import { Dueling } from "./Duelling";
import { CombatType } from "./combat/CombatType";
import { Mobile } from "../entity/impl/Mobile";
import { NPC } from "../entity/impl/npc/NPC";
import { Player } from "../entity/impl/player/Player";
import { Skill } from "../model/Skill";
import { SkullType, SkullTypes } from "../model/SkullType";
import { BonusManager } from "../model/equipment/BonusManager";
import { PlayerRights } from "../model/rights/PlayerRights";
import { Task } from "../task/Task";
import { TaskManager } from "../task/TaskManager";
import { Misc } from "../../util/Misc";

export class PrayerHandler {

    public static THICK_SKIN = 0;
    public static BURST_OF_STRENGTH = 1;
    public static CLARITY_OF_THOUGHT = 2;
    public static SHARP_EYE = 3;
    public static MYSTIC_WILL = 4;
    public static ROCK_SKIN = 5;
    public static SUPERHUMAN_STRENGTH = 6;
    public static IMPROVED_REFLEXES = 7;
    public static RAPID_RESTORE = 8;
    public static RAPID_HEAL = 9;
    public static PROTECT_ITEM = 10;
    public static HAWK_EYE = 11;
    public static MYSTIC_LORE = 12;
    public static STEEL_SKIN = 13;
    public static ULTIMATE_STRENGTH = 14;
    public static INCREDIBLE_REFLEXES = 15;
    public static PROTECT_FROM_MAGIC = 16;
    public static PROTECT_FROM_MISSILES = 17;
    public static PROTECT_FROM_MELEE = 18;
    public static EAGLE_EYE = 19;
    public static MYSTIC_MIGHT = 20;
    public static RETRIBUTION = 21;
    public static REDEMPTION = 22;
    public static SMITE = 23;
    public static PRESERVE = 24;
    public static CHIVALRY = 25;
    public static PIETY = 26;
    public static RIGOUR = 27
    public static AUGURY = 28;
    public static DEFENCE_PRAYERS: number[] = [PrayerHandler.THICK_SKIN, PrayerHandler.ROCK_SKIN, PrayerHandler.STEEL_SKIN, PrayerHandler.CHIVALRY, PrayerHandler.PIETY, PrayerHandler.RIGOUR, PrayerHandler.AUGURY];
    public static STRENGTH_PRAYERS: number[] = [PrayerHandler.BURST_OF_STRENGTH, PrayerHandler.SUPERHUMAN_STRENGTH, PrayerHandler.ULTIMATE_STRENGTH, PrayerHandler.CHIVALRY, PrayerHandler.PIETY];
    public static ATTACK_PRAYERS: number[] = [PrayerHandler.CLARITY_OF_THOUGHT, PrayerHandler.IMPROVED_REFLEXES, PrayerHandler.INCREDIBLE_REFLEXES, PrayerHandler.CHIVALRY, PrayerHandler.PIETY];
    public static RANGED_PRAYERS: number[] = [PrayerHandler.SHARP_EYE, PrayerHandler.HAWK_EYE, PrayerHandler.EAGLE_EYE, PrayerHandler.RIGOUR];
    public static MAGIC_PRAYERS: number[] = [PrayerHandler.MYSTIC_WILL, PrayerHandler.MYSTIC_LORE, PrayerHandler.MYSTIC_MIGHT, PrayerHandler.AUGURY];
    public static OVERHEAD_PRAYERS: number[] = [PrayerHandler.PROTECT_FROM_MAGIC, PrayerHandler.PROTECT_FROM_MISSILES, PrayerHandler.PROTECT_FROM_MELEE, PrayerHandler.RETRIBUTION, PrayerHandler.REDEMPTION, PrayerHandler.SMITE];
    public static PROTECTION_PRAYERS: number[] = [PrayerHandler.PROTECT_FROM_MAGIC, PrayerHandler.PROTECT_FROM_MISSILES, PrayerHandler.PROTECT_FROM_MELEE];

    public static getProtectingPrayer(type: CombatType): number {
        switch (type) {
            case CombatType.MELEE:
                return PrayerHandler.PROTECT_FROM_MELEE;
            case CombatType.MAGIC:
                return PrayerHandler.PROTECT_FROM_MAGIC;
            case CombatType.RANGED:
                return PrayerHandler.PROTECT_FROM_MISSILES;
            default:
                throw new Error("Invalid combat type: " + type);
        }
    }
    public static isActivated(c: Mobile, prayer: number): boolean {
        return c.getPrayerActive()[prayer];
    }

