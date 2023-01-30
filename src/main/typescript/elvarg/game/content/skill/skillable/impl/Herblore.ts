class Herblore extends ItemIdentifiers {
    private static ANIMATION: Animation = new Animation(363);

    public static concatenate(player: Player, itemUsed: Item, usedOn: Item): boolean {
        if (!(itemUsed.getDefinition().getName().includes("(") && usedOn.getDefinition().getName().includes(")"))) {
            return false;
        }

        let dose = PotionDose.forId(itemUsed.getId());

        if (dose.isPresent()) {
            if (dose.get().getDoseForID(usedOn.getId()) > 0) {
                let firstPotAmount = dose.get().getDoseForID(itemUsed.getId());
                let secondPotAmount = dose.get().getDoseForID(usedOn.getId());
                if (firstPotAmount + secondPotAmount <= 4) {
                    player.getInventory().delete(itemUsed, 1);
                    player.getInventory().delete(usedOn, 1);
                    player.getInventory().add(dose.get().getIDForDose(firstPotAmount + secondPotAmount), 1);
                    player.getInventory().add(EMPTY_VIAL, 1);
                } else {
                    let overflow = (firstPotAmount + secondPotAmount) - 4;
                    player.getInventory().delete(itemUsed, 1);
                    player.getInventory().delete(usedOn, 1);
                    player.getInventory().add(dose.get().getIDForDose(4), 1);
                    player.getInventory().add(dose.get().getIDForDose(overflow), 1);
                }
                return true;
            }
        }
        return false;
    }

    public static makeUnfinishedPotion(player: Player, itemUsed: number, usedWith: number): boolean {
        if (itemUsed == VIAL_OF_WATER || usedWith == VIAL_OF_WATER) {
            let herb = itemUsed == VIAL_OF_WATER ? usedWith : itemUsed;
            let unfinished = UnfinishedPotion.potions.get(herb);
            if (unfinished != null) {
                player.getPacketSender().sendCreationMenu(new CreationMenu("How many potions would you like to make?", [unfinished.getUnfPotion()], (itemId: number, amount: number) => {
                    let skillable = new ItemCreationSkillable([new RequiredItem(new Item(VIAL_OF_WATER), true), new RequiredItem(new Item(unfinished.getHerbNeeded()), true)],
                        new Item(unfinished.getUnfPotion()), amount, Optional.of(new AnimationLoop(ANIMATION, 4)),
                        unfinished.getLevelReq(), 10, Skill.HERBLORE);
                    player.getSkillManager().startSkillable(skillable);
                }));
                return true;
            }
        }
        return false;
    }

    public static finishPotion(player: Player, itemUsed: number, usedWith: number): boolean {
        let finished = FinishedPotion.forId(itemUsed, usedWith);
        if (finished.isPresent()) {
            player.getPacketSender().sendCreationMenu(new CreationMenu("How many potions would you like to make?", [finished.get().getFinishedPotion()], (itemId: number, amount: number) => {
                let skillable = new ItemCreationSkillable([new RequiredItem(new Item(finished.get().getItemNeeded()), true), new RequiredItem(new Item(finished.get().getUnfinishedPotion()), true)],
                    new Item(itemId), amount, Optional.of(new AnimationLoop(ANIMATION, 4)),
                    finished.get().getLevelReq(), finished.get().getExpGained(), Skill.HERBLORE);
                player.getSkillManager().startSkillable(skillable);
            }));
            return true;
        }
        return false;
    }

    public static cleanHerb(player: Player, itemId: number): boolean {
        let herb = CleanableHerb.herbs.get(itemId);
        if (herb != null) {
            if (player.getInventory().contains(herb.getGrimyHerb())) {
                if (player.getSkillManager().getCurrentLevel(Skill.HERBLORE) < herb.getLevelReq()) {
                    player.getPacketSender().sendMessage(`You need a Herblore level of at least ${herb.getLevelReq()} to clean this leaf.`);
                } else {
                    if (player.getClickDelay().elapsed(150)) {
                        player.getInventory().delete(herb.getGrimyHerb(), 1);
                        player.getInventory().add(herb.getCleanHerb(), 1);
                        player.getSkillManager().addExperience(Skill.HERBLORE, herb.getExp());
                        player.getPacketSender().sendMessage("You clean the dirt off the leaf.");
                        player.getClickDelay().reset();
                    }
                }
            }
            return true;
        }
        return false;
    }

    static herbs: Map<number, CleanableHerb> = new Map<number, CleanableHerb>();

    static initialize() {
        for (let herb of Object.values(CleanableHerb)) {
            herbs.set(herb.grimyHerb, herb);
        }
    }

    private grimyHerb: number;
    private cleanHerb: number;
    private levelReq: number;
    private cleaningExp: number;

    constructor(grimyHerb: number, cleanHerb: number, levelReq: number, cleaningExp: number) {
        this.grimyHerb = grimyHerb;
        this.cleanHerb = cleanHerb;
        this.levelReq = levelReq;
        this.cleaningExp = cleaningExp;
    }

    public getGrimyHerb(): number {
        return this.grimyHerb;
    }

    public getCleanHerb(): number {
        return this.cleanHerb;
    }

    public getLevelReq(): number {
        return this.levelReq;
    }

    public getExp(): number {
        return this.cleaningExp;
    }

    private static potions: Map<number, UnfinishedPotion> = new Map<number, UnfinishedPotion>();

    static initialize() {
        for (let potion of Object.values(UnfinishedPotion)) {
            potions.set(potion.herbNeeded, potion);
        }
    }

    private unfinishedPotion: number;
    private herbNeeded: number;
    private levelReq: number;

    constructor(unfinishedPotion: number, herbNeeded: number, levelReq: number) {
        this.unfinishedPotion = unfinishedPotion;
        this.herbNeeded = herbNeeded;
        this.levelReq = levelReq;
    }

    public getUnfPotion(): number {
        return this.unfinishedPotion;
    }

    public getHerbNeeded(): number {
        return this.herbNeeded;
    }

    public getLevelReq(): number {
        return this.levelReq;
    }

    const potions: Map<number, FinishedPotion> = new Map();

    for(const potion of Object.values(FinishedPotion)) {
    potions.set(potion.finishedPotion, potion);
    potions.set(potion.itemNeeded, potion);
}

const forId = (usedItem: number, usedOn: number): FinishedPotion | undefined => {
    let potion = potions.get(usedItem);
    if (potion != null) {
        if (requiredItems(potion, usedItem, usedOn)) {
            return potion;
        }
    }
    potion = potions.get(usedOn);
    if (potion != null) {
        if (requiredItems(potion, usedItem, usedOn)) {
            return potion;
        }
    }
    return undefined;
}

public requiredItems(potion: FinishedPotion, usedItem: number, usedOn: number): boolean {
    return ((potion.itemNeeded === usedItem || potion.itemNeeded === usedOn) && (potion.unfinishedPotion === usedItem
        || potion.unfinishedPotion == usedOn))
}

public getFinishedPotion(): number {
    return finishedPotion;
}

public getUnfinishedPotion(): number {
    return unfinishedPotion;
}

public getItemNeeded(): number {
    return itemNeeded;
}

public getLevelReq(): number {
    return levelReq;
}

public getExpGained(): number {
    return expGained;
}

const potions = new Map<number, IPotionDose>();

Object.values(PotionDose).forEach((potion) => {
    potions.set(potion.oneDosePotionID, potion);
    potions.set(potion.twoDosePotionID, potion);
    potions.set(potion.threeDosePotionID, potion);
    potions.set(potion.fourDosePotionID, potion);
});

static forId(itemId: number): PotionDose | undefined {
    return potions[itemId];
}

getDoseID1(): number {
    return this.oneDosePotionID;
}

getDoseID2(): number {
    return this.twoDosePotionID;
}

getDoseID3(): number {
    return this.threeDosePotionID;
}

getFourDosePotionID(): number {
    return this.fourDosePotionID;
}

getVial(): number {
    return this.vial;
}

getPotionName(): string {
    return this.potionName;
}

getDoseForID(id: number) {
    if (id == this.oneDosePotionID) {
        return 1;
    }
    if (id == this.twoDosePotionID) {
        return 2;
    }
    if (id == this.threeDosePotionID) {
        return 3;
    }
    if (id == this.fourDosePotionID) {
        return 4;
    }
    return -1;
}

getIDForDose(dose: number) {
    if (dose == 1) {
        return this.oneDosePotionID;
    }
    if (dose == 2) {
        return this.twoDosePotionID;
    }
    if (dose == 3) {
        return this.threeDosePotionID;
    }
    if (dose == 4) {
        return this.fourDosePotionID;
    }
    if (dose == 0) {
        return EMPTY_VIAL;
    }
    return -1;
}


enum CleanableHerb {
    GUAM = [199, 249, 1, 2],
    MARRENTILL = [201, 251, 5, 4],
    TARROMIN = [203, 253, 11, 5],
    HARRALANDER = [205, 255, 20, 6],
    RANARR = [207, 257, 25, 7],
    TOADFLAX = [3049, 2998, 30, 8],
    SPIRITWEED = [12174, 12172, 35, 9],
    IRIT = [209, 259, 40, 10],
    WERGALI = [14836, 14854, 30, 11],
    AVANTOE = [211, 261, 48, 12],
    KWUARM = [213, 263, 54, 13],
    SNAPDRAGON = [3051, 3000, 59, 13],
    CADANTINE = [215, 265, 65, 14],
    LANTADYME = [2485, 2481, 67, 16],
    DWARFWEED = [217, 267, 70, 18],
    TORSTOL = [219, 269, 75, 21],
}

enum UnfinishedPotion {
    GUAM_POTION = [91, 249, 1],
    MARRENTILL_POTION = [93, 251, 5],
    TARROMIN_POTION = [95, 253, 12],
    HARRALANDER_POTION = [97, 255, 22],
    RANARR_POTION = [99, 257, 30],
    TOADFLAX_POTION = [3002, 2998, 34],
    SPIRIT_WEED_POTION = [12181, 12172, 40],
    IRIT_POTION = [101, 259, 45],
    WERGALI_POTION = [14856, 14854, 1],
    AVANTOE_POTION = [103, 261, 50],
    KWUARM_POTION = [105, 263, 55],
    SNAPDRAGON_POTION = [3004, 3000, 63],
    CADANTINE_POTION = [107, 265, 66],
    LANTADYME = [2483, 2481, 69],
    DWARF_WEED_POTION = [109, 267, 72],
    TORSTOL_POTION = [111, 269, 78],
}

enum FinishedPotion {
    ATTACK_POTION[121, 91, 221, 1, 25],
    ANTIPOISON[175, 93, 235, 5, 38],
    STRENGTH_POTION[115, 95, 225, 12, 50],
    RESTORE_POTION[127, 97, 223, 22, 63],
    ENERGY_POTION[3010, 97, 1975, 26, 68],
    DEFENCE_POTION[133, 99, 239, 30, 75],
    AGILITY_POTION[3034, 3002, 2152, 34, 80],
    COMBAT_POTION[9741, 97, 9736, 36, 84],
    PRAYER_POTION[139, 99, 231, 38, 88],
    SUMMONING_POTION[12142, 12181, 12109, 40, 92],
    CRAFTING_POTION[14840, 14856, 5004, 42, 92],
    SUPER_ATTACK[145, 101, 221, 45, 100],
    VIAL_OF_STENCH[18661, 101, 1871, 46, 0],
    FISHING_POTION[181, 101, 231, 48, 106],
    SUPER_ENERGY[3018, 103, 2970, 52, 118],
    SUPER_STRENGTH[157, 105, 225, 55, 125],
    WEAPON_POISON[187, 105, 241, 60, 138],
    SUPER_RESTORE[3026, 3004, 223, 63, 143],
    SUPER_DEFENCE[163, 107, 239, 66, 150],
    ANTIFIRE[2454, 2483, 241, 69, 158],
    RANGING_POTION[169, 109, 245, 72, 163],
    MAGIC_POTION[3042, 2483, 3138, 76, 173],
    ZAMORAK_BREW[189, 111, 247, 78, 175],
    SARADOMIN_BREW[6687, 3002, 6693, 81, 180],
    RECOVER_SPECIAL[15301, 3018, 5972, 84, 200],
    SUPER_ANTIFIRE[15305, 2454, 4621, 85, 210],
    SUPER_PRAYER[15329, 139, 4255, 94, 270],
    SUPER_ANTIPOISON[181, 101, 235, 48, 103],
    HUNTER_POTION[10000, 103, 10111, 53, 110],
    FLETCHING_POTION[14848, 103, 11525, 58, 105],
    ANTIPOISON_PLUS[5945, 3002, 6049, 68, 15])
}

