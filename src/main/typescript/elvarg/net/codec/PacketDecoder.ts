import { ByteToMessageDecoder, ChannelHandlerContext } from 'netty'
import { PlayerSession } from './PlayerSession'
import { Packet } from './Packet'
import { IsaacRandom } from './security/IsaacRandom'
import { NetworkConstants } from './NetworkConstants'

class PacketDecoder extends ByteToMessageDecoder {
    // constructor(random: IsaacRandom) {
    //     this.random = random;
    //     this.opcode = -1;
    //     this.size = -1;
    // }
    private readonly random: IsaacRandom;
    private opcode: number;
    private size: number;
    private static readonly PACKET_SIZES = [
        0, 0, 6, 1, -1, -1, 2, 4, 4, 4,
        4, -1, -1, -1, 8, 0, 6, 2, 2, 0,
        0, 2, 0, 6, 0, 12, 0, 0, 0, 0,
        9, 0, 0, 0, 0, 8, 4, 0, 0, 2,
        2, 6, 0, 8, 0, -1, 0, 0, 0, 1,
        0, 0, 0, 12, 0, 0, 0, 8, 0, 0,
        -1, 8, 0, 0, 0, 0, 0, 0, 0, 0,
        6, 0, 2, 2, 8, 6, 0, -1, 0, 6,
        -1, 0, 0, 0, 0, 1, 4, 6, 0, 0,
        0, 0, 0, 0, 0, 3, 0, 0, -1, 0,
        0, 13, 0, -1, -1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 8, 0, 0,
        1, 0, 6, 0, 0, 0, -1, 0, 2, 8,
        0, 4, 6, 8, 0, 8, 0, 0, 6, 2,
        0, 0, 0, 0, 0, 8, 0, 0, 0, 0,
        0, 0, 1, 2, 0, 2,
    ]

    protected decode(ctx: ChannelHandlerContext, buffer: ByteBuf, out: any[]) {
        let session = ctx.channel().attr(NetworkConstants.SESSION_KEY).get();
        if (session == null || session.getPlayer() == null) {
            return;
        }

        let opcode = this.opcode;
        let size = this.size;

        if (opcode == -1) {
            if (buffer.isReadable(1)) {
                opcode = buffer.readUnsignedByte();
                opcode = opcode - this.random.nextInt() & 0xFF;
                size = PacketDecoder.PACKET_SIZES[opcode];
                this.opcode = opcode;
                this.size = size;
            } else {
                buffer.discardReadBytes();
                return;
            }
        }

        if (size == -1) {
            if (buffer.isReadable()) {
                size = buffer.readUnsignedByte() & 0xFF;
                this.size = size;
            } else {
                buffer.discardReadBytes();
                return;
            }
        }

        if (buffer.isReadable(size)) {
            let data = new Uint8Array(size);
            buffer.readBytes(data);
            this.opcode = -1;
            this.size = -1;
            out.push(new Packet(opcode, data));
        }
    }
}