    /**
     * Activates a prayer with specified <code>buttonId</code>.
     *
     * @param player   The player clicking on prayer button.
     * @param buttonId The button the player is clicking.
     */
    public static togglePrayer(player: Player, buttonId: number): boolean {
        let prayerData = PrayerData.actionButton.get(buttonId);
        if (prayerData != null) {
            if (!player.getPrayerActive()[prayerData.ordinal()])
                PrayerHandler.activatePrayer(player, prayerData.ordinal());
            else
                deactivatePrayer(player, prayerData.ordinal());
            return true;
        }
        return false;
    }

    public static activatePrayer(character: Mobile, pd: PrayerData) {
        PrayerHandler.activatePrayer(character, pd.ordinal());
    }

    public static activatePrayerPrayerId(character: Mobile, prayerId: number) {
        // Get the prayer data
        const pd = PrayerData.get(prayerId);

        // Check if it's available
        if (!pd) {
            return;
        }

        // Check if we're already praying this prayer
        if (character.getPrayerActive()[prayerId]) {
            // If we are an npc, make sure our headicon
            // is up to speed
            if (character.isNpc()) {
                const npc = character.getAsNpc();
                if (pd.hint !== -1) {
                    const hintId = getHeadHint(character);
                    if (npc.getHeadIcon() !== hintId) {
                        npc.setHeadIcon(hintId);
                    }
                }
            }
            return;
        }

        // If we're a player, make sure we can use this prayer
        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            if (player.getSkillManager().getCurrentLevel(Skill.PRAYER) <= 0) {
                player.getPacketSender().sendConfig(pd.configId, 0);
                player.getPacketSender().sendMessage("You do not have enough Prayer points.");
                return;
            }
            if (!PrayerHandler.canUse(player, pd, true)) {
                return;
            }
        }

