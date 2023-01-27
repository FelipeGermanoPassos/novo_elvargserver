export class RangedData {
    private static rangedWeapons: Map<number, RangedWeapon> = new Map<number, RangedWeapon>();
    private static rangedAmmunition: Map<number, Ammunition> = new Map<number, Ammunition>();

    public static getSpecialEffectsMultiplier(p: Player, target: Mobile, damage: number): number {
        let multiplier: number = 1.0;

        switch (p.getCombat().getAmmunition()) {
            case ENCHANTED_DIAMOND_BOLT:
                target.performGraphic(new Graphic(758, GraphicHeight.MIDDLE));
                multiplier = 1.15;
                break;

            case ENCHANTED_DRAGONSTONE_DRAGON_BOLT:
            case ENCHANTED_DRAGON_BOLT:
                let multiply: boolean = true;
                if (target.isPlayer()) {
                    let t: Player = target.getAsPlayer();
                    multiply = !(!t.getCombat().getFireImmunityTimer().finished() || CombatEquipment.hasDragonProtectionGear(t));
                }
                if (multiply) {
                    target.performGraphic(new Graphic(756));
                    multiplier = 1.31;
                }
                break;

            case ENCHANTED_EMERALD_BOLT:
                target.performGraphic(new Graphic(752));
                CombatFactory.poisonEntity(target, PoisonType.MILD);
                break;

            case ENCHANTED_JADE_BOLT:
                target.performGraphic(new Graphic(755));
                multiplier = 1.05;
                break;

            case ENCHANTED_DIAMOND_BOLT:
                target.performGraphic(new Graphic(758, GraphicHeight.MIDDLE));
                multiplier = 1.15;
                break;

            case ENCHANTED_DRAGONSTONE_DRAGON_BOLT:
            case ENCHANTED_DRAGON_BOLT:
                let multiply = true;
                if (target.isPlayer()) {
                    let t = target.getAsPlayer();
                    multiply = !(!t.getCombat().getFireImmunityTimer().finished() || CombatEquipment.hasDragonProtectionGear(t));
                }

                if (multiply) {
                    target.performGraphic(new Graphic(756));
                    multiplier = 1.31;
                }
                break;

            case ENCHANTED_EMERALD_BOLT:
                target.performGraphic(new Graphic(752));
                CombatFactory.poisonEntity(target, PoisonType.MILD);
                break;

            case ENCHANTED_JADE_BOLT:
                target.performGraphic(new Graphic(755));
                multiplier = 1.05;
                break;

            case ENCHANTED_ONYX_BOLT:
                target.performGraphic(new Graphic(753));
                multiplier = 1.26;
                let heal = (damage * 0.25) + 10;
                p.getSkillManager().setCurrentLevel(Skill.HITPOINTS, p.getSkillManager().getCurrentLevel(Skill.HITPOINTS) + heal);
                if (p.getSkillManager().getCurrentLevel(Skill.HITPOINTS) >= 1120) {
                    p.getSkillManager().setCurrentLevel(Skill.HITPOINTS, 1120);
                }
                p.getSkillManager().updateSkill(Skill.HITPOINTS);
                if (damage < 250 && Math.random3) <= 1) {
                    damage += 150 + Misc.getRandom(80);
                }
                break;

            case ENCHANTED_PEARL_BOLT:
                target.performGraphic(new Graphic(750));
                multiplier = 1.1;
                break;

            case ENCHANTED_RUBY_BOLT:
                break;

            case ENCHANTED_SAPPHIRE_BOLT:
                target.performGraphic(new Graphic(751));
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevel(Skill.PRAYER, t.getSkillManager().getCurrentLevel(Skill.PRAYER) - 20);
                    if (t.getSkillManager().getCurrentLevel(Skill.PRAYER) < 0) {
                        t.getSkillManager().setCurrentLevel(Skill.PRAYER, 0);
                    }
                    t.getPacketSender().sendMessage("Your Prayer level has been leeched.");
                    p.getSkillManager().setCurrentLevel(Skill.PRAYER, t.getSkillManager().getCurrentLevel(Skill.PRAYER) + 20);
                    if (p.getSkillManager().getCurrentLevel(Skill.PRAYER) > p.getSkillManager().getMaxLevel(Skill.PRAYER)) {
                        p.getSkillManager().setCurrentLevel(Skill.PRAYER, p.getSkillManager().getMaxLevel(Skill.PRAYER));
                    } else {
                        p.getPacketSender().sendMessage("Your enchanced bolts leech some Prayer points from your opponent..");
                    }
                }
                break;

            case ENCHANTED_TOPAZ_BOLT:
                target.performGraphic(new Graphic(757));
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevel(Skill.MAGIC, t.getSkillManager().getCurrentLevel(Skill.MAGIC) - 3);
                    t.getPacketSender().sendMessage("Your Magic level has been reduced.");
                }
                break;
            case ENCHANTED_OPAL_BOLT:
                target.performGraphic(new Graphic(749));
                multiplier = 1.3;
                break;
        }
        return multiplier;
    }

    private static rangedWeapons = new Map<number, RangedWeapon>();

    private weaponIds: number[];
    private ammunitionData: any[];
    private type: RangedWeaponType;

    constructor(weaponIds: number[], ammunitionData: any[], type: RangedWeaponType) {
        this.weaponIds = weaponIds;
        this.ammunitionData = ammunitionData;
        this.type = type;
    }

    public static getFor(p: Player) {
        let weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        return this.rangedWeapons.get(weapon);
    }

    public getWeaponIds() {
        return this.weaponIds;
    }

    public getAmmunitionData() {
        return this.ammunitionData;
    }

    public getType() {
        return this.type;
    }

    static {
        for (let data of RangedWeapon.values()) {
            for (let i of data.getWeaponIds()) {
                this.rangedWeapons.set(i, data);
            }
        }
    }

    const AMMUNITION_DATA: Map<Ammunition, AmmunitionData> = new Map<Ammunition, AmmunitionData>([
        [Ammunition.BRONZE_ARROW, { graphic: new Graphic(19, GraphicHeight.HIGH), damage: 10, weight: 7 }],
        [Ammunition.IRON_ARROW, { graphic: new Graphic(18, GraphicHeight.HIGH), damage: 9, weight: 10 }],
        [Ammunition.STEEL_ARROW, { graphic: new Graphic(20, GraphicHeight.HIGH), damage: 11, weight: 16 }],
        [Ammunition.MITHRIL_ARROW, { graphic: new Graphic(21, GraphicHeight.HIGH), damage: 12, weight: 22 }],
        [Ammunition.ADAMANT_ARROW, { graphic: new Graphic(22, GraphicHeight.HIGH), damage: 13, weight: 31 }],
        [Ammunition.RUNE_ARROW, { graphic: new Graphic(24, GraphicHeight.HIGH), damage: 15, weight: 50 }],
        [Ammunition.ICE_ARROW, { graphic: new Graphic(25, GraphicHeight.HIGH), damage: 16, weight: 58 }],
        [Ammunition.BROAD_ARROW, { graphic: new Graphic(20, GraphicHeight.HIGH), damage: 11, weight: 58 }],
        [Ammunition.DRAGON_ARROW, { graphic: new Graphic(1111, GraphicHeight.HIGH), damage: 1120, weight: 65 }],
        [Ammunition.BRONZE_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 13 }],
        [Ammunition.OPAL_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 20 }],
        [Ammunition.ENCHANTED_OPAL_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 20 }],
        [Ammunition.IRON_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 28 }],
        [Ammunition.JADE_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 31 }],
        [Ammunition.ENCHANTED_JADE_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 31 }],
        [Ammunition.STEEL_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 35 }],
        [Ammunition.PEARL_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 38 }],
        [Ammunition.ENCHANTED_PEARL_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 38 }],
        [Ammunition.MITHRIL_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 40 }],
        [Ammunition.RUNITE_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 115 }],
        [Ammunition.DIAMOND_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 105 }],
        [Ammunition.ENCHANTED_DIAMOND_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 105 }],
        [Ammunition.DRAGON_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 117 }],
        [Ammunition.ENCHANTED_DRAGON_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 117 }],
        [Ammunition.ONYX_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 120 }],
        [Ammunition.ENCHANTED_ONYX_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 120 }],
        [Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT, { graphic: new Graphic(955, GraphicHeight.HIGH), damage: 27, weight: 122 }],
        [Ammunition.BRONZE_DART, { graphic: new Graphic(232, GraphicHeight.HIGH), damage: 226, weight: 1 }],
        [Ammunition.IRON_DART, { graphic: new Graphic(233, GraphicHeight.HIGH), damage: 227, weight: 4 }],
        [Ammunition.STEEL_DART, { graphic: new Graphic(234, GraphicHeight.HIGH), damage: 228, weight: 6 }],
        [Ammunition.BRONZE_KNIFE, { graphic: new Graphic(219, GraphicHeight.HIGH), damage: 212, weight: 3 }],
        [Ammunition.BRONZE_KNIFE_P1, { graphic: new Graphic(219, GraphicHeight.HIGH), damage: 212, weight: 3 }],
        [Ammunition.BRONZE_KNIFE_P2, { graphic: new Graphic(219, GraphicHeight.HIGH), damage: 212, weight: 3 }],
        [Ammunition.MITHRIL_KNIFE, { graphic: new Graphic(223, GraphicHeight.HIGH), damage: 215, weight: 10 }],
        [Ammunition.MITHRIL_KNIFE_P1, { graphic: new Graphic(223, GraphicHeight.HIGH), damage: 215, weight: 10 }],
        [Ammunition.MITHRIL_KNIFE_P2, { graphic: new Graphic(223, GraphicHeight.HIGH), damage: 215, weight: 10 }],
        [Ammunition.BRONZE_JAVELIN, { graphic: null, damage: 200, weight: 25 }],
        [Ammunition.IRON_JAVELIN, { graphic: null, damage: 201, weight: 42 }],
        [Ammunition.STEEL_JAVELIN, { graphic: null, damage: 202, weight: 64 }],
        [Ammunition.MITHRIL_JAVELIN, { graphic: null, damage: 203, weight: 85 }],
        [Ammunition.ADAMANT_JAVELIN, { graphic: null, damage: 204, weight: 107 }],
        [Ammunition.RUNE_JAVELIN, { graphic: null, damage: 205, weight: 124 }],
        [Ammunition.DRAGON_JAVELIN, { graphic: null, damage: 1301, weight: 150 }],
        [Ammunition.TOKTZ_XIL_UL, { graphic: null, damage: 442, weight: 58 }],
        [Ammunition.BOLT_RACK, { graphic: null, damage: 27, weight: 55 }],
    ]);

    const NO_GROUND_DROP = new Set<Ammunition>([Ammunition.BRONZE_JAVELIN, Ammunition.IRON_JAVELIN, Ammunition.STEEL_JAVELIN, Ammunition.ADAMANT_JAVELIN, Ammunition.RUNE_JAVELIN, Ammunition.DRAGON_JAVELIN]);

