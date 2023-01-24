class OptionsDialogue extends Dialogue {
    private static CHATBOX_INTERFACES = [13760, 2461, 2471, 2482, 2494];
    private title: string;
    private optionsMap: LinkedHashMap<string, DialogueOptionsAction>;

    constructor(index: number, title: string, optionsMap: LinkedHashMap<string, DialogueOptionsAction>) {
        super(index);
        this.title = title;
        this.optionsMap = optionsMap;
    }

    constructor(index: number, optionsMap: LinkedHashMap<string, DialogueOptionsAction>) {
        this(index, "Choose an Option", optionsMap);
    }

    execute(optionIndex: number, player: Player) {
        if (optionsMap == null || player == null) {
            return;
        }

        this.getDialogueActionByIndex(optionIndex).execute(player);
    }

    getDialogueActionByIndex(index: number) {
        return this.optionsMap.get((this.optionsMap.keySet().toArray())[index]);
    }

    send(player: Player) {
        OptionsDialogue.send(player, this.title, this.optionsMap.keySet().toArray(new string[0]));
    }

    static send(player: Player, title: string, options: string[]) {
        let firstChildId = CHATBOX_INTERFACES[options.length - 1];
        player.getPacketSender().sendString(firstChildId - 1, title);
        for (let i = 0; i < options.length; i++) {
            player.getPacketSender().sendString(firstChildId + i, options[i]);
        }
        player.getPacketSender().sendChatboxInterface(firstChildId - 2);
    }
}