export enum SkullTypes {
    WHITE_SKULL = 0,
    RED_SKULL = 1
}

export class SkullType {
    iconId: number;

    SkullType(iconId: number) {
        this.iconId = iconId;
    }

    public getIconId(): number {
        return this.iconId;
    }
}