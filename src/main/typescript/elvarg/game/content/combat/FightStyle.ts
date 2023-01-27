import { CombatType } from "./CombatType";
import { Skills } from "../../model/Skill";
export abstract class FightStyle {
    static ACCURATE = new class extends FightStyle {
        skill(type: CombatType) {
            return type === CombatType.RANGED ? [Skills.RANGED] : [Skills.ATTACK];
        }
    }

    static AGGRESSIVE = new class extends FightStyle {
        skill(type: CombatType) {
            return type === CombatType.RANGED ? [Skills.RANGED] : [Skills.STRENGTH];
        }
    }

    static DEFENSIVE = new class extends FightStyle {
        skill(type: CombatType) {
            return type === CombatType.RANGED ? [Skills.RANGED, Skills.DEFENCE] : [Skills.DEFENCE];
        }
    }

    static CONTROLLED = new class extends FightStyle {
        skill() {
            return [Skills.ATTACK, Skills.STRENGTH, Skills.DEFENCE];
        }
    }

    abstract skill(type: CombatType);
}