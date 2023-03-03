import { TimerKey } from "../../util/timers/TimerKey";
import { Player } from "../entity/impl/player/Player";
import { Sounds } from "../Sounds";
import { Sound } from "../Sound";
import { Skill } from "../model/Skill";
import { Item } from "../model/Item";
import { Animation } from "../model/Animation";

export class Food {
    /**
     * The {@link Animation} that will be played when consuming food.
     */
    private static readonly ANIMATION = new Animation(829);

    public static consume(player: Player, item: number, slot: number): boolean {
        const food = Edible.types.get(item);
        // Check if {@code item} is a valid food type..
        if (!food) {
            return false;
        }

        if (player.getArea() != null) {
            if (!player.getArea().canEat(player, item)) {
                player.getPacketSender().sendMessage("You cannot eat here.");
                return true;
            }
        }

        // Check if we're currently able to eat..
        if (player.getTimers().has(TimerKey.STUN)) {
            player.getPacketSender().sendMessage("You're currently stunned!");
            return true;
        }

        if (food == Edible.KARAMBWAN) {
            if (player.getTimers().has(TimerKey.KARAMBWAN))
                return true;
        } else {
            if (player.getTimers().has(TimerKey.FOOD)) {
                return true;
            }
        }

        player.getTimers().extendOrRegister(TimerKey.FOOD, 3);
        player.getTimers().extendOrRegister(TimerKey.COMBAT_ATTACK, 5);

        if (food == Edible.KARAMBWAN) {
            player.getTimers().register(TimerKey.KARAMBWAN, 3); // Register karambwan timer too
            player.getTimers().register(TimerKey.POTION, 3); // Register the potion timer (karambwan blocks pots)
        }

        // Close interfaces..
        player.getPacketSender().sendInterfaceRemoval();

        // Stop skilling..
        player.getSkillManager().stopSkillable();

        // Send sound..
        Sounds.sendSound(player, Sound.FOOD_EAT);

        player.performAnimation(Food.ANIMATION);

        // Delete food from inventory..
        player.getInventory().delete(food.item, slot);

        // Heal the player..
        const currentHp = player.getSkillManager().getCurrentLevel(Skill.HITPOINTS);
        const maxHp = player.getSkillManager().getMaxLevel(Skill.HITPOINTS);
        const healAmount = food.heal;

        if (food == Edible.ANGLERFISH) {
                int c = 2;
            if (currentHp >= 25) {
                c = 4;
            }
            if (currentHp >= 50) {
                c = 6;
            }
            if (currentHp >= 75) {
                c = 8;
            }
            if (currentHp >= 93) {
                c = 13;
            }
            healAmount = Math.floor((currentHp / 10) + c);
            if (healAmount > 22) {
                healAmount = 22;
            }
            maxHp += healAmount;
        }

        if (healAmount + currentHp > maxHp) {
            healAmount = maxHp - currentHp;
        }
        if (healAmount < 0) {
            healAmount = 0;
        }

        player.setHitpoints(player.getHitpoints() + healAmount);

        // Send message to player..
        const e: string = food == Edible.BANDAGES ? "use" : "eat";
        player.getPacketSender().sendMessage("You " + e + " the " + food.name + ".");

        // Handle cake slices..
        if (food == Edible.CAKE || food == Edible.SECOND_CAKE_SLICE) {
            player.getInventory().add(new Item(food.item.getId() + 2, 1));
        }
        return true;
    }

}

export class Edible {
    public static readonly KEBAB = { item: new Item(1971), heal: 4 };
    public static readonly CHEESE = { item: new Item(1985), heal: 4 };
    public static readonly CAKE = { item: new Item(1891), heal: 5 };
    public static readonly SECOND_CAKE_SLICE = { item: new Item(1893), heal: 5 };
    public static readonly THIRD_CAKE_SLICE = { item: new Item(1895), heal: 5 };
    public static readonly BANDAGES = { item: new Item(14640), heal: 12 };
    public static readonly JANGERBERRIES = { item: new Item(247), heal: 2 };
    public static readonly WORM_CRUNCHIES = { item: new Item(2205), heal: 7 };
    public static readonly EDIBLE_SEAWEED = { item: new Item(403), heal: 4 };
    public static readonly ANCHOVIES = { item: new Item(319), heal: 1 };
    public static readonly SHRIMPS = { item: new Item(315), heal: 3 };
    public static readonly SARDINE = { item: new Item(325), heal: 4 };
    public static readonly COD = { item: new Item(339), heal: 7 };
    public static readonly TROUT = { item: new Item(333), heal: 7 };
    public static readonly PIKE = { item: new Item(351), heal: 8 };
    public static readonly SALMON = { item: new Item(329), heal: 9 };
    public static readonly TUNA = { item: new Item(361), heal: 10 };
    public static readonly LOBSTER = { item: new Item(379), heal: 12 };
    public static readonly BASS = { item: new Item(365), heal: 13 };
    public static readonly SWORDFISH = { item: new Item(373), heal: 14 };
    public static readonly MEAT_PIZZA = { item: new Item(2293), heal: 14 };
    public static readonly MONKFISH = { item: new Item(7946), heal: 16 };
    public static readonly SHARK = { item: new Item(385), heal: 20 };
    public static readonly SEA_TURTLE = { item: new Item(397), heal: 21 };
    public static readonly DARK_CRAB = { item: new Item(11936), heal: 22 };
    public static readonly MANTA_RAY = { item: new Item(391), heal: 22 };
    public static readonly KARAMBWAN = { item: new Item(3144), heal: 18 };
    public static readonly ANGLERFISH = { item: new Item(13441), heal: 22 };
    /*
    * Baked goods food types a player can make with the cooking skill.
    */
    POTATO = { item: new Item(1942), heal: 1 };
    BAKED_POTATO = { item: new Item(6701), heal: 4 };
    POTATO_WITH_BUTTER = { item: new Item(6703), heal: 14 };
    CHILLI_POTATO = { item: new Item(7054), heal: 14 };
    EGG_POTATO = { item: new Item(7056), heal: 16 };
    POTATO_WITH_CHEESE = { item: new Item(6705), heal: 16 };
    MUSHROOM_POTATO = { item: new Item(7058), heal: 20 };
    TUNA_POTATO = { item: new Item(7060), heal: 20 };
    SPINACH_ROLL = { item: new Item(1969), heal: 2 };
    BANANA = { item: new Item(1963), heal: 2 };
    BANANA_ = { item: new Item(18199), heal: 2 };
    CABBAGE = { item: new Item(1965), heal: 2 };
    ORANGE = { item: new Item(2108), heal: 2 };
    PINEAPPLE_CHUNKS = { item: new Item(2116), heal: 2 };
    PINEAPPLE_RINGS = { item: new Item(2118), heal: 2 };
    PEACH = { item: new Item(6883), heal: 8 };
    PURPLE_SWEETS = { item: new Item(4561), heal: 3 };

    public static types: Map<number, Edible> = new Map();

    static {
        for (const type of Object.values(Edible)) {
            Edible.types.set(type.item.getId(), type);
        }
    }

    private item: Item;
    private heal: number;
    private name: string;

    constructor(item: Item, heal: number, name: string) {
        this.item = item;
        this.heal = heal;
        this.name = name.toLowerCase().replace(/__/g, "-").replace(/_/g, " ");
    }

    public getItem(): Item {
        return this.item;
    }

    /**
     * Returns an array of all Edible item ids.
     *
     * @return {Integer[]} edibleTypes
     */
    public static getTypes(): number[] {
        return Object.keys(Edible.types).map(Number);
    }

    public getHeal(): number {
        return this.heal;
    }
}
