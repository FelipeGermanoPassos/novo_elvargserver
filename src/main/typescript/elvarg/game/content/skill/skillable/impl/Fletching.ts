export class Fletching extends ItemIdentifiers {
    /**
 * Attempts to fletch ammo.
 *
 * @param player
 * @param itemUsed
 * @param itemUsedWith
 * @return
 */
    public static fletchAmmo(player: Player, itemUsed: number, itemUsedWith: number): boolean {
        //Making ammo such as bolts and arrows..
        for (let ammo of FletchableAmmo.values()) {
            if ((ammo.getItem1() == itemUsed || ammo.getItem1() == itemUsedWith)
                && (ammo.getItem2() == itemUsed || ammo.getItem2() == itemUsedWith)) {
                if (player.getSkillManager().getCurrentLevel(Skill.FLETCHING) >= ammo.getLevelReq()) {
                    if (player.getInventory().getAmount(ammo.getItem1()) >= 10 && player.getInventory().getAmount(ammo.getItem2()) >= 10) {
                        player.getInventory().delete(ammo.getItem1(), 10);
                        player.getInventory().delete(ammo.getItem2(), 10);
                        player.getInventory().add(ammo.getOutcome(), 10);
                        player.getSkillManager().addExperience(Skill.FLETCHING, ammo.getXp());
                        let name = ItemDefinition.forId(ammo.getOutcome()).getName();
                        if (!name.endsWith("s"))
                            name += "s";
                        player.getPacketSender().sendMessage("You make some " + name + ".");
                    } else {
                        player.getPacketSender().sendMessage("You must have at least 10 of each supply when fletching a set.");
                    }
                } else {
                    player.getPacketSender().sendMessage("You need a Fletching level of at least " + ammo.getLevelReq() + " to fletch this.");
                }
                return true;
            }
        }
        return false;
    }

    const fletchCrossbow = (player: Player, itemUsed: number, itemUsedWith: number): boolean => {
        for (const c of FletchableCrossbow.values()) {
            if ((c.getStock() === itemUsed || c.getStock() === itemUsedWith)
                && (c.getLimbs() === itemUsed || c.getLimbs() === itemUsedWith)) {
                player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to make?", [c.getUnstrung()], (itemId, amount) => {
                    player.getSkillManager().startSkillable(new ItemCreationSkillable([new RequiredItem(new Item(c.getStock()), true), new RequiredItem(new Item(c.getLimbs()), true)], new Item(c.getUnstrung()), amount, Optional.empty(), c.getLevel(), c.getLimbsExp(), Skill.FLETCHING));
                }));
                return true;
            }
        }
        return false;
    }

    const stringBow = (player: Player, itemUsed: number, itemUsedWith: number): boolean => {
        if (itemUsed === BOW_STRING || itemUsedWith === BOW_STRING || itemUsed === CROSSBOW_STRING || itemUsedWith === CROSSBOW_STRING) {
            const string = itemUsed === BOW_STRING || itemUsed === CROSSBOW_STRING ? itemUsed : itemUsedWith;
            const unstrung = itemUsed === BOW_STRING || itemUsed === CROSSBOW_STRING ? itemUsedWith : itemUsed;
            const bow = StringableBow.unstrungBows.get(unstrung);
            if (bow) {
                if (bow.getBowStringId() === string) {
                    player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to make?", [bow.getResult()], (itemId, amount) => {
                        player.getSkillManager().startSkillable(new ItemCreationSkillable([new RequiredItem(new Item(bow.getItemId()), true), new RequiredItem(new Item(bow.getBowStringId()), true)], new Item(bow.getResult()), amount, Optional.of(new AnimationLoop(bow.getAnimation(), 3)), bow.getLevelReq(), bow.getExp(), Skill.FLETCHING));
                    }));
                    return true;
                } else {
                    player.getPacketSender().sendMessage("This bow cannot be strung with that.");
                    return false;
                }
            }
        }
        return false;
    }

    const fletchLog = (player: Player, itemUsed: number, itemUsedWith: number): boolean => {
        if (itemUsed === ItemIdentifiers.KNIFE || itemUsedWith === ItemIdentifiers.KNIFE) {
            const logId = itemUsed === ItemIdentifiers.KNIFE ? itemUsedWith : itemUsed;
            const list = FletchableLog.logs.get(logId);
            if (list) {
                const products: number[] = [];
                for (let i = 0; i < list.getFletchable().length; i++) {
                    products.push(list.getFletchable()[i].getProduct().getId());
                }
                const menu = new CreationMenu("What would you like to make?", products, (itemId, amount) => {
                    for (const fl of list.getFletchable()) {
                        if (fl.getProduct().getId() === itemId) {
                            player.getSkillManager().startSkillable(new ItemCreationSkillable([new RequiredItem(new Item(KNIFE), false), new RequiredItem(new Item(list.getLogId()), true)], fl.getProduct(), amount, Optional.of(new AnimationLoop(fl.getAnimation(), 3)), fl.getLevelRequired(), fl.getExperience(), Skill.FLETCHING));
                        }
                    }
                });
                player.getPacketSender().sendCreationMenu(menu);
                return true;
            }
        }
        return false;
    }
}

