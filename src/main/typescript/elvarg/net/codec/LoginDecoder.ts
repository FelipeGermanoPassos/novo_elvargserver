import { ByteToMessageDecoder, ChannelHandlerContext, ChannelFutureListener, Unpooled, ByteBuf } from 'socket.io';
import { Server } from '../../Server';
import { GameConstants } from '../../game/GameConstants';
import { ByteBufUtils } from '../ByteBufUtils';
import { NetworkConstants } from '../NetworkConstants';
import { LoginDetailsMessage } from '../login/LoginDetailsMessage';
import { LoginResponses } from '../login/LoginResponses';
import { IsaacRandom } from '../security/IsaacRandom';
import { Misc } from '../../util/Misc';
import { DiscordUtil } from '../../util/DiscordUtil';
import BigInteger from 'big-integer';
import { Random } from 'random';

enum LoginDecoderState {
    LOGIN_REQUEST,
    LOGIN_TYPE,
    LOGIN
}

export class LoginDecoder extends ByteToMessageDecoder {
    private static readonly random = new Random();
    private static readonly SECRET_VALUE = 345749224;
    private encryptedLoginBlockSize: number;
    private state: LoginDecoderState = LoginDecoderState.LOGIN_REQUEST;
    private hostAddressOverride: string | null = null;

    public static sendLoginResponse(ctx: ChannelHandlerContext, response: number) {
        let buffer = Unpooled.buffer(1);
        buffer.writeByte(response);
        ctx.writeAndFlush(buffer).addListener(ChannelFutureListener.CLOSE);
    }

    decode(ctx: ChannelHandlerContext, buffer: ByteBuf, out: any[]) {
        switch (this.state) {
            case LoginDecoderState.LOGIN_REQUEST:
                this.decodeRequest(ctx, buffer);
                break;
            case LoginDecoderState.LOGIN_TYPE:
                this.decodeType(ctx, buffer);
                break;
            case LoginDecoderState.LOGIN:
                this.decodeLogin(ctx, buffer, out);
                break;
        }
    }

    private decodeRequest(ctx: ChannelHandlerContext, buffer: ByteBuf) {
        if (!buffer.isReadable()) {
            ctx.channel().close();
            return;
        }

        let request = buffer.readUnsignedByte();
        if (request != NetworkConstants.LOGIN_REQUEST_OPCODE) {
            console.log(`Session rejected for bad login request id: ${request}`);
            LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }

        if (buffer.isReadable(8)) {
            let secret = buffer.readInt();
            if (secret != LoginDecoder.SECRET_VALUE) {
                console.log(`Invalid secret value given: ${secret}`);
                LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_BAD_SESSION_ID);
                return;
            }
            let ip = buffer.readInt();

            this.hostAddressOverride = `${ip & 0xff}.${ip >> 8 & 0xff}.${ip >> 16 & 0xff}.${ip >> 24 & 0xff}`;
        }

        // Send information to the client
        let buf = Unpooled.buffer(1 + 8);
        buf.writeByte(0); // 0 = continue login
        buf.writeLong(LoginDecoder.random.next); // This long will be used for encryption later on
        ctx.writeAndFlush(buf);

        this.state = LoginDecoderState.LOGIN_TYPE;
    }

    private decodeType(ctx: ChannelHandlerContext, buffer: ByteBuf) {
        if (!buffer.isReadable()) {
            ctx.channel().close();
            return;
        }

        let connectionType = buffer.readUnsignedByte();
        if (connectionType != NetworkConstants.NEW_CONNECTION_OPCODE && connectionType != NetworkConstants.RECONNECTION_OPCODE) {
            Server.getLogger().info("Session rejected for bad connection type id: " + connectionType);
            LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }

        this.state = LoginDecoderState.LOGIN;

    }

    private decodeLogin(ctx: ChannelHandlerContext, buffer: ByteBuf, out: Array<any>) {

        if (!buffer.isReadable()) {
            ctx.channel().close();
            return;
        }

        let encryptedLoginBlockSize = buffer.readUnsignedByte();

        if (encryptedLoginBlockSize != buffer.readableBytes()) {
            Server.getLogger().info(`[host= ${ctx.channel().remoteAddress()}] encryptedLoginBlockSize != readable bytes`);
            LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_REJECT_SESSION);
            return;
        }

        if (buffer.isReadable(encryptedLoginBlockSize)) {

            let magicId = buffer.readUnsignedByte();
            if (magicId != 0xFF) {
                Server.getLogger().info(`[host= ${ctx.channel().remoteAddress()}] [magic= ${magicId}] was rejected for the wrong magic value.`);
                LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }

            let memory = buffer.readByte();
            if (memory != 0 && memory != 1) {
                Server.getLogger().info(`[host= ${ctx.channel().remoteAddress()}] was rejected for having the memory setting.`);
                LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }

            let length = buffer.readUnsignedByte();
            let rsaBytes = new Uint8Array(length);
            buffer.readBytes(rsaBytes);

            let rsaBuffer = Unpooled.wrappedBuffer( BigInteger(rsaBytes)
                .modPow(NetworkConstants.RSA_EXPONENT, NetworkConstants.RSA_MODULUS).toArray);

            let securityId = rsaBuffer.readByte();
            if (securityId != 10 && securityId != 11) {
                Server.getLogger().info(`[host= ${ctx.channel().remoteAddress()}] was rejected for having the wrong securityId.`);
                LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }

            let clientSeed = rsaBuffer.readLong();
            let seedReceived = rsaBuffer.readLong();

            let seed = [(clientSeed >> 32), (clientSeed), (seedReceived >> 32), (seedReceived)];
            let decodingRandom = new IsaacRandom(seed);
            for (let i = 0; i < seed.length; i++) {
                seed[i] += 50;
            }

            let uid = rsaBuffer.readInt();
            if (uid != GameConstants.CLIENT_UID) {
                Server.getLogger().info(`[host= ${ctx.channel().remoteAddress()}] was rejected for having the wrong UID.`);
                LoginDecoder.sendLoginResponse(ctx, LoginResponses.OLD_CLIENT_VERSION);
                return;
            }

            let host: string | null = this.hostAddressOverride;
            if (host == null) {
                host = ByteBufUtils.getHost(ctx.channel);
            }
            let rawUsername: string = ByteBufUtils.readString(rsaBuffer);
            let password: string = ByteBufUtils.readString(rsaBuffer);

            if (securityId == 10) {
                let username: string = Misc.formatText(rawUsername.toLowerCase());

                if (username.length < 3 || username.length > 30 || password.length < 3 || password.length > 30) {
                    LoginDecoder.sendLoginResponse(ctx, LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                    return;
                }

                out.push(new LoginDetailsMessage(ctx, username, password, host,
                    new IsaacRandom(seed), decodingRandom));
            } else if (securityId == 11) {
                if (rawUsername == DiscordUtil.DiscordConstants.USERNAME_CACHED_TOKEN || rawUsername == DiscordUtil.DiscordConstants.USERNAME_AUTHZ_CODE) {
                    let msg = new LoginDetailsMessage(ctx, rawUsername, password, host,
                        new IsaacRandom(seed), decodingRandom);
                    msg.setDiscord(true);
                    out.push(msg);
                } else {
                    LoginDecoder.sendLoginResponse(ctx, LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                }
            }
        }
    }
}
