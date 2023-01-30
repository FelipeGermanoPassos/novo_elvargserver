class DialoguePacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        player.getDialogueManager().advance();
    }
}
