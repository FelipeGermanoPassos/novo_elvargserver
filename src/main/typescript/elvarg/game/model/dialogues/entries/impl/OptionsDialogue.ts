import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { DialogueOptionsAction } from "../../DialogueOptionsAction";

export class OptionsDialogue extends Dialogue {
    private static CHATBOX_INTERFACES = [13760, 2461, 2471, 2482, 2494];
    private title: string;
    private optionsMap: Record<string, DialogueOptionsAction>;

    constructor(
        index: number,
        titleOrOptionsMap?: string | Record<string, DialogueOptionsAction>,
        optionsMap?: Record<string, DialogueOptionsAction>
    ) {
        super(index);

        if (typeof titleOrOptionsMap === "string") {
            this.title = titleOrOptionsMap;
            this.optionsMap = optionsMap || {};
        } else {
            this.title = "Choose an Option";
            this.optionsMap = titleOrOptionsMap || {};
        }
    }

    execute(optionIndex: number, player: Player) {
        if (this.optionsMap == null || player == null) {
            return;
        }

        this.getDialogueActionByIndex(optionIndex).execute(player);
    }

    getDialogueActionByIndex(index: number) {
        const keys = Object.keys(this.optionsMap);
        const key = keys[index];
        return this.optionsMap[key];
    }
      
      send(player: Player) {
        const keys = Object.keys(this.optionsMap);
        OptionsDialogue.send(player, this.title, keys);
    }

    static send(player: Player, title: string, options: string[]) {
        let firstChildId = OptionsDialogue.CHATBOX_INTERFACES[options.length - 1];
        player.getPacketSender().sendString(title, firstChildId - 1,);
        for (let i = 0; i < options.length; i++) {
            player.getPacketSender().sendString(options[i], firstChildId + i);
        }
        player.getPacketSender().sendChatboxInterface(firstChildId - 2);
    }
}