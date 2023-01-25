import { ByteBuf, Unpooled } from 'io.netty.buffer';

enum ValueType {
    A,
    C,
    S,
    STANDARD
}

enum AccessType {
    BIT,
    BYTE,
}

export class PacketBuilder {
    public static BIT_MASK = [0, 0x1, 0x3, 0x7, 0xf, 0x1f, 0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff,
        0x7fff, 0xffff, 0x1ffff, 0x3ffff, 0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff, 0x1ffffff, 0x3ffffff, 0x7ffffff,
        0xfffffff, 0x1fffffff, 0x3fffffff, 0x7fffffff, -1];
    private opcode: number;
    private type: PacketType;
    private bitPosition: number;
    private buffer = Unpooled.buffer();
    constructor(opcode: number = -1) {
        this.opcode = opcode;
        this.type = PacketType.FIXED;
    }



    public PacketBuilder(opcode: number, type: PacketType) {
        this.opcode = opcode;
        this.type = type;
    }

    // public putBytes(from: ByteBuf) : PacketBuilder {
    //     for (let i = 0; i < from.writerIndex(); i++) {
    //         this.put(from.getByte(i));
    //     }
    //     return this;
    // }

    public writeBuffer(buffer: ByteBuf): PacketBuilder {
        this.buffer.writeBytes(buffer);
        return this;
    }

    // public putBytes(from: Uint8Array) : PacketBuilder {
    //     buffer.writeBytes(from);
    //     return this;
    // }

    public putBytes(from: Uint8Array, size: number): PacketBuilder {
        buffer.writeBytes(from, 0, size);
        return this;
    }

    public putBytesReverse(data: Uint8Array): PacketBuilder {
        for (let i = data.length - 1; i >= 0; i--) {
            this.put(data[i]);
        }
        return this;
    }

    // public writeByteArray(bytes: Uint8Array, offset: number, length: number) : PacketBuilder {
    //     buffer.writeBytes(bytes, offset, length);
    //     return this;
    // }

    public writeByteArray(bytes: Uint8Array): PacketBuilder {
        buffer.writeBytes(bytes);
        return this;
    }


