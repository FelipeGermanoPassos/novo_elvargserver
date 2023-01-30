import { FightStyle } from './FightStyle';
import { Sound } from '../../Sound';
import { BonusManager } from '../../model/equipment/BonusManager';

enum FightTypes {
    STAFF_BASH = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    STAFF_POUND = { id: 406, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    STAFF_FOCUS = { id: 406, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    WARHAMMER_POUND = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    WARHAMMER_PUMMEL = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    WARHAMMER_BLOCK = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    MAUL_POUND = { id: 2661, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    MAUL_PUMMEL = { id: 2661, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    MAUL_BLOCK = { id: 2661, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    ELDER_MAUL_POUND = { id: 7516, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    ELDER_MAUL_PUMMEL = { id: 7516, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    ELDER_MAUL_BLOCK = { id: 7516, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    GRANITE_MAUL_POUND = { id: 1665, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    GRANITE_MAUL_PUMMEL = { id: 1665, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    GRANITE_MAUL_BLOCK = { id: 1665, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    SCYTHE_REAP = { id: 414, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    SCYTHE_CHOP = { id: 382, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    SCYTHE_JAB = { id: 2066, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.CONTROLLED },
    SCYTHE_BLOCK = { id: 382, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    BATTLEAXE_CHOP = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    BATTLEAXE_HACK = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    BATTLEAXE_SMASH = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    BATTLEAXE_BLOCK = { id: 401, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    GREATAXE_CHOP = { id: 2062, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    GREATAXE_HACK = { id: 2062, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    GREATAXE_SMASH = { id: 2066, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    GREATAXE_BLOCK = { id: 2062, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    CROSSBOW_ACCURATE = { id: 4230, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    CROSSBOW_RAPID = { id: 4230, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    CROSSBOW_LONGRANGE = { id: 4230, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    KARILS_CROSSBOW_ACCURATE = { id: 2075, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    KARILS_CROSSBOW_RAPID = { id: 2075, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    KARILS_CROSSBOW_LONGRANGE = { id: 2075, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    BALLISTA_ACCURATE = { id: 7218, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    BALLISTA_RAPID = { id: 7218, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    BALLISTA_LONGRANGE = { id: 7218, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    BLOWPIPE_ACCURATE = { id: 5061, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    BLOWPIPE_RAPID = { id: 5061, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    BLOWPIPE_LONGRANGE = { id: 5061, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    ABYSSAL_BLUDGEON_CHOP = { id: 7054, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    ABYSSAL_BLUDGEON_SLASH = { id: 7054, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    ABYSSAL_BLUDGEON_SMASH = { id: 7054, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    ABYSSAL_BLUDGEON_BLOCK = { id: 7054, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    SHORTBOW_ACCURATE = { id: 426, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    SHORTBOW_RAPID = { id: 426, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    SHORTBOW_LONGRANGE = { id: 426, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    LONGBOW_ACCURATE = { id: 426, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    LONGBOW_RAPID = { id: 426, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    LONGBOW_LONGRANGE = { id: 426, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    DAGGER_STAB = { id: 400, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE },
    DAGGER_LUNGE = { id: 400, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    DAGGER_SLASH = { id: 400, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    DAGGER_BLOCK = { id: 400, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE },
    DRAGON_DAGGER_STAB = { id: 376, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE },
    DRAGON_DAGGER_LUNGE = { id: 376, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    DRAGON_DAGGER_SLASH = { id: 377, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    DRAGON_DAGGER_BLOCK = { id: 376, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE },
    SWORD_STAB = { id: 412, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE },
    SWORD_LUNGE = { id: 412, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    SWORD_SLASH = { id: 390, animation: 43, style: 2, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    SWORD_BLOCK = { id: 412, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE },
    SCIMITAR_CHOP = { id: 390, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    SCIMITAR_LUNGE = { id: 390, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    SCIMITAR_BLOCK = { id: 390, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    LONGSWORD_CHOP = { id: 390, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    LONGSWORD_SLASH = { id: 390, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    LONGSWORD_LUNGE = { id: 412, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    LONGSWORD_BLOCK = { id: 390, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    MACE_POUND = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    MACE_PUMMEL = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    MACE_SPIKE = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    MACE_BLOCK = { id: 401, animation: 43, style: 3, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    KNIFE_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    KNIFE_RAPID = { id: 806, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    KNIFE_LONGRANGE = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    OBBY_RING_ACCURATE = { id: 2614, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    OBBY_RING_RAPID = { id: 2614, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    OBBY_RING_LONGRANGE = { id: 2614, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    SPEAR_LUNGE = { id: 2080, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    SPEAR_SWIPE = { id: 2081, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.CONTROLLED },
    SPEAR_POUND = { id: 2082, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.CONTROLLED },
    SPEAR_BLOCK = { id: 2080, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE },
    TWOHANDEDSWORD_CHOP = { id: 407, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    TWOHANDEDSWORD_SLASH = { id: 407, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    TWOHANDEDSWORD_SMASH = { id: 406, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    TWOHANDEDSWORD_BLOCK = { id: 407, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    GODSWORD_CHOP = { id: 7046, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    GODSWORD_SLASH = { id: 7045, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    GODSWORD_SMASH = { id: 7054, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    GODSWORD_BLOCK = { id: 7055, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    VERACS_FLAIL_POUND = { id: 1658, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    VERACS_FLAIL_PUMMEL = { id: 1658, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    VERACS_FLAIL_SPIKE = { id: 1658, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    VERACS_FLAIL_BLOCK = { id: 1658, animation: 43, style: 3, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    PICKAXE_SPIKE = { id: 401, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE },
    PICKAXE_IMPALE = { id: 401, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    PICKAXE_SMASH = { id: 401, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    PICKAXE_BLOCK = { id: 400, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE },
    CLAWS_CHOP = { id: 393, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE },
    CLAWS_SLASH = { id: 393, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    CLAWS_LUNGE = { id: 393, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    CLAWS_BLOCK = { id: 393, animation: 43, style: 3, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE },
    HALBERD_JAB = { id: 440, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.CONTROLLED },
    HALBERD_SWIPE = { id: 440, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.AGGRESSIVE },
    HALBERD_FEND = { id: 440, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE },
    UNARMED_PUNCH = { id: 422, animation: 43, style: 0, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.ACCURATE },
    UNARMED_KICK = { id: 423, animation: 43, style: 1, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.AGGRESSIVE },
    UNARMED_BLOCK = { id: 422, animation: 43, style: 2, bonus: BonusManager.ATTACK_CRUSH, type: FightStyle.DEFENSIVE },
    WHIP_FLICK = { id: 1658, animation: 43, style: 0, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.ACCURATE, sound: Sound.WEAPON_WHIP },
    WHIP_LASH = { id: 1658, animation: 43, style: 1, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.CONTROLLED, sound: Sound.WEAPON_WHIP },
    WHIP_DEFLECT = { id: 1658, animation: 43, style: 2, bonus: BonusManager.ATTACK_SLASH, type: FightStyle.DEFENSIVE, sound: Sound.WEAPON_WHIP },
    THROWNAXE_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    THROWNAXE_RAPID = { id: 806, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    THROWNAXE_LONGRANGE = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    DART_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    DART_RAPID = { id: 806, animation: 43, style: 1, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    DART_LONGRANGE = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    JAVELIN_ACCURATE = { id: 806, animation: 43, style: 0, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.ACCURATE },
    JAVELIN_RAPID = { id: 806, animation: 43, style: 2, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.AGGRESSIVE },
    JAVELIN_LONGRANGE = { id: 806, animation: 43, style: 3, bonus: BonusManager.ATTACK_RANGE, type: FightStyle.DEFENSIVE },
    GHRAZI_RAPIER_STAB = { id: 8145, animation: 43, style: 0, bonus: BonusManager.ATTACK_STAB, type: FightStyle.ACCURATE },
    GHRAZI_RAPIER_LUNGE = { id: 8145, animation: 43, style: 1, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    GHRAZI_RAPIER_SLASH = { id: 390, animation: 43, style: 2, bonus: BonusManager.ATTACK_STAB, type: FightStyle.AGGRESSIVE },
    GHRAZI_RAPIER_BLOCK = { id: 8145, animation: 43, style: 3, bonus: BonusManager.ATTACK_STAB, type: FightStyle.DEFENSIVE }
}

class FightType {
    private animation: number;
    private attackSound: Sound;
    private parentId: number;
    private childId: number;
    private bonusType: number;
    private style: FightStyle;

    private constructor(animation: number, parentId: number, childId: number, bonusType: number, style: FightStyle, sound: Sound) {
        this.animation = animation;
        this.parentId = parentId;
        this.childId = childId;
        this.bonusType = bonusType;
        this.style = style;
        this.attackSound = sound;
    }

    public getAnimation(): number {
        return this.animation;
    }

    /**
     * Gets the parent config id.
     *
     * @return the parent id.
     */
    public getParentId(): number {
        return this.parentId;
    }

    /**
     * Gets the child config id.
     *
     * @return the child id.
     */
    public getChildId(): number {
        return this.childId;
    }

    /**
     * Gets the bonus type.
     *
     * @return the bonus type.
     */
    public getBonusType(): number {
        return this.bonusType;
    }

    /**
     * Gets the fighting style.
     *
     * @return the fighting style.
     */
    public getStyle(): FightStyle {
        return this.style;
    }

    public getCorrespondingBonus(): number {
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

    public getAttackSound(): Sound {
        return this.attackSound;
    }

}    