enum FletchableAmmo {
    HEADLESS_ARROWS = { id: 52, arrowHead: 314, product: 53, level: 15, exp: 1 },
    BRONZE_ARROWS = { id: 53, arrowHead: 39, product: 882, level: 20, exp: 1 },
    IRON_ARROWS = { id: 53, arrowHead: 40, product: 884, level: 38, exp: 15 },
    STEEL_ARROWS = { id: 53, arrowHead: 41, product: 886, level: 75, exp: 30 },
    MITHRIL_ARROWS = { id: 53, arrowHead: 42, product: 888, level: 113, exp: 45 },
    ADAMANT_ARROWS = { id: 53, arrowHead: 43, product: 890, level: 150, exp: 60 },
    RUNE_ARROWS = { id: 53, arrowHead: 44, product: 892, level: 188, exp: 75 },
    DRAGON_ARROWS = { id: 53, arrowHead: 11237, product: 11212, level: 225, exp: 90 },
    BRONZE_DARTS = { id: 314, arrowHead: 819, product: 806, level: 2, exp: 10 },
    IRON_DARTS = { id: 314, arrowHead: 820, product: 807, level: 4, exp: 22 },
    STEEL_DARTS = { id: 314, arrowHead: 821, product: 808, level: 8, exp: 37 },
    MITHRIL_DARTS = { id: 314, arrowHead: 822, product: 809, level: 12, exp: 52 },
    ADAMANT_DARTS = { id: 314, arrowHead: 823, product: 810, level: 15, exp: 67 },
    RUNE_DARTS = { id: 314, arrowHead: 824, product: 811, level: 20, exp: 81 },
    DRAGON_DARTS = { id: 314, arrowHead: 11232, product: 11230, level: 25, exp: 95 },
    BRONZE_BOLTS = { id: 314, arrowHead: 9375, product: 877, level: 5, exp: 9 },
    OPAL_BOLTS = { id: 877, arrowHead: 45, product: 879, level: 16, exp: 11 },
    IRON_BOLTS = { id: 314, arrowHead: 9377, product: 9140, level: 15, exp: 39 },
    PEARL_BOLTS = { id: 9140, arrowHead: 46, product: 880, level: 32, exp: 41 },
    SILVER_BOLTS = { id: 314, arrowHead: 9382, product: 9145, level: 25, exp: 43 },
    STEEL_BOLTS = { id: 314, arrowHead: 9378, product: 9141, level: 35, exp: 46 },
    RED_TOPAZ_BOLTS = { id: 9141, arrowHead: 9188, product: 9336, level: 39, exp: 48 },
    BARBED_BOLTS = { id: 877, arrowHead: 47, product: 881, level: 30, exp: 55 },
    MITHRIL_BOLTS = { id: 314, arrowHead: 9379, product: 9142, level: 50, exp: 54 },
    BROAD_BOLTS = { id: 314, arrowHead: 11876, product: 11875, level: 30, exp: 55 },
    SAPPHIRE_BOLTS = { id: 9142, arrowHead: 9189, product: 9337, level: 47, exp: 56 },
    EMERALD_BOLTS = { id: 9142, arrowHead: 9190, product: 9338, level: 58, exp: 55 },
    ADAMANTITE_BOLTS = { id: 314, arrowHead: 9380, product: 9143, level: 70, exp: 61 },
    RUBY_BOLTS = { id: 9143, arrowHead: 9191, product: 9339, level: 63, exp: 63 },
    DIAMOND_BOLTS = { id: 9143, arrowHead: 9192, product: 9340, level: 70, exp: 65 },
    RUNITE_BOLTS = { id: 314, arrowHead: 9381, product: 9144, level: 100, exp: 69 },
    DRAGONSTONE_BOLTS = { id: 9144, arrowHead: 9193, product: 9341, level: 82, exp: 71 },
    ONYX_BOLTS = { id: 9144, arrowHead: 9194, product: 9342, level: 94, exp: 73 };

