export class IsaacRandom {
    private static readonly GOLDEN_RATIO: number = 0x9e3779b9;
    private static readonly LOG_SIZE: number = Long.BYTES;
    private static readonly SIZE: number = 1 << LOG_SIZE;
    private static MASK: number = SIZE - 1 << 2;
    private readonly results: number[] = new Array(SIZE);
    private readonly state: number[] = new Array(SIZE);
    private count: number = SIZE;
    private accumulator: number;
    private last: number;
    private counter: number;

    public isaacRandom(seed: number[]) {
        let length = Math.min(seed.length, this.results.length);
        this.results.splice(0, length, ...seed);
        this.init();
    }

    private isaac() {
        let i: number, j: number, x: number, y: number;
        this.last += ++this.counter;
        for (i = 0, j = IsaacRandom.SIZE / 2; i < IsaacRandom.SIZE / 2;) {
            x = this.state[i];
            this.accumulator ^= this.accumulator << 13;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> LOG_SIZE & MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 6;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> LOG_SIZE & MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator << 2;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> LOG_SIZE & MASK) >> 2] + x;

            x = this.state[i];
            this.accumulator ^= this.accumulator >>> 16;
            this.accumulator += this.state[j++];
            this.state[i] = y = this.state[(x & MASK) >> 2] + this.accumulator + this.last;
            this.results[i++] = this.last = this.state[(y >> LOG_SIZE & MASK) >> 2] + x;
        }

        for (let j = 0; j < SIZE / 2;) {
            let x = state[i];
            accumulator ^= accumulator << 13;
            accumulator += state[j++];
            state[i] = y = state[(x & MASK) >> 2] + accumulator + last;
            results[i++] = last = state[(y >> LOG_SIZE & MASK) >> 2] + x;

            x = state[i];
            accumulator ^= accumulator >>> 6;
            accumulator += state[j++];
            state[i] = y = state[(x & MASK) >> 2] + accumulator + last;
            results[i++] = last = state[(y >> LOG_SIZE & MASK) >> 2] + x;

            x = state[i];
            accumulator ^= accumulator << 2;
            accumulator += state[j++];
            state[i] = y = state[(x & MASK) >> 2] + accumulator + last;
            results[i++] = last = state[(y >> LOG_SIZE & MASK) >> 2] + x;

            x = state[i];
            accumulator ^= accumulator >>> 16;
            accumulator += state[j++];
            state[i] = y = state[(x & MASK) >> 2] + accumulator + last;
            results[i++] = last = state[(y >> LOG_SIZE & MASK) >> 2] + x;
        }
    }

    private init() {
        let i: number;
        let a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number;
        a = b = c = d = e = f = g = h = GOLDEN_RATIO;

        for (i = 0; i < 4; ++i) {
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
        }

        for (i = 0; i < SIZE; i += 8) { /* fill in mem[] with messy stuff */
            a += results[i];
            b += results[i + 1];
            c += results[i + 2];
            d += results[i + 3];
            e += results[i + 4];
            f += results[i + 5];
            g += results[i + 6];
            h += results[i + 7];

            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            state[i] = a;
            state[i + 1] = b;
            state[i + 2] = c;
            state[i + 3] = d;
            state[i + 4] = e;
            state[i + 5] = f;
            state[i + 6] = g;
            state[i + 7] = h;
        }

        for (i = 0; i < SIZE; i += 8) {
            a += state[i];
            b += state[i + 1];
            c += state[i + 2];
            d += state[i + 3];
            e += state[i + 4];
            f += state[i + 5];
            g += state[i + 6];
            h += state[i + 7];
            a ^= b << 11;
            d += a;
            b += c;
            b ^= c >>> 2;
            e += b;
            c += d;
            c ^= d << 8;
            f += c;
            d += e;
            d ^= e >>> 16;
            g += d;
            e += f;
            e ^= f << 10;
            h += e;
            f += g;
            f ^= g >>> 4;
            a += f;
            g += h;
            g ^= h << 8;
            b += g;
            h += a;
            h ^= a >>> 9;
            c += h;
            a += b;
            state[i] = a;
            state[i + 1] = b;
            state[i + 2] = c;
            state[i + 3] = d;
            state[i + 4] = e;
            state[i + 5] = f;
            state[i + 6] = g;
            state[i + 7] = h;
        }
        isaac();
    }

    public nextInt(): number {
        if (0 == this.count--) {
            this.isaac();
            this.count = IsaacRandom.SIZE - 1;
        }
        return this.results[this.count];
    }

}
