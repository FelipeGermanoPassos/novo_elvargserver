class NpcDropDefinition {
    public static definitions = new Map<number, NpcDropDefinition>();
    private npcIds: number[];
    private rdtChance: number;
    private alwaysDrops: NPCDrop[];
    private commonDrops: NPCDrop[];
    private uncommonDrops: NPCDrop[];
    private rareDrops: NPCDrop[];
    private veryRareDrops: NPCDrop[];
    private specialDrops: NPCDrop[];
    
    Copy code
    public static get(npcId: number): NpcDropDefinition | undefined {
        return this.definitions.get(npcId);
    }
    
    public getNpcIds(): number[] {
        return this.npcIds;
    }
    
    public getRdtChance(): number {
        return this.rdtChance;
    }
    
    public getAlwaysDrops(): NPCDrop[] {
        return this.alwaysDrops;
    }
    
    public getCommonDrops(): NPCDrop[] {
        return this.commonDrops;
    }
    
    public getUncommonDrops(): NPCDrop[] {
        return this.uncommonDrops;
    }
    
    public getRareDrops(): NPCDrop[] {
        return this.rareDrops;
    }

    public getVeryRareDrops(): NPCDrop[] {
        return this.veryRareDrops;
    }
        
  
    public getSpecialDrops(): NPCDrop[] {
            return this.specialDrops;
    }
        
    enum DropTable {
        COMMON = 90,
        UNCOMMON = 40,
        RARE = 6,
        VERY_RARE = 0.6,
        SPECIAL = -1
    }
        
    enum RDT {
        LAW_RUNE = [563, 45, 64],
        DEATH_RUNE = [560, 45, 64],
        NATURE_RUNE = [561, 67, 43],
        STEEL_ARROW = [886, 150, 64],
        RUNE_ARROW = [886, 42, 64],
        UNCUT_SAPPHIRE = [1623, 1, 1],
        UNCUT_EMERALD = [1621, 1, 20],
        UNCUT_RUBY = [1619, 1, 20],
        UNCUT_DIAMOND = [1617, 1, 64],
        DRAGONSTONE = [1631, 1, 64],
        RUNITE_BAR = [2363, 1, 20],
        SILVER_ORE = [443, 100, 64],
        COINS = [995, 3000, 1],
        CHAOS_TALISMAN = [1452, 1, 1],
        NATURE_TALISMAN = [1462, 1, 20],
        LOOP_HALF_OF_KEY = [987, 6, 1],
        TOOTH_HALF_OF_KEY = [985, 6, 1],
        ADAMANT_JAVELIN = [829, 20, 64],
        RUNE_JAVELIN = [830, 5, 33],
        RUNE_2H_SWORD = [1319, 1, 43],
        RUNE_BATTLEAXE = [1373, 1, 43],
        RUNE_SQUARE_SHIELD = [1185, 1, 64],
        RUNE_KITE_SHIELD = [1201, 1, 128],
        DRAGON_MED_HELM = [1149, 1, 128],
        RUNE_SPEAR = [1247, 1, 137],
        SHIELD_LEFT_HALF = [2366, 1, 273],
        DRAGON_SPEAR = [1249, 1, 364]
    }
    
    itemId: number;
    amount: number;
    chance: number;


    constructor(itemId: number, amount: number, chance: number) {
        this.itemId = itemId;
        this.amount = amount;
        this.chance = chance;
    }

    getItemId(): number {
        return this.itemId;
    }

    getAmount(): number {
        return this.amount;
    }

    getChance(): number {
        return this.chance;
    }
    }

    class NPCDrop {
    itemId: number;
    minAmount: number;
    maxAmount: number;
    chance: number;

    constructor(itemId: number, minAmount: number, maxAmount: number) {
        this.itemId = itemId;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.chance = -1;
    }

    constructor(itemId: number, minAmount: number, maxAmount: number, chance: number) {
        this.itemId = itemId;
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.chance = chance;
    }

    getItemId(): number {
        return this.itemId;
    }

    getMinAmount(): number {
        return this.minAmount;
    }

    getMaxAmount(): number {
        return this.maxAmount;
    }

    toItem(random: RandomGen): Item {
        return new Item(this.itemId, random.inclusive(this.minAmount, this.maxAmount));
    }

    getChance(): number {
        return this.chance;
    }
}