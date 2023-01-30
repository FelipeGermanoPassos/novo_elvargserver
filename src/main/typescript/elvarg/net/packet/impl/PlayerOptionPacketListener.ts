import { Player } from './Player';
import { World } from './World';
import { Packet } from './Packet';

export class PlayerOptionPacketListener {
    public static attack(player: Player, packet: Packet) {
        let index: number = packet.readLEShort();
        if (index > World.getPlayers().capacity() || index < 0)
            return;
        const attacked: Player = World.getPlayers().get(index);
    
        if (attacked == null || attacked.getHitpoints() <= 0 || attacked.equals(player)) {
            player.getMovementQueue().reset();
            return;
        }
    
        if (player.getRights() === PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("AttacKInfo "+attacked.getLocation().toString() + " " + player.getLocation().getDistance(attacked.getLocation()));
        }
    
        player.getCombat().attack(attacked);
    }
    
    /**
     * Manages the first option click on a player option menu.
     *
     * @param player The player clicking the other entity.
     * @param packet The packet to read values from.
     */
    public static option1(player: Player, packet: Packet) {
        let id: number = packet.readShort() & 0xFFFF;
        if (id < 0 || id > World.getPlayers().capacity())
            return;
        let player2: Player = World.getPlayers().get(id);
        if (player2 == null)
            return;
        player.getMovementQueue().walkToEntity(player2, () => {
            if (player.getArea() != null) {
                player.getArea().onPlayerRightClick(player, player2, 1);
            }
        });
    }
    
    /**
     * Manages the second option click on a player option menu.
     *
     * @param player The player clicking the other entity.
     * @param packet The packet to read values from.
     */
    public static option2(player: Player, packet: Packet) {
        let id: number = packet.readShort() & 0xFFFF;
        if (id < 0 || id > World.getPlayers().capacity())
            return;
        let player2: Player = World.getPlayers().get(id);
        if (player2 == null)
            return;
        player.getMovementQueue().walkToEntity(player2, () => {
                if (player.getArea() != null) {
                    player.getArea().onPlayerRightClick(player, player2, 2);
                }
        });
    }

    private static option3(player: Player, packet: Packet) {
        let id = packet.readLEShortA() & 0xFFFF;
        if (id < 0 || id > World.getPlayers().capacity())
            return;
        let player2 = World.getPlayers().get(id);
        if (player2 == null)
            return;
        player.getMovementQueue().walkToEntity(player2, () => {
                if (player.getArea() != null) {
                    player.getArea().onPlayerRightClick(player, player2, 3);
                }
        });
    }

    execute(player: Player, packet: Packet) {

        if (player == null || player.getHitpoints() <= 0) {
            return;
        }

        if (player.busy()) {
            return;
        }

        switch (packet.getOpcode()) {
            case PacketConstants.ATTACK_PLAYER_OPCODE:
                this.attack(player, packet);
                break;
            case PacketConstants.PLAYER_OPTION_1_OPCODE:
                this.option1(player, packet);
                break;
                case PacketConstants.PLAYER_OPTION_2_OPCODE:
                    option2(player, packet);
                    break;
                case PacketConstants.PLAYER_OPTION_3_OPCODE:
                    option3(player, packet);
                    break;
            }
        }
    }
    