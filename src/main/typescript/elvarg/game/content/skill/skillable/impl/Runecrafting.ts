import { ItemIdentifiers } from "../../../../../util/ItemIdentifiers";
import { Skill, Skills} from "../../../../model/Skill";
import { Player } from "../../../../entity/impl/player/Player";
import { PetHandler } from "../../../PetHandler";
import { Graphic } from "../../../../model/Graphic";
import { Animation } from "../../../../model/Animation";

export class Runecrafting {
    private static CRAFT_RUNES_GRAPHIC = new Graphic(186);
    private static CRAFT_RUNES_ANIMATION = new Animation(791);

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
            player.performGraphic(Runecrafting.CRAFT_RUNES_GRAPHIC);
            player.performAnimation(Runecrafting.CRAFT_RUNES_ANIMATION);
			let craftAmount: number = this.craftAmount(rune.get(), player);
            let xpGain: number = 0;
            for (let i = 0; i < 28; i++) {
                if (!player.getInventory().contains(essence)) {
                break;
                }
                player.getInventory().deleteNumber(essence, 1);
                player.getInventory().adds(rune.get().getRuneID(), craftAmount);
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
            case AIR_RUNE:
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
            case Rune.ASTRAL_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 82)
                    amount = 2;
                break;
            case Rune.BLOOD_RUNE:
                break;
            case Rune.BODY_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 46)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 92)
                    amount = 3;
                break;
            case Rune.CHAOS_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 74)
                    amount = 2;
                break;
            case Rune.COSMIC_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 59)
                    amount = 2;
                break;
            case Rune.DEATH_RUNE:
                break;
            case Rune.EARTH_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 26)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 52)
                    amount = 3;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 78)
                    amount = 4;
                break;
            case Rune.FIRE_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 35)
                    amount = 2;
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 70)
                    amount = 3;
                break;
            case Rune.LAW_RUNE:
                break;
            case Rune.MIND_RUNE:
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
            case Rune.NATURE_RUNE:
                if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) >= 91)
                    amount = 2;
                break;
            case Rune.WATER_RUNE:
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
}

class Talisman {

    AIR_TALISMAN = { id: 1438, level: 1, location: { x: 2841, y: 4828 } };
    MIND_TALISMAN = { id: 1448, level: 2, location: { x: 2793, y: 4827 } };
    WATER_TALISMAN = { id: 1444, level: 5, location: { x: 2720, y: 4831 } };
    EARTH_TALISMAN = { id: 1440, level: 9, location: { x: 2655, y: 4829 } };
    FIRE_TALISMAN = { id: 1442, level: 14, location: { x: 2576, y: 4846 } };
    BODY_TALISMAN = { id: 1446, level: 20, location: { x: 2522, y: 4833 } };
    COSMIC_TALISMAN = { id: 1454, level: 27, location: { x: 2163, y: 4833 } };
    CHAOS_TALISMAN = { id: 1452, level: 35, location: { x: 2282, y: 4837 } };
    NATURE_TALISMAN = { id: 1462, level: 44, location: { x: 2400, y: 4834 } };
    LAW_TALISMAN = { id: 1458, level: 54, location: { x: 2464, y: 4817 } };
    DEATH_TALISMAN = { id: 1456, level: 65, location: { x: 2208, y: 4829 } };
    BLOOD_TALISMAN = { id: 1450, level: 77, location: { x: 1722, y: 3826 } };

    private static talismans: Map<number, Talisman> = new Map<number, Talisman>();

    static initialize() {
        for (let t of Object.values(Talisman)) {
            this.talismans.set(t.talismanId, t);
        }
    }

    constructor(public talismanId: number, public levelReq: number, public location: Location) { }

