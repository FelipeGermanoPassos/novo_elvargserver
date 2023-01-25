export abstract class CombatSwitch implements CombatAction {

    switchItemIds: number[];
    prayers: PrayerData[];
    instant: boolean;

    constructor(switchItemIds: number[]) {
        this.switchItemIds = switchItemIds;
        this.prayers = [];
        this.instant = false;
    }

    constructor(switchItemIds: number[], prayerData: PrayerData[]) {
        this.switchItemIds = switchItemIds;
        this.prayers = prayerData;
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


    public abstract performAfterSwitch(playerBot: PlayerBot, enemy: Mobile);
}