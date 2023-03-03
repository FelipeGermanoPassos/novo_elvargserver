import { CombatNormalSpell } from "./CombatNormalSpell";
export class CombatSpells {
    public static readonly WIND_STRIKE = new CombatNormalSpell() {
        castAnimation() {
            return Optional.of(new Animation(711));
        }
        castProjectile(cast: Mobile, castOn: Mobile): Optional < Projectile > {
            return Optional.of(new Projectile(cast, castOn, 91, 0, 20, 43, 31));
        }

        endGraphic(): Optional < Graphic > {
            return Optional.of(new Graphic(92, GraphicHeight.HIGH));
        }

        maximumHit(): number {
            return 2;
        }

        startGraphic(): Optional < Graphic > {
            return Optional.of(new Graphic(90, GraphicHeight.HIGH));
        }

        baseExperience(): number {
            return 5;
        }

        equipmentRequired(player: Player): Optional < Item[] > {
            return Optional.empty();
        }

        itemsRequired(player: Player): Optional < Item[] > {
            return Optional.of(new Item[] { new Item(556), new Item(558) });
        }

        levelRequired(): number {
            return 1;
        }
    }   
}