class NpcDialogue extends Dialogue {
    private static readonly CHATBOX_INTERFACES = [4885, 4890, 4896, 4903];
    private npcId: number;
    private text: string;
    private expression: DialogueExpression;

    constructor(index: number, npcId: number, text: string, expression: DialogueExpression) {
        super(index);
        this.npcId = npcId;
        this.text = text;
        this.expression = expression;
    }

    constructor(index: number, npcId: number, text: string) {
        this(index, npcId, text, DialogueExpression.CALM);
    }

    constructor(index: number, npcId: number, text: string, expression: DialogueExpression, continueAction: DialogueAction) {
        this(index, npcId, text, expression);
        this.setContinueAction(continueAction);
    }

    constructor(index: number, npcId: number, text: string, continueAction: DialogueAction) {
        this(index, npcId, text, DialogueExpression.CALM);
        this.setContinueAction(continueAction);
    }

    public send(player: Player): void {
        NpcDialogue.send(player, this.npcId, this.text, this.expression);
    }
    
    public static send(player: Player, npcId: number, text: string, expression: DialogueExpression): void {
        const lines = Misc.wrapText(text, 53);
        let length = lines.length;
        if (length > 5) {
            length = 5;
        }
        const startDialogueChildId = NpcDialogue.CHATBOX_INTERFACES[length - 1];
        const headChildId = startDialogueChildId - 2;
        player.getPacketSender().sendNpcHeadOnInterface(npcId, headChildId);
        player.getPacketSender().sendInterfaceAnimation(headChildId, expression.getExpression());
        player.getPacketSender().sendString(startDialogueChildId - 1,
                NpcDefinition.forId(npcId) != null ? NpcDefinition.forId(npcId).getName().replaceAll("_", " ") : "");
        for (let i = 0; i < length; i++) {
            player.getPacketSender().sendString(startDialogueChildId + i, lines[i]);
        }
        player.getPacketSender().sendChatboxInterface(startDialogueChildId - 3);
    }
}