import { ChannelHandlerContext, MessageToByteEncoder, ByteBuf } from 'socket.io';
import { LoginResponsePacket } from '../login/LoginResponsePacket';
import { LoginResponses } from '../login/LoginResponses';

/**
Encodes login.
@author Swiffy
*/
export class LoginEncoder extends MessageToByteEncoder<LoginResponsePacket> {

    protected encode(ctx: ChannelHandlerContext, msg: LoginResponsePacket, out: ByteBuf) {
        out.writeByte(msg.getResponse());

        if (msg.getResponse() == LoginResponses.LOGIN_SUCCESSFUL) {
            out.writeByte(msg.getRights());
        }
    }
}