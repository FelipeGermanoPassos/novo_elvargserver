class ItemActionPacketListener implements PacketExecutor {
    execute(player: Player, packet: Packet) {
    let interfaceId = packet.readUnsignedShort();
    let itemId = packet.readShort();
    let slot = packet.readShort();

    if (slot < 0 || slot > player.getInventory().capacity()) {
        return;
    }
    if (player.getInventory().getItems()[slot].getId() != itemId) {
        return;
    }

    if (player.isTeleporting() || player.getHitpoints() <= 0) {
        return;
    }

    player.getPacketSender().sendInterfaceRemoval();

    // Herblore
    if (Herblore.cleanHerb(player, itemId)) {
        return;
    }

    if (itemId == Barricades.ITEM_ID && Barricades.canSetup(player)) {
        return;
    }

    // Prayer
    if (Prayer.buryBone(player, itemId)) {
        return;
    }

    // Eating food..
    if (Food.consume(player, itemId, slot)) {
        return;
    }

    // Drinking potions..
    if (PotionConsumable.drink(player, itemId, slot)) {
        return;
    }

    // Runecrafting pouches..
    if (Runecrafting.handlePouch(player, itemId, 1)) {
        return;
    }

    // Teleport tablets..
    if (TeleportTablets.init(player, itemId)) {
        return;
    }

    switch (itemId) {
        case ItemIdentifiers.BIRD_NEST:
        case ItemIdentifiers.BIRD_NEST_2:
        case ItemIdentifiers.BIRD_NEST_3:
        case ItemIdentifiers.BIRD_NEST_4:
        case ItemIdentifiers.BIRD_NEST_5:
            handleSearchNest(player, itemId);
            break;
    case ItemIdentifiers.SPADE:
        player.performAnimation(new Animation(830));
        TaskManager.submit(new Task(1, player, false) {
            protected execute() {
                if (!player.isTeleporting()) {
                    Barrows.dig(player);
                }
                this.stop();
            }
        });
        break;
    case Gambling.MITHRIL_SEEDS:
        Gambling.plantFlower(player);
        break;
    case 9520:
        if (!(player.getArea() instanceof WildernessArea)) {
            if (player.getSpecialPercentage() < 100) {
                player.getPacketSender().sendInterfaceRemoval();
                player.performAnimation(new Animation(829));
                player.getInventory().delete(9520, 1);
                player.setSpecialPercentage(100);
                CombatSpecial.updateBar(player);
                player.getPacketSender().sendMessage("You now have 100% special attack energy.");
            } else {
                player.getPacketSender().sendMessage("You already have full special attack energy!");
            }
        } else {
            player.getPacketSender().sendMessage("You cannot use this in the Wilderness!");
        }
        break;
    case ItemIdentifiers.TELEPORT_TO_HOUSE:
        if (TeleportHandler.checkReqs(player, GameConstants.DEFAULT_LOCATION)) {
            TeleportHandler.teleport(player, GameConstants.DEFAULT_LOCATION, TeleportType.TELE_TAB, false);
            player.getInventory().delete(ItemIdentifiers.TELEPORT_TO_HOUSE, 1);
        }
        break;

    case 2542:
		case 2543:
		case 2544:
			if (player.busy()) {
				player.getPacketSender().sendMessage("You cannot do that right now.");
				return;
			}
			if (itemId == 2542 && player.isPreserveUnlocked() || itemId == 2543 && player.isRigourUnlocked()
					|| itemId == 2544 && player.isAuguryUnlocked()) {
				player.getPacketSender().sendMessage("You have already unlocked that prayer.");
				return;
			}

            break;
            case 2545:
                if (player.busy()) {
                    player.getPacketSender().sendMessage("You cannot do that right now.");
                    return;
                }
                if (player.isTargetTeleportUnlocked()) {
                    player.getPacketSender().sendMessage("You have already unlocked that teleport.");
                    return;
                }
                break;
		case 12873:
		case 12875:
		case 12879:
		case 12881:
		case 12883:
		case 12877:
			BarrowsSet set = BarrowsSet.get(itemId);
			if (set != null) {
				if (!player.getInventory().contains(set.getSetId())) {
					return;
				}
				if ((player.getInventory().getFreeSlots() - 1) < set.getItems().length) {
					player.getPacketSender().sendMessage(
							"You need at least " + set.getItems().length + " free inventory slots to do that.");
					return;
				}
				player.getInventory().delete(set.getSetId(), 1);
				for (int item : set.getItems()) {
					player.getInventory().add(item, 1);
				}
				player.getPacketSender()
						.sendMessage("You've opened your " + ItemDefinition.forId(itemId).getName() + ".");
			}
			break;
		}
    }

    static secondAction(player: Player, packet: Packet) {
        let interfaceId = packet.readLEShortA();
        let slot = packet.readLEShort();
        let itemId = packet.readShortA();
        if (slot < 0 || slot >= player.getInventory().capacity()) return;
        if (player.getInventory().getItems()[slot].getId() != itemId) return;
        
        if (Runecrafting.handleTalisman(player, itemId)) {
            return;
        }
        if (Runecrafting.handlePouch(player, itemId, 2)) {
            return;
        }
        
        switch (itemId) {
            case 2550:
                /*player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        player.getPacketSender().sendInterfaceRemoval();
                        if (option == 1) {
                            if (player.getInventory().contains(2550)) {
                                player.getInventory().delete(2550, 1);
                                player.setRecoilDamage(0);
                                player.getPacketSender().sendMessage("Your Ring of recoil has degraded.");
                            }
                        }
                    }
                });
                player.setDialogue(DialogueManager.getDialogues().get(10)); // Yes / no option
                DialogueManager.sendStatement(player,
                        "You still have " + (40 - player.getRecoilDamage()) + " damage before it breaks. Continue?");*/
                break;
        }
    }
    
    public thirdClickAction(player: Player, packet: Packet) {
        let itemId = packet.readShortA();
        let slot = packet.readLEShortA();
        let interfaceId = packet.readLEShortA();
        if (slot < 0 || slot >= player.getInventory().capacity())
            return;
        if (player.getInventory().getItems()[slot].getId() != itemId)
            return;
    
        if (BarrowsSet.pack(player, itemId)) {
            return;
        }
        if (Runecrafting.handlePouch(player, itemId, 3)) {
            return;
        }
    
        switch (itemId) {
            case 12926:
                player.getPacketSender().sendMessage("Your Toxic blowpipe has " + player.getBlowpipeScales() + " Zulrah scales left.");
                break;
        }
    }
    public execute(player: Player, packet: Packet) {
        if (player == null || player.getHitpoints() <= 0)
            return;
        switch (packet.getOpcode()) {
            case PacketConstants.SECOND_ITEM_ACTION_OPCODE:
                this.secondAction(player, packet);
                break;
            case PacketConstants.FIRST_ITEM_ACTION_OPCODE:
                firstAction(player, packet);
                break;
            case PacketConstants.THIRD_ITEM_ACTION_OPCODE:
                thirdClickAction(player, packet);
                break;
            }
        }
}