    public putBits(numBits: number, value: number): PacketBuilder {
        if (!this.buffer.hasArray()) {
            throw new Error("The ByteBuf implementation must support array() for bit usage.");
        }
        let bytes = Math.ceil(numBits / 8) + 1;
        this.buffer.ensureWritable((this.bitPosition + 7) / 8 + bytes);

        let buffer = this.buffer.array();

        let bytePos = this.bitPosition >> 3;
        let bitOffset = 8 - (this.bitPosition & 7);
        this.bitPosition += numBits;

        for (; numBits > bitOffset; bitOffset = 8) {
            buffer[bytePos] &= ~PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos++] |= (value >> (numBits - bitOffset)) & PacketBuilder.BIT_MASK[bitOffset];
            numBits -= bitOffset;
        }
        if (numBits == bitOffset) {
            buffer[bytePos] &= ~PacketBuilder.BIT_MASK[bitOffset];
            buffer[bytePos] |= value & PacketBuilder.BIT_MASK[bitOffset];
        } else {
            buffer[bytePos] &= ~(PacketBuilder.BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & PacketBuilder.BIT_MASK[numBits]) << (bitOffset - numBits);
        }
        return this;
    }

    public putBit(flag: boolean) {
        this.putBits(1, flag ? 1 : 0);
        return this;
    }

    public initializeAccess(type: AccessType) {
        switch (type) {
            case AccessType.BIT:
                this.bitPosition = this.buffer.writerIndex() * 8;
                break;
            case AccessType.BYTE:
                this.buffer.writerIndex((this.bitPosition + 7) / 8);
                break;
        }
        return this;
    }

    // public put(value: number, type: ValueType) {
    //     switch (type) {
    //         case ValueType.A:
    //             value += 128;
    //             break;
    //         case ValueType.C:
    //             value = -value;
    //             break;
    //         case ValueType.S:
    //             value = 128 - value;
    //             break;
    //         case ValueType.STANDARD:
    //             break;
    //     }
    //     this.buffer.writeByte(value);
    //     return this;
    // }

    public put(value: number): PacketBuilder {
        this.put(value, ValueType.STANDARD);
        return this;
    }

    public putShort(value: number, type: ValueType, order: ByteOrder): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put(value >> 8);
                this.put(value, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian short is impossible!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian short is impossible!");
            case ByteOrder.LITTLE:
                this.put(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder.TRIPLE_INT:
                throw new Error("TRIPLE_INT short not added!");
        }
        return this;
    }

    // public putShort(value: number): PacketBuilder {
    //     this.putShort(value, ValueType.STANDARD, ByteOrder.BIG);
    //     return this;
    // }

    // public putShort(value: number, type: ValueType): PacketBuilder {
    //     this.putShort(value, type, ByteOrder.BIG);
    //     return this;
    // }

    public putInt(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put((value >> 24));
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value, type);
                break;
            case ByteOrder.MIDDLE:
                this.put((value >> 8));
                this.put(value, type);
                this.put((value >> 24));
                this.put((value >> 16));
                break;
            case ByteOrder.INVERSE_MIDDLE:
                this.put((value >> 16));
                this.put((value >> 24));
                this.put(value, type);
                this.put((value >> 8));
                break;
            case ByteOrder.LITTLE:
                this.put(value, type);
                this.put((value >> 8));
                this.put((value >> 16));
                this.put((value >> 24));
                break;
            case ByteOrder.TRIPLE_INT:
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value);
                break;
        }
        return this;
    }

    public putInt(value: number): PacketBuilder {
        putInt(value, ValueType.STANDARD, ByteOrder.BIG);
        return this;
    }

    putBytes(from: ByteBuf): PacketBuilder {
        for (let i = 0; i < from.writerIndex(); i++) {
            this.put(from.getByte(i));
        }
        return this;
    }

    writeBuffer(buffer: ByteBuf): PacketBuilder {
        this.buffer.writeBytes(buffer);
        return this;
    }

    putBytes(from: Uint8Array): PacketBuilder {
        this.buffer.writeBytes(from);
        return this;
    }

    putBytes(from: Uint8Array, size: number): PacketBuilder {
        this.buffer.writeBytes(from, 0, size);
        return this;
    }

    putBytesReverse(data: Uint8Array): PacketBuilder {
        for (let i = data.length - 1; i >= 0; i--) {
            this.put(data[i]);
        }
        return this;
    }

    writeByteArray(bytes: Uint8Array, offset: number, length: number): PacketBuilder {
        this.buffer.writeBytes(bytes, offset, length);
        return this;
    }

    public writeByteArray(bytes: number[]): PacketBuilder {
        this.buffer.writeBytes(bytes);
        return this;
    }

    public putBits(numBits: number, value: number): PacketBuilder {
        if (!this.buffer.hasArray()) {
            throw new Error("The ByteBuf implementation must support array() for bit usage.");
        }

        let bytes: number = Math.ceil((numBits / 8)) + 1;
        this.buffer.ensureWritable((this.bitPosition + 7) / 8 + bytes);

        let buffer: number[] = this.buffer.array();

        let bytePos: number = this.bitPosition >> 3;
        let bitOffset: number = 8 - (this.bitPosition & 7);
        this.bitPosition += numBits;

        for (; numBits > bitOffset; bitOffset = 8) {
            buffer[bytePos] &= ~BIT_MASK[bitOffset];
            buffer[bytePos++] |= (value >> (numBits - bitOffset)) & BIT_MASK[bitOffset];
            numBits -= bitOffset;
        }

        if (numBits === bitOffset) {
            buffer[bytePos] &= ~BIT_MASK[bitOffset];
            buffer[bytePos] |= value & BIT_MASK[bitOffset];
        } else {
            buffer[bytePos] &= ~(BIT_MASK[numBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & BIT_MASK[numnumBits] << (bitOffset - numBits));
            buffer[bytePos] |= (value & BIT_MASK[numBits]) << (bitOffset - numBits);
        }
        return this;
    }

    public initializeAccess(type: AccessType) {
        switch (type) {
            case AccessType.BIT:
                this.bitPosition = this.buffer.writerIndex() * 8;
                break;
            case AccessType.BYTE:
                this.buffer.writerIndex((this.bitPosition + 7) / 8);
                break;
        }
        return this;
    }

    public putBit(flag: boolean) {
        this.putBits(1, flag ? 1 : 0);
        return this;
    }

    public put(value: number, type: ValueType) {
        switch (type) {
            case ValueType.A:
                value += 128;
                break;
            case ValueType.C:
                value = -value;
                break;
            case ValueType.S:
                value = 128 - value;
                break;
            case ValueType.STANDARD:
                break;
        }
        this.buffer.writeByte(value as any);
        return this;
    }

    putShort(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG): this {
        switch (order) {
            case ByteOrder.BIG:
                this.put(value >> 8);
                this.put(value, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian short is impossible!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian short is impossible!");
            case ByteOrder.LITTLE:
                this.put(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder.TRIPLE_INT:
                throw new Error("TRIPLE_INT short not added!");
        }
        return this;
    }

    putShort(value: number): this {
        return this.putShort(value, ValueType.STANDARD, ByteOrder.BIG);
    }

    public putShort(value: int, order: ByteOrder): PacketBuilder {
        return this.putShort(value, ValueType.STANDARD, order);
    }

    public putInt(value: number, type: ValueType, order: ByteOrder): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                this.put(value >> 24);
                this.put(value >> 16);
                this.put(value >> 8);
                this.put(value, type);
                break;
            case ByteOrder.MIDDLE:
                this.put(value >> 8);
                this.put(value, type);
                this.put(value >> 24);
                this.put(value >> 16);
                break;
            case ByteOrder.INVERSE_MIDDLE:
                this.put(value >> 16);
                this.put(value >> 24);
                this.put(value, type);
                this.put(value >> 8);
                break;
            case ByteOrder.LITTLE:
                this.put(value, type);
                this.put(value >> 8);
                this.put(value >> 16);
                this.put(value >> 24);
                break;
            case ByteOrder.TRIPLE_INT:
                this.put((value >> 16));
                this.put((value >> 8));
                this.put(value);
                break;
        }
        return this;
    }

    public putInt(value: number): this {
        putInt(value, ValueType.STANDARD, ByteOrder.BIG);
        return this;
    }

    public putInt(value: number, type: ValueType): this {
        putInt(value, type, ByteOrder.BIG);
        return this;
    }

    public putInt(value: number, order: ByteOrder): this {
        putInt(value, ValueType.STANDARD, order);
        return this;
    }

    public putLong(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG) {
        switch (order) {
            case ByteOrder.BIG:
                this.put((value >> 56) as number);
                this.put((value >> 48) as number);
                this.put((value >> 40) as number);
                this.put((value >> 32) as number);
                this.put((value >> 24) as number);
                this.put((value >> 16) as number);
                this.put((value >> 8) as number);
                this.put(value as number, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian long is not implemented!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian long is not implemented!");
            case ByteOrder.TRIPLE_INT:
                throw new Error("triple-int long is not implemented!");
            case ByteOrder.LITTLE:
                this.put(value as number, type);
                this.put((value >> 8) as number);
                this.put((value >> 16) as number);
                this.put((value >> 24) as number);
                this.put((value >> 32) as number);
                this.put((value >> 40) as number);
                this.put((value >> 48) as number);
                this.put((value >> 56) as number);
                break;
        }
        return this;
    }

    public putLong(value: number, type: ValueType = ValueType.STANDARD, order: ByteOrder = ByteOrder.BIG): PacketBuilder {
        switch (order) {
            case ByteOrder.BIG:
                put((value >> 56) as number);
                put((value >> 48) as number);
                put((value >> 40) as number);
                put((value >> 32) as number);
                put((value >> 24) as number);
                put((value >> 16) as number);
                put((value >> 8) as number);
                put((value) as number, type);
                break;
            case ByteOrder.MIDDLE:
                throw new Error("Middle-endian long " + "is not implemented!");
            case ByteOrder.INVERSE_MIDDLE:
                throw new Error("Inverse-middle-endian long is not implemented!");
            case ByteOrder.TRIPLE_INT:
                throw new Error("triple-int long is not implemented!");
            case ByteOrder.LITTLE:
                put((value) as number, type);
                put((value >> 8) as number);
                put((value >> 16) as number);
                put((value >> 24) as number);
                put((value >> 32) as number);
                put((value >> 40) as number);
                put((value >> 48) as number);
                put((value >> 56) as number);
                break;
        }
        return this;
    }

    public putString(string: string) {
        if (string == null) {
            string = "unkown";
        }
        for (let value of string.getBytes()) {
            put(value);
        }
        put(10);
        return this;
    }

    /**
     * Gets the packet's opcode.
     *
     * @return the packets opcode.
     */
    public getOpcode(): number {
        return this.opcode;
    }

    /**
     * Gets the packet's size.
     *
     * @return the packets size.
     */
    public getSize(): number {
        return this.buffer.readableBytes();
    }

    /**
     * Gets the backing byte buffer used to read and write data.
     *
     * @return the backing byte buffer.
     */
    public buffer(): ByteBuf {
        return this.buffer;
    }

    /**
     * Creates the actual packet from this builder
     *
     * @return
     */
    public toPacket(): Packet {
        return new Packet(this.opcode, this.type, this.buffer);
    }

    public getType(): PacketType {
        return this.type;
    }
}