let rangedAmmunition = new Map<number, Ammunition>();

class Ammunition {
    public static getFor(p: Player): Ammunition {
        //First try to get a throw weapon as ammo
        let weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        let throwWeapon = rangedAmmunition.get(weapon);

        //Toxic blowpipe should always fire dragon darts.
        if (weapon == 12926) {
            return Ammunition.DRAGON_DART;
        }

        //Didnt find one. Try arrows
        if (throwWeapon == null) {
            return rangedAmmunition.get(p.getEquipment().getItems()[Equipment.AMMUNITION_SLOT].getId());
        }

        return throwWeapon;
    }

    private startGfx: Graphic;
    private itemId: number;
    private projectileId: number;
    private strength: number;

    constructor(itemId: number, startGfx: Graphic, projectileId: number, strength: number) {
        this.itemId = itemId;
        this.startGfx = startGfx;
        this.projectileId = projectileId;
        this.strength = strength;
        rangedAmmunition.set(itemId, this);
    }

    public static getFor(item: number): Ammunition {
        //First try to get a throw weapon as ammo
        let throwWeapon = rangedAmmunition.get(item);

        //Didnt find one. Try arrows
        if (throwWeapon == null) {
            return rangedAmmunition.get(item);
        }

        return throwWeapon;
    }

