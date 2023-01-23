class OptionDialogue extends Dialogue {
    private static readonly CHATBOX_INTERFACES = [13760, 2461, 2471, 2482, 2494];
    private action: DialogueOptionAction;
    private title: string;
    private options: string[];

    constructor(index: number, title: string, action: DialogueOptionAction, ...options: string[]) {
        super(index);
        this.title = title;
        this.action = action;
        this.options = options;
    }

    constructor(index: number, action: DialogueOptionAction, ...options: string[]) {
        this(index, "Choose an Option", action, ...options);
    }

    public execute(option: DialogueOption): void {
        if (this.action == null) {
            return;
        }
        this.action.executeOption(option);
    }

    public send(player: Player): void {
        OptionDialogue.send(player, this.title, this.options);
    }

    public static send(player: Player, title: string, options: string[]): void {
        const firstChildId = OptionDialogue.CHATBOX_INTERFACES[options.length - 1];
        player.getPacketSender().sendString(firstChildId - 1, title);
        for (let i = 0; i < options.length; i++) {
            player.getPacketSender().sendString(firstChildId + i, options[i]);
        }
        player.getPacketSender().sendChatboxInterface(firstChildId - 2);
    }
}