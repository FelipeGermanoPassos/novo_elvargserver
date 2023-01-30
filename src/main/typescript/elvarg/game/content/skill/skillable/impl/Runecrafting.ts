class Runecrafting {
    private static CRAFT_RUNES_GRAPHIC = { id: 186 };
    private static CRAFT_RUNES_ANIMATION = { id: 791 };

    static initialize(player: Player, objectId: number): boolean {
        let rune = Rune.forId(objectId);
        if (rune) {
            if (player.getSkillManager().getCurrentLevel(Skill.RUNECRAFTING) < rune.getLevelRequirement()) {
                player.getPacketSender().sendMessage("You need a Runecrafting level of at least "
                    + rune.getLevelRequirement() + " to craft this.");
                return false;
            }
            let essence;
            if (rune.isPureRequired()) {
                if (!player.getInventory().contains(ItemIdentifiers.PURE_ESSENCE)) {
                    player.getPacketSender().sendMessage("You need Pure essence to craft runes using this altar.");
                    return true;
                }
                essence = ItemIdentifiers.PURE_ESSENCE;
            } else {
                if (player.getInventory().contains(ItemIdentifiers.RUNE_ESSENCE)) {
                    essence = ItemIdentifiers.RUNE_ESSENCE;
                } else if (player.getInventory().contains(ItemIdentifiers.PURE_ESSENCE)) {
                    essence = ItemIdentifiers.PURE_ESSENCE;
                } else {
                    player.getPacketSender().sendMessage("You don't have any essence in your inventory.");
                    return true;
                }
            }
            player.performGraphic(CRAFT_RUNES_GRAPHIC);
            player.performAnimation(CRAFT_RUNES_ANIMATION);
			int craftAmount = craftAmount(rune.get(), player);
			int xpGain = 0;
            for (int i = 0; i < 28; i++) {
                if (!player.getInventory().contains(essence)) {
                    break;
                }
                player.getInventory().delete(essence, 1);
                player.getInventory().add(rune.get().getRuneID(), craftAmount);
                xpGain += rune.get().getXP();
            }

            // Finally add the total experience they gained..
            player.getSkillManager().addExperience(Skill.RUNECRAFTING, xpGain);

            // Pets..
            PetHandler.onSkill(player, Skill.RUNECRAFTING);
        }
        return false;
    }

    private static craftAmount(rune: Rune, player: Player) {
        let amount = 1;
        switch (rune) {
            case Rune.AIR_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 11)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 22)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 33)
                    amount = 4;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 44)
                    amount = 5;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 55)
                    amount = 6;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 66)
                    amount = 7;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 77)
                    amount = 8;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 88)
                    amount = 9;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 99)
                    if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 99)
                        amount = 10;
                break;
            case ASTRAL_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 82)
                    amount = 2;
                break;
            case BLOOD_RUNE:
                break;
            case BODY_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 46)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 92)
                    amount = 3;
                break;
            case CHAOS_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 74)
                    amount = 2;
                break;
            case COSMIC_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 59)
                    amount = 2;
                break;
            case DEATH_RUNE:
                break;
            case EARTH_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 26)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 52)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 78)
                    amount = 4;
                break;
            case FIRE_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 35)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 70)
                    amount = 3;
                break;
            case LAW_RUNE:
                break;
            case MIND_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 14)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 28)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 42)
                    amount = 4;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 56)
                    amount = 5;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 70)
                    amount = 6;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 84)
                    amount = 7;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 98)
                    amount = 8;
                break;
            case NATURE_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 91)
                    amount = 2;
                break;
            case WATER_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 19)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 38)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 57)
                    amount = 4;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 76)
                    amount = 5;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 95)
                    amount = 6;
                break;
            default:
                break;
        }
        return amount;
    }

    const runes = new Map<number, Rune>();

    static {
        for (const rune of Rune.values()) {
            runes.set(rune.getObjectId(), rune);
        }
    }

    private runeID: number;
    private levelReq: number;
    private xpReward: number;
    private objectId: number;
    private pureRequired: boolean;

    constructor(rune: number, levelReq: number, xpReward: number, altarObjectID: number, pureRequired: boolean) {
        this.runeID = rune;
        this.levelReq = levelReq;
        this.xpReward = xpReward;
        this.objectId = altarObjectID;
        this.pureRequired = pureRequired;
    }

    public static forId(objectId: number): Optional<Rune> {
        return runes.get(objectId) || undefined;
    }

    public getRuneID(): number {
        return this.runeID;
    }

    public getLevelRequirement(): number {
        return this.levelReq;
    }

    public getXP(): number {
        return this.xpReward;
    }

    public getObjectId(): number {
        return this.objectId;
    }

    public isPureRequired(): boolean {
        return this.pureRequired;
    }
}

