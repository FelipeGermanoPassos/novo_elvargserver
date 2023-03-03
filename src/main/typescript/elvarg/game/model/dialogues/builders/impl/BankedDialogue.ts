import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { OptionDialogue } from '../../../../model/dialogues/entries/impl/OptionDialogue'
import { Player } from "../../../../entity/impl/player/Player";
import { DynamicDialogueBuilder } from '../../../../model/dialogues/builders/DynamicDialogueBuilder'
import { NpcDialogue } from '../../../../model/dialogues/entries/impl/NpcDialogue'
import { DialogueOption } from "../../DialogueOption";


import com.elvarg.game.model.dialogues.entries.impl.OptionDialogue;



export class BankerDialogue extends DynamicDialogueBuilder {

    build(player: Player) {
        this.add(new NpcDialogue(0, NpcIdentifiers.BANKER, "Hello would you like to open the bank?", player.getDialogueManager().startDialog(this, 3)));

        this.add(new OptionDialogue(1, (option: DialogueOption) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }, "Yes Please", "No, thanks..."));
    }
}