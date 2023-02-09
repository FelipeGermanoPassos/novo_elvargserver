import { Player } from "../entity/impl/player/Player";
import { PrayerHandler } from "./PrayerHandler";

export class QuickPrayers extends PrayerHandler {
    private static readonly TOGGLE_QUICK_PRAYERS = 1500;
    private static readonly SETUP_BUTTON = 1506;
    private static readonly CONFIRM_BUTTON = 17232;
    private static readonly QUICK_PRAYERS_TAB_INTERFACE_ID = 17200;
    private static readonly CONFIG_START = 620;

    private player: Player;
    public prayers: PrayerData[] = new Array(PrayerData.values().length);
    private selectingPrayers: boolean;
    private enabled: boolean;

    constructor(player: Player) {
        super();
        this.player = player;
    }

    public sendChecks(): void {
        for (const prayer of PrayerData.values()) {
            this.sendCheck(prayer);
        }
    }

    private sendCheck(prayer: PrayerData): void {
        this.player.getPacketSender().sendConfig(CONFIG_START + prayer.ordinal(), this.prayers[prayer.ordinal()] !== null ? 0 : 1);
    }

    private uncheck(toDeselect: number[], exception: number): void {
        for (const i of toDeselect) {
            if (i === exception) {
                continue;
            }
            this.uncheck(PrayerData.values()[i]);
        }
    }

    private uncheck(prayer: PrayerData): void {
        if (this.prayers[prayer.ordinal()] !== null) {
            this.prayers[prayer.ordinal()] = null;
            this.sendCheck(prayer);
        }
    }

    private toggle(index: number): void {
        const prayer = PrayerData.values()[index];
        if (this.prayers[prayer.ordinal()] !== null) {
            this.uncheck(prayer);
            return;
        }

        if (!canUse(this.player, prayer, true)) {
            this.uncheck(prayer);
            return;
        }

        this.prayers[prayer.ordinal()] = prayer;
        this.sendCheck(prayer);

        switch (index) {
            case THICK_SKIN:
            case ROCK_SKIN:
            case STEEL_SKIN:
                this.uncheck(DEFENCE_PRAYERS, index);
                break;
            case BURST_OF_STRENGTH:
            case SUPERHUMAN_STRENGTH:
            case ULTIMATE_STRENGTH:
                this.uncheck(STRENGTH_PRAYERS, index);
                this.uncheck(RANGED_PRAYERS, index);
                this.uncheck(MAGIC_PRAYERS, index);
                break;
            case CLARITY_OF_THOUGHT:
            case IMPROVED_REFLEXES:
            case INCREDIBLE_REFLEXES:
                this.uncheck(ATTACK_PRAYERS, index);
                this.uncheck(RANGED_PRAYERS, index);
                this.uncheck(MAGIC_PRAYERS, index);
                break;
            case SHARP_EYE:
            case HAWK_EYE:
            case EAGLE_EYE:
            case MYSTIC_WILL:
            case MYSTIC_LORE:
            case MYSTIC_MIGHT:
                this.uncheck(STRENGTH_PRAYERS, index);
                this.uncheck(ATTACK_PRAYERS, index);
                this.uncheck(RANGED_PRAYERS, index);
                this.uncheck(MAGIC_PRAYERS, index);
                break;
            case CHIVALRY:
            case PIETY:
            case RIGOUR:
            case AUGURY:
                this.uncheck(DEFENCE_PRAYERS, index);
                this.uncheck(STRENGTH_PRAYERS, index);
                this.uncheck(ATTACK_PRAYERS, index);
                this.uncheck(RANGED_PRAYERS, index);
                this.uncheck(MAGIC_PRAYERS, index);
                break;
            case PROTECT_FROM_MAGIC:
            case PROTECT_FROM_MISSILES:
            case PROTECT_FROM_MELEE:
                this.uncheck(OVERHEAD_PRAYERS, index);
                break;
            case RETRIBUTION:
            case REDEMPTION:
            case SMITE:
                this.uncheck(OVERHEAD_PRAYERS, index);
                break;
        }
    }

    public checkActive(): void {
        if (this.enabled) {
            for (const prayer of this.prayers) {
                if (prayer === null) continue;
                if (isActivated(this.player, prayer.ordinal())) {
                    return;
                }
            }
            this.enabled = false;
            this.player.getPacketSender().sendQuickPrayersState(false);
        }
    }


    public handleButton(button: number): boolean {
        switch (button) {
            case TOGGLE_QUICK_PRAYERS:
                if (this.player.getSkillManager().getCurrentLevel(Skill.PRAYER) <= 0) {
                    this.player.getPacketSender().sendMessage("You don't have enough Prayer points.");
                    return true;
                }
                if (this.enabled) {
                    for (const prayer of this.prayers) {
                        if (prayer === null) continue;
                        deactivatePrayer(this.player, prayer.ordinal());
                    }
                    this.enabled = false;
                } else {
                    let found = false;
                    for (const prayer of this.prayers) {
                        if (prayer === null) continue;
                        activatePrayer(this.player, prayer.ordinal());
                        found = true;
                    }
                    if (!found) {
                        this.player.getPacketSender().sendMessage("You have not setup any quick-prayers yet.");
                    }
                    this.enabled = found;
                }
                this.player.getPacketSender().sendQuickPrayersState(this.enabled);
                break;
            case SETUP_BUTTON:
                if (this.selectingPrayers) {
                    this.player.getPacketSender().sendTabInterface(5, 5608).sendTab(5);
                    this.selectingPrayers = false;
                } else {
                    this.sendChecks();
                    this.player.getPacketSender().sendTabInterface(5, QUICK_PRAYERS_TAB_INTERFACE_ID).sendTab(5);
                    this.selectingPrayers = true;
                }
                break;
            case CONFIRM_BUTTON:
                if (this.selectingPrayers) {
                    this.player.getPacketSender().sendTabInterface(5, 5608);
                    this.selectingPrayers = false;
                }
                break;
        }
        if (button >= 17202 && button <= 17230) {
            if (this.selectingPrayers) {
                const index = button - 17202;
                this.toggle(index);
            }
            return true;
        }
        return false;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    public getPrayers(): PrayerData[] {
        return this.prayers;
    }

    public setPrayers(prayers: PrayerData[]): void {
        this.prayers = prayers;
    }
}