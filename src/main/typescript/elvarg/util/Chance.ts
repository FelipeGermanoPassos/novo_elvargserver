import { Misc } from 'misc';

enum Chance {
    ALWAYS = 100,
    VERY_COMMON = 90,
    COMMON = 75,
    SOMETIMES = 50,
    UNCOMMON = 35,
    VERY_UNCOMMON = 10,
    EXTREMELY_RARE = 5,
    ALMOST_IMPOSSIBLE = 1
}

export class ChanceCalculator {
    private percentage: number;

    constructor(percentage: number) {
        this.percentage = percentage;
    }

    success(): boolean {
        return (Misc.getRandom(100)) <= this.percentage;
    }

    getPercentage(): number {
        return this.percentage;
    }
}