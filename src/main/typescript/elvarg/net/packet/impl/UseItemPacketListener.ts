class UseItemPacketListener implements PacketExecutor {
    private static itemOnItem(player: Player, packet: Packet) {
    let usedWithSlot = packet.readUnsignedShort();
    let itemUsedSlot = packet.readUnsignedShortA();
    if (usedWithSlot < 0 || itemUsedSlot < 0 || itemUsedSlot >= player.getInventory().length || usedWithSlot >= player.getInventory().length)
    return;
    let used = player.getInventory()[itemUsedSlot];
    let usedWith = player.getInventory()[usedWithSlot];

    player.getPacketSender().sendInterfaceRemoval();
    player.getSkillManager().stopSkillable();

    //Herblore
    if (Herblore.makeUnfinishedPotion(player, used.getId(), usedWith.getId())
            || Herblore.finishPotion(player, used.getId(), usedWith.getId())
            || Herblore.concatenate(player, used, usedWith)) {
        return;
    }

    //Fletching
    if (Fletching.fletchLog(player, used.getId(), usedWith.getId())
            || Fletching.stringBow(player, used.getId(), usedWith.getId())
            || Fletching.fletchAmmo(player, used.getId(), usedWith.getId())
            || Fletching.fletchCrossbow(player, used.getId(), usedWith.getId())) {
        return;
        }
        if ((used.getId() === DRAGON_DEFENDER || usedWith.getId() === DRAGON_DEFENDER)
        && (used.getId() === AVERNIC_DEFENDER_HILT || usedWith.getId() === AVERNIC_DEFENDER_HILT)) {
        if (player.busy() || CombatFactory.inCombat(player)) {
        player.getPacketSender().sendMessage("You cannot do that right now.");
        return;
        }
        if (player.getInventory().contains(DRAGON_DEFENDER) && player.getInventory().contains(AVERNIC_DEFENDER_HILT)) {
        player.getInventory().delete(DRAGON_DEFENDER, 1).delete(AVERNIC_DEFENDER_HILT, 1).add(AVERNIC_DEFENDER, 1);
        player.getPacketSender().sendMessage("You attach your Avernic hilt onto the Dragon defender..");
        }
        return;
        }
            //Blowpipe reload
    else if (used.getId() === TOXIC_BLOWPIPE || usedWith.getId() === TOXIC_BLOWPIPE) {
        let reload = used.getId() === TOXIC_BLOWPIPE ? usedWith.getId() : used.getId();
        if (reload === ZULRAHS_SCALES) {
            const amount = player.getInventory().getAmount(12934);
            player.incrementBlowpipeScales(amount);
            player.getInventory().delete(ZULRAHS_SCALES, amount);
            player.getPacketSender().sendMessage(`You now have ${player.getBlowpipeScales()} Zulrah scales in your blowpipe.`);
        } else {
            player.getPacketSender().sendMessage("You cannot load the blowpipe with that!");
        }
    }

    private static itemOnNpc(player: Player, packet: Packet) {
        const id = packet.readShortA();
        const index = packet.readShortA();
        const slot = packet.readLEShort();
        if (index < 0 || index > World.getNpcs().capacity()) {
            return;
        }
    
        if (slot < 0 || slot > player.getInventory().getItems().length) {
            return;
        }
    
        let npc = World.getNpcs().get(index);
        if (npc == null) {
            return;
        }
        let item = player.getInventory().getItems()[slot];
        if (item == null || item.getId() !== id) {
            return;
        }
    
        player.getMovementQueue().walkToEntity(npc, () => {
    
            if (NPCInteractionSystem.handleUseItem(player, npc, id, slot)) {
                // Player is using an item on a defined NPC
                return;
            }
    
            switch (id) {
                default:
                    player.getPacketSender().sendMessage("Nothing interesting happens.");
                    break;
            }
        });
    }
    
    private static itemOnObject(player: Player, packet: Packet) {
        let interfaceType = packet.readShort();
        const objectId = packet.readShort();
        const objectY = packet.readLEShortA();
        const itemSlot = packet.readLEShort();
        const objectX = packet.readLEShortA();
        const itemId = packet.readShort();

        if (itemSlot < 0 || itemSlot >= player.getInventory().capacity())
        return;

    const item = player.getInventory().getItems()[itemSlot];

    if (item == null || item.getId() !== itemId)
        return;

    const position = new Location(objectX, objectY, player.getLocation().getZ());

    const object = MapObjects.get(player, objectId, position);

    // Make sure the object actually exists in the region...
    if (object == null) {
        return;
    }

    //Update facing..
    player.setPositionToFace(position);

    //Handle object..

    player.getMovementQueue().walkToObject(object, () => {
        switch (object.getId()) {
            case ObjectIdentifiers.STOVE_4: //Edgeville Stove
            case ObjectIdentifiers.FIRE_5: //Player-made Fire
            case ObjectIdentifiers.FIRE_23: //Barb village fire
                //Handle cooking on objects..
                let cookable = Cookable.getForItem(item.getId());
                if (cookable.isPresent()) {
                    player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to cook?", Arrays.asList(cookable.get().getCookedItem()), (productId, amount) => {
                        player.getSkillManager().startSkillable(new Cooking(object, cookable.get(), amount));
                    }));
                    return;
                }
                //Handle bonfires..
                if (object.getId() == ObjectIdentifiers.FIRE_5) {
                    let log = LightableLog.getForItem(item.getId());
                    if (log.isPresent()) {
                        player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to burn?", Arrays.asList(log.get().getLogId()), (productId, amount) => {
                            player.getSkillManager().startSkillable(new Firemaking(log.get(), object, amount));
                        }));
                        return;
                    }
                }
                break;
            case ObjectIdentifiers.WEB:
                if (!WebHandler.isSharpItem(item)) {
                    player.sendMessage("Only a sharp blade can cut through this sticky web.");
                    return;
                }
                WebHandler.handleSlashWeb(player, object, true);
                break;
            case 409: //Bone on Altar
                let b = BuriableBone.forId(item.getId());
                if (b.isPresent()) {
                    player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to offer?", Arrays.asList(itemId), (productId, amount) => {
                        player.getSkillManager().startSkillable(new  AltarOffering(b.get(), object, amount));
                    }));
                }
                break;
            default:
                player.getPacketSender().sendMessage("Nothing interesting happens.");
                break;
        }
        if (Bank.useItemOnDepositBox(player, item, itemSlot, object)) {
            return;
        }

        if (CastleWars.handleItemOnObject(player, item, object)) {
            return;
        }
    });
}

