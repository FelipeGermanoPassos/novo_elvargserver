import { DialogueBuilder } from '../../../../model/dialogues/builders/DialogueBuilder'
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { PlayerDialogue } from '../../../../model/dialogues/entries/impl/PlayerDialogue'
import { Player } from '../../../../entity/impl/player/Player';

export class TestStaticDialogue extends DialogueBuilder {
    constructor() {
        super();
        const dialogueExpression = player.getDialogueManager().startDialog(this, 3);
        this.add(
            new PlayerDialogue(0, "Well this works just fine.", dialogueExpression),
            new PlayerDialogue(1, "Second test", dialogueExpression),
            new NpcDialogue(2, 6797, "okay great.", dialogueExpression)
        );
    }
}