class Talisman {
    private static talismans: Map<number, Talisman> = new Map<number, Talisman>();
    static initialize() {
        for (let t of Object.values(TalismanEnum)) {
            talismans.set(t.talismanId, t);
        }
    }

    constructor(public talismanId: number, public levelReq: number, public location: Location) { }

    static forId(itemId: number): Talisman | undefined {
        return talismans.get(itemId);
    }

    getItemId(): number {
        return this.talismanId;
    }

    getLevelRequirement(): number {
        return this.levelReq;
    }

    getPosition(): Location {
        return { ...this.location };
    }
}

class Pouch {
    private static pouches: Map<number, Pouch> = new Map<number, Pouch>();

    static initialize() {
        for (let p of Object.values(PouchEnum)) {
            pouches.set(p.itemId, p);
        }
    }

    constructor(public itemId: number, public requiredLevel: number, public capacity: number, public decayChance: number) { }

    static forItemId(itemId: number): Pouch | undefined {
        return pouches.get(itemId);
    }

    get itemId(): number {
        return this.itemId;
    }

    get requiredLevel(): number {
        return this.requiredLevel;
    }

    get capacity(): number {
        return this.capacity;
    }

    get decayChance(): number {
        return this.decayChance;
    }
}

class PouchContainer {
    pouch: Pouch;
    runeEssenceAmt: number;
    pureEssenceAmt: number;
    constructor(pouch: Pouch) {
        this.pouch = pouch;
    }

    constructor(pouch: Pouch, runeEssence: number, pureEssence: number) {
        this.pouch = pouch;
        this.runeEssenceAmt = runeEssence;
        this.pureEssenceAmt = pureEssence;
    }

    store(player: Player) {
        if (this.getStoredAmount() >= this.pouch.capacity) {
            player.sendMessage("Your pouch is already full.");
            return;
        }
        if (player.getSkillLevel(Skill.RUNECRAFTING) < this.pouch.requiredLevel) {
            player.sendMessage(
                "You need a Runecrafting level of at least " +
                this.pouch.requiredLevel +
                " to use this."
            );
            return;
        }

        for (let i = this.getStoredAmount(); i < this.pouch.capacity; i++) {
            if (player.hasItem(ItemIdentifiers.PURE_ESSENCE)) {
                player.removeItem(ItemIdentifiers.PURE_ESSENCE, 1);
                this.pureEssenceAmt++;
            } else if (player.getInventory().contains(ItemIdentifiers.RUNE_ESSENCE)) {
                player.getInventory().delete(ItemIdentifiers.RUNE_ESSENCE, 1);
                runeEssenceAmt++;
            } else {
                player.getPacketSender().sendMessage("You don't have any more essence to store.");
                break;
            }
        }
    }

    withdraw(player: Player) {
        let total = this.getStoredAmount();
        if (total === 0) {
            player.sendMessage("Your pouch is already empty.");
            return;
        }
        for (let i = 0; i < total; i++) {
            if (player.isInventoryFull()) {
                player.sendMessage("You do not have enough inventory space.");
                break;
            }
            if (this.pureEssenceAmt > 0) {
                player.addItem(ItemIdentifiers.PURE_ESSENCE, 1);
                this.pureEssenceAmt--;
            } else if (this.runeEssenceAmt > 0) {
                player.addItem(ItemIdentifiers.RUNE_ESSENCE, 1);
                this.runeEssenceAmt--;
            } else {
                player.sendMessage("You don't have any more essence to withdraw.");
                break;
            }
        }
    }

