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
                return PROTECT_FROM_MELEE;
            case CombatType.MAGIC:
                return PROTECT_FROM_MAGIC;
            case CombatType.RANGED:
                return PROTECT_FROM_MISSILES;
            default:
                throw new Error("Invalid combat type: " + type);
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
                activatePrayer(player, prayerData.ordinal());
            else
                deactivatePrayer(player, prayerData.ordinal());
            return true;
        }
        return false;
    }

    public static activatePrayer(character: Mobile, pd: PrayerData) {
        activatePrayer(character, pd.ordinal());
    }

    public static activatePrayer(character: Mobile, prayerId: number) {
        // Get the prayer data
        const pd = PrayerData.prayerData.get(prayerId);

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
            if (!canUse(player, pd, true)) {
                return;
            }
        }

        switch (prayerId) {
            case THICK_SKIN:
            case ROCK_SKIN:
            case STEEL_SKIN:
                resetPrayers(character, DEFENCE_PRAYERS, prayerId);
                break;
            case BURST_OF_STRENGTH:
            case SUPERHUMAN_STRENGTH:
            case ULTIMATE_STRENGTH:
                resetPrayers(character, STRENGTH_PRAYERS, prayerId);
                resetPrayers(character, RANGED_PRAYERS, prayerId);
                resetPrayers(character, MAGIC_PRAYERS, prayerId);
                break;
            case CLARITY_OF_THOUGHT:
            case IMPROVED_REFLEXES:
            case INCREDIBLE_REFLEXES:
                resetPrayers(character, ATTACK_PRAYERS, prayerId);
                resetPrayers(character, RANGED_PRAYERS, prayerId);
                resetPrayers(character, MAGIC_PRAYERS, prayerId);
                break;
            case SHARP_EYE:
            case HAWK_EYE:
            case EAGLE_EYE:
            case MYSTIC_WILL:
            case MYSTIC_LORE:
            case MYSTIC_MIGHT:
                resetPrayers(character, STRENGTH_PRAYERS, prayerId);
                resetPrayers(character, ATTACK_PRAYERS, prayerId);
                resetPrayers(character, RANGED_PRAYERS, prayerId);
                resetPrayers(character, MAGIC_PRAYERS, prayerId);
                break;
            case CHIVALRY:
            case PIETY:
            case RIGOUR:
            case AUGURY:
                resetPrayers(character, DEFENCE_PRAYERS, prayerId);
                resetPrayers(character, STRENGTH_PRAYERS, prayerId);
                resetPrayers(character, ATTACK_PRAYERS, prayerId);
                resetPrayers(character, RANGED_PRAYERS, prayerId);
                resetPrayers(character, MAGIC_PRAYERS, prayerId);
                break;
            case PROTECT_FROM_MAGIC:
            case PROTECT_FROM_MISSILES:
            case PROTECT_FROM_MELEE:
                resetPrayers(character, OVERHEAD_PRAYERS, prayerId);
                break;
            case RETRIBUTION:
            case REDEMPTION:
            case SMITE:
                resetPrayers(character, OVERHEAD_PRAYERS, prayerId);
                break;
        }
        character.setPrayerActive(prayerId, true);

        Here is the equivalent code in TypeScript:

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

    canUse(player: Player, prayer: PrayerData, msg: boolean): boolean {
        if (player.getSkillManager().getMaxLevel(Skill.PRAYER) < (prayer.requirement)) {
            if (msg) {
                player.getPacketSender().sendConfig(prayer.configId, 0);
                player.getPacketSender().sendMessage(You need a Prayer level of at least ${ prayer.requirement } to use ${ prayer.getPrayerName() }.);
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
            if (player.isSkulled() && player.getSkullType() === SkullType.RED_SKULL) {
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
        const locked = false;

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
                const hintId = getHeadHint(c);
                player.getAppearance().setHeadHint(hintId);
            }

            player.getQuickPrayers().checkActive();
            BonusManager.update(player);
        } else if (c.isNpc()) {
            if (pd.hint !== -1) {
                const hintId = getHeadHint(c);
                if (c.getAsNpc().getHeadIcon() !== hintId) {
                    c.getAsNpc().setHeadIcon(hintId);
                }
            }
        }
    }

    deactivatePrayers(character: Mobile): void {
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

    resetAll(player: Player): void {
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
        if (prayers[PROTECT_FROM_MELEE]) {
            return 0;
        }
        if (prayers[PROTECT_FROM_MISSILES]) {
            return 1;
        }
        if (prayers[PROTECT_FROM_MAGIC]) {
            return 2;
        }
        if (prayers[RETRIBUTION]) {
            return 3;
        }
        if (prayers[SMITE]) {
            return 4;
        }
        if (prayers[REDEMPTION]) {
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

        stop() {
            super.stop();
            player.setPrayerPointDrain(0);
            player.setDrainingPrayer(false);
        }
    }

    public static void resetPrayers(Mobile c: any, prayers: number[], prayerID: number) {
        for (let i = 0; i < prayers.length; i++) {
            if (prayers[i] != prayerID)
                deactivatePrayer(c, prayers[i]);
        }
    }

    /**
     * Resets prayers in the array
     *
     * @param player
     * @param prayers
     */
    public static void resetPrayers(Player player: Player, prayers: number[]) {
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

    static prayerData: { [key: number]: PrayerData } = {};
    static actionButton: { [key: number]: PrayerData } = {};
    requirement: number;
    buttonId: number;
    configId: number;

    static init() {
        for (let pd of Object.values(PrayerData)) {
            prayerData[pd.ordinal()] = pd;
            actionButton[pd.buttonId] = pd;
        }
    }

    constructor(private requirement: number, drainRate: number, private buttonId: number, private configId: number, hint?: number) {
        this.drainRate = drainRate;
        if (hint) {
            this.hint = hint;
        }
    }

    /**
     * Gets the prayer's formatted name.
     *
     * @return The prayer's name
     */
    getPrayerName(): string {
        if (!this.name) {
            return Misc.capitalizeWords(this.toString().toLowerCase().replace(/_/g, " "));
        }
        return this.name;
    }

    static prayerData = new Map<number, PrayerData>();
    static actionButton = new Map<number, PrayerData>();

    static init() {
        for (let pd of Object.values(PrayerData)) {
            PrayerData.prayerData.set(pd.ordinal, pd);
            PrayerData.actionButton.set(pd.buttonId, pd);
        }
    }
}

enum PrayerData {
    THICK_SKIN = 1,
    BURST_OF_STRENGTH,
    CLARITY_OF_THOUGHT,
    SHARP_EYE,
    MYSTIC_WILL,
    ROCK_SKIN,
    SUPERHUMAN_STRENGTH,
    IMPROVED_REFLEXES,
    RAPID_RESTORE,
    RAPID_HEAL,
    PROTECT_ITEM,
    HAWK_EYE,
    MYSTIC_LORE,
    STEEL_SKIN,
    ULTIMATE_STRENGTH,
    INCREDIBLE_REFLEXES,
    PROTECT_FROM_MAGIC,
    PROTECT_FROM_MISSILES,
    PROTECT_FROM_MELEE,
    EAGLE_EYE,
    MYSTIC_MIGHT,
    RETRIBUTION,
    REDEMPTION,
    SMITE,
    PRESERVE,
    CHIVALRY,
    PIETY,
    RIGOUR,
    AUGURY
}