enum PotionDose {
    STRENGTH = [119, 117, 115, 113, VIAL_OF_WATER, "Strength"],
    SUPER_STRENGTH = [161, 159, 157, 2440, VIAL_OF_WATER, "Super strength"],
    SUPER_COMBAT = [12701, 12699, 12697, 12695, VIAL_OF_WATER, "Super combat"],
    ATTACK = [125, 123, 121, 2428, VIAL_OF_WATER, "Attack"],
    SUPER_ATTACK = [149, 147, 145, 2436, VIAL_OF_WATER, "Super attack"],
    DEFENCE = [137, 135, 133, 2432, VIAL_OF_WATER, "Defence"],
    SUPER_DEFENCE = [167, 165, 163, 2442, VIAL_OF_WATER, "Super defence"],
    RANGING_POTION = [173, 171, 169, 2444, VIAL_OF_WATER, "Ranging"],
    FISHING = [155, 153, 151, 2438, VIAL_OF_WATER, "Fishing"],
    PRAYER = [143, 141, 139, 2434, VIAL_OF_WATER, "Prayer"],
    ANTIFIRE = [2458, 2456, 2454, 2452, VIAL_OF_WATER, "Antifire"],
    ZAMORAK_BREW = [193, 191, 189, 2450, VIAL_OF_WATER, "Zamorakian brew"],
    ANTIPOISON = [179, 177, 175, 2446, VIAL_OF_WATER, "Antipoison"],
    RESTORE = [131, 129, 127, 2430, VIAL_OF_WATER, "Restoration"],
    MAGIC_POTION = [3046, 3044, 3042, 3040, VIAL_OF_WATER, "Magic"],
    SUPER_RESTORE = [3030, 3028, 3026, 3024, VIAL_OF_WATER, "Super Restoration"],
    ENERGY = [3014, 3012, 3010, 3008, VIAL_OF_WATER, "Energy"],
    SUPER_ENERGY = [3022, 3020, 3018, 3016, VIAL_OF_WATER, "Super Energy"],
    AGILITY = [3038, 3036, 3034, 3032, VIAL_OF_WATER, "Agility"],
    SARADOMIN_BREW = [6691, 6689, 6687, 6685, VIAL_OF_WATER, "Saradomin brew"],
    ANTIPOISON1 = [5949, 5947, 5945, 5943, VIAL_OF_WATER, "Antipoison (+)"],
    ANTIPOISON2 = [5958, 5956, 5954, 5952, VIAL_OF_WATER, "Antipoison (++)"],
    SUPER_ANTIPOISON = [185, 183, 181, 2448, VIAL_OF_WATER, "Super Antipoison"],
    RELICYMS_BALM = [4848, 4846, 4844, 4842, VIAL_OF_WATER, "Relicym's balm"],
    SERUM_207 = [3414, 3412, 3410, 3408, VIAL_OF_WATER, "Serum 207"],
    COMBAT = [9745, 9743, 9741, 9739, VIAL_OF_WATER, "Combat"];
}