export class BufferedConnection implements Runnable {
    private socket: Socket;
    private inputStream: InputStream;
    private outputStream: OutputStream;
    private closed: boolean;
    private buffer: Uint8Array;
    private writeIndex: number;
    private buffIndex: number;
    private isWriter: boolean;
    private hasIOError: boolean;

    constructor(socket1: Socket) {
        closed = false;
        isWriter = false;
        hasIOError = false;
        socket = socket1;
        socket.setTimeout(30000);
        socket.setNoDelay(true);
        inputStream = socket.getInputStream();
        outputStream = socket.getOutputStream();
    }

    public close(): void {
        closed = true;
        try {
            if (inputStream != null)
                inputStream.close();
            if (outputStream != null)
                outputStream.close();
            if (socket != null)
                socket.close();
        } catch (error) {
            //console.log("Error closing stream");
        }
        isWriter = false;
        synchronized (this) {
            notify();
        }
        buffer = null;
    }

    public read(): number {
        if (closed)
            return 0;
        else
            return inputStream.read();
    }

    public available(): number {
        if (closed)
            return 0;
        else
            return inputStream.available();
    }

    public flushInputStream(abyte0: Uint8Array, j: number): void {
        let i = 0;// was parameter
        if (closed)
            return;
        let k;
        for (; j > 0; j -= k) {
            k = inputStream.read(abyte0, i, j);
            if (k <= 0)
                throw new Error("EOF");
            i += k;
        }
    }

    public queueBytes(i: number, abyte0: Uint8Array): void {
        if (closed) {
            console.log("Closed");
            return;
        }
        if (hasIOError) {
            hasIOError = false;
            //throw new IOError("Error in writer thread");
        }
        if (buffer == null)
            buffer = new Uint8Array(5000);
        synchronized (this) {
            for (let l = 0; l < i; l++) {
                buffer[buffIndex] = abyte0[l];
                buffIndex = (buffIndex + 1) % 5000;
                if (buffIndex == (writeIndex + 4900) % 5000)
                    throw new Error("buffer overflow");
            }

            if (!isWriter) {
                isWriter = true;
                let t = new Thread(this);
                t.setPriority(3);
                t.start();
            }

            notify();
        }
    }

    public run(): void {
        while (isWriter) {
            let i;
            let j;
            synchronized (this) {
                if (buffIndex == writeIndex)
                    try {
                        wait();
                    } catch (InterruptedException _ex) {
                    }
                if (!isWriter)
                    return;
                j = writeIndex;
                if (buffIndex >= writeIndex)
                    i = buffIndex - writeIndex;
                else
                    i = 5000 - writeIndex;
            }
            if (i > 0) {
                try {
                    outputStream.write(buffer, j, i);
                } catch (IOError _ex) {
                    hasIOError = true;
                }
                writeIndex = (writeIndex + i) % 5000;
                try {
                    if (buffIndex == writeIndex)
                        outputStream.flush();
                } catch (IOError _ex) {
                    hasIOError = true;
                }
            }
        }
    }

    public printDebug(): void {
        console.log("dummy:" + closed);
        console.log("tcycl:" + writeIndex);
        console.log("tnum:" + buffIndex);
        console.log("writer:" + isWriter);
        console.log("ioerror:" + hasIOError);
        try {
            console.log("available:" + available());
        } catch (IOError _ex) {
        }
    }
}
