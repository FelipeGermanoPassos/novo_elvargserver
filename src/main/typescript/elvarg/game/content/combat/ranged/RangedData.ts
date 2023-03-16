<<<<<<< Updated upstream
=======
import Immutable from 'immutable';
import { CombatEquipment } from '../CombatEquipment';
import { CombatFactory } from '../CombatFactory';
import { FightStyle } from '../FightStyle';
import { Mobile } from '../../../entity/impl/Mobile';
import { Player } from '../../../entity/impl/player/Player';
import { Graphic } from '../../../model/Graphic';
import { GraphicHeight } from '../../../model/GraphicHeight';
import { Skill } from '../../../model/Skill';
import { Equipment } from '../../../model/container/impl/Equipment';
import { PoisonType } from '../../../task/impl/CombatPoisonEffect';
import { ItemIdentifiers } from '../../../../util/ItemIdentifiers';
import { Misc } from '../../../../util/Misc';
import { FightType } from '../FightType';



>>>>>>> Stashed changes
export class RangedData {
    /**
  * A map of items and their respective interfaces.
  */
    private static rangedWeapons: Map<number, RangedWeapon> = new Map<number, RangedWeapon>();
    private static rangedAmmunition: Map<number, Ammunition> = new Map<number, Ammunition>();

    public static getSpecialEffectsMultiplier(p: Player, target: Mobile, damage: number): number {
        let multiplier = 1.0;

        // Todo: ENCHANTED_RUBY_BOLT
        switch (p.getCombat().getAmmunition()) {
<<<<<<< Updated upstream
            case ENCHANTED_DIAMOND_BOLT:
=======
            case Ammunition.ENCHANTED_DIAMOND_BOLT:
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(758, GraphicHeight.MIDDLE));
                multiplier = 1.15;
                break;

<<<<<<< Updated upstream
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
=======
            case Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT:
            case Ammunition.ENCHANTED_DRAGON_BOLT:
>>>>>>> Stashed changes
                let multiply = true;
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    multiply = !(!t.getCombat().getFireImmunityTimer().finished() || CombatEquipment.hasDragonProtectionGear(t));
                }

                if (multiply) {
                    target.performGraphic(new Graphic(756));
                    multiplier = 1.31;
                }
                break;

<<<<<<< Updated upstream
            case ENCHANTED_EMERALD_BOLT:
=======
            case Ammunition.ENCHANTED_EMERALD_BOLT:
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(752));
                CombatFactory.poisonEntity(target, PoisonType.MILD);
                break;

<<<<<<< Updated upstream
            case ENCHANTED_JADE_BOLT:
=======
            case Ammunition.ENCHANTED_JADE_BOLT:
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(755));
                multiplier = 1.05;
                break;

<<<<<<< Updated upstream
            case ENCHANTED_ONYX_BOLT:
=======
            case Ammunition.ENCHANTED_ONYX_BOLT:
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(753));
                multiplier = 1.26;
                const heal = Math.floor(damage * 0.25) + 10;
                p.getSkillManager().setCurrentLevels(Skill.HITPOINTS, p.getSkillManager().getCurrentLevel([Skill.HITPOINTS]) + heal);
                if (p.getSkillManager().getCurrentLevel([Skill.HITPOINTS]) >= 1120) {
                    p.getSkillManager().setCurrentLevels(Skill.HITPOINTS, 1120);
                }
                p.getSkillManager().updateSkill(Skill.HITPOINTS);
                if (damage < 250 && Misc.getRandom(3) <= 1) {
                    damage += 150 + Misc.getRandom(80);
                }
                break;

<<<<<<< Updated upstream
            case ENCHANTED_PEARL_BOLT:
=======
            case Ammunition.ENCHANTED_PEARL_BOLT:
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(750));
                multiplier = 1.1;
                break;

<<<<<<< Updated upstream
            case ENCHANTED_RUBY_BOLT:
                break;

            case ENCHANTED_SAPPHIRE_BOLT:
