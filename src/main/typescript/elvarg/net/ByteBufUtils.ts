export class ByteBufUtils {
    public static J_STRING_TERMINATOR: string = '\n';

    public static getMedium(buffer: ByteBuf) {
        return (buffer.readShort() & 0xFFFF) << 8 | buffer.readByte() & 0xFF;
    }

    public static getString(buffer: ByteBuf, terminator: string = this.J_STRING_TERMINATOR) {
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
        let os = new ByteArrayOutputStream();
        while (true) {
            let read = buffer.readByte() & 0xFF;
            if (read === terminator.charCodeAt(0)) {
                break;
            }
            os.write(read);
        }
        return new TextDecoder().decode(os.toByteArray());
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