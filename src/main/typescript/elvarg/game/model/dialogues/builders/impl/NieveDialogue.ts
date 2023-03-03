import { DynamicDialogueBuilder } from "../DynamicDialogueBuilder";
import { OptionDialogue } from "../../entries/impl/OptionDialogue";
import { ActionDialogue } from "../../entries/impl/ActionDialogue";
import { NpcDialogue } from "../../entries/impl/NpcDialogue";
import { EndDialogue } from "../../entries/impl/EndDialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOption } from "../../DialogueOption";
import { Skill } from "../../../Skill";
import { SkillManager } from "../../../../content/skill/SkillManager";
import { Slayer } from "../../../../content/skill/slayer/Slayer";
import { PlayerDialogue } from "../../entries/impl/PlayerDialogue";


class NieveDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        this.add(new NpcDialogue(0, 6797, "'Ello, and what are you after then?", player.getDialogueManager().startDialog(this, 3)));
        this.add(new OptionDialogue(1, (option: DialogueOption) => {
            switch (option) {
            case DialogueOption.FIRST_OPTION:
            player.getDialogueManager().startDialogue(2);
            break;
            case DialogueOption.SECOND_OPTION:
            player.getDialogueManager().startDialogue(8);
            break;
            case DialogueOption.THIRD_OPTION:
            player.getDialogueManager().startDialogue(11);
            break;
            default:
            player.getPacketSender().sendInterfaceRemoval();
            break;
            }
        }, "I need another assignment.", "Have you any rewards for me, or anything to trade?",
        "Tell me about your skill cape, please.", "Er.... Nothing..."));

                this.add(new ActionDialogue(2, () => {
            if (player.getSlayerTask() == null) {
                if (Slayer.assign(player)) {
                    this.add(new NpcDialogue(3, 6797, "You've been assigned to hunt " + player.getSlayerTask().getRemaining()
                            + " " + player.getSlayerTask().getTask().toString() + ", come back when you're done.", player.getDialogueManager().startDialog(this, 3)));
                            this.add(new PlayerDialogue(4, "Okay, thanks.", player.getDialogueManager().startDialog(this, 3)));
                            this.add(new EndDialogue(5));
                    player.getDialogueManager().startDialog(this, 3);
                }
            } else {
                this.add(new NpcDialogue(3, 6797, "You're still hunting " + player.getSlayerTask().getTask().toString() + ". You need to kill " + player.getSlayerTask().getRemaining() + " more, come back when you're done.", player.getDialogueManager().startDialog(this, 3)));
                this.add(new PlayerDialogue(4, "Got any tips for me?", player.getDialogueManager().startDialog(this, 3)));
                this.add(new NpcDialogue(5, 6797, "You should be able to find your task " + player.getSlayerTask().getTask().getHint() + ".", player.getDialogueManager().startDialog(this, 3))); // TODO: Hints
                this.add(new PlayerDialogue(6, "Thanks!", player.getDialogueManager().startDialog(this, 3)));
                this.add(new EndDialogue(7));
                player.getDialogueManager().startDialog(this, 3);
            }
        }));

        this.add(new PlayerDialogue(8, "Have you any rewards for me, or anything to trade?", player.getDialogueManager().startDialog(this, 3)), new NpcDialogue(9, 6797,
                "I have quite a few rewards you can earn, and a wide variety of Slayer equipment for sale.", player.getDialogueManager().startDialog(this, 3)));
                this.add(new OptionDialogue(10, (option: number) => {
            switch (option) {
            case DialogueOption.FIRST_OPTION:
                // TODO: Rewards
                break;
            case DialogueOption.SECOND_OPTION:
                // TODO: Trade
                break;
            default:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            }
        }, "Look at rewards.", "Look at shop.", "Cancel."));

        // Skill cape
        if (player.getSkillManager().getMaxLevel(Skill.SLAYER) == SkillManager.getMaxAchievingLevel(Skill.SLAYER)) {
            this.add(new NpcDialogue(11, 6797, "", player.getDialogueManager().startDialog(this, 3)));
        } else {
            this.add(new NpcDialogue(11, 6797, "", player.getDialogueManager().startDialog(this, 3)));
        }
    }
}
    