=======
            case Ammunition.ENCHANTED_RUBY_BOLT:
                break;

            case Ammunition.ENCHANTED_SAPPHIRE_BOLT:
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(751));
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevels(Skill.PRAYER, t.getSkillManager().getCurrentLevel([Skill.PRAYER]) - 20);
                    if (t.getSkillManager().getCurrentLevel([Skill.PRAYER]) < 0) {
                        t.getSkillManager().setCurrentLevels(Skill.PRAYER, 0);
                    }
                    t.getPacketSender().sendMessage("Your Prayer level has been leeched.");

                    p.getSkillManager().setCurrentLevels(Skill.PRAYER, t.getSkillManager().getCurrentLevel([Skill.PRAYER]) + 20);
                    if (p.getSkillManager().getCurrentLevel([Skill.PRAYER]) > p.getSkillManager().getMaxLevel(Skill.PRAYER)) {
                        p.getSkillManager().setCurrentLevels(Skill.PRAYER, p.getSkillManager().getMaxLevel(Skill.PRAYER));
                    } else {
                        p.getPacketSender().sendMessage("Your enchanced bolts leech some Prayer points from your opponent..");
                    }
                }
                break;
            case Ammunition.ENCHANTED_TOPAZ_BOLT:


<<<<<<< Updated upstream
            case ENCHANTED_TOPAZ_BOLT:
=======
>>>>>>> Stashed changes
                target.performGraphic(new Graphic(757));
                if (target.isPlayer()) {
                    const t = target.getAsPlayer();
                    t.getSkillManager().setCurrentLevels(Skill.MAGIC, t.getSkillManager().getCurrentLevel([Skill.MAGIC]) - 3);
                    t.getPacketSender().sendMessage("Your Magic level has been reduced.");
                }

                break;
<<<<<<< Updated upstream
            case ENCHANTED_OPAL_BOLT:
=======
            case Ammunition.ENCHANTED_OPAL_BOLT:


>>>>>>> Stashed changes
                target.performGraphic(new Graphic(749));
                multiplier = 1.3;

                break;
        }

        return multiplier;
    }
}

class Ammunition {
    public static readonly BRONZE_ARROW = new Ammunition(882, new Graphic(19, GraphicHeight.HIGH), 10, 7)
    public static readonly IRON_ARROW = new Ammunition(884, new Graphic(18, GraphicHeight.HIGH), 9, 10)
    public static readonly STEEL_ARROW = new Ammunition(886, new Graphic(20, GraphicHeight.HIGH), 11, 16)
    public static readonly MITHRIL_ARROW = new Ammunition(888, new Graphic(21, GraphicHeight.HIGH), 12, 22)
    public static readonly ADAMANT_ARROW = new Ammunition(890, new Graphic(22, GraphicHeight.HIGH), 13, 31)
    public static readonly RUNE_ARROW = new Ammunition(892, new Graphic(24, GraphicHeight.HIGH), 15, 50)
    public static readonly ICE_ARROW = new Ammunition(78, new Graphic(25, GraphicHeight.HIGH), 16, 58)
    public static readonly BROAD_ARROW = new Ammunition(4160, new Graphic(20, GraphicHeight.HIGH), 11, 58)
    public static readonly DRAGON_ARROW = new Ammunition(11212, new Graphic(1111, GraphicHeight.HIGH), 1120, 65)

