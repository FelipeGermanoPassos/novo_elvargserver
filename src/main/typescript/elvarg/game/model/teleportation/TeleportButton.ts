enum TeleportButton {
    HOME = [-1, 19210, 21741, 19210],
    TRAINING = [-1, 1164, 13035, 30064],
    MINIGAME = [2, 1167, 13045, 30075],
    WILDERNESS = [0, 1170, 13053, 30083],
    SLAYER = [-1, 1174, 13061, 30114],
    CITY = [-1, 1540, 13079, 30146],
    SKILLS = [3, 1541, 13069, 30106],
    BOSSES = [1, 7455, 13087, 30138],

    menu: number;
    ids: number[];

    constructor(menu: number, ...ids: number[]) {
        this.ids = ids;
        this.menu = menu;
    }
    
    static teleports = new Map<number, TeleportButton>();
    
    static init() {
    for (const b of Object.values(TeleportButton)) {
        for (const i of b.ids) {
            teleports.set(i, b);
        }
    }
}
    
    static get(buttonId: number) {
    return teleports.get(buttonId);
}
    }

TeleportButton.init();

export default TeleportButton;