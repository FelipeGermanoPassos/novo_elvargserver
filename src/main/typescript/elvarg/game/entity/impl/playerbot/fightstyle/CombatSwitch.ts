import { PrayerHandler } from "../../../../content/PrayerHandler";
import { Mobile } from "../../Mobile";
import { PlayerBot } from "../PlayerBot";
import { ItemInSlot } from "../../../../model/ItemInSlot";
import { EquipPacketListener } from "../../../../../net/packet/impl/EquipPacketListener";
import { TimerKey } from "../../../../../util/timers/TimerKey";
import { CombatAction } from "./CombatAction";
import { PrayerData } from "../../../../content/PrayerHandler";


export abstract class CombatSwitch implements CombatAction {

    switchItemIds: number[];
    prayers: PrayerData[];
    instant: boolean;
    shouldPerform;
    stopAfter;


    constructor(switchItemIds: number[], prayerData?: PrayerData[]) {
        this.switchItemIds = switchItemIds;
        if (prayerData != null) {
            this.prayers = prayerData;
        } else {
            this.prayers = [];
        }
        this.instant = false;
    }

    private doSwitch(playerBot: PlayerBot) {
        for (let prayer of this.prayers) {
            PrayerHandler.activatePrayer(playerBot, prayer);
        }
        for (let itemId of this.switchItemIds) {
            let item = ItemInSlot.getFromInventory(itemId, playerBot.getInventory());

            if (item == null) {
                continue;
            }
            EquipPacketListener.equipFromInventory(playerBot, item);
        }
    }
    public perform(playerBot: PlayerBot, enemy: Mobile) {
        this.doSwitch(playerBot);
        this.performAfterSwitch(playerBot, enemy);
    }


    public abstract performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void;
}