    class FletchableAmmo {
    constructor(
        public item1: number,
        public item2: number,
        public outcome: number,
        public xp: number,
        public levelReq: number
    ) { }
    
        public getItem1(): number {
        return this.item1;
    }
    
        public getItem2(): number {
        return this.item2;
    }
    
        public getOutcome(): number {
        return this.outcome;
    }
    
        public getXp(): number {
        return this.xp;
    }
    
        public getLevelReq(): number {
        return this.levelReq;
    }
}

enum FletchableCrossbow {
    BRONZE_CROSSBOW = { stock: WOODEN_STOCK, limbs: BRONZE_LIMBS, unstrung: BRONZE_CROSSBOW_U_, level: 9, limbsExp: 12 },
    IRON_CROSSBOW = { stock: OAK_STOCK, limbs: IRON_LIMBS, unstrung: IRON_CROSSBOW_U_, level: 39, limbsExp: 44 },
    STEEL_CROSSBOW = { stock: WILLOW_STOCK, limbs: STEEL_LIMBS, unstrung: STEEL_CROSSBOW_U_, level: 46, limbsExp: 54 },
    MITHRIL_CROSSBOW = { stock: MAPLE_STOCK, limbs: MITHRIL_LIMBS, unstrung: MITHRIL_CROSSBOW_U_, level: 54, limbsExp: 64 },
    ADAMANT_CROSSBOW = { stock: MAHOGANY_STOCK, limbs: ADAMANTITE_LIMBS, unstrung: ADAMANT_CROSSBOW_U_, level: 61, limbsExp: 82 },
    RUNE_CROSSBOW = { stock: YEW_STOCK, limbs: RUNITE_LIMBS, unstrung: RUNITE_CROSSBOW_U_, level: 69, limbsExp: 100 },

    class FletchableCrossbow {
        private stock: number;
        private limbs: number;
        private unstrung: number;
        private level: number;
        private limbsExp: number;
    constructor(stock: number, limbs: number, unstrung: number, level: number, limbsExp: number) {
        this.stock = stock;
        this.limbs = limbs;
        this.unstrung = unstrung;
        this.level = level;
        this.limbsExp = limbsExp;
    }
        
        public getStock(): number {
        return this.stock;
    }
        
        public getUnstrung(): number {
        return this.unstrung;
    }
        
        public getLimbs(): number {
        return this.limbs;
    }
        
        public getLevel(): number {
        return this.level;
    }
        
