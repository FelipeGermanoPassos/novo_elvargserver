export class TeleportType {
    // Spellbooks
    public static NORMAL = { startTick: 3, startAnim: new Animation(714, Priority.HIGH), middleAnim: null, endAnim: new Animation(715, Priority.HIGH), startGraphic: new Graphic(308, 50, GraphicHeight.HIGH), middleGraphic: null, endGraphic: null }
    public static ANCIENT = { startTick: 5, startAnim: new Animation(1979, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(392, Priority.HIGH), middleGraphic: null, endGraphic: null }
    public static LUNAR = { startTick: 4, startAnim: new Animation(1816, Priority.HIGH), middleAnim: null, endAnim: new Animation(715, Priority.HIGH), startGraphic: new Graphic(308, Priority.HIGH), middleGraphic: null, endGraphic: null }
    // Ladders
    public static LADDER_DOWN = { startTick: 1, startAnim: new Animation(827, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: null, middleGraphic: null, endGraphic: null }
    public static LADDER_UP = { startTick: 1, startAnim: new Animation(828, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: null, middleGraphic: null, endGraphic: null }
    // Misc
    public static LEVER = { startTick: 3, startAnim: new Animation(2140, Priority.HIGH), middleAnim: new Animation(714), endAnim: new Animation(715, Priority.HIGH), startGraphic: null, middleGraphic: null, endGraphic: new Graphic(308, 50, GraphicHeight.HIGH) }
    public static TELE_TAB = { startTick: 3, startAnim: new Animation(4071, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(678, Priority.HIGH), middleGraphic: null, endGraphic: null }
    public static PURO_PURO = { startTick: 9, startAnim: new Animation(6601, Priority.HIGH), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(1118, Priority.HIGH), middleGraphic: null, endGraphic: null }
}

export interface TeleportTypeProps {
    startTick: number;
    startAnim: Animation;
    middleAnim: Animation;
    endAnim: Animation;
    startGraphic: Graphic;
    middleGraphic: Graphic;
    endGraphic: Graphic;
}

export function getStartAnimation(TeleportType: TeleportType): Animation {
    return TeleportType.startAnim;
}

export function getEndAnimation(TeleportType: TeleportType): Animation {
    return TeleportType.endAnim;
}

export function getStartGraphic(TeleportType: TeleportType): Graphic {
    return TeleportType.startGraphic;
}

export function getStartTick(TeleportType: TeleportType): number {
    return TeleportType.startTick;
}

export function getMiddleAnim(TeleportType: TeleportType): Animation {
    return TeleportType.middleAnim;
}

export function getMiddleGraphic(TeleportType: TeleportType): Graphic {
    return TeleportType.middleGraphic;
}