        switch (prayerId) {
            case PrayerHandler.THICK_SKIN:
            case PrayerHandler.ROCK_SKIN:
            case PrayerHandler.STEEL_SKIN:
                resetPrayers(character, PrayerHandler.DEFENCE_PRAYERS, prayerId);
                break;
            case PrayerHandler.BURST_OF_STRENGTH:
            case PrayerHandler.SUPERHUMAN_STRENGTH:
            case PrayerHandler.ULTIMATE_STRENGTH:
                resetPrayers(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.CLARITY_OF_THOUGHT:
            case PrayerHandler.IMPROVED_REFLEXES:
            case PrayerHandler.INCREDIBLE_REFLEXES:
                resetPrayers(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.SHARP_EYE:
            case PrayerHandler.HAWK_EYE:
            case PrayerHandler.EAGLE_EYE:
            case PrayerHandler.MYSTIC_WILL:
            case PrayerHandler.MYSTIC_LORE:
            case PrayerHandler.MYSTIC_MIGHT:
                resetPrayers(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.CHIVALRY:
            case PrayerHandler.PIETY:
            case PrayerHandler.RIGOUR:
            case PrayerHandler.AUGURY:
                resetPrayers(character, PrayerHandler.DEFENCE_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.STRENGTH_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.ATTACK_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.RANGED_PRAYERS, prayerId);
                resetPrayers(character, PrayerHandler.MAGIC_PRAYERS, prayerId);
                break;
            case PrayerHandler.PROTECT_FROM_MAGIC:
            case PrayerHandler.PROTECT_FROM_MISSILES:
            case PrayerHandler.PROTECT_FROM_MELEE:
                resetPrayers(character, PrayerHandler.OVERHEAD_PRAYERS, prayerId);
                break;
            case PrayerHandler.RETRIBUTION:
            case PrayerHandler.REDEMPTION:
            case PrayerHandler.SMITE:
                resetPrayers(character, PrayerHandler.OVERHEAD_PRAYERS, prayerId);
                break;
        }
        character.setPrayerActive(prayerId, true);


        if (character.isPlayer()) {
            const player = character.getAsPlayer();
            player.getPacketSender().sendConfig(pd.configId, 1);
            startDrain(player);
            if (pd.hint !== -1) {
                const hintId = getHeadHint(character);
                player.getAppearance().setHeadHint(hintId);
            }

            if (player.getInterfaceId() === BonusManager.INTERFACE_ID) {
                BonusManager.update(player);
            }
        } else if (character.isNpc()) {
            const npc = character.getAsNpc();
            if (pd.hint !== -1) {
                const hintId = getHeadHint(character);
                if (npc.getHeadIcon() !== hintId) {
                    npc.setHeadIcon(hintId);
                }
            }
        }
    }

    public static canUse(player: Player, prayer: PrayerData, msg: boolean): boolean {
        if (player.getSkillManager().getMaxLevel(Skill.PRAYER) < (prayer.requirement)) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Prayer level of at least" + prayer.requirement + " to use" + prayer.getPrayerName() + ".");
            }
            return false;
        }
        if (prayer === PrayerData.CHIVALRY && player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 60) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 60 to use Chivalry.");
            }
            return false;
        }
        if (prayer === PrayerData.PIETY && player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 70) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 70 to use Piety.");
            }
            return false;
        }
        if ((prayer === PrayerData.RIGOUR || prayer === PrayerData.AUGURY) && player.getSkillManager().getMaxLevel(Skill.DEFENCE) < 70) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage("You need a Defence level of at least 70 to use that prayer.");
            }
            return false;
        }
        if (prayer === PrayerData.PROTECT_ITEM) {
            if (player.isSkulled() && player.getSkullType() === SkullTypes.RED_SKULL) {
                if (msg) {
                    player.getPacketSender().sendConfig(prayer.configId, 0);
                    // DialogueManager.sendStatement(player, "You cannot use the Protect Item prayer with a red skull!");
                }
                return false;
            }
        }
        if (!player.getCombat().getPrayerBlockTimer().finished()) {
            if (prayer == PrayerData.PROTECT_FROM_MELEE || prayer == PrayerData.PROTECT_FROM_MISSILES
                || prayer == PrayerData.PROTECT_FROM_MAGIC) {
                if (msg) {
                    player.getPacketSender().sendConfig(prayer.configId, 0);
                    player.getPacketSender()
                        .sendMessage("You have been disabled and can no longer use protection prayers.");
                }
                return false;
            }
        }

        // Prayer locks
        let locked = false;

        if (prayer == PrayerData.PRESERVE && !player.isPreserveUnlocked()
            || prayer == PrayerData.RIGOUR && !player.isRigourUnlocked()
            || prayer == PrayerData.AUGURY && !player.isAuguryUnlocked()) {
            if (player.getRights() != PlayerRights.OWNER && player.getRights() != PlayerRights.DEVELOPER) {
                locked = true;
            }
        }

        if (locked) {
            if (msg) {
                player.getPacketSender().sendMessage("You have not unlocked that Prayer yet.");
            }
            return false;
        }

        // Duel, disabled prayer?
        if (player.getDueling().inDuel() && player.getDueling().getRules()[DuelRule.NO_PRAYER.ordinal()]) {
            if (msg) {
                //   DialogueManager.sendStatement(player, "Prayer has been disabled in this duel!");
                player.getPacketSender().sendConfig(prayer.configId, 0);
            }
            return false;
        }
        return true;
    }

    deactivatePrayer(c: Mobile, prayerId: number): void {
        if (!c.getPrayerActive()[prayerId]) {
            return;
        }
        const pd = PrayerData.prayerData.get(prayerId);
        c.getPrayerActive()[prayerId] = false;
        if (c.isPlayer()) {
            const player = c.getAsPlayer();
            player.getPacketSender().sendConfig(pd.configId, 0);
            if (pd.hint !== -1) {
                const hintId = this.getHeadHint(c);
                player.getAppearance().setHeadHint(hintId);
            }

            player.getQuickPrayers().checkActive();
            BonusManager.update(player);
        } else if (c.isNpc()) {
            if (pd.hint !== -1) {
                const hintId = this.getHeadHint(c);
                if (c.getAsNpc().getHeadIcon() !== hintId) {
                    c.getAsNpc().setHeadIcon(hintId);
                }
            }
        }
    }

    public static deactivatePrayers(character: Mobile): void {
        for (let i = 0; i < character.getPrayerActive().length; i++) {
            deactivatePrayer(character, i);
        }
        if (character.isPlayer()) {
            character.getAsPlayer().getQuickPrayers().setEnabled(false);
            character.getAsPlayer().getPacketSender().sendQuickPrayersState(false);
        } else if (character.isNpc()) {
            if (character.getAsNpc().getHeadIcon() !== -1) {
                character.getAsNpc().setHeadIcon(-1);
            }
        }
    }

    public static resetAll(player: Player): void {
        for (let i = 0; i < player.getPrayerActive().length; i++) {
            const pd = PrayerData.prayerData.get(i);
            if (!pd) continue;
            player.getPrayerActive()[i] = false;
            player.getPacketSender().sendConfig(pd.configId, 0);
            if (pd.hint !== -1) {
                const hintId = getHeadHint(player);
                player.getAppearance().setHeadHint(hintId);
            }
        }
        player.getQuickPrayers().setEnabled(false);
        player.getPacketSender().sendQuickPrayersState(false);
    }

    getHeadHint(character: Mobile): number {
        const prayers = character.getPrayerActive();
        if (prayers[PrayerHandler.PROTECT_FROM_MELEE]) {
            return 0;
        }
        if (prayers[PrayerHandler.PROTECT_FROM_MISSILES]) {
            return 1;
        }
        if (prayers[PrayerHandler.PROTECT_FROM_MAGIC]) {
            return 2;
        }
        if (prayers[PrayerHandler.RETRIBUTION]) {
            return 3;
        }
        if (prayers[PrayerHandler.SMITE]) {
            return 4;
        }
        if (prayers[PrayerHandler.REDEMPTION]) {
            return 5;
        }
        return -1;
    }

    startDrain(player: Player) {
        if (player.isDrainingPrayer()) {
            return;
        }
        player.setDrainingPrayer(true);
        let task = new Task(1, player, false, function () {
            let drainPerTick = 0;
            let pointDrain = player.getPrayerPointDrain();
            for (let i = 0; i < player.getPrayerActive().length; i++) {
                if (!player.getPrayerActive()[i]) {
                    continue;
                }
                let pd = PrayerData.prayerData.get(i);
                if (!pd) {
                    continue;
                }
                let drainMinute = pd.drainRate;
                let drainSeconds = drainMinute / 60;
                let drainTicks = (drainSeconds * 0.6);
                drainPerTick += drainTicks;
            }
            if (player.getHitpoints() <= 0 || drainPerTick <= 0) {
                this.stop();
                return;
            }
            let bonus = player.getBonusManager().getOtherBonus()[BonusManager.PRAYER];
            drainPerTick /= (1 + (0.0333 * bonus));

            pointDrain += drainPerTick;
            let drainTreshold = Math.floor(pointDrain);
            if (drainTreshold >= 1) {
                let total = (player.getSkillManager().getCurrentLevel(Skill.PRAYER) - drainTreshold);
                player.getSkillManager().setCurrentLevel(Skill.PRAYER, total, true);
                if (player.getSkillManager().getCurrentLevel(Skill.PRAYER) <= 0) {
                    deactivatePrayers(player);
                    player.getPacketSender().sendMessage("You have run out of Prayer points!");
                    this.stop();
                    return;
                }
                pointDrain -= drainTreshold;
                if (pointDrain < 0) {
                    pointDrain = 0;
                }
            }
            player.setPrayerPointDrain(pointDrain);
        })
    }

    stop() {
        super.stop();
        Player.setPrayerPointDrain(0);
        Player.setDrainingPrayer(false);
    }

    public static resetPrayersC(c: Mobile, prayers: number[], prayerID: number): void {
        for (let i = 0; i < prayers.length; i++) {
            if (prayers[i] != prayerID)
                this.deactivatePrayer(c, prayers[i]);
        }
    }

    /**
     * Resets prayers in the array
     *
     * @param player
     * @param prayers
     */
    public static resetPrayers(player: Player, prayers: number[]): void {
        for (let i = 0; i < prayers.length; i++) {
            deactivatePrayer(player, prayers[i]);
        }
    }

    /**
     * Checks if action button ID is a prayer button.
     *
     * @param buttonId action button being hit.
     */
    public static isButton(actionButtonID: number): boolean {
        return PrayerData.actionButton.has(actionButtonID);
    }
}

