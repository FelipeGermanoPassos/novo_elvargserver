import { DynamicDialogueBuilder } from "../DynamicDialogueBuilder";
import { OptionDialogue } from "../../entries/impl/OptionDialogue";
import { NpcIdentifiers } from "../../../../../util/NpcIdentifiers";
import { ActionDialogue } from "../../entries/impl/ActionDialogue";
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOption } from "../../DialogueOption";
import { BrokenItem } from "../../../BrokenItem";
export class ParduDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        let allBrokenItemCost = BrokenItem.getRepairCost(player);
        if (allBrokenItemCost == 0) {
            this.add(new NpcDialogue(0, NpcIdentifiers.PERDU, "Hello! Seems like you have no broken items.", player.getDialogueManager().startDialog(this, 3)));
            return;
        }
        this.add(new NpcDialogue(0, NpcIdentifiers.PERDU, "Hello would you like that I fix all your broken item for " +allBrokenItemCost+" blood money?", player.getDialogueManager().startDialog(this, 3)));

        this.add(new OptionDialogue(1, (option: number) => {
            switch (option) {
            case DialogueOption.FIRST_OPTION:
                player.getDialogueManager().startDialogue(2);
                break;
            default:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            }
        }, "Yes Please", "No, thanks..."));

        this.add(new ActionDialogue(2, () => {
            let isSuccess = BrokenItem.repair(player);
            if (isSuccess) {
                this.add(new NpcDialogue(3, NpcIdentifiers.PERDU, "All items repaired!", player.getDialogueManager().startDialog(this, 3)));
                player.getDialogueManager().startDialog(this, 3);
            } else {
                this.add(new NpcDialogue(3, NpcIdentifiers.PERDU, "You dont have enough blood money for me to fix your items...", player.getDialogueManager().startDialog(this, 3)));
                player.getDialogueManager().startDialog(this, 3);
            }
        }));
    }
}