    public static readonly BRONZE_BOLT = new Ammunition(877, new Graphic(955, GraphicHeight.HIGH), 27, 13)
    public static readonly OPAL_BOLT = new Ammunition(879, new Graphic(955, GraphicHeight.HIGH), 27, 20)
    public static readonly ENCHANTED_OPAL_BOLT = new Ammunition(9236, new Graphic(955, GraphicHeight.HIGH), 27, 20)
    public static readonly IRON_BOLT = new Ammunition(9140, new Graphic(955, GraphicHeight.HIGH), 27, 28)
    public static readonly JADE_BOLT = new Ammunition(9335, new Graphic(955, GraphicHeight.HIGH), 27, 31)
    public static readonly ENCHANTED_JADE_BOLT = new Ammunition(9237, new Graphic(955, GraphicHeight.HIGH), 27, 31)
    public static readonly STEEL_BOLT = new Ammunition(9141, new Graphic(955, GraphicHeight.HIGH), 27, 35)
    public static readonly PEARL_BOLT = new Ammunition(880, new Graphic(955, GraphicHeight.HIGH), 27, 38)
    public static readonly ENCHANTED_PEARL_BOLT = new Ammunition(9238, new Graphic(955, GraphicHeight.HIGH), 27, 38)
    public static readonly MITHRIL_BOLT = new Ammunition(9142, new Graphic(955, GraphicHeight.HIGH), 27, 40)
    public static readonly TOPAZ_BOLT = new Ammunition(9336, new Graphic(955, GraphicHeight.HIGH), 27, 50)
    public static readonly ENCHANTED_TOPAZ_BOLT = new Ammunition(9239, new Graphic(955, GraphicHeight.HIGH), 27, 50)
    public static readonly ADAMANT_BOLT = new Ammunition(9143, new Graphic(955, GraphicHeight.HIGH), 27, 60)
    public static readonly SAPPHIRE_BOLT = new Ammunition(9337, new Graphic(955, GraphicHeight.HIGH), 27, 65)
    public static readonly ENCHANTED_SAPPHIRE_BOLT = new Ammunition(9240, new Graphic(955, GraphicHeight.HIGH), 27, 65)
    public static readonly EMERALD_BOLT = new Ammunition(9338, new Graphic(955, GraphicHeight.HIGH), 27, 70)
    public static readonly ENCHANTED_EMERALD_BOLT = new Ammunition(9241, new Graphic(955, GraphicHeight.HIGH), 27, 70)
    public static readonly RUBY_BOLT = new Ammunition(9339, new Graphic(955, GraphicHeight.HIGH), 27, 75)
    public static readonly ENCHANTED_RUBY_BOLT = new Ammunition(9242, new Graphic(955, GraphicHeight.HIGH), 27, 75)
    public static readonly BROAD_BOLT = new Ammunition(13280, new Graphic(955, GraphicHeight.HIGH), 27, 100)
    public static readonly RUNITE_BOLT = new Ammunition(9144, new Graphic(955, GraphicHeight.HIGH), 27, 115)
    public static readonly DIAMOND_BOLT = new Ammunition(9340, new Graphic(955, GraphicHeight.HIGH), 27, 105)
    public static readonly ENCHANTED_DIAMOND_BOLT = new Ammunition(9243, new Graphic(955, GraphicHeight.HIGH), 27, 105)
    public static readonly DRAGON_BOLT = new Ammunition(9341, new Graphic(955, GraphicHeight.HIGH), 27, 117)
    public static readonly ENCHANTED_DRAGON_BOLT = new Ammunition(9244, new Graphic(955, GraphicHeight.HIGH), 27, 117)
    public static readonly ONYX_BOLT = new Ammunition(9342, new Graphic(955, GraphicHeight.HIGH), 27, 120)
    public static readonly ENCHANTED_ONYX_BOLT = new Ammunition(9245, new Graphic(955, GraphicHeight.HIGH), 27, 120)
    public static readonly ENCHANTED_DRAGONSTONE_DRAGON_BOLT = new Ammunition(ItemIdentifiers.DRAGONSTONE_DRAGON_BOLTS_E_, new Graphic(955, GraphicHeight.HIGH), 27, 122)

    public static readonly BRONZE_DART = new Ammunition(806, new Graphic(232, GraphicHeight.HIGH), 226, 1)
    public static readonly IRON_DART = new Ammunition(807, new Graphic(233, GraphicHeight.HIGH), 227, 4)
    public static readonly STEEL_DART = new Ammunition(808, new Graphic(234, GraphicHeight.HIGH), 228, 6)
    public static readonly MITHRIL_DART = new Ammunition(809, new Graphic(235, GraphicHeight.HIGH), 229, 8)
    public static readonly ADAMANT_DART = new Ammunition(810, new Graphic(236, GraphicHeight.HIGH), 230, 13)
    public static readonly RUNE_DART = new Ammunition(811, new Graphic(237, GraphicHeight.HIGH), 231, 17)
    public static readonly DRAGON_DART = new Ammunition(11230, new Graphic(1123, GraphicHeight.HIGH), 226, 24)

    public static readonly BRONZE_KNIFE = new Ammunition(864, new Graphic(219, GraphicHeight.HIGH), 212, 3)
    public static readonly BRONZE_KNIFE_P1 = new Ammunition(870, new Graphic(219, GraphicHeight.HIGH), 212, 3)
    public static readonly BRONZE_KNIFE_P2 = new Ammunition(5654, new Graphic(219, GraphicHeight.HIGH), 212, 3)
    public static readonly BRONZE_KNIFE_P3 = new Ammunition(5661, new Graphic(219, GraphicHeight.HIGH), 212, 3)

