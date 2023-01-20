class ItemContainerActionPacketListener {
    static firstAction(player: Player, packet: Packet) {
        let containerId = packet.readInt();
        let slot = packet.readShortA();
        let id = packet.readShortA();

        // Bank withdrawal..
        if (containerId >= Bank.CONTAINER_START && containerId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
            Bank.withdraw(player, id, slot, 1, containerId - Bank.CONTAINER_START);
            return;
        }

        if (containerId == 7423) {
            DepositBox.deposit(player, slot, id, 1);
            return;
        }

        switch (containerId) {
            case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
            case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
            case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
            case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
            case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
                if (player.getInterfaceId() == EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
                    EquipmentMaking.initialize(player, id, containerId, slot, 1);
                }
                break;
            // Withdrawing items from duel
            case Dueling.MAIN_INTERFACE_CONTAINER:
                if (player.getStatus() == PlayerStatus.DUELING) {
                    player.getDueling().handleItem(id, 1, slot, player.getDueling().getContainer(), player.getInventory());
                }
                break;

            case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
            if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
                player.getPriceChecker().deposit(id, 1, slot);
            } else if (player.getStatus() == PlayerStatus.TRADING) {
                player.getTrading().handleItem(id, 1, slot, player.getInventory(), player.getTrading().getContainer());
            } else if (player.getStatus() == PlayerStatus.DUELING) {
                player.getDueling().handleItem(id, 1, slot, player.getInventory(), player.getDueling().getContainer());
            }
            break;
        case Trading.CONTAINER_INTERFACE_ID:
            if (player.getStatus() == PlayerStatus.TRADING) {
                player.getTrading().handleItem(id, 1, slot, player.getTrading().getContainer(), player.getInventory());
            }
            break;
        case PriceChecker.CONTAINER_ID:
            player.getPriceChecker().withdraw(id, 1, slot);
            break;

        case Bank.INVENTORY_INTERFACE_ID:
            Bank.deposit(player, id, slot, 1);
            break;

        case Shop.ITEM_CHILD_ID:
        case Shop.INVENTORY_INTERFACE_ID:
            if (player.getStatus() == PlayerStatus.SHOPPING) {
                ShopManager.priceCheck(player, id, slot, (containerId == Shop.ITEM_CHILD_ID));
            }
            break;
            case Equipment.INVENTORY_INTERFACE_ID:
                let item = player.getEquipment().getItems()[slot];
                if (!item || item.getId() !== id) return;
            
                if (player.getArea() && !player.getArea().canUnequipItem(player, slot, item)) {
                    return;
                }
            
                let stackItem = item.getDefinition().isStackable() && player.getInventory().getAmount(item.getId()) > 0;
                let inventorySlot = player.getInventory().getEmptySlot();
                if (inventorySlot !== -1) {
                    player.getEquipment().setItem(slot, new Item(-1, 0));
            
                    if (stackItem) {
                        player.getInventory().add(item.getId(), item.getAmount());
                    } else {
                        player.getInventory().setItem(inventorySlot, item);
                    }
            
                    BonusManager.update(player);
                    if (item.getDefinition().getEquipmentType().getSlot() === Equipment.WEAPON_SLOT) {
                        WeaponInterfaces.assign(player);
                        player.setSpecialActivated(false);
                        CombatSpecial.updateBar(player);
                        if (player.getCombat().getAutocastSpell() != null) {
                            Autocasting.setAutocast(player, null);
                            player.getPacketSender().sendMessage("Autocast spell cleared.");
                        }
                    }
                    player.getEquipment().refreshItems();
                    player.getInventory().refreshItems();
                    player.getUpdateFlag().flag(Flag.APPEARANCE);
                } else {
                    player.getInventory().full();
                }
                break;
            }
        }   
        
        private static void secondAction(Player player, Packet packet) {
            int interfaceId = packet.readInt();
            int id = packet.readLEShortA();
            int slot = packet.readLEShort();
    
            // Bank withdrawal..
            if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
                Bank.withdraw(player, id, slot, 5, interfaceId - Bank.CONTAINER_START);
                return;
            }
    
            if (interfaceId == 7423) {
                DepositBox.deposit(player, slot, id, 5);
                return;
            }
    
            switch (interfaceId) {
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
                    if (player.getInterfaceId() == EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
                        EquipmentMaking.initialize(player, id, interfaceId, slot, 5);
                    }
                    break;
                case Shop.INVENTORY_INTERFACE_ID:
                    if (player.getStatus() == PlayerStatus.SHOPPING) {
                        ShopManager.sellItem(player, slot, id, 1);
                    }
                    break;
                case Shop.ITEM_CHILD_ID:
                    if (player.getStatus() == PlayerStatus.SHOPPING) {
                        ShopManager.buyItem(player, slot, id, 1);
                    }
                    break;
                case Bank.INVENTORY_INTERFACE_ID:
                    Bank.deposit(player, id, slot, 5);
                    break;
                case Dueling.MAIN_INTERFACE_CONTAINER:
                    if (player.getStatus() == PlayerStatus.DUELING) {
                        player.getDueling().handleItem(id, 5, slot, player.getDueling().getContainer(), player.getInventory());
                    }
                    break;
                case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                    if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
                        player.getPriceChecker().deposit(id, 5, slot);
                    } else if (player.getStatus() == PlayerStatus.TRADING) {
                        player.getTrading().handleItem(id, 5, slot, player.getInventory(), player.getTrading().getContainer());
                    } else if (player.getStatus() == PlayerStatus.DUELING) {
                        player.getDueling().handleItem(id, 5, slot, player.getInventory(), player.getDueling().getContainer());
                    }
                    break;
                case Trading.CONTAINER_INTERFACE_ID:
                    if (player.getStatus() == PlayerStatus.TRADING) {
                        player.getTrading().handleItem(id, 5, slot, player.getTrading().getContainer(), player.getInventory());
                    }
                    break;
                case PriceChecker.CONTAINER_ID:
                    player.getPriceChecker().withdraw(id, 5, slot);
                    break;
            }
        }

        private static thirdAction(player: Player, packet: Packet) {
            let interfaceId = packet.readInt();
            let id = packet.readShortA();
            let slot = packet.readShortA();
        
            // Bank withdrawal..
            if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
                Bank.withdraw(player, id, slot, 10, interfaceId - Bank.CONTAINER_START);
                return;
            }
        
            if (interfaceId == 7423) {
                DepositBox.deposit(player, slot, id, 10);
                return;
            }
        
            switch (interfaceId) {
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_1:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_2:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_3:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_4:
                case EquipmentMaking.EQUIPMENT_CREATION_COLUMN_5:
                    if (player.getInterfaceId() == EquipmentMaking.EQUIPMENT_CREATION_INTERFACE_ID) {
                        EquipmentMaking.initialize(player, id, interfaceId, slot, 10);
                    }
                    break;
                case Shop.INVENTORY_INTERFACE_ID:
                    if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
                        player.getPriceChecker().deposit(id, 10, slot);
                    } else if (player.getStatus() == PlayerStatus.TRADING) {
                        player.getTrading().handleItem(id, 10, slot, player.getInventory(), player.getTrading().getContainer());
                    } else if (player.getStatus() == PlayerStatus.DUELING) {
                        player.getDueling().handleItem(id, 10, slot, player.getInventory(), player.getDueling().getContainer());
                    }
                    break;
                case Trading.CONTAINER_INTERFACE_ID:
                    if (player.getStatus() == PlayerStatus.TRADING) {
                        player.getTrading().handleItem(id, 10, slot, player.getTrading().getContainer(), player.getInventory());
                    }
                    break;
                case PriceChecker.CONTAINER_ID:
                    player.getPriceChecker().withdraw(id, 10, slot);
                    break;
            }
        }

        private static fourthAction(player: Player, packet: Packet) {
            let slot = packet.readShortA();
            let interfaceId = packet.readInt();
            let id = packet.readShortA();
        
            // Bank withdrawal..
            if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
                Bank.withdraw(player, id, slot, -1, interfaceId - Bank.CONTAINER_START);
                return;
            }
        
            if (interfaceId == 7423) {
                DepositBox.deposit(player, slot, id, Number.MAX_SAFE_INTEGER);
                return;
            }
        
            switch (interfaceId) {
                case Shop.INVENTORY_INTERFACE_ID:
                    if (player.getStatus() == PlayerStatus.SHOPPING) {
                        ShopManager.sellItem(player, slot, id, 10);
                    }
                    break;
                case Shop.ITEM_CHILD_ID:
                    if (player.getStatus() == PlayerStatus.SHOPPING) {
                        ShopManager.buyItem(player, slot, id, 10);
                    }
                    break;
                case Bank.INVENTORY_INTERFACE_ID:
                    Bank.deposit(player, id, slot, -1);
                    break;
                // Withdrawing items from duel
                case Dueling.MAIN_INTERFACE_CONTAINER:
                    if (player.getStatus() == PlayerStatus.DUELING) {
                        player.getDueling().handleItem(id, player.getDueling().getContainer().getAmount(id), slot,
                                player.getDueling().getContainer(), player.getInventory());
                    }
                    break;
                case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                    if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
                        player.getPriceChecker().deposit(id, player.getInventory().getAmount(id), slot);
                    } else if (player.getStatus() == PlayerStatus.TRADING) {
                        player.getTrading().handleItem(id, player.getInventory().getAmount(id), slot, player.getInventory(),
                                player.getTrading().getContainer());
                    } else if (player.getStatus() == PlayerStatus.DUELING) {
                        player.getDueling().handleItem(id, player.getInventory().getAmount(id), slot, player.getInventory(),
                                player.getDueling().getContainer());
                    }
                    break;
                case Trading.CONTAINER_INTERFACE_ID:
                    if (player.getStatus() == PlayerStatus.TRADING) {
                        player.getTrading().handleItem(id, player.getTrading().getContainer().getAmount(id), slot,
                                player.getTrading().getContainer(), player.getInventory());
                    }
                    break;
                case PriceChecker.CONTAINER_ID:
                    player.getPriceChecker().withdraw(id, player.getPriceChecker().getAmount(id), slot);
                    break;
           
                }
            }        
        
            private static fifthAction(player: Player, packet: Packet) {
                let interfaceId = packet.readInt();
                let slot = packet.readLEShort();
                let id = packet.readLEShort();
            
                // Bank withdrawal..
                if (interfaceId >= Bank.CONTAINER_START && interfaceId < Bank.CONTAINER_START + Bank.TOTAL_BANK_TABS) {
                    player.setEnteredAmountAction((amount) => {
                        Bank.withdraw(player, id, slot, amount, interfaceId - Bank.CONTAINER_START);
                    });
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
                    return;
                }
            
                if (interfaceId == 7423) {
                    player.setEnteredAmountAction((amount) => DepositBox.deposit(player, slot, id, amount));
                    player.getPacketSender().sendEnterAmountPrompt("How many would you like to deposit?");
                    return;
                }
            
                switch (interfaceId) {
                    case Shop.INVENTORY_INTERFACE_ID:
                        player.setEnteredAmountAction((amount) => {
                            ShopManager.sellItem(player, slot, id, amount);
                        });
                        player.getPacketSender().sendEnterAmountPrompt("How many would you like to sell?");
                        break;
                    case Shop.ITEM_CHILD_ID:
                        player.setEnteredAmountAction((amount) => {
                            ShopManager.buyItem(player, slot, id, amount);
                        });
                        player.getPacketSender().sendEnterAmountPrompt("How many would you like to buy?");
                        break;
            
                    case Bank.INVENTORY_INTERFACE_ID:
                        player.setEnteredAmountAction((amount) => {
                            Bank.deposit(player, id, slot, amount);
                        });
                        player.getPacketSender().sendEnterAmountPrompt("How many would you like to bank?");
                        break;
                        case Trading.INVENTORY_CONTAINER_INTERFACE: // Duel/Trade inventory
                        if (player.getStatus() == PlayerStatus.PRICE_CHECKING) {
                            player.setEnteredAmountAction((amount) => {
                                player.getPriceChecker().deposit(id, amount, slot);
                            });
                            player.getPacketSender().sendEnterAmountPrompt("How many would you like to deposit?");
                        } else if (player.getStatus() == PlayerStatus.TRADING) {
                            player.setEnteredAmountAction((amount) => {
                                player.getTrading().handleItem(id, amount, slot, player.getInventory(), player.getTrading().getContainer());
                            });
                            player.getPacketSender().sendEnterAmountPrompt("How many would you like to offer?");
                        } else if (player.getStatus() == PlayerStatus.DUELING) {
                            player.setEnteredAmountAction((amount) => {
                                player.getDueling().handleItem(id, amount, slot, player.getInventory(), player.getDueling().getContainer());
                            });
                            player.getPacketSender().sendEnterAmountPrompt("How many would you like to offer?");
                        }
                        break;
                    case Trading.CONTAINER_INTERFACE_ID:
                        if (player.getStatus() == PlayerStatus.TRADING) {
                            player.setEnteredAmountAction((amount) => {
                                player.getTrading().handleItem(id, amount, slot, player.getTrading().getContainer(), player.getInventory());
                            });
                            player.getPacketSender().sendEnterAmountPrompt("How many would you like to remove?");
                        }
                        break;
                    case Dueling.MAIN_INTERFACE_CONTAINER:
                        if (player.getStatus() == PlayerStatus.DUELING) {
                            player.setEnteredAmountAction((amount) => {
                                player.getDueling().handleItem(id, amount, slot, player.getDueling().getContainer(), player.getInventory());
                            });
                            player.getPacketSender().sendEnterAmountPrompt("How many would you like to remove?");
                        }
                        break;
                    case PriceChecker.CONTAINER_ID:                
                        player.setEnteredAmountAction((amount) => {                    
                            player.getPriceChecker().withdraw(id, amount, slot);
                        });
                        player.getPacketSender().sendEnterAmountPrompt("How many would you like to withdraw?");
                        break;
                }
            }

            private static sixthAction(player: Player, packet: Packet) {
            }
        
            public execute( player: Player,  packet: Packet) {
        
                if (player == null || player.getHitpoints() <= 0) {
                    return;
                }
        
                switch (packet.getOpcode()) {
                    case PacketConstants.FIRST_ITEM_CONTAINER_ACTION_OPCODE:
                        firstAction(player, packet);
                        break;
                    case PacketConstants.SECOND_ITEM_CONTAINER_ACTION_OPCODE:
                        secondAction(player, packet);
                        break;
                    case PacketConstants.THIRD_ITEM_CONTAINER_ACTION_OPCODE:
                        thirdAction(player, packet);
                        break;
                    case PacketConstants.FOURTH_ITEM_CONTAINER_ACTION_OPCODE:
                        fourthAction(player, packet);
                        break;
                    case PacketConstants.FIFTH_ITEM_CONTAINER_ACTION_OPCODE:
                        fifthAction(player, packet);
                        break;
                    case PacketConstants.SIXTH_ITEM_CONTAINER_ACTION_OPCODE:
                        sixthAction(player, packet);
                        break;
                }
            }
            
    }