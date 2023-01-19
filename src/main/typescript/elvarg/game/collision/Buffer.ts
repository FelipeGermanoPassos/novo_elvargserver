class Buffer {
    public offset: number;
    private buffer: number[];
    constructor(buffer: number[]) {
        this.buffer = buffer;
        this.offset = 0;
    }
    public skip(length: number) {
        this.offset += length;
    }
    public setOffset(...args: [location: number]) {
        this.offset = parseInt(location.toString());
    }
    public length() {
        return this.buffer.length;
    }
    public readSignedByte() {
        return this.buffer[this.offset++];
    }
    public readUnsignedByte() {
        return this.buffer[this.offset++] & 255;
    }
    public getShort() {
        var val = (this.readSignedByte() << 8) + this.readSignedByte();
        if (val > 32767) {
            val -= 65536;
        }
        return val;
    }
    public readUShort() {
        return (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    }
    public getInt() {
        return (this.readUnsignedByte() << 24) + (this.readUnsignedByte() << 16) + (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    }
    public getLong() {
        return (this.readUnsignedByte() << 56) + (this.readUnsignedByte() << 48) + (this.readUnsignedByte() << 40) + (this.readUnsignedByte() << 32) + (this.readUnsignedByte() << 24) + (this.readUnsignedByte() << 16) + (this.readUnsignedByte() << 8) + this.readUnsignedByte();
    }
    public readUnsignedWord() {
        this.offset += 2;
        return ((this.buffer[this.offset - 2] & 255) << 8) + (this.buffer[this.offset - 1] & 255);
    }
    public getUSmart() {
        var i = this.buffer[this.offset] & 255;
        if (i < 128) {
            return this.readUnsignedByte();
        }
        else {
            return this.readUShort() - 32768;
        }
    }
    public readSmart() {
        try {
            var value = 0;
            var ptr: number;
            for (ptr = this.getUSmart(); 32767 == ptr; ptr = this.getUSmart()) {
                value += 32767;
            }
            value += ptr;
            return value;
        } catch (erro) {
            console.log(erro)
        } finally {
            return -1;
        }
    }
    public readString() {
        var i = this.offset;
        while (this.buffer[this.offset++] != 10) {
            ;
        }
        return;
    }
    public getBytes() {
        var i = this.offset;
        while (this.buffer[this.offset++] != 10) {
            ;
        }
        var abyte0: number[] = Array(this.offset - i - 1).fill(0);
        var myArray = [this.buffer, i, abyte0, i - i, this.offset - 1 - i];
        var myArrayCopy = myArray.slice();
        return abyte0;
    }
    public read(length: number) {
        var b: number[] = Array(length).fill(0);
        for (var i = 0; i < length; i++) {
            b[i] = this.buffer[this.offset++];
        }
        return b;
    }
}