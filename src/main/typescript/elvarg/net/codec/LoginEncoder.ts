import { ChannelHandlerContext, MessageToByteEncoder } from 'netty';
import { LoginResponsePacket, LoginResponses } from '../login';

/**
Encodes login.
@author Swiffy
*/
export class LoginEncoder extends MessageToByteEncoder<LoginResponsePacket> {

    protected encode(ctx: ChannelHandlerContext, msg: LoginResponsePacket, out: ByteBuf) {
        out.writeByte(msg.getResponse());

        if (msg.getResponse() == LoginResponses.LOGIN_SUCCESSFUL) {
            out.writeByte(msg.getRights().ordinal());
        }
    }
}