    public getItemId(): number {
        return this.itemId;
    }

    public getStartGraphic(): Graphic {
        return this.startGfx;
    }

    public getProjectileId(): number {
        return this.projectileId;
    }

    public getStrength(): number {
        return this.strength;
    }

    public dropOnFloor(): boolean {
        return !NO_GROUND_DROP.has(this);
    }

    const RangedWeaponTypes: { [key in RangedWeaponType]: IRangedWeaponType } = {
        KNIFE: {longRangeFightType: FightType.KNIFE_LONGRANGE, defaultDistance: 4, longRangeDistance: 6 },
        DART: {longRangeFightType: FightType.DART_LONGRANGE, defaultDistance: 3, longRangeDistance: 5 },
        TOKTZ_XIL_UL: {longRangeFightType: FightType.OBBY_RING_LONGRANGE, defaultDistance: 5, longRangeDistance: 6 },
        LONGBOW: {longRangeFightType: FightType.LONGBOW_LONGRANGE, defaultDistance: 9, longRangeDistance: 10 },
    }

    public getDefaultDistance() {
        return defaultDistance;
    }
    
    public getLongRangeDistance() {
        return longRangeDistance;
    }

    public getLongRangeFightType(): FightType {
        return longRangeFightType;
    }
}

export enum RangedWeaponType {
    KNIFE = "KNIFE",
    DART = "DART",
    TOKTZ_XIL_UL = "TOKTZ_XIL_UL",
    LONGBOW = "LONGBOW",
    BLOWPIPE = "BLOWPIPE",
    SHORTBOW = "SHORTBOW",
    CROSSBOW = "CROSSBOW",
    BALLISTA = "BALLISTA",
}
interface IRangedWeaponType {
    longRangeFightType: FightType,
    defaultDistance: number,
    longRangeDistance: number
}


