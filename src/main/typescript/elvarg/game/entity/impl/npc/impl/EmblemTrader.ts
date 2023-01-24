import { NPCInteraction } from 'com.elvarg.game.entity.impl.npc.NPCInteraction';
import { Player } from 'com.elvarg.game.entity.impl.player';
import { ShopManager } from 'com.elvarg.game.model.container.shop';
import { EmblemTraderDialogue } from 'com.elvarg.game.model.dialogues.builders.impl';
import { NPC } from 'com.elvarg.game.entity.impl.npc';
import { ShopIdentifiers } from 'com.elvarg.util';

export class EmblemTrader implements NPCInteraction {

    public firstOptionClick(player: Player, npc: NPC): void {
        player.getDialogueManager().start(new EmblemTraderDialogue());
    }

    public secondOptionClick(player: Player, npc: NPC): void {
        ShopManager.open(player, ShopIdentifiers.PVP_SHOP);
    }

    public thirdOptionClick(player: Player, npc: NPC): void {
        player.getDialogueManager().start(new EmblemTraderDialogue(), 2);
    }

    public forthOptionClick(player: Player, npc: NPC): void {
        player.getDialogueManager().start(new EmblemTraderDialogue(), 5);
    }

    public useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void {

    }
}
