export class DropItemPacketListener implements PacketExecutor {

    public static destroyItemInterface(player: Player, item: Item) {
        player.setDestroyItem(item.getId());
        let info = [            {"Are you sure you want to discard this item?", "14174"}, {"Yes.", "14175"}, {"No.", "14176"},            {"", "14177"}, {"This item will vanish once it hits the floor.", "14182"},            {"You cannot get it back if discarded.", "14183"}, {item.getDefinition().getName(), "14184"}    ];
        player.getPacketSender().sendItemOnInterface(14171, item.getId(), 0, item.getAmount());
        for (let i = 0; i < info.length; i++)
            player.getPacketSender().sendString(parseInt(info[i][1]), info[i][0]);
        player.getPacketSender().sendChatboxInterface(14170);
    }

    export class DropItemPacketListener implements PacketExecutor {
        public execute(player: Player, packet: Packet) {
            let id = packet.readUnsignedShortA();
            let interface_id = packet.readUnsignedShort();
            let itemSlot = packet.readUnsignedShortA();
    
            if (player == null || player.getHitpoints() <= 0) {
                return;
            }
    
            if (interface_id != Inventory.INTERFACE_ID) {
                return;
            }
    
            if (player.getHitpoints() <= 0)
                return;
            
            if (itemSlot < 0 || itemSlot >= player.getInventory().capacity())
                return;
    
            if (player.busy()) {
                player.getPacketSender().sendInterfaceRemoval();
            }
    
            let item = player.getInventory().getItems()[itemSlot];
            if (item == null)
                return;
            if (item.getId() != id || item.getAmount() <= 0) {
                return;
            }
    
            if (player.getRights() == PlayerRights.DEVELOPER) {
                player.getPacketSender().sendMessage("Drop item: " + Integer.toString(item.getId()) + ".");
            }
    
            player.getPacketSender().sendInterfaceRemoval();
    
            // Stop skilling..
            player.getSkillManager().stopSkillable();
    
            // Check if we're dropping a pet..
            if (PetHandler.drop(player, id, false)) {
                Sounds.sendSound(player, Sound.DROP_ITEM);
                return;
            }
    
            if (item.getDefinition().isDropable()) {
                // Items dropped in the Wilderness should go global immediately.
                if (player.getArea() instanceof WildernessArea) {
                    ItemOnGroundManager.registerGlobal(player, item);
                } else {
                    ItemOnGroundManager.register(player, item);
                }
                
                player.getInventory().setItem(itemSlot, new Item(-1, 0)).refreshItems();
    
                Sounds.sendSound(player, Sound.DROP_ITEM);
            } else {
                destroyItemInterface(player, item);
            }
        }
    }
    