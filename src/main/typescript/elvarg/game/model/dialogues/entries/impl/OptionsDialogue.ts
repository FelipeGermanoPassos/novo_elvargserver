import { Dialogue } from "../Dialogue";
import { Player } from "../../../../entity/impl/player/Player";
import { LinkedHashMap } from 'linkedHashMap'
import { DialogueOptionAction } from ''

class OptionsDialogue extends Dialogue {
    private static CHATBOX_INTERFACES = [13760, 2461, 2471, 2482, 2494];
    private title: string;
    private optionsMap: LinkedHashMap<string, DialogueOptionsAction>;

    constructor(index: number, title: string, optionsMap: LinkedHashMap<string, DialogueOptionsAction>);
    constructor(index: number, optionsMap: LinkedHashMap<string, DialogueOptionsAction>);

    constructor(index: number, titleOrOptionsMap?: string | LinkedHashMap<string, DialogueOptionsAction>, optionsMap?: LinkedHashMap<string, DialogueOptionsAction>) {
        super(index);
        if (typeof titleOrOptionsMap === "string") {
            this.title = titleOrOptionsMap;
            this.optionsMap = optionsMap!;
        } else {
            this.title = "Choose an Option";
            this.optionsMap = titleOrOptionsMap!;
        }
    }

    execute(optionIndex: number, player: Player) {
        if (this.optionsMap == null || player == null) {
            return;
        }

        this.getDialogueActionByIndex(optionIndex).execute(player);
    }

    getDialogueActionByIndex(index: number) {
        return this.optionsMap.get((this.optionsMap.keySet().toArray())[index]);
    }

    send(player: Player) {
        OptionsDialogue.send(player, this.title, this.optionsMap.keySet().toArray(new String[0]));
    }

    static send(player: Player, title: string, options: string[]) {
        let firstChildId = OptionsDialogue.CHATBOX_INTERFACES[options.length - 1];
        player.getPacketSender().sendString(firstChildId - 1, title);
        for (let i = 0; i < options.length; i++) {
            player.getPacketSender().sendString(firstChildId + i, options[i]);
        }
        player.getPacketSender().sendChatboxInterface(firstChildId - 2);
    }
}