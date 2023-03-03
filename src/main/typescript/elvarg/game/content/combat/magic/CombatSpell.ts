import { Spell } from "./Spell";
import { Mobile } from "../../../entity/impl/Mobile";
import { NPC } from "../../../entity/impl/npc/NPC";
import { Animation } from "../../../model/Animation";
import { TaskManager } from "../../../task/TaskManager";
import { Task } from "../../../task/Task";
import { CombatSpells } from "./CombatSpells";
import { Graphic } from "../../../model/Graphic";
import { Sound } from "../../../Sound";
import { Projectile } from "../../../model/Projectile";
import { PendingHit } from "../hit/PendingHit";
import { CombatAncientSpell } from "./CombatAncientSpell";

export abstract class CombatSpell extends Spell {
    public startCast(cast: Mobile, castOn: Mobile): void {
        let castAnimation = -1;
      
        const npc = cast.isNpc() ? (cast as NPC) : null;
      
        if (this.castAnimation().isPresent() && castAnimation == -1) {
          this.castAnimation().ifPresent(animation => animation.perform(cast));
        } else {
          cast.performAnimation(new Animation(castAnimation));
        }
      
        if (npc !== null) {
          if (
            npc.getId() !== 2000 &&
            npc.getId() !== 109 &&
            npc.getId() !== 3580 &&
            npc.getId() !== 2007
          ) {
            this.startGraphic().ifPresent(graphic => graphic.perform(cast));
          }
        } else {
          this.startGraphic().ifPresent(graphic => graphic.perform(cast));
        }
      
        const projectile = this.castProjectile(cast, castOn);
      
        if (projectile.isPresent()) {
          const g = projectile.get();
      
          TaskManager.submit(new Task(2, cast, false) {
            execute() {
              g.sendProjectile();
              this.stop();
            }
          });
        }
    }

    public getAttackSpeed(): number {
        let speed = 5;
        const spell = this;
        if (spell instanceof CombatAncientSpell) {
        if (spell == CombatSpells.SMOKE_RUSH.getSpell() || spell == CombatSpells.SHADOW_RUSH.getSpell()
        || spell == CombatSpells.BLOOD_RUSH.getSpell() || spell == CombatSpells.ICE_RUSH.getSpell()
        || spell == CombatSpells.SMOKE_BLITZ.getSpell() || spell == CombatSpells.SHADOW_BLITZ.getSpell()
        || spell == CombatSpells.BLOOD_BLITZ.getSpell() || spell == CombatSpells.ICE_BLITZ.getSpell()) {
        speed = 4;
        }
        }
        return speed;
    }

    abstract spellId(): number;
    abstract maximumHit(): number;
    abstract castAnimation(): Animation | undefined;
    abstract startGraphic(): Graphic | undefined;
    abstract castProjectile(cast: Mobile, castOn: Mobile): Projectile | undefined;
    abstract endGraphic(): Graphic | undefined;
    abstract finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void;

    public onHitCalc(hit: PendingHit): void {
        if (!hit.isAccurate()) {
            return;
        }
        this.spellEffectOnHitCalc(hit.getAttacker(), hit.getTarget(), hit.getTotalDamage());
    }
    
    public spellEffectOnHitCalc(cast: Mobile, castOn: Mobile, damage: number): void {}
    
    public impactSound(): Sound {
        return null;
    }

}
