export class World {
    private static readonly MAX_PLAYERS = 500;
    private static players: MobileList<Player> = new MobileList<Player>(MAX_PLAYERS);
    private static playerBots: Map<string, PlayerBot> = new Map<string, PlayerBot>();
    private static npcs: MobileList<NPC> = new MobileList<NPC>(5000);
    private static items: ItemOnGround[] = [];
    private static objects: GameObject[] = [];
    private static removedObjects: Set<GameObject> = new Set<GameObject>();
    private static addPlayerQueue: Player[] = [];
    private static removePlayerQueue: Player[] = [];
    private static addNPCQueue: NPC[] = [];
    private static removeNPCQueue: NPC[] = [];
    private static executor: GameSyncExecutor = new GameSyncExecutor();

    static process() {
        // Process all active {@link Task}s..
        TaskManager.process();

        // Process all minigames
        MinigameHandler.process();

        // Process all ground items..
        ItemOnGroundManager.process();

        // Add pending players..
        for (let i = 0; i < GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            let player = addPlayerQueue.poll();
            if (!player) break;
            // Kick any copies before adding the new player
            World.getPlayerByName(player.getUsername()).ifPresent(e => e.requestLogout());
            getPlayers().add(player);
        }

        // Deregister queued players.
        let amount = 0;
        let $it = removePlayerQueue.iterator();
        while ($it.hasNext()) {
            let player = $it.next();
            if (!player || amount >= GameConstants.QUEUED_LOOP_THRESHOLD) {
                break;
            }
            if (player.canLogout() || player.getForcedLogoutTimer().finished() || Server.isUpdating()) {
                getPlayers().remove(player);
                $it.remove();
            }
            amount++;
        }

        // Add pending Npcs..
        for (let i = 0; i < GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            let npc = addNPCQueue.poll();
            if (!npc) break;
            getNpcs().add(npc);
        }

        // Removing pending npcs..
        for (let i = 0; i < GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            let npc = removeNPCQueue.poll();
            if (!npc) break;
            getNpcs().remove(npc);
        }

        // Handle synchronization tasks.
        executor.sync(new GameSyncTask(true, false) {
            execute(index: number) {
                let player = players.get(index);
                try {
                    player.process();
                } catch (e) {
                    console.log(e);
                    player.requestLogout();
                }
            }
        });

        executor.sync(new GameSyncTask(false, false) {
            execute(index: number) {
                let npc = npcs.get(index);
                try {
                    npc.process();
                } catch (e) {
                    console.log(e);
                }
            }
        });

        executor.sync(new GameSyncTask(true) {
            execute(index: number) {
                let player = players.get(index);
                synchronized(player) {
                    try {
                        PlayerUpdating.update(player);
                        NPCUpdating.update(player);
                    } catch (e) {
                        console.log(e);
                        player.requestLogout();
                    }
                }
            }
        });

        executor.sync(new GameSyncTask(true) {
            execute(index: number) {
                let player = players.get(index);
                synchronized(player) {
                    try {
                        player.resetUpdating();
                        player.setCachedUpdateBlock(null);
                        player.getSession().flush();
                    } catch (e) {
                        console.log(e);
                        player.requestLogout();
                    }
                }
            });

        executor.sync(new GameSyncTask(false) {
            execute(index: number) {
                let npc = npcs.get(index);
                synchronized(npc) {
                    try {
                        npc.resetUpdating();
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
    }

    /**
    * Gets a player by their username.
    *
    * @param username
    *            The username of the player.
    * @return The player with the matching username.
    */
    public static getPlayerByName(username: string): Player {
        return players.search(p => p != null && p.getUsername().equals(Misc.formatText(username)));
    }

    /**
    * Broadcasts a message to all players in the game.
    *
    * @param message
    *            The message to broadcast.
    */
    public static sendMessage(message: string) {
        players.forEach(p => p.getPacketSender().sendMessage(message));
    }

    /**
    * Broadcasts a message to all staff-members in the game.
    *
    * @param message
    *            The message to broadcast.
    */
    public static sendStaffMessage(message: string) {
        players.filter(p => !Objects.isNull(p) && p.isStaff())
            .forEach(p => p.getPacketSender().sendMessage(message));
    }

    /**
    * Saves all players in the game.
    */
    public static savePlayers() {
        players.forEach(PLAYER_PERSISTENCE:: save);
    }

    public static getPlayers(): MobileList<Player> {
        return players;
    }

    public static getNpcs(): MobileList<NPC> {
        return npcs;
    }

    public static getPlayerBots(): TreeMap<string, PlayerBot> { return playerBots; }

    public static getItems(): List<ItemOnGround> {
        return items;
    }

    public static getObjects(): List<GameObject> {
        return objects;
    }

    public static getRemovedObjects(): LinkedHashSet<GameObject> {
        return removedObjects;
    }

    public static getAddPlayerQueue(): Queue<Player> {
        return addPlayerQueue;
    }

    public static getRemovePlayerQueue(): Queue<Player> {
        return removePlayerQueue;
    }

    public static getAddNPCQueue(): Queue<NPC> {
        return addNPCQueue;
    }

    public static getRemoveNPCQueue(): Queue<NPC> {
        return removeNPCQueue;
    }
}

