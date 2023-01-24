import { GameConstants, World, Location, TaskManager } from "com.elvarg.game"
import { Player, ItemOnGround, State, OperationType, GroundItemRespawnTask } from "com.elvarg.game.entity.impl.grounditem"
import { Item } from "com.elvarg.game.model"
import { Optional } from "java.util"

class ItemOnGroundManager {
    public static readonly STATE_UPDATE_DELAY: number = 50

    public static onRegionChange(player: Player): void {
        for (let item of World.getItems()) {
            ItemOnGroundManager.perform(player, item, OperationType.CREATE)
        }
    }

    public static process(): void {
        for (let item of World.getItems()) {
            item.process()
            if (item.isPendingRemoval()) {
                if (item.respawns()) {
                    TaskManager.submit(new GroundItemRespawnTask(item, item.getRespawnTimer()))
                }
                World.getItems().delete(item)
            }
        }
    }

    public static perform(item: ItemOnGround, type: OperationType): void {
        switch (item.getState()) {
            case State.SEEN_BY_PLAYER:
                if (item.getOwner().isPresent()) {
                    let owner = World.getPlayerByName(item.getOwner().get())
                    owner.ifPresent(o => ItemOnGroundManager.perform(o, item, type))
                }
                break;
            case State.SEEN_BY_EVERYONE:
                for (let player of World.getPlayers()) {
                    if (player) {
                        ItemOnGroundManager.perform(player, item, type)
                    }
                }
                break;
            default:
                break;
        }
    }
    public static perform(player: Player, item: ItemOnGround, type: OperationType): void {
        if (item.isPendingRemoval()) {
            type = OperationType.DELETE;
        }
        if (item.getPosition().getZ() != player.getLocation().getZ())
            return;
        if (player.getPrivateArea() != item.getPrivateArea()) {
            return;
        }
        if (item.getPosition().getDistance(player.getLocation()) > 64)
            return;
        switch (type) {
            case OperationType.ALTER:
                player.getPacketSender().alterGroundItem(item);
                break;
            case OperationType.DELETE:
                player.getPacketSender().deleteGroundItem(item);
                break;
            case OperationType.CREATE:
                if (!ItemOnGroundManager.isOwner(player.getUsername(), item)) {
                    if (item.getState() == State.SEEN_BY_PLAYER)
                        return;
                    if (!item.getItem().getDefinition().isTradeable() || !item.getItem().getDefinition().isDropable())
                        return;
                }
                player.getPacketSender().createGroundItem(item);
                break;
            default:
                throw new Error(
                    "Unsupported operation (" + type.toString() + ") on: " + item.toString());
        }
    }
    public static register(item: ItemOnGround) {
        // No point spamming with spawned items...
        let spawnable = GameConstants.ALLOWED_SPAWNS.includes(item.getItem().getId());
        if (spawnable) {
            return;
        }

        // Check for merge with existing stackables..
        if (item.getItem().getDefinition().isStackable()) {
            if (this.merge(item)) {
                return;
            }
        }

        // We didn't need to modify a previous item.
        // Simply register the given item to the world..
        World.getItems().add(item);
        ItemOnGroundManager.perform(item, OperationType.CREATE);
    }

    public static merge(item: ItemOnGround): boolean {
        let iterator = World.getItems().iterator();
        for (let item_ of iterator) {
            if (item_ == null || item_.isPendingRemoval() || item_ === item) {
                continue;
            }
            if (!item_.getPosition().equals(item.getPosition())) {
                continue;
            }

            // Check if the ground item is private...
            // If we aren't the owner, we shouldn't modify it.
            if (item_.getState() === State.SEEN_BY_PLAYER) {
                let flag = true;
                if (item_.getOwner().isPresent() && item.getOwner().isPresent()) {
                    if (item_.getOwner().get() === item.getOwner().get()) {
                        flag = false;
                    }
                }
                if (flag) {
                    continue;
                }
            }

            // Modify the existing item.
            if (item_.getItem().getId() === item.getItem().getId()) {
                let oldAmount = item_.getItem().getAmount();
                item_.getItem().incrementAmountBy(item.getItem().getAmount());
                item_.setOldAmount(oldAmount);
                item_.setTick(0);
                ItemOnGroundManager.perform(item_, OperationType.ALTER);
                return true;
            }
        }
        return false;
    }
    public static deregister(item: ItemOnGround) {
        item.setPendingRemoval(true);
        ItemOnGroundManager.perform(item, OperationType.DELETE);
    }

    public static register(player: Player, item: Item): ItemOnGround {
        return this.register(player, item, player.getLocation().clone());
    }

    public static register(player: Player, item: Item, position: Location): ItemOnGround {
        let i = new ItemOnGround(State.SEEN_BY_PLAYER, Optional.of(player.getUsername()), position, item, true,
            -1, player.getPrivateArea());
        this.register(i);
        return i;
    }

    public static registerNonGlobal(player: Player, item: Item) {
        this.registerNonGlobal(player, item, player.getLocation().clone());
    }

    public static registerNonGlobal(player: Player, item: Item, position: Location) {
        this.register(new ItemOnGround(State.SEEN_BY_PLAYER, Optional.of(player.getUsername()), position, item, false, -1, player.getPrivateArea()));
    }

    public static registerGlobal(player: Player, item: Item) {
        this.register(new ItemOnGround(State.SEEN_BY_EVERYONE, Optional.of(player.getUsername()), player.getLocation().clone(), item, false, -1, player.getPrivateArea()));
    }

    public static getGroundItem(owner: Optional<string>, id: number, position: Location): Optional<ItemOnGround> {
        let iterator = World.getItems().iterator();
        for (let item of iterator) {
            if (item == null || item.isPendingRemoval()) {
                continue;
            }
            if (item.getState() === State.SEEN_BY_PLAYER) {
                if (!owner.isPresent() || !this.isOwner(owner.get(), item)) {
                    continue;
                }
            }
            if (id !== item.getItem().getId()) {
                continue;
            }
            if (!item.getPosition().equals(position)) {
                continue;
            }
            return Optional.of(item);
        }
        return Optional.empty();
    }

    public static exists(item: ItemOnGround): boolean {
        return this.getGroundItem(item.getOwner(), item.getItem().getId(), item.getPosition()).isPresent();
    }

    private static isOwner(username: string, item: ItemOnGround): boolean {
        if (!item.getOwner().isPresent()) {
            return item.getOwner().get() === username;
        }
        return false;
    }

    export enum  OperationType {
        CREATE, DELETE, ALTER
    }
}