import { CombatSpell } from "./CombatSpell";
import { Mobile } from "../../../entity/impl/Mobile";
import { Animation } from "../../../model/Animation";
import { Graphic } from "../../../model/Graphic";
import { Projectile } from "../../../model/Projectile";
import { Player } from "../../../entity/impl/player/Player";
import { Optional } from 'optional'
import { Item } from "../../../model/Item";

interface CombatNormalSpellOptions {
    spellId: () => number
    maximumHit:() => number 
    castAnimation:() => Animation
    startGraphic:() => Graphic
    castProjectile:(cast: Mobile, castOn: Mobile) => Projectile
    endGraphic:() => Graphic 
    finishCast:(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number) => void
    baseExperience?: () => number
    equipmentRequired?:(player: Player) => Optional<Item>
    itemsRequired?:(player: Player) => Optional<Item>
    levelRequired?:() => number
    spellEffect?:(cast: Mobile, castOn: Mobile) => void 
  }

export class CombatNormalSpell extends CombatSpell {
    constructor(private readonly options: CombatNormalSpellOptions){
        super();
    }

    spellId(): number {
        return this.options.spellId()
    }
    maximumHit(): number {
        return this.options.maximumHit()
    }
    castAnimation(): Animation {
        return this.options.castAnimation()
    }
    startGraphic(): Graphic {
        return this.options.startGraphic()
    }
    castProjectile(cast: Mobile, castOn: Mobile): Projectile {
        return this.options.castProjectile(cast, castOn)
    }
    endGraphic(): Graphic {
        return this.options.endGraphic()
    }

    finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void {
        return this.options.finishCast(cast, castOn, accurate, damage)
    }

    baseExperience(): number {
        if(this.options.baseExperience) {
          return this.options.baseExperience()
        } else {
          return super.baseExperience()
        }
    }

    equipmentRequired(player: Player): Optional<Item> {
        if(this.options.equipmentRequired) {
          return this.options.equipmentRequired(player)
        } else {
          return super.equipmentRequired(player)
        }
    }

    itemsRequired(player: Player): Optional<Item> {
        if(this.options.itemsRequired) {
          return this.options.itemsRequired(player)
        } else {
          return super.itemsRequired(player)
        }
    }

    levelRequired(): number {
        if(this.options.levelRequired) {
          return this.options.levelRequired()
        } else {
          return super.levelRequired()
        }
    }

    spellEffect(cast: Mobile, castOn: Mobile): void {
        if(this.options.spellEffect) {
          return this.options.spellEffect(cast, castOn)
        } else {
          return super.spellEffect(cast, castOn)
        }
    }  

}