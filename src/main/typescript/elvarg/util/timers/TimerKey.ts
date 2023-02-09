import { Misc } from 'misc';

export enum TimerKey {
    FOOD,
    KARAMBWAN,
    POTION,
    COMBAT_ATTACK,
    FREEZE,
    FREEZE_IMMUNITY,
    STUN,
    ATTACK_IMMUNITY,
    CASTLEWARS_TAKE_ITEM,
    STEPPING_OUT,
    BOT_WAIT_FOR_PLAYERS
}

export let ticks: { [key in TimerKey]: number } = {
    [TimerKey.FOOD]: 0,
    [TimerKey.KARAMBWAN]: 0,
    [TimerKey.POTION]: 0,
    [TimerKey.COMBAT_ATTACK]: 0,
    [TimerKey.FREEZE]: 0,
    [TimerKey.FREEZE_IMMUNITY]: 0,
    [TimerKey.STUN]: 0,
    [TimerKey.ATTACK_IMMUNITY]: 0,
    [TimerKey.CASTLEWARS_TAKE_ITEM]: 0,
    [TimerKey.STEPPING_OUT]: 0,
    [TimerKey.BOT_WAIT_FOR_PLAYERS]: Misc.getTicks(180)
}
export namespace TimerKey {
    export function getTicks(key: TimerKey) {
        return ticks[key];
    }
}