export const PrayerDataType = {

    THICK_SKIN = { requirement: 1, drainRate: 5, buttonId: 5609, configId: 83 },
    BURST_OF_STRENGTH = { requirement: 4, drainRate: 5, buttonId: 5610, configId: 84 },
    CLARITY_OF_THOUGHT = { requirement: 7, drainRate: 5, buttonId: 5611, configId: 85 },
    SHARP_EYE = { requirement: 8, drainRate: 5, buttonId: 19812, configId: 700 },
    MYSTIC_WILL = { requirement: 9, drainRate: 5, buttonId: 19814, configId: 701 },
    ROCK_SKIN = { requirement: 10, drainRate: 10, buttonId: 5612, configId: 86 },
    SUPERHUMAN_STRENGTH = { requirement: 13, drainRate: 10, buttonId: 5613, configId: 87 },
    IMPROVED_REFLEXES = { requirement: 16, drainRate: 10, buttonId: 5614, configId: 88 },
    RAPID_RESTORE = { requirement: 19, drainRate: 2.3, buttonId: 5615, configId: 89 },
    RAPID_HEAL = { requirement: 22, drainRate: 3, buttonId: 5616, configId: 90 },
    PROTECT_ITEM = { requirement: 25, drainRate: 3, buttonId: 5617, configId: 91 },
    HAWK_EYE = { requirement: 26, drainRate: 10, buttonId: 19816, configId: 702 },
    MYSTIC_LORE = { requirement: 27, drainRate: 10, buttonId: 19818, configId: 703 },
    STEEL_SKIN = { requirement: 28, drainRate: 20, buttonId: 5618, configId: 92 },
    ULTIMATE_STRENGTH = { requirement: 31, drainRate: 20, buttonId: 5619, configId: 93 },
    INCREDIBLE_REFLEXES = { requirement: 34, drainRate: 20, buttonId: 5620, configId: 94 },
    PROTECT_FROM_MAGIC = { requirement: 37, drainRate: 20, buttonId: 5621, configId: 95, 2},
    PROTECT_FROM_MISSILES = { requirement: 40, drainRate: 20, buttonId: 5622, configId: 96, 1},
    PROTECT_FROM_MELEE = { requirement: 43, drainRate: 20, buttonId: 5623, configId: 97, 0},
    EAGLE_EYE = { requirement: 44, drainRate: 20, buttonId: 19821, configId: 704 },
    MYSTIC_MIGHT = { requirement: 45, drainRate: 20, buttonId: 19823, configId: 705 },
    RETRIBUTION = { requirement: 46, drainRate: 5, buttonId: 683, configId: 98, 4},
    REDEMPTION = { requirement: 49, drainRate: 10, buttonId: 684, configId: 99, 5},
    SMITE = { requirement: 52, drainRate: 32.0, buttonId: 685, configId: 100, 100, 6},
    PRESERVE = { requirement: 55, drainRate: 3, buttonId: 28001, configId: 708 },
    CHIVALRY = { requirement: 60, drainRate: 38.5, buttonId: 19825, configId: 706 },
    PIETY = { requirement: 70, drainRate: 38.5, buttonId: 19827, configId: 707 },
    RIGOUR = { requirement: 74, drainRate: 38.5, buttonId: 28004, configId: 710 },
    AUGURY = { requirement: 77, drainRate: 38.5, buttonId: 28007, configId: 712 }
}