    public static readonly IRON_KNIFE = new Ammunition(863, new Graphic(220, GraphicHeight.HIGH), 213, 4)
    public static readonly IRON_KNIFE_P1 = new Ammunition(871, new Graphic(220, GraphicHeight.HIGH), 213, 4)
    public static readonly IRON_KNIFE_P2 = new Ammunition(5655, new Graphic(220, GraphicHeight.HIGH), 213, 4)
    public static readonly IRON_KNIFE_P3 = new Ammunition(5662, new Graphic(220, GraphicHeight.HIGH), 213, 4)

    public static readonly STEEL_KNIFE = new Ammunition(865, new Graphic(221, GraphicHeight.HIGH), 214, 7)
    public static readonly STEEL_KNIFE_P1 = new Ammunition(872, new Graphic(221, GraphicHeight.HIGH), 214, 7)
    public static readonly STEEL_KNIFE_P2 = new Ammunition(5656, new Graphic(221, GraphicHeight.HIGH), 214, 7)
    public static readonly STEEL_KNIFE_P3 = new Ammunition(5663, new Graphic(221, GraphicHeight.HIGH), 214, 7)

    public static readonly BLACK_KNIFE = new Ammunition(869, new Graphic(222, GraphicHeight.HIGH), 215, 8)
    public static readonly BLACK_KNIFE_P1 = new Ammunition(874, new Graphic(222, GraphicHeight.HIGH), 215, 8)
    public static readonly BLACK_KNIFE_P2 = new Ammunition(5658, new Graphic(222, GraphicHeight.HIGH), 215, 8)
    public static readonly BLACK_KNIFE_P3 = new Ammunition(5665, new Graphic(222, GraphicHeight.HIGH), 215, 8)

    public static readonly MITHRIL_KNIFE = new Ammunition(866, new Graphic(223, GraphicHeight.HIGH), 215, 10)
    public static readonly MITHRIL_KNIFE_P1 = new Ammunition(873, new Graphic(223, GraphicHeight.HIGH), 215, 10)
    public static readonly MITHRIL_KNIFE_P2 = new Ammunition(5657, new Graphic(223, GraphicHeight.HIGH), 215, 10)
    public static readonly MITHRIL_KNIFE_P3 = new Ammunition(5664, new Graphic(223, GraphicHeight.HIGH), 215, 10)

    public static readonly ADAMANT_KNIFE = new Ammunition(867, new Graphic(224, GraphicHeight.HIGH), 217, 14)
    public static readonly ADAMANT_KNIFE_P1 = new Ammunition(875, new Graphic(224, GraphicHeight.HIGH), 217, 14)
    public static readonly ADAMANT_KNIFE_P2 = new Ammunition(5659, new Graphic(224, GraphicHeight.HIGH), 217, 14)
    public static readonly ADAMANT_KNIFE_P3 = new Ammunition(5666, new Graphic(224, GraphicHeight.HIGH), 217, 14)

    public static readonly RUNE_KNIFE = new Ammunition(868, new Graphic(225, GraphicHeight.HIGH), 218, 24)
    public static readonly RUNE_KNIFE_P1 = new Ammunition(876, new Graphic(225, GraphicHeight.HIGH), 218, 24)
    public static readonly RUNE_KNIFE_P2 = new Ammunition(5660, new Graphic(225, GraphicHeight.HIGH), 218, 24)
    public static readonly RUNE_KNIFE_P3 = new Ammunition(5667, new Graphic(225, GraphicHeight.HIGH), 218, 24)

    public static readonly BRONZE_JAVELIN = new Ammunition(825, null, 200, 25)
    public static readonly IRON_JAVELIN = new Ammunition(826, null, 201, 42)
    public static readonly STEEL_JAVELIN = new Ammunition(827, null, 202, 64)
    public static readonly MITHRIL_JAVELIN = new Ammunition(828, null, 203, 85)
    public static readonly ADAMANT_JAVELIN = new Ammunition(829, null, 204, 107)
    public static readonly RUNE_JAVELIN = new Ammunition(830, null, 205, 124)
    public static readonly DRAGON_JAVELIN = new Ammunition(19484, null, 1301, 150)

    public static readonly TOKTZ_XIL_UL = new Ammunition(6522, null, 442, 58)

    public static readonly BOLT_RACK = new Ammunition(4740, null, 27, 55)

