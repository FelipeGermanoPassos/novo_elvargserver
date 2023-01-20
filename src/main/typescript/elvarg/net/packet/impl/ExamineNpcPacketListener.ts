class ExamineNpcPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let npcId = packet.readShort();
        
        if (npcId <= 0) {
            return;
        }

        let npcDef = NpcDefinition.forId(npcId);
        if (npcDef != null) {
            player.getPacketSender().sendMessage(npcDef.getExamine());
        }
    }
}