export enum Ammunitions {
    BRONZE_ARROW = 882,
    IRON_ARROW = 884,
    STEEL_ARROW = 886,
    MITHRIL_ARROW = 888,
    ADAMANT_ARROW = 890,
    RUNE_ARROW = 892,
    ICE_ARROW = 78,
    BROAD_ARROW = 4160,
    DRAGON_ARROW = 11212,
    BRONZE_BOLT = 877,
    OPAL_BOLT = 879,
    ENCHANTED_OPAL_BOLT = 9236,
    IRON_BOLT = 9140,
    JADE_BOLT = 9335,
    ENCHANTED_JADE_BOLT = 9237,
    STEEL_BOLT = 9141,
    PEARL_BOLT = 880,
    ENCHANTED_PEARL_BOLT = 9238,
    MITHRIL_BOLT = 9142,
    TOPAZ_BOLT = 9336,
    ENCHANTED_TOPAZ_BOLT = 9239,
    ADAMANT_BOLT = 9143,
    SAPPHIRE_BOLT = 9337,
    ENCHANTED_SAPPHIRE_BOLT = 9240,
    EMERALD_BOLT = 9338,
    ENCHANTED_EMERALD_BOLT = 9241,
    RUBY_BOLT = 9339,
    ENCHANTED_RUBY_BOLT = 9242,
    BROAD_BOLT = 13280,
    RUNITE_BOLT = 9144,
    DIAMOND_BOLT = 9340,
    ENCHANTED_DIAMOND_BOLT = 9243,
    DRAGON_BOLT = 9341,
    ENCHANTED_DRAGON_BOLT = 9244,
    ONYX_BOLT = 9342,
    ENCHANTED_ONYX_BOLT = 9245,
    ENCHANTED_DRAGONSTONE_DRAGON_BOLT = "DRAGONSTONE_DRAGON_BOLTS_E_",
    BRONZE_DART = 806,
    IRON_DART = 807,
    STEEL_DART = 808,
    MITHRIL_DART = 809,
    ADAMANT_DART = 810,
    RUNE_DART = 811,
    DRAGON_DART = 11230,
    BRONZE_KNIFE = 864,
    BRONZE_KNIFE_P1 = 870,
    BRONZE_KNIFE_P2 = 5654,
    BRONZE_KNIFE_P3 = 5661,
    IRON_KNIFE = 863,
    IRON_KNIFE_P1 = 871,
    IRON_KNIFE_P2 = 5655,
    IRON_KNIFE_P3 = 5662,
    STEEL_KNIFE = 865,
    STEEL_KNIFE_P1 = 872,
    STEEL_KNIFE_P2 = 5656,
    STEEL_KNIFE_P3 = 5663,
    BLACK_KNIFE = 869,
    BLACK_KNIFE_P1 = 874,
    BLACK_KNIFE_P2 = 5658,
    BLACK_KNIFE_P3 = 5665,
    MITHRIL_KNIFE = 866,
    MITHRIL_KNIFE_P1 = 873,
    MITHRIL_KNIFE_P2 = 5657,
    MITHRIL_KNIFE_P3 = 5664,
    ADAMANT_KNIFE = 867,
    ADAMANT_KNIFE_P1 = 875,
    ADAMANT_KNIFE_P2 = 5659,
    ADAMANT_KNIFE_P3 = 5666,
    RUNE_KNIFE = 868,
    RUNE_KNIFE_P1 = 876,
    RUNE_KNIFE_P2 = 5660,
    RUNE_KNIFE_P3 = 5667,
    BRONZE_JAVELIN = 825,
    IRON_JAVELIN = 826,
    STEEL_JAVELIN = 827,
    MITHRIL_JAVELIN = 828,
    ADAMANT_JAVELIN = 829,
    RUNE_JAVELIN = 830,
    DRAGON_JAVELIN = 19484,
    TOKTZ_XIL_UL = 6522,
    BOLT_RACK = 4740,
}

