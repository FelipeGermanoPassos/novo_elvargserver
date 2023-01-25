import { NPC } from "com.elvarg.game.entity.impl.npc";
import { Player } from "com.elvarg.game.entity.impl.player";
import { BankerDialogue } from "com.elvarg.game.model.dialogues.builders.impl";
import { NPCInteraction } from "com.elvarg.game.entity.impl.npc";

class Banker implements NPCInteraction {
    firstOptionClick(player: Player, npc: NPC) {
        player.dialogueManager.start(new BankerDialogue());
    }

    secondOptionClick(player: Player, npc: NPC) {
        player.getBank(player.currentBankTab).open();
    }

    thirdOptionClick(player: Player, npc: NPC) { }

    forthOptionClick(player: Player, npc: NPC) { }

    useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number) { }
}