import { NPC } from "../../..";
import { CombatMethod, RockCrabCombatMethod } from "../../../content/combat/method";
import { Location } from "../../../model";
import { ROCKS, ROCKS_2, ROCK_CRAB, ROCK_CRAB_2 } from "../../../util/NpcIdentifiers";

@Ids([ROCKS, ROCKS_2])
export class RockCrab extends NPC {
    private static readonly COMBAT_METHOD = new RockCrabCombatMethod();
    public static readonly ROCK_IDS = [ROCKS, ROCKS_2];

    public constructor(id: number, position: Location) {
        super(id, position);
    }

    public isAggressiveTo(player: Player): boolean {
        // Rock crabs always attack players, regardless of combat level
        // Otherwise, there would be no way for Players over combat level 26 to attack them
        return true;
    }

    public aggressionDistance(): number {
        // Rock crabs only attack when Player is right beside them
        return 1;
    }

    public getCombatMethod(): CombatMethod {
        return RockCrab.COMBAT_METHOD;
    }

    public static getTransformationId(rockNpcId: number): number {
        switch (rockNpcId) {
            // Rock is transforming into a Rock Crab
            case ROCKS:
                return ROCK_CRAB;
            case ROCKS_2:
                return ROCK_CRAB_2;
            // Rock Crab is transforming back into a Rock
            case ROCK_CRAB:
                return ROCKS;
            case ROCK_CRAB_2:
                return ROCKS_2;
        }
        return ROCK_CRAB;
    }
}