interface AmmunitionData {
    graphic: Graphic;
    damage: number;
    weight: number;
}

export enum RangedWeapon {
    LONGBOW = [839],
    [Ammunition.BRONZE_ARROW],
    RangedWeaponType.LONGBOW,
    SHORTBOW = [841],
    [Ammunition.BRONZE_ARROW],
    RangedWeaponType.SHORTBOW,
    OAK_LONGBOW = [845],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW],
    RangedWeaponType.LONGBOW,
    OAK_SHORTBOW = [843],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW],
    RangedWeaponType.SHORTBOW,
    WILLOW_LONGBOW = [847],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW],
    RangedWeaponType.LONGBOW,
    WILLOW_SHORTBOW = [849],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW],
    RangedWeaponType.SHORTBOW,
    MAPLE_LONGBOW = [851],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW],
    RangedWeaponType.LONGBOW,
    MAPLE_SHORTBOW = [853],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW],
    RangedWeaponType.SHORTBOW,
    YEW_LONGBOW = [855],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW],
    RangedWeaponType.LONGBOW,
    YEW_SHORTBOW = [857],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW],
    RangedWeaponType.SHORTBOW,
    MAGIC_LONGBOW = [859],
    [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW],

    DARK_BOW = {
        itemIds: [11235, 13405, 15701, 15702, 15703, 15704],
        ammunition: [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.DRAGON_ARROW],
        weaponType: RangedWeaponType.LONGBOW,
    },
    BRONZE_CROSSBOW = {
        itemIds: [9174],
        ammunition: [Ammunition.BRONZE_BOLT],
        weaponType: RangedWeaponType.CROSSBOW,
    },
    IRON_CROSSBOW = {
        itemIds: [9177],
        ammunition: [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT],
        weaponType: RangedWeaponType.CROSSBOW,
    },
    STEEL_CROSSBOW = {
        itemIds: [9179],
        ammunition: [
            Ammunition.BRONZE_BOLT,
            Ammunition.OPAL_BOLT,
            Ammunition.ENCHANTED_OPAL_BOLT,
            Ammunition.IRON_BOLT,
            Ammunition.JADE_BOLT,
            Ammunition.ENCHANTED_JADE_BOLT,
            Ammunition.STEEL_BOLT,
            Ammunition.PEARL_BOLT,
            Ammunition.ENCHANTED_PEARL_BOLT,
        ],
        weaponType: RangedWeaponType.CROSSBOW,
    },
    MITHRIL_CROSSBOW = {
        itemIds: [9181],
        ammunition: [
            Ammunition.BRONZE_BOLT,
            Ammunition.OPAL_BOLT,
            Ammunition.ENCHANTED_OPAL_BOLT,
            Ammunition.IRON_BOLT,
            Ammunition.JADE_BOLT,
            Ammunition.ENCHANTED_JADE_BOLT,
            Ammunition.STEEL_BOLT,
            Ammunition.PEARL_BOLT,
            Ammunition.ENCHANTED_PEARL_BOLT,
            Ammunition.MITHRIL_BOLT,
            Ammunition.TOPAZ_BOLT,
            Ammunition.ENCHANTED_TOPAZ_BOLT,
        ],
        weaponType: RangedWeaponType.CROSSBOW,
    },
    ADAMANT_CROSSBOW = {
        itemIds: [9183],
        ammunition: [
            Ammunition.BRONZE_BOLT,
            Ammunition.OPAL_BOLT,
            Ammunition.ENCHANTED_OPAL_BOLT,
            Ammunition.IRON_BOLT,
            Ammunition.JADE_BOLT,
            Ammunition.ENCHANTED_JADE_BOLT,
            Ammunition.STEEL_BOLT,
            Ammunition.PEARL_BOLT,
            Ammunition.ENCHANTED_PEARL_BOLT,
            Ammunition.MITHRIL_BOLT,
            Ammunition.TOPAZ_BOLT,
            Ammunition.ENCHANTED_TOPAZ_BOLT,
            Ammunition.ADAMANT_BOLT,
            Ammunition.SAPPHIRE_BOLT,
            Ammunition.ENCHANTED_SAPPHIRE_BOLT,
            Ammunition.EMERALD_BOLT,
            Ammunition.ENCHANTED_EMERALD_BOLT,
            Ammunition.RUBY_BOLT,
            Ammunition.ENCHANTED_RUBY_BOLT,
        ],
        weaponType: RangedWeaponType.CROSSBOW,
    },
    RUNE_CROSSBOW = {
        itemIds: [9185],
        ammunition: [
            Ammunition.BRONZE_BOLT,
            Ammunition.OPAL_BOLT,
            Ammunition.ENCHANTED_OPAL_BOLT,
            Ammunition.IRON_BOLT,
            Ammunition.JADE_BOLT,
            Ammunition.ENCHANTED_JADE_BOLT,
            Ammunition.STEEL_BOLT,
            Ammunition.PEARL_BOLT,
            Ammunition.ENCHANTED_PEARL_BOLT,
            Ammunition.MITHRIL_BOLT,
            Ammunition.TOPAZ_BOLT,
            Ammunition.ENCHANTED_TOPAZ_BOLT,
            Ammunition.ADAMANT_BOLT,
            Ammunition.SAPPHIRE_BOLT,
            Ammunition.ENCHANTED_SAPPHIRE_BOLT,
            Ammunition.EMERALD_BOLT,
            Ammunition.ENCHANTED_EMERALD_BOLT,
            Ammunition.RUBY_BOLT,
            Ammunition.ENCHANTED_RUBY_BOLT,
            Ammunition.RUNITE_BOLT,
            Ammunition.BROAD_BOLT,
            Ammunition.DIAMOND_BOLT,
            Ammunition.ENCHANTED_DIAMOND_BOLT,
            Ammunition.ONYX_BOLT,
            Ammunition.ENCHANTED_ONYX_BOLT,
            Ammunition.DRAGON_BOLT,
            Ammunition.ENCHANTED_DRAGON_BOLT,
        ],
        weaponType: RangedWeaponType.CROSSBOW,
    },
    /*ADAMANT_CROSSBOW(new int[]{9183}, new Ammunition[]{Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT}, RangedWeaponType.CROSSBOW),
    RUNE_CROSSBOW(new int[]{9185}, new Ammunition[]{Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT}, RangedWeaponType.CROSSBOW),
    ARMADYL_CROSSBOW(new int[]{ItemIdentifiers.ARMADYL_CROSSBOW}, new Ammunition[]{Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT, Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT}, RangedWeaponType.CROSSBOW),

    BRONZE_DART(new int[]{806}, new Ammunition[]{Ammunition.BRONZE_DART}, RangedWeaponType.DART),
    IRON_DART(new int[]{807}, new Ammunition[]{Ammunition.IRON_DART}, RangedWeaponType.DART),
    STEEL_DART(new int[]{808}, new Ammunition[]{Ammunition.STEEL_DART}, RangedWeaponType.DART),
    MITHRIL_DART(new int[]{809}, new Ammunition[]{Ammunition.MITHRIL_DART}, RangedWeaponType.DART),
    ADAMANT_DART(new int[]{810}, new Ammunition[]{Ammunition.ADAMANT_DART}, RangedWeaponType.DART),
    RUNE_DART(new int[]{811}, new Ammunition[]{Ammunition.RUNE_DART}, RangedWeaponType.DART),
    DRAGON_DART(new int[]{11230}, new Ammunition[]{Ammunition.DRAGON_DART}, RangedWeaponType.DART),

    BRONZE_KNIFE(new int[]{864, 870, 5654}, new Ammunition[]{Ammunition.BRONZE_KNIFE}, RangedWeaponType.KNIFE),
    IRON_KNIFE(new int[]{863, 871, 5655}, new Ammunition[]{Ammunition.IRON_KNIFE}, RangedWeaponType.KNIFE),
    STEEL_KNIFE(new int[]{865, 872, 5656}, new Ammunition[]{Ammunition.STEEL_KNIFE}, RangedWeaponType.KNIFE),
    BLACK_KNIFE(new int[]{869, 874, 5658}, new Ammunition[]{Ammunition.BLACK_KNIFE}, RangedWeaponType.KNIFE),
    MITHRIL_KNIFE(new int[]{866, 873, 5657}, new Ammunition[]{Ammunition.MITHRIL_KNIFE}, RangedWeaponType.KNIFE),
    ADAMANT_KNIFE(new int[]{867, 875, 5659}, new Ammunition[]{Ammunition.ADAMANT_KNIFE}, RangedWeaponType.KNIFE),
    RUNE_KNIFE(new int[]{868, 876, 5660, 5667}, new Ammunition[]{Ammunition.RUNE_KNIFE}, RangedWeaponType.KNIFE),


    TOKTZ_XIL_UL(new int[]{6522}, new Ammunition[]{Ammunition.TOKTZ_XIL_UL}, RangedWeaponType.TOKTZ_XIL_UL),

    KARILS_CROSSBOW(new int[]{4734}, new Ammunition[]{Ammunition.BOLT_RACK}, RangedWeaponType.CROSSBOW),

    BALLISTA(new int[]{19478, 19481}, new Ammunition[]{Ammunition.BRONZE_JAVELIN, Ammunition.IRON_JAVELIN, Ammunition.STEEL_JAVELIN, Ammunition.MITHRIL_JAVELIN, Ammunition.ADAMANT_JAVELIN, Ammunition.RUNE_JAVELIN, Ammunition.DRAGON_JAVELIN}, RangedWeaponType.BALLISTA),

    TOXIC_BLOWPIPE(new int[]{12926}, new Ammunition[]{Ammunition.DRAGON_DART}, RangedWeaponType.BLOWPIPE);*/
}
