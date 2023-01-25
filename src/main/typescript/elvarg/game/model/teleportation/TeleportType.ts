export enum TeleportType {
    // Spellbooks
    NORMAL = { startTick: 3, startAnim: new Animation(714, Priority.HIGH), middleAnim: null, endAnim: new Animation(715, Priority.HIGH), startGraphic: new Graphic(308, 50, GraphicHeight.HIGH), middleGraphic: null, endGraphic: null },
    ANCIENT = { startTick: 5, startAnim: new Animation(1979, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(392, Priority.HIGH), middleGraphic: null, endGraphic: null },
    LUNAR = { startTick: 4, startAnim: new Animation(1816, Priority.HIGH), middleAnim: null, endAnim: new Animation(715, Priority.HIGH), startGraphic: new Graphic(308, Priority.HIGH), middleGraphic: null, endGraphic: null },
    // Ladders
    LADDER_DOWN = { startTick: 1, startAnim: new Animation(827, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: null, middleGraphic: null, endGraphic: null },
    LADDER_UP = { startTick: 1, startAnim: new Animation(828, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: null, middleGraphic: null, endGraphic: null },

    // Misc
    LEVER = { startTick: 3, startAnim: new Animation(2140, Priority.HIGH), middleAnim: new Animation(714), endAnim: new Animation(715, Priority.HIGH), startGraphic: null, middleGraphic: null, endGraphic: new Graphic(308, 50, GraphicHeight.HIGH) },
    TELE_TAB = { startTick: 3, startAnim: new Animation(4071, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(678, Priority.HIGH), middleGraphic: null, endGraphic: null },
    PURO_PURO = { startTick: 9, startAnim: new Animation(6601, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(1118, Priority.HIGH), middleGraphic: null, endGraphic: null },
}

interface TeleportTypeProps {
    startTick: number;
    startAnim: Animation;
    middleAnim: Animation;
    endAnim: Animation;
    startGraphic: Graphic;
    middleGraphic: Graphic;
    endGraphic: Graphic;
}

function getStartAnimation(TeleportType: TeleportType): Animation {
    return TeleportType.startAnim;
}

function getEndAnimation(TeleportType: TeleportType): Animation {
    return TeleportType.endAnim;
}

function getStartGraphic(TeleportType: TeleportType): Graphic {
    return TeleportType.startGraphic;
}

function getStartTick(TeleportType: TeleportType): number {
    return TeleportType.startTick;
}

function getMiddleAnim(TeleportType: TeleportType): Animation {
    return TeleportType.middleAnim;
}

function getMiddleGraphic(TeleportType: TeleportType): Graphic {
    return TeleportType.middleGraphic;
}
