import { GraphicHeight } from "../GraphicHeight";
import { Priority } from "../Priority";
import { Graphic } from "../Graphic";
import { Animation } from "../Animation";
export class TeleportType {
    // Spellbooks
    public static NORMAL = { startTick: 3, startAnim: new Animation(714), middleAnim: null, endAnim: new Animation(715), startGraphic: new Graphic(308, 50), middleGraphic: null, endGraphic: null }
    public static ANCIENT = { startTick: 5, startAnim: new Animation(1979), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(392, Priority.HIGH), middleGraphic: null, endGraphic: null }
    public static LUNAR = { startTick: 4, startAnim: new Animation(1816), middleAnim: null, endAnim: new Animation(715), startGraphic: new Graphic(308, Priority.HIGH), middleGraphic: null, endGraphic: null }
    // Ladders
    public static LADDER_DOWN = { startTick: 1, startAnim: new Animation(827), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: null, middleGraphic: null, endGraphic: null }
    public static LADDER_UP = { startTick: 1, startAnim: new Animation(828), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: null, middleGraphic: null, endGraphic: null }
    // Misc
    public static LEVER = { startTick: 3, startAnim: new Animation(2140), middleAnim: new Animation(714), endAnim: new Animation(715), startGraphic: null, middleGraphic: null, endGraphic: new Graphic(308, 50) }
    public static TELE_TAB = { startTick: 3, startAnim: new Animation(4071), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(678, Priority.HIGH), middleGraphic: null, endGraphic: null }
    public static PURO_PURO = { startTick: 9, startAnim: new Animation(6601), middleAnim: null, endAnim: Animation.DEFAULT_RESET_ANIMATION, startGraphic: new Graphic(1118, Priority.HIGH), middleGraphic: null, endGraphic: null }
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

export function getStartAnimation(TeleportType: TeleportTypeProps): Animation {
    return TeleportType.startAnim;
}

export function getEndAnimation(TeleportType: TeleportTypeProps): Animation {
    return TeleportType.endAnim;
}

export function getStartGraphic(TeleportType: TeleportTypeProps): Graphic {
    return TeleportType.startGraphic;
}

export function getStartTick(TeleportType: TeleportTypeProps): number {
    return TeleportType.startTick;
}

export function getMiddleAnim(TeleportType: TeleportTypeProps): Animation {
    return TeleportType.middleAnim;
}

export function getMiddleGraphic(TeleportType: TeleportTypeProps): Graphic {
    return TeleportType.middleGraphic;
}