    check(player: Player) {
        player.sendMessage(
            "Your " +
            this.pouch.toString().replace("_", " ") +
            " contains " +
            this.runeEssenceAmt +
            " Rune essence and " +
            this.pureEssenceAmt +
            " Pure essence."
        );
    }

    getStoredRuneEssence(): number {
        return this.runeEssenceAmt;
    }

    getStoredPureEssence(): number {
        return this.pureEssenceAmt;
    }

    getPouch(): Pouch {
        return this.pouch;
    }

}

enum Rune {
    AIR_RUNE = { id: 556, level: 1, craftAmount: 5, animationId: 14897, pureEssence: false },
    MIND_RUNE = { id: 558, level: 2, craftAmount: 6, animationId: 14898, pureEssence: false },
    WATER_RUNE = { id: 555, level: 5, craftAmount: 7, animationId: 14899, pureEssence: false },
    EARTH_RUNE = { id: 557, level: 9, craftAmount: 8, animationId: 14900, pureEssence: false },
    FIRE_RUNE = { id: 554, level: 14, craftAmount: 9, animationId: 14901, pureEssence: false },
    BODY_RUNE = { id: 559, level: 20, craftAmount: 10, animationId: 14902, pureEssence: false },
    COSMIC_RUNE = { id: 564, level: 27, craftAmount: 11, animationId: 14903, pureEssence: true },
    CHAOS_RUNE = { id: 562, level: 35, craftAmount: 12, animationId: 14906, pureEssence: true },
    ASTRAL_RUNE = { id: 9075, level: 40, craftAmount: 13, animationId: 14911, pureEssence: true },
    NATURE_RUNE = { id: 561, level: 44, craftAmount: 14, animationId: 14905, pureEssence: true },
    LAW_RUNE = { id: 563, level: 54, craftAmount: 15, animationId: 14904, pureEssence: true },
    DEATH_RUNE = { id: 560, level: 65, craftAmount: 16, animationId: 14907, pureEssence: true },
    BLOOD_RUNE = { id: 565, level: 75, craftAmount: 27, animationId: 27978, pureEssence: true }
}

enum Talisman {
    AIR_TALISMAN = { id: 1438, level: 1, location: { x: 2841, y: 4828 } },
    MIND_TALISMAN = { id: 1448, level: 2, location: { x: 2793, y: 4827 } },
    WATER_TALISMAN = { id: 1444, level: 5, location: { x: 2720, y: 4831 } },
    EARTH_TALISMAN = { id: 1440, level: 9, location: { x: 2655, y: 4829 } },
    FIRE_TALISMAN = { id: 1442, level: 14, location: { x: 2576, y: 4846 } },
    BODY_TALISMAN = { id: 1446, level: 20, location: { x: 2522, y: 4833 } },
    COSMIC_TALISMAN = { id: 1454, level: 27, location: { x: 2163, y: 4833 } },
    CHAOS_TALISMAN = { id: 1452, level: 35, location: { x: 2282, y: 4837 } },
    NATURE_TALISMAN = { id: 1462, level: 44, location: { x: 2400, y: 4834 } },
    LAW_TALISMAN = { id: 1458, level: 54, location: { x: 2464, y: 4817 } },
    DEATH_TALISMAN = { id: 1456, level: 65, location: { x: 2208, y: 4829 } },
    BLOOD_TALISMAN = { id: 1450, level: 77, location: { x: 1722, y: 3826 } },
}

enum Pouch {
    SMALL_POUCH = { id: 5509, level: 1, capacity: 3, time: -1 },
    MEDIUM_POUCH = { id: 5510, level: 25, capacity: 6, time: 45 },
    LARGE_POUCH = { id: 5512, level: 50, capacity: 9, time: 29 },
    GIANT_POUCH = { id: 5514, level: 75, capacity: 12, time: 10 },
}

interface Pouch {
    id: number;
    level: number;
    capacity: number;
    time: number;
}

interface Location {
    x: number;
    y: number;
}

interface Talisman {
    talismanId: number;
    levelReq: number;
    location: Location;
}