        public getLimbsExp(): number {
        return this.limbsExp;
    }
}

enum StringableBow {
    //Regular bows
    SB = [SHORTBOW_U_, BOW_STRING, SHORTBOW, 5, 10, new Animation(6678)],
    SL = [LONGBOW_U_, BOW_STRING, LONGBOW, 10, 20, new Animation(6684)],
    OSB = [OAK_SHORTBOW_U_, BOW_STRING, OAK_SHORTBOW, 20, 33, new Animation(6679)],
    OSL = [OAK_LONGBOW_U_, BOW_STRING, OAK_LONGBOW, 25, 50, new Animation(6685)],
    WSB = [WILLOW_SHORTBOW_U_, BOW_STRING, WILLOW_SHORTBOW, 35, 66, new Animation(6680)],
    WLB = [WILLOW_LONGBOW_U_, BOW_STRING, WILLOW_LONGBOW, 40, 83, new Animation(6686)],
    MASB = [MAPLE_SHORTBOW_U_, BOW_STRING, MAPLE_SHORTBOW, 50, 100, new Animation(6681)],
    MASL = [MAPLE_LONGBOW_U_, BOW_STRING, MAPLE_LONGBOW, 55, 116, new Animation(6687)],
    YSB = [YEW_SHORTBOW_U_, BOW_STRING, YEW_SHORTBOW, 65, 135, new Animation(6682)],
    YLB = [YEW_LONGBOW_U_, BOW_STRING, YEW_LONGBOW, 70, 150, new Animation(6688)],
    MSB = [MAGIC_SHORTBOW_U_, BOW_STRING, MAGIC_SHORTBOW, 80, 166, new Animation(6683)],
    MSL = [MAGIC_LONGBOW_U_, BOW_STRING, MAGIC_LONGBOW, 85, 183, new Animation(6689)],
    //Crossbows
    BCBOW = [BRONZE_CROSSBOW_U_, CROSSBOW_STRING, BRONZE_CROSSBOW, 9, 12, new Animation(6671)],
    ICBOW = [IRON_CROSSBOW_U_, CROSSBOW_STRING, IRON_CROSSBOW, 39, 44, new Animation(6673)],
    SCBOW = [STEEL_CROSSBOW_U_, CROSSBOW_STRING, STEEL_CROSSBOW, 46, 54, new Animation(6674)],
    MCBOW = [MITHRIL_CROSSBOW_U_, CROSSBOW_STRING, MITH_CROSSBOW, 54, 64, new Animation(6675)],
    ACBOW = [ADAMANT_CROSSBOW_U_, CROSSBOW_STRING, ADAMANT_CROSSBOW, 61, 82, new Animation(6676)],
    RCBOW = [RUNITE_CROSSBOW_U_, CROSSBOW_STRING, RUNE_CROSSBOW, 69, 100, new Animation(6677)]

    class StringableBow {
        private itemId: number;
        private bowStringId: number;
        private result: number;
        private levelReq: number;
        private exp: number;
        private animation: Animation;
        private static unstrungBows = new Map<number, StringableBow>();

    constructor(itemId: number, bowStringId: number, result: number, levelReq: number, exp: number, animation: Animation) {
        this.itemId = itemId;
        this.bowStringId = bowStringId;
        this.result = result;
        this.levelReq = levelReq;
        this.exp = exp;
        this.animation = animation;
    }

public static init() {
        for (const l of Object.values(StringableBow)) {
            unstrungBows.set(l.getItemId(), l);
        }
    }

public getItemId(): number {
        return this.itemId;
    }

public getBowStringId(): number {
        return this.bowStringId;
    }

public getResult(): number {
        return this.result;
    }
}
StringableBow.init()

// you can call it by
StringableBow.unstrungBows.get(getItemId);

// or
StringableBow.unstrungBows.forEach((value: StringableBow, key: number) => {
    console.log(key, value)
})

// also you can iterate over the values
for (const l of Object.values(StringableBow)) {
    console.log(l.getItemId())
}

// or over the keys
for (const l of Object.keys(StringableBow)) {
    console.log(StringableBow[l].getItemId())
}

public getLevelReq(): number {
    return this.levelReq;
}