private static itemOnPlayer(player: Player, packet: Packet) {
    let interfaceId = packet.readUnsignedShortA();
    let targetIndex = packet.readUnsignedShort();
    let itemId = packet.readUnsignedShort();
    let slot = packet.readLEShort();
    if (slot < 0 || slot >= player.getInventory().capacity() || targetIndex >= World.getPlayers().capacity())
    return;
    let target = World.getPlayers().get(targetIndex);
    if (target == null) {
    return;
    }
    let item = player.getInventory().get(slot);

    if (item == null || !player.getInventory().contains(itemId)) {
        return;
    }

    player.getMovementQueue().walkToEntity(target, () => {

        if (CastleWars.handleItemOnPlayer(player, target, item)) {
            return;
        }
        switch (itemId) {
            /** For future actions.. **/
            case 995: {
                player.getPacketSender().sendMessage("Perhaps I should trade this item instead..");
                break;
            }
        }

    });

}
private static itemOnGroundItem(player: Player, packet: Packet) {
    let interfaceId = packet.readLEShort();
    let inventory_item = packet.readShortA();
    let ground_item_id = packet.readShort();
    let y = packet.readShortA();
    let unknown = packet.readLEShortA();
    let x = packet.readShort();
    //Verify item..
    if (!player.getInventory().contains(inventory_item)) {
    return;
    }
        //Verify ground item..
        let groundItem = ItemOnGroundManager.getGroundItem(Optional.of(player.getUsername()), ground_item_id, new Location(x, y));

        if (!groundItem) {
            return;
        }
    
        let item_position = groundItem.getPosition();
    
        player.getMovementQueue().walkToGroundItem(item_position, () => {
    
            player.setPositionToFace(groundItem.getPosition());
            //Handle used item..
            switch (inventory_item) {
                case TINDERBOX: //Lighting a fire..
                    let log = LightableLog.getForItem(ground_item_id);
                    if (log) {
                        player.getSkillManager().startSkillable(new Firemaking(log, groundItem));
                        return;
                    }
                    break;
            }
        });
    }
    
    public execute(player: Player, packet: Packet) {
        if (player.getHitpoints() <= 0)
        return;
    switch (packet.getOpcode()) {
        case PacketConstants.ITEM_ON_ITEM:
            itemOnItem(player, packet);
            break;
        case PacketConstants.ITEM_ON_OBJECT:
            itemOnObject(player, packet);
            break;
        case PacketConstants.ITEM_ON_GROUND_ITEM:
            itemOnGroundItem(player, packet);
            break;
        case PacketConstants.ITEM_ON_NPC:
            itemOnNpc(player, packet);
            break;
        case PacketConstants.ITEM_ON_PLAYER:
            itemOnPlayer(player, packet);
            break;
    }
    }
}
