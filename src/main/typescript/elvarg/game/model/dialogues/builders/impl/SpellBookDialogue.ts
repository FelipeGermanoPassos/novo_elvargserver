import { DynamicDialogueBuilder } from "../DynamicDialogueBuilder";
import { OptionDialogue } from "../../entries/impl/OptionDialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOption } from "../../DialogueOption";
import { MagicSpellbook } from "../../../MagicSpellbook";

export class SpellBookDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        this.add(new OptionDialogue(0, (option: number) => {
            switch (option) {
                case DialogueOption.FIRST_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook.changeSpellbook(player, MagicSpellbook.NORMAL);
                    break;
                case DialogueOption.SECOND_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook.changeSpellbook(player, MagicSpellbook.ANCIENT);
                    break;
                case DialogueOption.THIRD_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook.changeSpellbook(player, MagicSpellbook.LUNAR);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }, "Normal", "Ancient", "Lunar"));

    }
}