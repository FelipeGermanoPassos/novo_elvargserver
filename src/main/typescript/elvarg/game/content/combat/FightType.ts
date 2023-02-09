import { FightStyle } from './FightStyle';
import { Sound } from '../../Sound';
import { BonusManager } from '../../model/equipment/BonusManager';

export class FightType {
    public static STAFF_BASH = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static STAFF_POUND = { id: 406, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static STAFF_FOCUS = { id: 406, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static WARHAMMER_POUND = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static WARHAMMER_PUMMEL = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static WARHAMMER_BLOCK = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static MAUL_POUND = { id: 2661, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static MAUL_PUMMEL = { id: 2661, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static MAUL_BLOCK = { id: 2661, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static ELDER_MAUL_POUND = { id: 7516, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static ELDER_MAUL_PUMMEL = { id: 7516, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static ELDER_MAUL_BLOCK = { id: 7516, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static GRANITE_MAUL_POUND = { id: 1665, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static GRANITE_MAUL_PUMMEL = { id: 1665, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static GRANITE_MAUL_BLOCK = { id: 1665, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static SCYTHE_REAP = { id: 414, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static SCYTHE_CHOP = { id: 382, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static SCYTHE_JAB = { id: 2066, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.CONTROLLED }
    public static SCYTHE_BLOCK = { id: 382, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static BATTLEAXE_CHOP = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static BATTLEAXE_HACK = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static BATTLEAXE_SMASH = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static BATTLEAXE_BLOCK = { id: 401, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static GREATAXE_CHOP = { id: 2062, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static GREATAXE_HACK = { id: 2062, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static GREATAXE_SMASH = { id: 2066, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static GREATAXE_BLOCK = { id: 2062, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static CROSSBOW_ACCURATE = { id: 4230, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static CROSSBOW_RAPID = { id: 4230, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static CROSSBOW_LONGRANGE = { id: 4230, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static KARILS_CROSSBOW_ACCURATE = { id: 2075, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static KARILS_CROSSBOW_RAPID = { id: 2075, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static KARILS_CROSSBOW_LONGRANGE = { id: 2075, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static BALLISTA_ACCURATE = { id: 7218, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static BALLISTA_RAPID = { id: 7218, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static BALLISTA_LONGRANGE = { id: 7218, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static BLOWPIPE_ACCURATE = { id: 5061, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static BLOWPIPE_RAPID = { id: 5061, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static BLOWPIPE_LONGRANGE = { id: 5061, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static ABYSSAL_BLUDGEON_CHOP = { id: 7054, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static ABYSSAL_BLUDGEON_SLASH = { id: 7054, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static ABYSSAL_BLUDGEON_SMASH = { id: 7054, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static ABYSSAL_BLUDGEON_BLOCK = { id: 7054, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static SHORTBOW_ACCURATE = { id: 426, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static SHORTBOW_RAPID = { id: 426, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static SHORTBOW_LONGRANGE = { id: 426, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static LONGBOW_ACCURATE = { id: 426, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static LONGBOW_RAPID = { id: 426, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static LONGBOW_LONGRANGE = { id: 426, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static DAGGER_STAB = { id: 400, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE }
    public static DAGGER_LUNGE = { id: 400, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static DAGGER_SLASH = { id: 400, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static DAGGER_BLOCK = { id: 400, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
    public static DRAGON_DAGGER_STAB = { id: 376, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE }
    public static DRAGON_DAGGER_LUNGE = { id: 376, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static DRAGON_DAGGER_SLASH = { id: 377, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static DRAGON_DAGGER_BLOCK = { id: 376, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
    public static SWORD_STAB = { id: 412, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE }
    public static SWORD_LUNGE = { id: 412, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static SWORD_SLASH = { id: 390, animation: 43, style: 2, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static SWORD_BLOCK = { id: 412, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
    public static SCIMITAR_CHOP = { id: 390, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static SCIMITAR_LUNGE = { id: 390, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static SCIMITAR_BLOCK = { id: 390, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static LONGSWORD_CHOP = { id: 390, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static LONGSWORD_SLASH = { id: 390, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static LONGSWORD_LUNGE = { id: 412, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static LONGSWORD_BLOCK = { id: 390, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static MACE_POUND = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static MACE_PUMMEL = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static MACE_SPIKE = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static MACE_BLOCK = { id: 401, animation: 43, style: 3, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static KNIFE_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static KNIFE_RAPID = { id: 806, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static KNIFE_LONGRANGE = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static OBBY_RING_ACCURATE = { id: 2614, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static OBBY_RING_RAPID = { id: 2614, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static OBBY_RING_LONGRANGE = { id: 2614, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static SPEAR_LUNGE = { id: 2080, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static SPEAR_SWIPE = { id: 2081, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.CONTROLLED }
    public static SPEAR_POUND = { id: 2082, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.CONTROLLED }
    public static SPEAR_BLOCK = { id: 2080, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
    public static TWOHANDEDSWORD_CHOP = { id: 407, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static TWOHANDEDSWORD_SLASH = { id: 407, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static TWOHANDEDSWORD_SMASH = { id: 406, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static TWOHANDEDSWORD_BLOCK = { id: 407, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static GODSWORD_CHOP = { id: 7046, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static GODSWORD_SLASH = { id: 7045, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static GODSWORD_SMASH = { id: 7054, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static GODSWORD_BLOCK = { id: 7055, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static VERACS_FLAIL_POUND = { id: 1658, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static VERACS_FLAIL_PUMMEL = { id: 1658, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static VERACS_FLAIL_SPIKE = { id: 1658, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static VERACS_FLAIL_BLOCK = { id: 1658, animation: 43, style: 3, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static PICKAXE_SPIKE = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE }
    public static PICKAXE_IMPALE = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static PICKAXE_SMASH = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static PICKAXE_BLOCK = { id: 400, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
    public static CLAWS_CHOP = { id: 393, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE }
    public static CLAWS_SLASH = { id: 393, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static CLAWS_LUNGE = { id: 393, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static CLAWS_BLOCK = { id: 393, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE }
    public static HALBERD_JAB = { id: 440, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED }
    public static HALBERD_SWIPE = { id: 440, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE }
    public static HALBERD_FEND = { id: 440, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
    public static UNARMED_PUNCH = { id: 422, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE }
    public static UNARMED_KICK = { id: 423, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE }
    public static UNARMED_BLOCK = { id: 422, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE }
    public static WHIP_FLICK = { id: 1658, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE, sound: Sound.WEAPON_WHIP }
    public static WHIP_LASH = { id: 1658, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.CONTROLLED, sound: Sound.WEAPON_WHIP }
    public static WHIP_DEFLECT = { id: 1658, animation: 43, style: 2, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE, sound: Sound.WEAPON_WHIP }
    public static THROWNAXE_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static THROWNAXE_RAPID = { id: 806, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static THROWNAXE_LONGRANGE = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static DART_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static DART_RAPID = { id: 806, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static DART_LONGRANGE = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static JAVELIN_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE }
    public static JAVELIN_RAPID = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE }
    public static JAVELIN_LONGRANGE = { id: 806, animation: 43, style: 3, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE }
    public static GHRAZI_RAPIER_STAB = { id: 8145, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE }
    public static GHRAZI_RAPIER_LUNGE = { id: 8145, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static GHRAZI_RAPIER_SLASH = { id: 390, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE }
    public static GHRAZI_RAPIER_BLOCK = { id: 8145, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }

    private static animation: number;
    private static attackSound: Sound;
    private static parentId: number;
    private static childId: number;
    private static bonusType: number;
    private static style: FightStyle;

    private constructor(animation: number, parentId: number, childId: number, bonusType: number, style: FightStyle, sound: Sound) {
        FightType.animation = animation;
        FightType.parentId = parentId;
        FightType.childId = childId;
        FightType.bonusType = bonusType;
        FightType.style = style;
        FightType.attackSound = sound;
    }

    public static getAnimation(): number {
        return this.animation;
    }

    /**
     * Gets the parent config id.
     *
     * @return the parent id.
     */
    public static getParentId(): number {
        return this.parentId;
    }

    /**
     * Gets the child config id.
     *
     * @return the child id.
     */
    public static getChildId(): number {
        return this.childId;
    }

    /**
     * Gets the bonus type.
     *
     * @return the bonus type.
     */
    public static getBonusType(): number {
        return this.bonusType;
    }

    /**
     * Gets the fighting style.
     *
     * @return the fighting style.
     */
    public static getStyle(): FightStyle {
        return this.style;
    }

    public static getCorrespondingBonus(): number {
        switch (this.bonusType) {
            case BonusManager.ATTACK_CRUSH:
                return BonusManager.DEFENCE_CRUSH;
            case BonusManager.ATTACK_MAGIC:
                return BonusManager.DEFENCE_MAGIC;
            case BonusManager.ATTACK_RANGE:
                return BonusManager.DEFENCE_RANGE;
            case BonusManager.ATTACK_SLASH:
                return BonusManager.DEFENCE_SLASH;
            case BonusManager.ATTACK_STAB:
                return BonusManager.DEFENCE_STAB;
            default:
                return BonusManager.DEFENCE_CRUSH;
        }
    }

    public static getAttackSound(): Sound {
        return this.attackSound;
    }

}    