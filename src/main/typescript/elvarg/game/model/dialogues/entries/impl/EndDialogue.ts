class EndDialogue extends Dialogue {
    constructor(index: number) {
        super(index);
    }

    public send(player: Player) {
        player.getPacketSender().sendInterfaceRemoval();
    }
}