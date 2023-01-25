import { NPC, NPCInteraction, Player } from "../../..";
import { ParduDialogue } from "../../../model/dialogues/builders/impl";
import { PERDU } from "../../../util/NpcIdentifiers";

@Ids(PERDU)
export class Perdu implements NPCInteraction {
    public firstOptionClick(player: Player, npc: NPC): void {
        player.getDialogueManager().start(new ParduDialogue());
    }

    public secondOptionClick(player: Player, npc: NPC): void {
    }

    public thirdOptionClick(player: Player, npc: NPC): void {
    }

    public forthOptionClick(player: Player, npc: NPC): void {
    }

    public useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void {
    }
}
