class BirdNest {
    private static AMOUNT: number = 1;
    private static SEEDS_NEST_CHANCE: number = 0.64;
    private static GOLD_NEST_CHANCE: number = 0.32;
    public static NEST_DROP_CHANCE: number = 256;

    public static Nest = {
        RED_BIRD_NEST: "RED_BIRD_NEST",
        GREEN_BIRD_NEST: "GREEN_BIRD_NEST",
        BLUE_BIRD_NEST: "BLUE_BIRD_NEST",
        SEEDS_NEST: "SEEDS_NEST",
        GOLD_BIRD_NEST: "GOLD_BIRD_NEST",
        EMPTY: "EMPTY"
    }

    public static getById(id: number) {
        for (const nest in this.Nest) {
            if (nest.getId() === id) {
                return nest;
            }
        }
        return null;
    }

    export function getSeedById(id: number): Seed | undefined {
    for (let seed in Seed) {
        if (Seed[seed].id === id) {
            return Seed[seed];
        }
    }
}

export function getSeedByName(name: string): Seed | undefined {
    for (let seed in Seed) {
        if (Seed[seed].name === name) {
            return Seed[seed];
        }
    }

}


}

class Ring {
    private id: number;
    private name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    static handleDropNest(player: Player) {
        if (player.getLocation().getZ() > 0) {
            return;
        }
        let random = Math.random();
        let nest: Nest;
        if (random < SEEDS_NEST_CHANCE) {
            nest = Nest.SEEDS_NEST;
        } else if (random < SEEDS_NEST_CHANCE + GOLD_NEST_CHANCE) {
            nest = Nest.GOLD_BIRD_NEST;
        } else {
            let color = Misc.getRandom(2);
            nest = color === 1 ? Nest.RED_BIRD_NEST : color === 2 ? Nest.GREEN_BIRD_NEST : Nest.BLUE_BIRD_NEST;
        }
        if (nest != null) {
            ItemOnGroundManager.register(player, new Item(nest.getId(), 1));
            player.getPacketSender().sendMessage("@red@A bird's nest falls out of the tree.");
        }
    }

    static handleSearchNest(p: Player, itemId: number) {
        let nest = Nest.getById(itemId);
        if (!nest) {
            return;
        }
        if (p.getInventory().getFreeSlots() <= 0) {
            p.getPacketSender().sendMessage("Your inventory is too full to take anything out of the bird's nest.");
            return;
        }
        p.getInventory().delete(itemId, 1);
        p.getInventory().add(Nest.EMPTY.getId(), 1);
        if (nest == Nest.GOLD_BIRD_NEST) {
            searchRingNest(p, itemId);
        } else if (nest == Nest.SEEDS_NEST) {
            searchSeedNest(p, itemId);
        } else {
            searchEggNest(p, itemId);
        }
    }


    static searchEggNest(player: Player, itemId: number) {
        let eggId = 0;
        if (itemId == BIRD_NEST) {
            eggId = BIRDS_EGG;
        } else if (itemId == BIRD_NEST_3) {
            eggId = BIRDS_EGG_2;
        } else if (itemId == BIRD_NEST_2) {
            eggId = BIRDS_EGG_3;
        }
        if (eggId != 0) {
            player.getInventory().add(eggId, AMOUNT);
            player.getPacketSender().sendMessage("You take the bird's egg out of the bird's nest.");
        }
    }

    private static searchSeedNest(player: Player, itemId: number) {
        if (itemId != BIRD_NEST_4) {
            return;
        }
        let random = Misc.getRandom(1000);
        let seed: Seed = null;
        if (random <= 220) {
            seed = Seed.ACORN;
        } else if (random <= 350) {
            seed = Seed.WILLOW;
        } else if (random <= 400) {
            seed = Seed.MAPLE;
        } else if (random <= 430) {
            seed = Seed.YEW;
        } else if (random <= 440) {
            seed = Seed.MAGIC;
        } else if (random <= 600) {
            seed = Seed.APPLE;
        } else if (random <= 700) {
            seed = Seed.BANANA;
        } else if (random <= 790) {
            seed = Seed.ORANGE;
        } else if (random <= 850) {
            seed = Seed.CURRY;
        } else if (random <= 900) {
            seed = Seed.PINEAPPLE;
        } else if (random <= 930) {
            seed = Seed.PAPAYA;
        } else if (random <= 960) {
            seed = Seed.PALM;
        } else if (random <= 980) {
            seed = Seed.CALQUAT;
        } else if (random <= 1000) {
            seed = Seed.SPIRIT;
        }
        if (seed != null) {
            player.getInventory().add(seed.getId(), AMOUNT);
            if (seed == Seed.ACORN) {
                player.getPacketSender().sendMessage(`You take an ${seed.getName()} out of the bird's nest.`);
            } else if (seed == Seed.APPLE || seed == Seed.ORANGE) {
                player.getPacketSender().sendMessage(`You take an ${seed.getName()} tree seed out of the bird's nest.`);
            } else {
                player.getPacketSender().sendMessage("You take a " + seed.getName() + " tree seed out of the bird's nest.");
            }
        }
    }
    static searchRingNest(player: Player, itemId: number) {
        if (itemId != BIRD_NEST_5) {
            return;
        }
        let random = Misc.getRandom(100);
        let ring: Ring = null;
        if (random <= 35) {
            ring = Ring.GOLD;
        } else if (random <= 75) {
            ring = Ring.SAPPHIRE;
        } else if (random <= 90) {
            ring = Ring.EMERALD;
        } else if (random <= 98) {
            ring = Ring.RUBY;
        } else if (random <= 100) {
            ring = Ring.DIAMOND;
        }
        if (ring != null) {
            player.getInventory().add(ring.getId(), AMOUNT);
            if (ring == Ring.EMERALD) {
                player.getPacketSender().sendMessage(`You take an ${ring.getName()} ring out of the bird's nest.`);
            } else {
                player.getPacketSender().sendMessage(`You take a ${ring.getName()} ring out of the bird's nest.`);
            }
        }
    }

}


enum Ring {
    GOLD = 1635,
    SAPPHIRE = 1637,
    EMERALD = 1639,
    RUBY = 1641,
    DIAMOND = 1643
}

export enum Seed {
    ACORN = { id: 5312, name: "acorn" },
    WILLOW = { id: 5313, name: "willow" },
    MAPLE = { id: 5314, name: "maple" },
    YEW = { id: 5315, name: "yew" },
    MAGIC = { id: 5316, name: "magic" },
    SPIRIT = { id: 5317, name: "spirit" },
    APPLE = { id: 5283, name: "apple" },
    BANANA = { id: 5284, name: "banana" },
    ORANGE = { id: 5285, name: "orange" },
    CURRY = { id: 5286, name: "curry" },
    PINEAPPLE = { id: 5287, name: "pineapple" },
    PAPAYA = { id: 5288, name: "papaya" },
    PALM = { id: 5289, name: "palm" },
    CALQUAT = { id: 5290, name: "calquat" }
}





