
import { Player } from '../../../game/entity/impl/player/Player';
import { Packet } from '../Packet';
import { PacketExecutor } from '../PacketExecutor';
import { ItemOnGroundManager } from '../../../game/entity/impl/grounditem/ItemOnGroundManager';
import { Optional } from 'optional'

export class SecondGroundItemOptionPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
    const y = packet.readLEShort();
    const itemId = packet.readShort();
    const x = packet.readLEShort();
    const position = new Location();
    if (!player || player.getHitpoints() <= 0) {
        return;
    }

    player.getSkillManager().stopSkillable();

    if (!player.getLastItemPickup().elapsed())
        return;
    if (player.busy())
        return;

    if (Math.abs(player.getLocation().getX() - x) > 25 || Math.abs(player.getLocation().getY() - y) > 25) {
        player.getMovementQueue().reset();
        return;
    }
    player.getMovementQueue().walkToGroundItem(position, () => {
            const item = ItemOnGroundManager.getGroundItem(Optional.of(player.getUsername()), itemId, position);
            if (item.isPresent()) {
                const log = LightableLog.getForItem(item.get().getItem().getId());
                if (log.isPresent()) {
                    player.getSkillManager().startSkillable(new Firemaking());
                }
            }
    });
}
}