    private static NO_GROUND_DROP: Immutable.Set<Ammunition> = Immutable.Set.of(
        Ammunition.BRONZE_JAVELIN,
        Ammunition.IRON_JAVELIN,
        Ammunition.STEEL_JAVELIN,
        Ammunition.ADAMANT_JAVELIN,
        Ammunition.RUNE_JAVELIN,
        Ammunition.DRAGON_JAVELIN
    ).toSet();

    private static startGfx: Graphic;
    private static itemId: number;
    private static projectileId: number;
    private static strength: number;
    private static rangedAmmunition: Map<number, Ammunition> = new Map<number, Ammunition>();


    constructor(itemId: number, startGfx: Graphic, projectileId: number, strength: number) {
        Ammunition.itemId = itemId;
        Ammunition.startGfx = startGfx;
        Ammunition.projectileId = projectileId;
        Ammunition.strength = strength;
    }

    public static getFor(p: Player): Ammunition {
        // First try to get a throw weapon as ammo
        const weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        const throwWeapon = Ammunition.rangedAmmunition.get(weapon);

        // Toxic blowpipe should always fire dragon darts.
        if (weapon === 12926) {
            return Ammunition.DRAGON_DART;
        }

        // Didn't find one. Try arrows
        if (throwWeapon == null) {
            return Ammunition.rangedAmmunition.get(p.getEquipment().getItems()[Equipment.AMMUNITION_SLOT].getId());
        }

        return throwWeapon;
    }

    public static getForItem(item: number): Ammunition {
        // First try to get a throw weapon as ammo
        const throwWeapon = Ammunition.rangedAmmunition.get(item);

        // Didn't find one. Try arrows
        if (throwWeapon == null) {
            return Ammunition.rangedAmmunition.get(item);
        }

        return throwWeapon;
    }

    public getItemId(): number {
        return Ammunition.itemId;
    }

    public getStartGraphic(): Graphic {
        return Ammunition.startGfx;
    }

    public getProjectileId(): number {
        return Ammunition.projectileId;
    }

    public getStrength(): number {
        return Ammunition.strength;
    }

    public dropOnFloor(): boolean {
        return !Ammunition.NO_GROUND_DROP.includes(this);
    }




    static {
        for (const data of Object.values(Ammunition)) {
            Ammunition.rangedAmmunition.set(data.getItemId(), data);
        }
    }


}

class RangedWeaponType {
    public static readonly KNIFE = new RangedWeaponType(4, 6, FightType.KNIFE_LONGRANGE)
    public static readonly DART = new RangedWeaponType(3, 5, FightType.DART_LONGRANGE)
    public static readonly TOKTZ_XIL_UL = new RangedWeaponType(5, 6, FightType.OBBY_RING_LONGRANGE)
    public static readonly LONGBOW = new RangedWeaponType(9, 10, FightType.LONGBOW_LONGRANGE)
    public static readonly BLOWPIPE = new RangedWeaponType(5, 7, FightType.BLOWPIPE_LONGRANGE)
    public static readonly SHORTBOW = new RangedWeaponType(7, 9, FightType.SHORTBOW_LONGRANGE)
    public static readonly CROSSBOW = new RangedWeaponType(7, 9, FightType.CROSSBOW_LONGRANGE)
    public static readonly BALLISTA = new RangedWeaponType(7, 9, FightType.BALLISTA_LONGRANGE)


    private static longRangeFightType: FightType;
    private static defaultDistance: number;
    private static longRangeDistance: number;

    constructor(defaultDistance: number, longRangeDistance: number, longRangeFightType: FightType) {
        RangedWeaponType.defaultDistance = defaultDistance;
        RangedWeaponType.longRangeDistance = longRangeDistance;
        RangedWeaponType.longRangeFightType = longRangeFightType;
    }

    public getDefaultDistance(): number {
        return RangedWeaponType.defaultDistance;
    }

    public getLongRangeDistance(): number {
        return RangedWeaponType.longRangeDistance;
    }

    public getLongRangeFightType(): FightType {
        return RangedWeaponType.longRangeFightType;
    }

}