    static forId(itemId: number): Talisman | undefined {
        return this.talismans.get(itemId);
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

export class Pouch  {
    private static pouches: Map<number, Pouch> = new Map<number, Pouch>();

    public static SMALL_POUCH = { id: 5509, level: 1, capacity: 3, time: -1 };
    public static MEDIUM_POUCH = { id: 5510, level: 25, capacity: 6, time: 45 };
    public static LARGE_POUCH = { id: 5512, level: 50, capacity: 9, time: 29 };
    public static GIANT_POUCH = { id: 5514, level: 75, capacity: 12, time: 10 };

    public static initialize() {
        for (let p of Object.values(Pouch)) {
            Pouch.pouches.set(p.itemId, p);
        }
    }

    constructor(public itemId: number, public requiredLevel: number, public capacity: number, public decayChance: number) { }

    public static forItemId(itemId: number): Pouch | undefined {
        return Pouch.pouches.get(itemId);
    }

    public  getitemId(): number {
        return this.itemId;
    }

    public getrequiredLevel(): number {
        return this.requiredLevel;
    }

    public getcapacity(): number {
        return this.capacity;
    }

    public getdecayChance(): number {
        return this.decayChance;
    }
}

export class PouchContainer {
    pouch: Pouch;
    runeEssenceAmt: number;
    pureEssenceAmt: number;

    constructor(pouch: Pouch, runeEssence?: number, pureEssence?: number) {
        this.pouch = pouch;
        this.runeEssenceAmt = runeEssence;
        this.pureEssenceAmt = pureEssence;
    }

    public store(player: Player) {
        if (this.getStoredAmount() >= this.pouch.capacity) {
            player.sendMessage("Your pouch is already full.");
            return;
        }
        if (player.getSkillManager().getMaxLevel(Skill.RUNECRAFTING) < this.pouch.requiredLevel) {
            player.sendMessage(
                "You need a Runecrafting level of at least " +
                this.pouch.requiredLevel +
                " to use this."
            );
            return;
        }

        for (let i = this.getStoredAmount(); i < this.pouch.capacity; i++) {
            if (player.getInventory().contains(ItemIdentifiers.PURE_ESSENCE)) {
                player.getInventory().deleteNumber(ItemIdentifiers.PURE_ESSENCE, 1);
                this.pureEssenceAmt++;
            } else if (player.getInventory().contains(ItemIdentifiers.RUNE_ESSENCE)) {
                player.getInventory().deleteNumber(ItemIdentifiers.RUNE_ESSENCE, 1);
                this.runeEssenceAmt++;
            } else {
                player.getPacketSender().sendMessage("You don't have any more essence to store.");
                break;
            }
        }
    }

    public withdraw(player: Player) {
        let total = this.getStoredAmount();
        if (total === 0) {
            player.sendMessage("Your pouch is already empty.");
            return;
        }
        for (let i = 0; i < total; i++) {
            if (player.getInventory().isFull()) {
                player.getInventory().full();
                break;
            }
            if (this.pureEssenceAmt > 0) {
                player.getInventory().adds(ItemIdentifiers.PURE_ESSENCE, 1);
                this.pureEssenceAmt--;
            } else if (this.runeEssenceAmt > 0) {
                player.getInventory().adds(ItemIdentifiers.RUNE_ESSENCE, 1);
                this.runeEssenceAmt--;
            } else {
                player.getPacketSender().sendMessage("You don't have any more essence to withdraw.");
                break;
            }
            }
    }

    public check(player: Player) {
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

    public getStoredAmount(): number {
        return this.runeEssenceAmt + this.pureEssenceAmt;
    }

    public getStoredRuneEssence(): number {
        return this.runeEssenceAmt;
    }

    public getStoredPureEssence(): number {
        return this.pureEssenceAmt;
    }

    public getPouch(): Pouch {
        return this.pouch;
    }

}

export class Rune {
    public static readonly AIR_RUNE = new Rune(556, 1, 5, 14897, false );
    public static readonly MIND_RUNE = new Rune(558, 2, 6, 14898, false );
    public static readonly WATER_RUNE = new Rune(555, 5, 7, 14899, false );
    public static readonly EARTH_RUNE = new Rune(557, 9, 8, 14900, false );
    public static readonly FIRE_RUNE = new Rune(554, 14, 9, 14901, false );
    public static readonly BODY_RUNE = new Rune(559, 20, 10, 14902, false );
    public static readonly COSMIC_RUNE = new Rune(564, 27, 11,  14903, true );
    public static readonly CHAOS_RUNE = new Rune(562, 35, 12, 14906, true );
    public static readonly ASTRAL_RUNE = new Rune(9075, 40, 13, 14911, true );
    public static readonly NATURE_RUNE = new Rune(561, 44, 14, 14905, true );
    public static readonly LAW_RUNE = new Rune(563, 54, 15, 14904, true );
    public static readonly DEATH_RUNE = new Rune(560, 65, 16, 14907, true );
    public static readonly BLOOD_RUNE = new Rune(565,  75, 27, 27978, true );

    static runes: Map<number, Rune> = new Map<number, Rune>();

    static {
        for (const rune of Object.values(Rune)) {
            this.runes.set(rune.getObjectId(), rune);
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

    public static forId(objectId: number): Rune | undefined {
        return this.runes.get(objectId);
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

