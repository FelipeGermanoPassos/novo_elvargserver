export class PlayerDeathTask extends Task {
    private player: Player;
    private killer: Player | undefined;
    private loseItems = true;
    private itemsToKeep: Item[] = [];
    private ticks = 2;
    

    constructor(player: Player) {
        super(1, player, false);
        this.player = player;
        this.killer = player.getCombat().getKiller(true);
    }
    
    public execute() {
        if (!this.player) {
            this.stop();
            return;
        }
        try {
            switch (this.ticks) {
                case 0:
                if (this.player instanceof PlayerBot) {
                    (this.player as PlayerBot).getCombatInteraction().handleDeath(this.killer);
                }
                if (this.player.getArea() != null) {
                    this.loseItems = this.player.getArea().dropItemsOnDeath(this.player, this.killer);
                }
                const droppedItems: Item[] = [];
                if (this.loseItems) {
                    this.itemsToKeep = ItemsKeptOnDeath.getItemsToKeep(this.player);
                    const playerItems = this.player.getInventory().getValidItems().concat(this.player.getEquipment().getValidItems());
                    const position = this.player.getLocation();
                    let dropped = false;

                for (let item of playerItems) {
                // Keep tradeable items
                if (!item.getDefinition().isTradeable() || itemsToKeep.get().includes(item)) {
                    if (!itemsToKeep.get().includes(item)) {
                        itemsToKeep.get().add(item);
                    }
                    continue;
                }

                // Don't drop items if we're owner or dev
                if (player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER) {
                    break;
                }

                // Drop emblems but downgrade them a tier.
                if (item.getId() === Emblem.MYSTERIOUS_EMBLEM_1.id || item.getId() === Emblem.MYSTERIOUS_EMBLEM_2.id
                        || item.getId() === Emblem.MYSTERIOUS_EMBLEM_3.id || item.getId() === Emblem.MYSTERIOUS_EMBLEM_4.id
                        || item.getId() === Emblem.MYSTERIOUS_EMBLEM_5.id || item.getId() === Emblem.MYSTERIOUS_EMBLEM_6.id
                        || item.getId() === Emblem.MYSTERIOUS_EMBLEM_7.id || item.getId() === Emblem.MYSTERIOUS_EMBLEM_8.id
                        || item.getId() === Emblem.MYSTERIOUS_EMBLEM_9.id || item.getId() === Emblem.MYSTERIOUS_EMBLEM_10.id) {

                    // Tier 1 shouldnt be dropped cause it cant be downgraded
                    if (item.getId() === Emblem.MYSTERIOUS_EMBLEM_1.id) {
                        continue;
                    }

                    if (killer.isPresent) {
                        const lowerEmblem = item.getId() === Emblem.MYSTERIOUS_EMBLEM_2.id ? item.getId() - 2 : item.getId() - 1;
                        ItemOnGroundManager.registerNonGlobal(killer.get, new Item(lowerEmblem), position);
                        killer.get.getPacketSender().sendMessage(@red@${player.getUsername()} dropped a ${ItemDefinition.forId(lowerEmblem).getName()}!);
                        dropped = true;
                        continue;
                        }
                        droppedItems.add(item);
                        
                        // Drop item
                        ItemOnGroundManager.register(killer.isPresent ? killer.get : player, item, position);
                        dropped = true;
                }
                        
                // Handle defeat..
                if (killer.isPresent) {   
                    if (k.getArea() != null) {
                        k.getArea().defeated(k, player);
                    }
                    if (!dropped) {
                        killer.get.getPacketSender().sendMessage(${player.getUsername()} had no valuable items to be dropped.);
                    }
                }
                
                // Reset items
                player.getInventory().resetItems().refreshItems();
                player.getEquipment().resetItems().refreshItems();
                }
                
                // Restore the player's default attributes (such as stats)..
                player.resetAttributes();
                
                // If the player lost items..
                if (loseItems) {
                // Handle items kept on death..
                    if (itemsToKeep.isPresent()) {
                        for (const it of itemsToKeep.get()) {
                            let id = it.getId();
                            const brokenItem = BrokenItem.get(id);
                            if (brokenItem != null) {
                                id = brokenItem.getBrokenItem();
                                player.getPacketSender().sendMessage(`Your ${ItemDefinition.forId(it.getId()).getName()} has been broken. You can fix it by talking to Perdu.`);
                            }
                        player.getInventory().add(new Item(id, it.getAmount()));
                        }
                        itemsToKeep.get().clear();
                    }
                }

                let handledDeath: boolean = false;

                if (player.getArea() != null) {
                    handledDeath = player.getArea().handleDeath(player, killer);
                }

                if (!handledDeath) {
                    player.moveTo(GameConstants.DEFAULT_LOCATION);
                    if (loseItems) {
                        if (player.isOpenPresetsOnDeath()) {
                            Presetables.open(player);
                        }
                    }
                }

                // Stop the event..
                stop();
                break;

                case 2:
                if (player instanceof PlayerBot) {
                    (<PlayerBot>player).getCombatInteraction().handleDying(this.killer);
                }

                // Reset combat..
                player.getCombat().reset();

                // Reset movement queue and disable it..
                player.getMovementQueue().setBlockMovement(true).reset();

                // Mark us as untargetable..
                player.setUntargetable(true);

                // Close all open interfaces..
                player.getPacketSender().sendInterfaceRemoval();

                // Send death message..
                player.getPacketSender().sendMessage("Oh dear, you are dead!");

                // Perform death animation..
                player.performAnimation(new Animation(836, Priority.HIGH));

                // Handle retribution prayer effect on our killer, if present..
                if (PrayerHandler.isActivated(player, PrayerHandler.RETRIBUTION)) {
                    if (killer.isPresent()) {
                        CombatFactory.handleRetribution(player, killer.get());
                    }
                }
                        break;
                        ticks--;
                }
            }
        } catch (e) {
            super.stop();
            console.error(e);
            player.resetAttributes();
            player.moveTo(GameConstants.DEFAULT_LOCATION);
        }
    }
}
