enum EffectTimers {
    VENGEANCE = 157,
    FREEZE = 158,
    ANTIFIRE = 159,
    OVERLOAD = 160,
    TELE_BLOCK = 161
}
class EffectTimer {
    clientSprite: number;

    constructor(clientSprite: number) {
        this.clientSprite = clientSprite;
    }

    public getClientSprite(): number {
        return this.clientSprite;
    }

    public setClientSprite(sprite: number): void {
        this.clientSprite = sprite;
    }
}