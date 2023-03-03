
import { ByteBuf} from 'io.netty.buffer';
import { StringBuilder } from 'stringbuilder'
import { Channel } from 'net';

export class ByteBufUtils {
    public static J_STRING_TERMINATOR: string = '\n';

    public static getMedium(buffer: Buffer) {
        const short1 = buffer.readUInt8(0) << 8;
        const short2 = buffer.readUInt8(1);
        return (short1 | short2);
      }

    public static getStrings(buffer: ByteBuf, terminator: string = this.J_STRING_TERMINATOR) {
        let str = "";
        let b: number;
        while ((b = buffer.readByte()) != terminator.charCodeAt(0)) {
            str += String.fromCharCode(b);
        }
        return str;
    }

    public static getBytes(buffer: ByteBuf, length: number) {
        let data = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            data[i] = buffer.readByte();
        }
        return data;
    }

    public static getString(buffer: ByteBuf, terminator: string): string {
        const os = Buffer.alloc(0);
        while (true) {
            let read = buffer.readByte() & 0xFF;
            if (read === terminator.charCodeAt(0)) {
                break;
            }
            os.write(String.fromCharCode(read));
        }
        return new TextDecoder().decode(os.toArrayBuffer());
    }

    public static getHost(channel: Channel): string {
        return (channel.remoteAddress() as InetSocketAddress).address.hostAddress;
    }

    public static readString(buf: ByteBuf): string {
        let temp: number;
        let builder = new StringBuilder();
        while (buf.isReadable() && (temp = buf.readByte()) != 10) {
            builder.append(String.fromCharCode(temp));
        }
        return builder.toString();
    }


}

//TODO: Trocar ByteBuf e ByteBuffer pro Buffer