import { Location } from "com.elvarg.game.model";
import { CombatMethod } from "com.elvarg.game.content.combat.method";
import { BanditCombatMethod } from "com.elvarg.game.content.combat.method.impl.npcs";
import { NPC } from "com.elvarg.game.entity.impl.npc";
import { Player } from "com.elvarg.game.entity.impl.player";
import { Equipment } from "com.elvarg.game.model.container.impl";

const BANDIT = [0];

class Bandit extends NPC {
    private static COMBAT_METHOD: CombatMethod = new BanditCombatMethod();

    constructor(id: number, position: Location) {
        super(id, position);
    }

    public isAggressiveTo(player: Player): boolean {
        // Bandits are only aggressive towards players who have god affiliated items
        const saradominItemCount = Equipment.getItemCount(player, "Saradomin", true);
        const zamorakItemCount = Equipment.getItemCount(player, "Zamorak", true);

        return saradominItemCount > 0 || zamorakItemCount > 0;
    }

    public getCombatMethod(): CombatMethod {
        return Bandit.COMBAT_METHOD;
    }
}