    public getExp(): number {
    return this.exp;
}

    public getAnimation(): Animation {
    return this.animation;
}

enum FletchableLog {
    REGULAR = [LOGS,
        new FletchableItem(new Item(ARROW_SHAFT, 15), 1, 5, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(WOODEN_STOCK), 9, 6, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(SHORTBOW_U_), 5, 10, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(LONGBOW_U_), 10, 20, CUTTING_LOGS_ANIM)],
    OAK = [OAK_LOGS,
        new FletchableItem(new Item(ARROW_SHAFT, 30), 15, 10, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(OAK_STOCK), 24, 16, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(OAK_SHORTBOW_U_), 20, 33, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(OAK_LONGBOW_U_), 25, 50, CUTTING_LOGS_ANIM)],
    WILLOW = [WILLOW_LOGS,
        new FletchableItem(new Item(ARROW_SHAFT, 45), 30, 15, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(WILLOW_STOCK), 39, 22, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(WILLOW_SHORTBOW_U_), 35, 66, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(WILLOW_LONGBOW_U_), 40, 83, CUTTING_LOGS_ANIM)],
    MAPLE = [MAPLE_LOGS,
        new FletchableItem(new Item(ARROW_SHAFT, 60), 45, 20, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(MAPLE_STOCK), 54, 32, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(MAPLE_SHORTBOW_U_), 50, 100, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(MAPLE_LONGBOW_U_), 55, 116, CUTTING_LOGS_ANIM)],
    YEW = [YEW_LOGS,
        new FletchableItem(new Item(ARROW_SHAFT, 75), 60, 25, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(YEW_STOCK), 69, 50, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(YEW_SHORTBOW_U_), 65, 135, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(YEW_LONGBOW_U_), 70, 150, CUTTING_LOGS_ANIM)],
    MAGIC = [MAGIC_LOGS,
        new FletchableItem(new Item(ARROW_SHAFT, 90), 75, 30, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(MAGIC_SHORTBOW_U_), 80, 166, CUTTING_LOGS_ANIM),
        new FletchableItem(new Item(MAGIC_LONGBOW_U_), 85, 183, CUTTING_LOGS_ANIM)]


        class FletchableLog {
            private logId: number;
            private fletchable: FletchableItem[];
            private static logs = new Map<number, FletchableLog>();

    constructor(logId: number, ...fletchable: FletchableItem[]) {
        this.logId = logId;
        this.fletchable = fletchable;
    }

public static init() {
        for (const l of Object.values(FletchableLog)) {
            logs.set(l.getLogId(), l);
        }
    }

public getLogId(): number {
        return this.logId;
    }

public getFletchable(): FletchableItem[] {
        return this.fletchable;
    }
}
FletchableLog.init()

// you can call it by
FletchableLog.logs.get(getLogId);

// or
FletchableLog.logs.forEach((value: FletchableLog, key: number) => {
    console.log(key, value)
})

// also you can iterate over the values
for (const l of Object.values(FletchableLog)) {
    console.log(l.getLogId())
}

// or over the keys
for (const l of Object.keys(FletchableLog)) {
    console.log(FletchableLog[l].getLogId())
}

class FletchableItem {
    private product: Item;
    private levelRequired: number;
    private experience: number;
    private animation: Animation;

    constructor(product: Item, levelRequired: number, experience: number, animation: Animation) {
        this.product = product;
        this.levelRequired = levelRequired;
        this.experience = experience;
        this.animation = animation;
    }

    public getProduct(): Item {
        return this.product;
    }

    public getLevelRequired(): number {
        return this.levelRequired;
    }

    public getExperience(): number {
        return this.experience;
    }

    public getAnimation(): Animation {
        return this.animation;
    }
}    