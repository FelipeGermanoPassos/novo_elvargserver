enum SlayerTask {
    BANSHEES("in the Slayer Tower", 15, 50, 15, 8, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
        ["banshee", "twisted banshee"]),
        BATS("in the Taverly Dungeon", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["bat", "giant bat"]),
        CHICKENS("in Lumbridge", 15, 50, 1, 6, [SlayerMaster.TURAEL],
            ["chicken", "mounted terrorbird gnome", "terrorbird", "rooster"]),
        BEARS("outside Varrock", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["black bear", "grizzly bear", "grizzly bear cub", "bear cub", "callisto"]),
        CAVE_BUGS("Lumbridge dungeon", 10, 20, 7, 8, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["cave bug"]),
        CAVE_CRAWLERS("Lumbridge dungeon", 15, 50, 10, 8, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["cave crawler"]),
        CAVE_SLIME("Lumbridge dungeon", 10, 20, 17, 8, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["cave slime"]),
        COWS("Lumbridge", 15, 50, 1, 8, [SlayerMaster.TURAEL],
            ["cow", "cow calf"]),
        CRAWLING_HANDS("in the Slayer Tower", 15, 50, 5, 8, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["crawling hand"]),
        DESERT_LIZARDS("in the desert", 15, 50, 22, 8, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["lizard", "small lizard", "desert lizard"]),
        DOGS("", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["dog", "jackal", "guard dog", "wild dog"]),
        DWARVES("", 15, 50, 1, 7, [SlayerMaster.TURAEL], ["dwarf", "dwarf gang member", "chaos dwarf"]),
        GHOSTS("", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["ghost", "tortured soul"]),
        GOBLINS("", 15, 50, 1, 7, [SlayerMaster.TURAEL],
            ["goblin", "cave goblin guard"]),
        ICEFIENDS("", 15, 50, 1, 8, [SlayerMaster.TURAEL], ["icefiend"]),
        KALPHITES("", 15, 50, 1, 6, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["kalphite worker", "kalphite soldier", "kalphite guardian", "kalphite queen"]),
        MINOTAURS("", 10, 20, 1, 7, [SlayerMaster.TURAEL], ["minotaur"]),
        MONKEYS("", 10, 20, 1, 7, [SlayerMaster.TURAEL],
            ["monkey", "karmjan monkey", "monkey guard", "monkey archer", "zombie monkey"]),
        RATS("", 15, 50, 1, 7, [SlayerMaster.TURAEL],
            ["rat", "giant rat", "dungeon rat", "brine rat"]),
        SCORPIONS("", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["scorpion", "king scorpion", "poison scorpion", "pit scorpion", "scorpia"]),
        SKELETONS("", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["skeleton", "skeleton mage", "vet'ion"]),
        SPIDERS("", 15, 50, 1, 6, [SlayerMaster.TURAEL],
            ["spider", "giant spider", "shadow spider", "giant crypt spider", "venenatis"]),
        WOLVES("", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA],
            ["wolf", "white wolf", "big wolf"]),
        ZOMBIES("", 15, 50, 1, 7, [SlayerMaster.TURAEL, SlayerMaster.MAZCHNA], ["zombie", "undead one"]),
        CATABLEPONS("", 15, 50, 1, 8, [SlayerMaster.MAZCHNA], ["catablepon"]),
        COCKATRICES("", 15, 50, 25, 8, [SlayerMaster.MAZCHNA], ["cockatrice"]),
        EARTH_WARRIORS("", 15, 50, 1, 6, [SlayerMaster.MAZCHNA], ["earth warrior"]),
        FLESH_CRAWLERS("", 15, 50, 1, 7, [SlayerMaster.MAZCHNA], ["flesh crawler"]),
        GHOULS("", 15, 50, 1, 7, [SlayerMaster.MAZCHNA], ["ghoul"]),
        HILL_GIANTS("", 15, 50, 1, 7, [SlayerMaster.MAZCHNA], ["hill giant"]),
        HOBGOBLINS("", 15, 50, 1, 7, [SlayerMaster.MAZCHNA], ["hob goblin"]),
        ROCKSLUGS("", 15, 50, 1, 8, [SlayerMaster.MAZCHNA], ["rockslug"])
        private hint: string;
    private minimumAmount: number;
    private maximumAmount: number;
    private slayerLevel: number;
    private weight: number;
    private masters: SlayerMaster[];
    private npcNames: string[];

constructor(hint: string, minimumAmount: number, maximumAmount: number, slayerLevel: number, weight: number,
    masters: SlayerMaster[], npcNames: string[]) {
    this.hint = hint;
    this.minimumAmount = minimumAmount;
    this.maximumAmount = maximumAmount;
    this.slayerLevel = slayerLevel;
    this.weight = weight;
    this.masters = masters;
    this.npcNames = npcNames;
}

public getHint() : string {
    return this.hint;
}

public getMinimumAmount() : number {
    return this.minimumAmount;
}

public getMaximumAmount() : number {
    return this.maximumAmount;
}

public getSlayerLevel() : number {
    return this.slayerLevel;
}

public getWeight() : number {
    return this.weight;
}

public getMasters() : SlayerMaster[] {
    return this.masters;
}

public getNpcNames() : string[] {
    return this.npcNames;
}

public toString() : string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase().replace(/_/g, "");
}

public isUnlocked(player: Player) : boolean {
    return true;
}

public static VALUES = Object.values(SlayerTask);
    }


