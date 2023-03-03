import { Player } from "../../../game/entity/impl/player/Player";
import { Packet } from "../Packet";
import { PlayerRights } from "../../../game/model/rights/PlayerRights";
import { PacketExecutor } from "../PacketExecutor";
import { ItemOnGroundManager } from "../../../game/entity/impl/grounditem/ItemOnGroundManager";
import { ItemDefinition } from "../../../game/definition/ItemDefinition";
import { Optional } from 'optional'
import { OperationType } from "../../../game/entity/impl/object/ObjectManager";
import { Sound } from "../../../game/Sound";
import { Sounds } from "../../../game/Sounds";

export class PickupItemPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
        const y = packet.readLEShort();
        const itemId = packet.readShort();
        const x = packet.readLEShort();
        const position = new Location();

        if (player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("Pick up item: " + itemId + ". " + position.toString());
        }

        if (player.busy() || !player.getLastItemPickup().elapsed()) {
            // If player is busy or last item was picked up less than 0.3 seconds ago
            return;
        }

        player.getMovementQueue().walkToGroundItem(position, () => takeItem(player, itemId, position));
    }

    private takeItem(player: Player, itemId: number, position: Location) {
        let x = position.getX(), y = position.getY();
    
        if (Math.abs(player.getLocation().getX() - x) > 25 || Math.abs(player.getLocation().getY() - y) > 25) {
            player.getMovementQueue().reset();
            return;
        }
    
        // Check if we can hold it..
        if (!(player.getInventory().getFreeSlots() > 0 || (player.getInventory().getFreeSlots() == 0
                && ItemDefinition.forId(itemId).isStackable() && player.getInventory().contains(itemId)))) {
            player.getInventory().full();
            return;
        }
    
        let item = ItemOnGroundManager.getGroundItem(Optional.of(player.getUsername()), itemId, position);
        let deregister = true;
        if (item.isPresent()) {
            if (player.getInventory().getAmount(item.get().getItem().getId())
                    + item.get().getItem().getAmount() > Number.MAX_SAFE_INTEGER
                    || player.getInventory().getAmount(item.get().getItem().getId())
                    + item.get().getItem().getAmount() <= 0) {
                let playerCanHold = Number.MAX_SAFE_INTEGER
                        - player.getInventory().getAmount(item.get().getItem().getId());
                        if (playerCanHold <= 0) {
                            player.getPacketSender().sendMessage("You cannot hold that more of that item.");
                            return;
                        } else {
                            let currentAmount: number = item.get().getItem().getAmount();
                            item.get().setOldAmount(currentAmount);
                            item.get().getItem().decrementAmountBy(playerCanHold);
                            ItemOnGroundManager.perform(item.get(), OperationType.ALTER);
                            deregister = false;
                        }
                    }
                    if (deregister) {
                        ItemOnGroundManager.deregister(item.get());
                    }
                    player.getInventory().add(item.get().getItem());
                    Sounds.sendSound(player, Sound.PICK_UP_ITEM);
                    player.getLastItemPickup().reset();
                }
            }
    
}
