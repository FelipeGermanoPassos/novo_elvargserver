class CloseInterfacePacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        player.getPacketSender().sendInterfaceRemoval();
    }
}
