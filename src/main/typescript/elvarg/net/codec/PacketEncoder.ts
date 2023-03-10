import { IsaacRandom } from "com/elvarg/net/security/IsaacRandom";
import { Packet, PacketType } from "com/elvarg/net/packet/Packet";
import { ByteBuf, Unpooled } from "netty";
import { MessageToByteEncoder } from "netty";

export class PacketEncoder extends MessageToByteEncoder<Packet> {
    private encoder: IsaacRandom;
    private CLIENT_PACKET_SIZES: number[];

    constructor(encoder: IsaacRandom) {
        super();
        this.encoder = encoder;
        this.CLIENT_PACKET_SIZES = [];
    }

    protected encode(ctx: ChannelHandlerContext, packet: Packet, out: ByteBuf): void {
        const opcode = (packet.getOpcode() + this.encoder.nextInt()) & 0xFF;
        const type = packet.getType();
        const size = packet.getSize();

        if (type === PacketType.FIXED) {
            const currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (size !== currSize) {
                console.error(`{PacketEncoder} Opcode ${packet.getOpcode()} has defined size ${currSize} but is actually ${size}.`);
                return;
            }
        } else if (type === PacketType.VARIABLE) {
            const currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (currSize !== -1) {
                console.error(`{PacketEncoder} Opcode ${packet.getOpcode()}'s size needs to be -1, it's currently ${currSize}.`);
                return;
            }
        } else if (type === PacketType.VARIABLE_SHORT) {
            const currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (currSize !== -2) {
                console.error(`{PacketEncoder} Opcode ${packet.getOpcode()}'s size needs to be -2, it's currently ${currSize}.`);
                return;
            }
        }

        let finalSize = size + 1;
        switch (type) {
            case PacketType.VARIABLE:
                if (size > 255) {
                    throw new Error(`Tried to send packet length ${size} in variable-byte packet`);
                }
                finalSize++;
                break;
            case PacketType.VARIABLE_SHORT:
                if (size > 65535) {
                    throw new Error(`Tried to send packet length ${size} in variable-short packet`);
                }
                finalSize += 2;
                break;
            default:
                break;
        }

        const buffer = Unpooled.buffer(finalSize);
        buffer.writeByte(opcode);

        switch (type) {
            case PacketType.VARIABLE:
                buffer.writeByte(size);
                break;
            case VARIABLE_SHORT:
                buffer.writeShort((short) size);
                break;
            default:
                break;
        }
        // Write packet
        buffer.writeBytes(packet.getBuffer());

        // Write the packet to the out buffer
        out.writeBytes(buffer);
    }

    const CLIENT_PACKET_SIZES: number[] = [
        0, 0, 0, 1, 6, 0, 0, 0, 4, 4, //0
        6, 2, -1, 1, 1, -1, 1, 0, 0, 0, // 10
        0, 0, 0, 0, 1, 0, 0, -1, 1, 1, //20
        0, 0, 0, 0, -2, 4, 3, 0, 2, 0, //30
        0, 0, 0, 0, 7, 8, 0, 6, 0, 0, //40
        9, 8, 0, -2, 4, 1, 0, 0, 0, 0, //50
        -2, 1, 0, 0, 2, -2, 0, 0, 0, 0, //60
        6, 3, 2, 4, 2, 4, 0, 0, 0, 4, //70
        0, -2, 0, 0, 11, 2, 1, 6, 6, 0, //80
        0, 0, 0, 0, 0, 0, 0, 2, 0, 1, //90
        2, 2, 0, 1, -1, 8, 1, 0, 8, 0, //100
        1, 1, 1, 1, 2, 1, 5, 15, 0, 0, //110
        0, 4, 4, -1, 9, -1, -2, 2, 0, 0, //120 // 9
        -1, 0, 0, 0, 13, 0, 0, 1, 0, 0, // 130
        3, 10, 2, 0, 0, 0, 0, 14, 0, 0, //140
        0, 4, 5, 3, 0, 0, 3, 0, 0, 0, //150
        4, 5, 0, 0, 2, 0, 6, 5, 0, 0, //160
        0, 5, -2, -2, 7, 5, 10, 6, 0, -2, // 170
        0, 0, 0, 1, 1, 2, 1, -1, 0, 0, //180
        0, 0, 0, 0, 0, 2, -1, 0, -1, 0, //190
        4, 0, 0, 0, 0, 0, 3, 0, 4, 0, //200
        0, 0, 0, 0, -2, 7, 0, -2, 2, 0, //210
        0, 1, -2, -2, 0, 0, 0, 0, 0, 0, // 220
        8, 0, 0, 0, 0, 0, 0, 0, 0, 0,//230
        2, -2, 0, 0, -1, 0, 6, 0, 4, 3,//240
        -1, 0, -1, -1, 6, 0, 0//250
    ];
} 