

//import com.elvarg.net.security.IsaacRandom;
import * as IsaacRandom from '../../net/security/IsaacRandom';

//import java.math.BigNumbereger;
import * as BigInteger from 'big-integer';
public class Buffer {
    private static readonly BIT_MASKS: number[] = [0, 1, 3, 7, 15, 31, 63, 127, 255,
    511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 0x1ffff, 0x3ffff,
    0x7ffff, 0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff,
    0x1ffffff, 0x3ffffff, 0x7ffffff, 0xfffffff, 0x1fffffff, 0x3fffffff,
    0x7fffffff, -1];
    public payload: number[];
    public currentPosition: number;
    public bitPosition: number;
    public encryption: IsaacRandom;

    public constructor(payload: number[]) {
        this.payload = payload;
        this.currentPosition = 0;
    }

    public static create(): Buffer {
        let buffer = new Buffer();
        buffer.currentPosition = 0;
        buffer.payload = new Array(5000);
        return buffer;
    }


    public readUTriByte(i: number): number {
        this.currentPosition += 3;
        return (0xff & this.payload[this.currentPosition - 3] << 16)
        + (0xff & this.payload[this.currentPosition - 2] << 8)
        + (0xff & this.payload[this.currentPosition - 1]);
    }

    public readUShort(): number {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);
    }

    function readUShortA(): number {
        this.currentPosition += 2;
        return ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] - 128 & 0xff);
    }

    function readUSmart(): number {
        let value = this.payload[this.currentPosition] & 0xff;
        if (value < 128)
            return readUnsignedByte();
        else
            return readUShort() - 32768;
    }

    public readUSmart2(): number {
        let baseVal = 0;
        let lastVal = 0;
        while ((lastVal = this.readUSmart()) == 32767) {
            baseVal += 32767;
        }
        return baseVal + lastVal;
    }

    public readNewString(): string {
    let i = this.currentPosition;
    while (this.payload[this.currentPosition++] != 0)
        ;
    return new String(this.payload, i, this.currentPosition - i - 1);
    }

    public writeOpcode(opcode: number):void {
    this.payload[this.currentPosition++] = (opcode + this.encryption.nextInt());
    }
    

    public writeByte(value: number):void {
        this.payload[this.currentPosition++] = (value);
    }
    
    public writeShort(value: number):void {
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value);
    }
    
    public writeTriByte(value: number):void {
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value);
    }

    public writeInt(value: number):void {
        this.payload[this.currentPosition++] = (value >> 24);
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = value;
    }

    public writeLEInt(value: number):void {
        this.payload[this.currentPosition++] = value;
        this.payload[this.currentPosition++] = (value >> 8);
        this.payload[this.currentPosition++] = (value >> 16);
        this.payload[this.currentPosition++] = (value >> 24);
    }
        

    public writeLong(value: number):void {
        try {
        this.payload[this.currentPosition++] = (value >> 56) as number;
        this.payload[this.currentPosition++] = (value >> 48) as number;
        this.payload[this.currentPosition++] = (value >> 40) as number;
        this.payload[this.currentPosition++] = (value >> 32) as number;
        this.payload[this.currentPosition++] = (value >> 24) as number;
        this.payload[this.currentPosition++] = (value >> 16) as number;
        this.payload[this.currentPosition++] = (value >> 8) as number;
        this.payload[this.currentPosition++] = (value) as number;
        } catch (runtimeexception) {
        console.error("14395, " + 5 + ", " + value + ", " + runtimeexception.toString());
        throw new Error();
        }
    }
    
    public writeString(text: string):void {
        this.payload.slice(text.length()).forEach((e,i) => this.payload[this.currentPosition + i] = e);
        this.currentPosition += text.length();
        this.payload[this.currentPosition++] = 10;
    }

    public readShort2(): number {
        this.currentPosition += 2;
        let i = ((this.payload[this.currentPosition - 2] & 0xff) << 8) + (this.payload[this.currentPosition - 1] & 0xff);
        if (i > 32767)
        i -= 65537;
        return i;
    }
                    

    public readSignedByte(): number {
        return this.payload[this.currentPosition++];
    }
    
    public readShort(): number {
        this.currentPosition += 2;
        let value = ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);

        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    }

    public readTriByte(): number {
        this.currentPosition += 3;
        return ((this.payload[this.currentPosition - 3] & 0xff) << 16)
                + ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);
    }

    public readInt(): number {
        this.currentPosition += 4;
        return ((this.payload[this.currentPosition - 4] & 0xff) << 24)
                + ((this.payload[this.currentPosition - 3] & 0xff) << 16)
                + ((this.payload[this.currentPosition - 2] & 0xff) << 8)
                + (this.payload[this.currentPosition - 1] & 0xff);
    }

    function readLong(): number {
        let msi = (readInt() & 0xffffffff) as number;
        let lsi = (readInt() & 0xffffffff) as number;
        return (msi << 32) + lsi;
    }

    function readString(): string {
        let index = currentPosition;
        while (payload[currentPosition++] != 10)
            ;
        return new String(payload, index, currentPosition - index - 1);
    }

    function readBytes(): Uint8Array {
        let index = currentPosition;
        while (payload[currentPosition++] != 10)
            ;
        let data = new Uint8Array(currentPosition - index - 1);
        data.set(payload.slice(index, currentPosition - 1));
        return data;
    }

    function readBytes(offset: number, length: number, data: Uint8Array) {
        for (let index = length; index < length + offset; index++)
            data[index] = payload[currentPosition++];
    }

    function initBitAccess() {
        bitPosition = currentPosition * 8;
    }

    function readBits(amount: number): number {
        let byteOffset = bitPosition >> 3;
        let bitOffset = 8 - (bitPosition & 7);
        let value = 0;
        bitPosition += amount;
        for (; amount > bitOffset; bitOffset = 8) {
            value += (payload[byteOffset++] & BIT_MASKS[bitOffset]) << amount
                    - bitOffset;
            amount -= bitOffset;
        }
        if (amount == bitOffset)
            value += payload[byteOffset] & BIT_MASKS[bitOffset];
        else
            value += payload[byteOffset] >> bitOffset - amount
                    & BIT_MASKS[amount];
        return value;
    }

    function disableBitAccess() {
        currentPosition = (bitPosition + 7) / 8;
    }

    function readSmart(): number {
        let value = payload[currentPosition] & 0xff;
        if (value < 128)
            return readUnsignedByte() - 64;
        else
            return readUShort() - 49152;
    }

    function getSmart(): number {
        try {
            // checks current without modifying position
            if (currentPosition >= payload.length) {
                return payload[payload.length - 1] & 0xFF;
            }
            let value = payload[currentPosition] & 0xFF;

            if (value < 128) {
                return readUnsignedByte();
            } else {
                return readUShort() - 32768;
            }
        } catch (e) {
            console.log(e);
            return readUShort() - 32768;
        }
    }

    function encodeRSA(exponent: bigint, modulus: bigint) {
        let length = currentPosition;
        currentPosition = 0;
        let buffer = new Uint8Array(length);
        readBytes(length, 0, buffer);

        let rsa = buffer;

        //if (Configuration.ENABLE_RSA) {
        rsa = new BigInteger(buffer).modPow(exponent, modulus)
                .toByteArray();
        //}

        currentPosition = 0;
        writeByte(rsa.length);
        writeBytes(rsa, rsa.length, 0);
    }

    function writeNegatedByte(value: number) {
        payload[currentPosition++] = (value * -1);
    }

    function writeByteS(value: number) {
        payload[currentPosition++] = (128 - value);
    }

    function readUByteA(): number {
        return payload[currentPosition++] - 128 & 0xff;
    }

    function readNegUByte(): number {
        return -payload[currentPosition++] & 0xff;
    }

    function readUByteS(): number {
        return 128 - payload[currentPosition++] & 0xff;
    }

    function readNegByte(): number {
        return -payload[currentPosition++];
    }

    function readByteS(): number {
        return 128 - payload[currentPosition++];
    }

    function writeLEShort(value: number) {
        payload[currentPosition++] = value;
        payload[currentPosition++] = (value >> 8);
    }

    function writeShortA(value: number) {
        payload[currentPosition++] = (value >> 8);
        payload[currentPosition++] = (value + 128);
    }

    function writeLEShortA(value: number) {
        payload[currentPosition++] = (value + 128);
        payload[currentPosition++] = (value >> 8);
    }

    function readLEUShort(): number {
        currentPosition += 2;
        return ((payload[currentPosition - 1] & 0xff) << 8)
                + (payload[currentPosition - 2] & 0xff);
    }

    
    function readLEUShortA(): number {
        currentPosition += 2;
        return ((payload[currentPosition - 1] & 0xff) << 8)
                + (payload[currentPosition - 2] - 128 & 0xff);
    }

    function readLEShort(): number {
        currentPosition += 2;
        let value = ((payload[currentPosition - 1] & 0xff) << 8)
                + (payload[currentPosition - 2] & 0xff);

        if (value > 32767) {
            value -= 0x10000;
        }
        return value;
    }

    function readLEShortA(): number {
        currentPosition += 2;
        let value = ((payload[currentPosition - 1] & 0xff) << 8)
                + (payload[currentPosition - 2] - 128 & 0xff);
        if (value > 32767)
            value -= 0x10000;
        return value;
    }

    function getIntLittleEndian(): number {
        currentPosition += 4;
        return ((payload[currentPosition - 4] & 0xFF) << 24) + ((payload[currentPosition - 3] & 0xFF) << 16) + ((payload[currentPosition - 2] & 0xFF) << 8) + (payload[currentPosition - 1] & 0xFF);
    }

    function readMEInt(): number { // V1
        currentPosition += 4;
        return ((payload[currentPosition - 2] & 0xff) << 24)
                + ((payload[currentPosition - 1] & 0xff) << 16)
                + ((payload[currentPosition - 4] & 0xff) << 8)
                + (payload[currentPosition - 3] & 0xff);
    }

    function readIMEInt(): number { // V2
        currentPosition += 4;
        return ((payload[currentPosition - 3] & 0xff) << 24)
                + ((payload[currentPosition - 4] & 0xff) << 16)
                + ((payload[currentPosition - 1] & 0xff) << 8)
                + (payload[currentPosition - 2] & 0xff);
    }

    function writeReverseDataA(data: Uint8Array, length: number, offset: number) {
        for (let index = (length + offset) - 1; index >= length; index--) {
            payload[currentPosition++] = (data[index] + 128);
        }
    }

    function readReverseData(data: Uint8Array, offset: number, length: number) {
        for (let index = (length + offset) - 1; index >= length; index--) {
            data[index] = payload[currentPosition++];
        }
    }
}
                
                
                
                
