import { ThreadLocalRandom } from "node_modules/java.util.concurrent";

class RandomGen {
    private random: ThreadLocalRandom = ThreadLocalRandom.current();

    public get() {
        return this.random;
    }

    public inclusive(min: number, max: number) {
        if (max < min) {
            max = min + 1;
        }
        return this.random.nextInt((max - min) + 1) + min;
    }

    public inclusive(range: number) {
        return this.inclusive(0, range);
    }

    public inclusiveExcludes(min: number, max: number, exclude: number[]) {
        exclude.sort();

        let result = this.inclusive(min, max);
        while (exclude.binarySearch(result) >= 0) {
            result = this.inclusive(min, max);
        }

        return result;
    }

    public floatRandom(range: number) {
        if (range < 0) {
            throw new Error("range <= 0");
        }
        return this.random.nextFloat() * range;
    }

    public randomIndex(array: any[]) {
        return (this.random.nextDouble() * array.length) | 0;
    }

    public random<T>(array: T[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: number[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: long[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: double[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: short[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: byte[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: float[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: boolean[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random(array: char[]) {
        return array[(this.random.nextDouble() * array.length) | 0];
    }

    public random<T>(list: Array<T>) {
        return list[(this.random.nextDouble() * list.length) | 0];
    }

    public shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const index = this.random.nextInt(i + 1);
            const a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: long[]): long[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: double[]): double[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: short[]): short[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: byte[]): byte[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = Math.floor(Math.random() * (i + 1));
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }
    function shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = random.nextInt(i + 1);
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: boolean[]): boolean[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = random.nextInt(i + 1);
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function shuffle(array: char[]): char[] {
        for (let i = array.length - 1; i > 0; i--) {
            let index = random.nextInt(i + 1);
            let a = array[index];
            array[index] = array[i];
            array[i] = a;
        }
        return array;
    }

    function success(value: number): boolean {
        return random.nextDouble() <= value;
    }
}
