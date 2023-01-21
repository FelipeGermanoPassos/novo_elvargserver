class CompressionUtil {
    private constructor() {
        throw new Error("static-utility classes may not be instantiated.");
    }

    static gunzip(data: Uint8Array): Uint8Array {
        return toByteArray(new GZIPInputStream(new ByteArrayInputStream(data)));
    }

    static unbzip2Headerless(data: Uint8Array, offset: number, length: number): Uint8Array {
        let bzip2 = new Uint8Array(length + 2);
        bzip2[0] = 'h'.charCodeAt(0);
        bzip2[1] = '1'.charCodeAt(0);
        bzip2.set(data.slice(offset, offset + length), 2);

        return unbzip2(bzip2);
    }

    class CompressionUtil {
        static unbzip2(data: Uint8Array): Uint8Array | null {
            //return toByteArray(new CBZip2InputStream(new ByteArrayInputStream(data)));
            return null;
        }
    }
}
