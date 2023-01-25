import { Player } from 'com.elvarg.game.entity.impl.player'
import { World } from 'com.elvarg'
import { TaskManager } from 'com.elvarg'

class FollowPlayerPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet): void {
        if (player.busy()) {
            return;
        }
        TaskManager.cancelTasks(player.getIndex());
        const otherPlayersIndex = packet.readLEShort();
        if (otherPlayersIndex < 0 || otherPlayersIndex > World.getPlayers().capacity())
            return;
        const leader = World.getPlayers().get(otherPlayersIndex);
        if (leader == null) {
            return;
        }
        FollowPlayerPacketListener.follow(player, leader);
    }

    public static follow(player: Player, leader: Player) {
        let mobility = player.getMovementQueue().getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(player);
            player.getMovementQueue().reset();
            return;
        }

        player.getMovementQueue().reset();
        player.getMovementQueue().walkToReset();

        player.setFollowing(leader);
        player.setMobileInteraction(leader);

        TaskManager.submit(new Task(1, player.getIndex(), true) {

            protected execute() {
                if (player.getFollowing() == null) {
                    player.setPositionToFace(null);
                    this.stop();
                    return;
                }

                if (leader.isTeleporting() || !leader.getLocation().isWithinDistance(player.getLocation(), 15)) {
                    player.setPositionToFace(null);
                    this.stop();
                    return;
                }
                let destX = leader.getMovementQueue().followX;
                let destY = leader..followY;
                if (Objects.equals(new Location(destX, destY), player.getLocation()) || destX == -1 && destY == -1) {
                    return;
                }
                player.getMovementQueue().reset();
                player.setPositionToFace(leader.getLocation());
                player.setMobileInteraction(leader);
                PathFinder.calculateWalkRoute(player, destX, destY);
            }
        });
    }
}