class RangedWeapon {
    private static readonly LONGBOW = new RangedWeapon([839], [Ammunition.BRONZE_ARROW], RangedWeaponType.LONGBOW)
    private static readonly SHORTBOW = new RangedWeapon([841], [Ammunition.BRONZE_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly OAK_LONGBOW = new RangedWeapon([845], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW], RangedWeaponType.LONGBOW)
    private static readonly OAK_SHORTBOW = new RangedWeapon([843], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly WILLOW_LONGBOW = new RangedWeapon([847], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW], RangedWeaponType.LONGBOW)
    private static readonly WILLOW_SHORTBOW = new RangedWeapon([849], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly MAPLE_LONGBOW = new RangedWeapon([851], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW], RangedWeaponType.LONGBOW)
    private static readonly MAPLE_SHORTBOW = new RangedWeapon([853], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly YEW_LONGBOW = new RangedWeapon([855], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW], RangedWeaponType.LONGBOW)
    private static readonly YEW_SHORTBOW = new RangedWeapon([857], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly MAGIC_LONGBOW = new RangedWeapon([859], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW], RangedWeaponType.LONGBOW)
    private static readonly MAGIC_SHORTBOW = new RangedWeapon([861, 6724], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.ICE_ARROW, Ammunition.BROAD_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly GODBOW = new RangedWeapon([19143, 19149, 19146], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.BROAD_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.SHORTBOW)
    private static readonly ZARYTE_BOW = new RangedWeapon([20171], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.BROAD_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.SHORTBOW)

    private static readonly DARK_BOW = new RangedWeapon([11235, 13405, 15701, 15702, 15703, 15704], [Ammunition.BRONZE_ARROW, Ammunition.IRON_ARROW, Ammunition.STEEL_ARROW, Ammunition.MITHRIL_ARROW, Ammunition.ADAMANT_ARROW, Ammunition.RUNE_ARROW, Ammunition.DRAGON_ARROW], RangedWeaponType.LONGBOW)

    private static readonly BRONZE_CROSSBOW = new RangedWeapon([9174], [Ammunition.BRONZE_BOLT], RangedWeaponType.CROSSBOW)
    private static readonly IRON_CROSSBOW = new RangedWeapon([9177], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT], RangedWeaponType.CROSSBOW)
    private static readonly STEEL_CROSSBOW = new RangedWeapon([9179], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT], RangedWeaponType.CROSSBOW)
    private static readonly MITHRIL_CROSSBOW = new RangedWeapon([9181], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT], RangedWeaponType.CROSSBOW)
    private static readonly ADAMANT_CROSSBOW = new RangedWeapon([9183], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT], RangedWeaponType.CROSSBOW)
    private static readonly RUNE_CROSSBOW = new RangedWeapon([9185], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT], RangedWeaponType.CROSSBOW)
    private static readonly ARMADYL_CROSSBOW = new RangedWeapon([ItemIdentifiers.ARMADYL_CROSSBOW], [Ammunition.BRONZE_BOLT, Ammunition.OPAL_BOLT, Ammunition.ENCHANTED_OPAL_BOLT, Ammunition.IRON_BOLT, Ammunition.JADE_BOLT, Ammunition.ENCHANTED_JADE_BOLT, Ammunition.STEEL_BOLT, Ammunition.PEARL_BOLT, Ammunition.ENCHANTED_PEARL_BOLT, Ammunition.MITHRIL_BOLT, Ammunition.TOPAZ_BOLT, Ammunition.ENCHANTED_TOPAZ_BOLT, Ammunition.ADAMANT_BOLT, Ammunition.SAPPHIRE_BOLT, Ammunition.ENCHANTED_SAPPHIRE_BOLT, Ammunition.EMERALD_BOLT, Ammunition.ENCHANTED_EMERALD_BOLT, Ammunition.RUBY_BOLT, Ammunition.ENCHANTED_RUBY_BOLT, Ammunition.RUNITE_BOLT, Ammunition.BROAD_BOLT, Ammunition.DIAMOND_BOLT, Ammunition.ENCHANTED_DIAMOND_BOLT, Ammunition.ONYX_BOLT, Ammunition.ENCHANTED_ONYX_BOLT, Ammunition.DRAGON_BOLT, Ammunition.ENCHANTED_DRAGON_BOLT, Ammunition.ENCHANTED_DRAGONSTONE_DRAGON_BOLT], RangedWeaponType.CROSSBOW)

    private static readonly BRONZE_DART = new RangedWeapon([806], [Ammunition.BRONZE_DART], RangedWeaponType.DART)
    private static readonly IRON_DART = new RangedWeapon([807], [Ammunition.IRON_DART], RangedWeaponType.DART)
    private static readonly STEEL_DART = new RangedWeapon([808], [Ammunition.STEEL_DART], RangedWeaponType.DART)
    private static readonly MITHRIL_DART = new RangedWeapon([809], [Ammunition.MITHRIL_DART], RangedWeaponType.DART)
    private static readonly ADAMANT_DART = new RangedWeapon([810], [Ammunition.ADAMANT_DART], RangedWeaponType.DART)
    private static readonly RUNE_DART = new RangedWeapon([811], [Ammunition.RUNE_DART], RangedWeaponType.DART)
    private static readonly DRAGON_DART = new RangedWeapon([11230], [(Ammunition.DRAGON_DART)], RangedWeaponType.DART)


    private static readonly BRONZE_KNIFE = new RangedWeapon([864, 870, 5654], [Ammunition.BRONZE_KNIFE], RangedWeaponType.KNIFE)
    private static readonly IRON_KNIFE = new RangedWeapon([863, 871, 5655], [Ammunition.IRON_KNIFE], RangedWeaponType.KNIFE)
    private static readonly STEEL_KNIFE = new RangedWeapon([865, 872, 5656], [Ammunition.STEEL_KNIFE], RangedWeaponType.KNIFE)
    private static readonly BLACK_KNIFE = new RangedWeapon([869, 874, 5658], [Ammunition.BLACK_KNIFE], RangedWeaponType.KNIFE)
    private static readonly MITHRIL_KNIFE = new RangedWeapon([866, 873, 5657], [Ammunition.MITHRIL_KNIFE], RangedWeaponType.KNIFE)
    private static readonly ADAMANT_KNIFE = new RangedWeapon([867, 875, 5659], [Ammunition.ADAMANT_KNIFE], RangedWeaponType.KNIFE)
    private static readonly RUNE_KNIFE = new RangedWeapon([868, 876, 5660, 5667], [Ammunition.RUNE_KNIFE], RangedWeaponType.KNIFE)

    private static readonly TOKTZ_XIL_UL = new RangedWeapon([6522], [Ammunition.TOKTZ_XIL_UL], RangedWeaponType.TOKTZ_XIL_UL)

    private static readonly KARILS_CROSSBOW = new RangedWeapon([4734], [Ammunition.BOLT_RACK], RangedWeaponType.CROSSBOW)

    private static readonly BALLISTA = new RangedWeapon([19478, 19481], [Ammunition.BRONZE_JAVELIN, Ammunition.IRON_JAVELIN, Ammunition.STEEL_JAVELIN, Ammunition.MITHRIL_JAVELIN, Ammunition.ADAMANT_JAVELIN, Ammunition.RUNE_JAVELIN, Ammunition.DRAGON_JAVELIN], RangedWeaponType.BALLISTA)

    private static readonly TOXIC_BLOWPIPE = new RangedWeapon([12926], [Ammunition.DRAGON_DART], RangedWeaponType.BLOWPIPE)




    private weaponIds: number[];
    private ammunitionData: Ammunition[];
    private type: RangedWeaponType;
    private static rangedWeapons: Map<number, RangedWeapon> = new Map<number, RangedWeapon>();


    constructor(weaponIds: number[], ammunitionData: Ammunition[], type: RangedWeaponType) {
        this.weaponIds = weaponIds;
        this.ammunitionData = ammunitionData;
        this.type = type;
    }

<<<<<<< Updated upstream
    public static getFor(p: Player) {
        let weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        return this.rangedWeapons.get(weapon);
=======
    public static getFor(p: Player): RangedWeapon {
        const weapon = p.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId();
        return RangedWeapon.rangedWeapons.get(weapon);
>>>>>>> Stashed changes
    }

    public getWeaponIds(): number[] {
        return this.weaponIds;
    }

    public getAmmunitionData(): Ammunition[] {
        return this.ammunitionData;
    }

    public getType(): RangedWeaponType {
        return this.type;
    }

    static {
        for (const data of Object.values(RangedWeapon)) {
            for (const i of data.getWeaponIds()) {
                RangedWeapon.rangedWeapons.set(i, data);
            }
        }
    }
<<<<<<< Updated upstream

    const Ammunition: Map<Ammunition, AmmunitionData> = new Map<Ammunition, AmmunitionData>([
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
=======
>>>>>>> Stashed changes
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


<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