export class PrayerData {
    /**
       * Contains the PrayerData with their corresponding prayerId.
       */
    private static prayerData: HashMap<Integer, PrayerData> = new HashMap<Integer, PrayerData>();
    /**
     * Contains the PrayerData with their corresponding buttonId.
     */
    private static actionButton: HashMap<Integer, PrayerData> = new HashMap<Integer, PrayerData>();

    /**
     * Populates the prayerId and buttonId maps.
     */
    static {
        for (const pd of Object.values(PrayerData)) {
            this.prayerData.set(pd.ordinal(), pd);
            this.actionButton.set(pd.buttonId, pd);
        }
    }

    /**
     * The prayer's level requirement for player to be able to activate it.
     */
    private requirement: number;
    /**
     * The prayer's action button id in prayer tab.
     */
    private buttonId: number;
    /**
     * The prayer's config id to switch their glow on/off by sending the sendConfig
     * packet.
     */
    private configId: number;
    /**
     * The rate of which the player's prayer points will be drained at 
     * per minute.
     */
    private drainRate: number;
    /**
     * The prayer's head icon hint index.
     */
    private hint: number = -1;
    /**
     * The prayer's formatted name.
     */
    private name: string;

    constructor(requirement: number, drainRate: number, buttonId: number, configId: number, hint: number[]) {
        this.requirement = requirement;
        this.drainRate = drainRate;
        this.buttonId = buttonId;
        this.configId = configId;
        if (hint.length > 0)
            this.hint = hint[0];
    }

    /**
     * Gets the prayer's formatted name.
     *
     * @return The prayer's name
     */
    private static getPrayerName(): string {
        if (this.name == null)
            return Misc.capitalizeWords(toString().toLowerCase().replaceAll("_", " "));
        return this.name;
    }
}



