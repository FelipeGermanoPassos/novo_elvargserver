export class Food {
    /**
     * The {@link Animation} that will be played when consuming food.
     */
    private static readonly ANIMATION = new Animation(829, Priority.HIGH);

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

        player.performAnimation(ANIMATION);

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
const types: Map<number, Edible> = new Map();

for (const type of Object.values(Edible)) {
    types.set(type.item.getId(), type);

    Edible.prototype.getItem = function () {
        return this.item;
    }
}

static getTypes(): number[] {
    return Array.from(types.keys());
}

getHeal(): number {
    return this.heal;
}

interface Edible {
    item: Item,
    heal: number,
    name: string
}

export enum Edible {
    KEBAB = { item: new Item(1971), heal: 4 },
    CHEESE = { item: new Item(1985), heal: 4 },
    CAKE = { item: new Item(1891), heal: 5 },
    SECOND_CAKE_SLICE = { item: new Item(1893), heal: 5 },
    THIRD_CAKE_SLICE = { item: new Item(1895), heal: 5 },
    BANDAGES = { item: new Item(14640), heal: 12 },
    JANGERBERRIES = { item: new Item(247), heal: 2 },
    WORM_CRUNCHIES = { item: new Item(2205), heal: 7 },
    EDIBLE_SEAWEED = { item: new Item(403), heal: 4 },
    ANCHOVIES = { item: new Item(319), heal: 1 },
    SHRIMPS = { item: new Item(315), heal: 3 },
    SARDINE = { item: new Item(325), heal: 4 },
    COD = { item: new Item(339), heal: 7 },
    TROUT = { item: new Item(333), heal: 7 },
    PIKE = { item: new Item(351), heal: 8 },
    SALMON = { item: new Item(329), heal: 9 },
    TUNA = { item: new Item(361), heal: 10 },
    LOBSTER = { item: new Item(379), heal: 12 },
    BASS = { item: new Item(365), heal: 13 },
    SWORDFISH = { item: new Item(373), heal 14},
    MEAT_PIZZA = { item: new Item(2293), heal: 14 },
    MONKFISH = { item: new Item(7946), heal: 16 },
    SHARK = { item: new Item(385), heal: 20 },
    SEA_TURTLE = { item: new Item(397), heal: 21 },
    DARK_CRAB = { item: new Item(11936), heal: 22 },
    MANTA_RAY = { item: new Item(391), heal: 22 },
    KARAMBWAN = { item: new Item(3144), heal: 18 },
    ANGLERFISH = { item: new Item(13441), heal: 22 },
    /*
    * Baked goods food types a player can make with the cooking skill.
    */
    POTATO = { item: new Item(1942), heal: 1 },
    BAKED_POTATO = { item: new Item(6701), heal: 4 },
    POTATO_WITH_BUTTER = { item: new Item(6703), heal: 14 },
    CHILLI_POTATO = { item: new Item(7054), heal: 14 },
    EGG_POTATO = { item: new Item(7056), heal: 16 },
    POTATO_WITH_CHEESE = { item: new Item(6705), heal: 16 },
    MUSHROOM_POTATO = { item: new Item(7058), heal: 20 },
    TUNA_POTATO = { item: new Item(7060), heal: 20 },
    SPINACH_ROLL = { item: new Item(1969), heal: 2 },
    BANANA = { item: new Item(1963), heal: 2 },
    BANANA_ = { item: new Item(18199), heal: 2 },
    CABBAGE = { item: new Item(1965), heal: 2 },
    ORANGE = { item: new Item(2108), heal: 2 },
    PINEAPPLE_CHUNKS = { item: new Item(2116), heal: 2 },
    PINEAPPLE_RINGS = { item: new Item(2118), heal: 2 },
    PEACH = { item: new Item(6883), heal: 8 },
    PURPLE_SWEETS = { item: new Item(4561), heal: 3 },
}
