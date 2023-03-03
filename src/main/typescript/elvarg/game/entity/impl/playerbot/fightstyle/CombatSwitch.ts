import { PrayerHandler } from "../../../../content/PrayerHandler";
import { Mobile } from "../../Mobile";
import { PlayerBot } from "../PlayerBot";
import { ItemInSlot } from "../../../../model/ItemInSlot";
import { EquipPacketListener } from "../../../../../net/packet/impl/EquipPacketListener";
import { TimerKey } from "../../../../../util/timers/TimerKey";
import { CombatAction } from "./CombatAction";
import { PrayerData } from "../../../../content/PrayerHandler";
import { Player } from "../../player/Player";


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

    private doSwitch(playerBot: PlayerBot, player: Player) {
        for (let prayer of this.prayers) {
            PrayerHandler.activatePrayer(player, prayer);
        }
        for (let itemId of this.switchItemIds) {
            let item = ItemInSlot.getFromInventory(itemId, playerBot.getInventory());

            if (item == null) {
                continue;
            }
            EquipPacketListener.equipFromInventory(player, item);
        }
    }
    public perform(player: Player, enemy: Mobile) {
        this.doSwitch(player);
        this.performAfterSwitch(playerBot, enemy);
    }


    public abstract performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void;
}