class SpecialAttackPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        let specialBarButton = packet.readInt();
    
        if (player.getHitpoints() <= 0) {
            return;
        }
    
        CombatSpecial.activate(player);
    }
}

interface PacketExecutor {
execute(player: Player, packet: Packet): void;
}

interface Player {
getHitpoints(): number;
}

interface Packet {
readInt(): number;
}

interface CombatSpecial {
activate(player: Player): void;
}    