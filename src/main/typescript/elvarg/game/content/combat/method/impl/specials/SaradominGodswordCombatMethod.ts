import { MeleeCombatMethod } from "../MeleeCombatMethod";
import { Animation } from "../../../../../model/Animation";
import { Graphic } from "../../../../../model/Graphic";
import { Priority } from "../../../../../model/Priority";
import { Mobile } from "../../../../../entity/impl/Mobile";
import { CombatSpecial } from "../../../CombatSpecial";
import { PendingHit } from "../../../hit/PendingHit";
import { Skills } from "../../../../../model/Skill";

export class SaradominGodswordCombatMethod extends MeleeCombatMethod {
    private static ANIMATION = new Animation(7640, Priority.HIGH);
    private static GRAPHIC = new Graphic(1209, Priority.HIGH);

    start(character: Mobile, target: Mobile) {
        CombatSpecial.drain(character, CombatSpecial.SARADOMIN_GODSWORD.getDrainAmount());
        character.performAnimation(SaradominGodswordCombatMethod.ANIMATION);
        character.performGraphic(SaradominGodswordCombatMethod.GRAPHIC);
    }

    handleAfterHitEffects(hit: PendingHit) {
        const player = hit.getAttacker().getAsPlayer();
        const damage = hit.getTotalDamage();
        const damageHeal = Math.floor(damage * 0.5);
        const damagePrayerHeal = Math.floor(damage * 0.25);
        if (player.getSkillManager().getCurrentLevel(Skills.HITPOINTS) < player.getSkillManager().getMaxLevel(Skill.HITPOINTS)) {
            const level = player.getSkillManager().getCurrentLevel(Skills.HITPOINTS) + damageHeal > player.getSkillManager().getMaxLevel(Skill.HITPOINTS)
                ? player.getSkillManager().getMaxLevel(Skills.HITPOINTS)
                : player.getSkillManager().getCurrentLevel(Skills.HITPOINTS) + damageHeal;
            player.getSkillManager().setCurrentLevel(Skills.HITPOINTS, level);
        }
        if (player.getSkillManager().getCurrentLevel(Skills.PRAYER) < player.getSkillManager().getMaxLevel(Skill.PRAYER)) {
            const level = player.getSkillManager().getCurrentLevel(Skills.PRAYER) + damagePrayerHeal > player.getSkillManager().getMaxLevel(Skill.PRAYER) ? player.getSkillManager().getMaxLevel(Skill.PRAYER)
                : player.getSkillManager().getCurrentLevel(Skills.PRAYER) + damagePrayerHeal;
            player.getSkillManager().setCurrentLevel(Skills.PRAYER, level);
        }
    }
}
