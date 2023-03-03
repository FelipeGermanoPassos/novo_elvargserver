import { Misc } from "../../../../../../util/Misc";
import { Player } from "../../../../../entity/impl/player/Player";
import { ItemOnGroundManager } from "../../../../../entity/impl/grounditem/ItemOnGroundManager";
import { ItemIdentifiers } from "../../../../../../util/ItemIdentifiers";
import { Item } from "../../../../../model/Item";

export class BirdNest {
    public static AMOUNT: number = 1;
    public static SEEDS_NEST_CHANCE: number = 0.64;
    public static GOLD_NEST_CHANCE: number = 0.32;
    public static NEST_DROP_CHANCE: number = 256;

    public static getById(id: number) {
        for (const nest in Nest) {
            if (Rings.getId() === id) {
                return nest;
            }
        }
        return null;
    }

    public static  getSeedById(id: number): Seed | undefined {
        for (let seed in Seed) {
            if (Seed[seed].id === id) {
                return Seed[seed];
            }
        }
    }

    public static getSeedByName(name: string): Seed | undefined {
        for (let seed in Seed) {
            if (Seed[seed].name === name) {
                return Seed[seed];
            }
        }
    }

}

export class Rings {
    private id: number;
    private name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static handleSearchNest(p: Player, itemId: number) {
        let nest = BirdNest.getById(itemId);
        if (!nest) {
            return;
        }
        if (p.getInventory().getFreeSlots() <= 0) {
            p.getPacketSender().sendMessage("Your inventory is too full to take anything out of the bird's nest.");
            return;
        }
        p.getInventory().deleteNumber(itemId, 1);
        p.getInventory().adds(Nest.EMPTY.getId(), 1);
        if (nest == Nest.GOLD_BIRD_NEST) {
            this.searchRingNest(p, itemId);
        } else if (nest == Nest.SEEDS_NEST) {
            this.searchSeedNest(p, itemId);
        } else {
            this.searchEggNest(p, itemId);
        }
    }


    static searchEggNest(player: Player, itemId: number) {
        let eggId = 0;
        if (itemId == ItemIdentifiers.BIRD_NEST) {
            eggId = ItemIdentifiers.BIRDS_EGG;
        } else if (itemId == ItemIdentifiers.BIRD_NEST_3) {
            eggId = ItemIdentifiers.BIRDS_EGG_2;
        } else if (itemId == ItemIdentifiers.BIRD_NEST_2) {
            eggId = ItemIdentifiers.BIRDS_EGG_3;
        }
        if (eggId != 0) {
            player.getInventory().adds(eggId, BirdNest.AMOUNT);
            player.getPacketSender().sendMessage("You take the bird's egg out of the bird's nest.");
        }
    }

    private static searchSeedNest(player: Player, itemId: number) {
        if (itemId != ItemIdentifiers.BIRD_NEST_4) {
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
            player.getInventory().adds(Rings.getId(), BirdNest.AMOUNT);
            if (seed == Seed.ACORN) {
                player.getPacketSender().sendMessage(`You take an ${Rings.getName()} out of the bird's nest.`);
            } else if (seed == Seed.APPLE || seed == Seed.ORANGE) {
                player.getPacketSender().sendMessage(`You take an ${Rings.getName()} tree seed out of the bird's nest.`);
            } else {
                player.getPacketSender().sendMessage("You take a " + Rings.getName() + " tree seed out of the bird's nest.");
            }
        }
    }
    static searchRingNest(player: Player, itemId: number) {
        if (itemId != ItemIdentifiers.BIRD_NEST_5) {
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
            player.getInventory().adds(Ring.getId(), BirdNest.AMOUNT);
            if (ring == Ring.EMERALD) {
                player.getPacketSender().sendMessage(`You take an ${Rings.getName()} ring out of the bird's nest.`);
            } else {
                player.getPacketSender().sendMessage(`You take a ${Rings.getName()} ring out of the bird's nest.`);
            }
        }
    }

}


class Ring {
    GOLD = 1635;
    SAPPHIRE = 1637;
    EMERALD = 1639;
    RUBY = 1641;
    DIAMOND = 1643

    private readonly id: number;
    private readonly name: String;

    constructor( id: number, name: String) {
        this.id = id;
        this.name = name;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): String {
        return this.name;
    }
}

export class Seed {
    public static readonly ACORN = { id: 5312, name: "acorn" };
    public static readonly WILLOW = { id: 5313, name: "willow" };
    public static readonly MAPLE = { id: 5314, name: "maple" };
    public static readonly YEW = { id: 5315, name: "yew" };
    public static readonly MAGIC = { id: 5316, name: "magic" };
    public static readonly SPIRIT = { id: 5317, name: "spirit" };
    public static readonly APPLE = { id: 5283, name: "apple" };
    public static readonly BANANA = { id: 5284, name: "banana" };
    public static readonly ORANGE = { id: 5285, name: "orange" };
    public static readonly CURRY = { id: 5286, name: "curry" };
    public static readonly PINEAPPLE = { id: 5287, name: "pineapple" };
    public static readonly PAPAYA = { id: 5288, name: "papaya" };
    public static readonly PALM = { id: 5289, name: "palm" };
    public static readonly CALQUAT = { id: 5290, name: "calquat" }

    private readonly id: number;
        private readonly name: String;

        constructor(id: number, name: String) {
            this.id = id;
            this.name = name;
        }

        public getId(): number {
            return this.id;
        }

        public getName(): String {
            return this.name;
        }
}

export class Nest {
    RED_BIRD_NEST = 'RED_BIRD_NEST';
    GREEN_BIRD_NEST = "GREEN_BIRD_NEST";
    BLUE_BIRD_NEST = "BLUE_BIRD_NEST";
    SEEDS_NEST = "SEEDS_NEST";
    GOLD_BIRD_NEST =  "GOLD_BIRD_NEST";
    EMPTY = "EMPTY";

    private readonly id: number

    constructor(id: number) {
        this.id = id;
    }

    public getId(): number {
        return this.id;
    }

    public static getById(id: number): Nest {
        for (nest: Nest : values()) {
            if (nest.getId() == id) {
                return nest;
            }
        }
        return null;
    }
}




