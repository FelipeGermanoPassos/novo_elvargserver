class InterfaceActionClickOpcode implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let interfaceId = packet.readInt();
        let action = packet.readByte();

        if (player == null || player.getHitpoints() <= 0
            || player.isTeleporting()) {
            return;
        }

        if (Bank.handleButton(player, interfaceId, action)) {
            return;
        }

        if (ClanChatManager.handleButton(player, interfaceId, action)) {
            return;
        }

        if (Presetables.handleButton(player, interfaceId)) {
            return;
        }

        if (TeleportHandler.handleButton(player, interfaceId, action)) {
            return;
        }
    }
}
