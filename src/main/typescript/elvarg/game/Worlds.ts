<<<<<<< HEAD
import {ObjectManager} from '../../../entity/impl/object/ObjectManager';
import {ItemOnGround} from '../../../entity/impl/grounditem/ItemOnGround'
import {GameObject} from '../../../entity/impl/object/GameObject';
import {Player} from '../game/entity/impl/player/Player'
import {PlayerBot} from '../game/entity/impl/playerbot/PlayerBot'
import * as MobileList from '../game/entity/impl/MobileList'
import {NPC} from '../game/entity/impl/npc/NPC';
package com.elvarg.game.entity.updating.sync;
import {GameSyncExecutor} from '../game/entity/updating/sync/GameSyncExecutor'
import {GameSyncTask} from '../game/entity/updating/sync/GameSyncTask'
import {Lock} 'ts-lock'

export class World {

    private static MAX_PLAYERS = 500;
    
    /**
     * The collection of active {@link Player}s.
     */
    private static players = new MobileList<Player>(World.MAX_PLAYERS);
    
    /**
     * The collection of active {@link PlayerBot}s.
     */
    private static playerBots = new Map<string, PlayerBot>();
    
    /**
     * The collection of active {@link NPC}s.
     */
    private static npcs = new MobileList<NPC>(5000);
    
    /**
     * The collection of active {@link ItemOnGround}s..
     */
=======
export class World {
    private static readonly MAX_PLAYERS = 500;
    private static players: MobileList<Player> = new MobileList<Player>(MAX_PLAYERS);
    private static playerBots: Map<string, PlayerBot> = new Map<string, PlayerBot>();
    private static npcs: MobileList<NPC> = new MobileList<NPC>(5000);
>>>>>>> 7052ca7d0e28eadf12625750f1d5d94c3ea0d2aa
    private static items: ItemOnGround[] = [];
    
    /**
     * The collection of active {@link GameObject}s..
     */
    private static objects: GameObject[] = [];
    
    /**
     * The collection of removed {@link GameObject}s..
     */
    private static removedObjects = new Set<GameObject>();
    
    /**
     * The collection of {@link Players}s waiting to be added to the game.
     */
    private static addPlayerQueue = new Array<Player>();
    
    /**
     * The collection of {@link Players}s waiting to be removed from the game.
     */
    private static removePlayerQueue = new Array<Player>();
    
    /**
     * The collection of {@link Players}s waiting to be added to the game.
     */
    private static addNPCQueue = new Array<NPC>();
    
    /**
     * The collection of {@link Players}s waiting to be removed from the game.
     */
    private static removeNPCQueue = new Array<NPC>();
    
    /**
     * The manager for game synchronization.
     */
    private static executor = new GameSyncExecutor();

    constructor() {
        this.executor.sync(new GameSyncTask(false, false, (index: number) => {
            let npc = this.npcs.get(index);
            try {
                npc.process();
            } catch (e) {
                console.log(e);
            }
        }));

        this.executor.sync(new GameSyncTask(true, false, (index: number) => {
            let player = this.players[index];
            this.lock.acquire().then(() => {
                try {
                    PlayerUpdating.update(player);
                    NPCUpdating.update(player);
                } catch (e) {
                    console.log(e);
                    player.requestLogout();
                } finally {
                    this.lock.release();
                }
            });
        }));

        this.executor.sync(new GameSyncTask(true, false, (index: number) => {
            let player = this.players[index];
            this.lock.acquire().then(() => {
                try {
                    player.resetUpdating();
                    player.setCachedUpdateBlock(null);
                    player.getSession().flush();
                } catch (e) {
                    console.log(e);
                    player.requestLogout();
                } finally {
                    this.lock.release();
                }
            });
        }));

        this.executor.sync(new GameSyncTask(false, false, (index: number) => {
            let npc = this.npcs[index];
            this.lock.acquire().then(() => {
                try {
                    npc.resetUpdating();
                } catch (e) {
                    console.log(e);
                } finally {
                    this.lock.release();
                }
            });
        }));
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

    public static process() {
        // Process all active {@link Task}s..
        TaskManager.process();
        
        // Process all minigames
        MinigameHandler.process();
        
        // Process all ground items..
        ItemOnGroundManager.process();
        
        // Add pending players..
        for (let i = 0; i < GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            let player = World.addPlayerQueue.shift();
            if (!player)
                break;
            // Kick any copies before adding the new player
            let existingPlayer = World.getPlayerByName(player.username);
            if (existingPlayer) {
                existingPlayer.requestLogout();
            }
            World.players.add(player);
        }
        
        // Deregister queued players.
        let amount = 0;
        let $it = World.removePlayerQueue.iterator();
        while ($it.hasNext()) {
            let player = $it.next();
            if (!player || amount >= GameConstants.QUEUED_LOOP_THRESHOLD) {
                break;
            }
            if (player.canLogout() || player.forcedLogoutTimer.finished() || Server.isUpdating()) {
                World.players.remove(player);
                $it.remove();
            }
            amount++;
        }

        // Add pending Npcs..
        for (let i = 0; i < GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            let npc = World.addNPCQueue.shift();
            if (!npc)
            break;
            World.npcs.add(npc);
            }
    
        // Removing pending npcs..
        for (let i = 0; i < GameConstants.QUEUED_LOOP_THRESHOLD; i++) {
            let npc = World.removeNPCQueue.shift();
            if (!npc)
                break;
            World.npcs.remove(npc);
        }
    
        // Handle synchronization tasks.
        World.executor.sync((index: number) => {
            let player = World.players.get(index);
            try {
                player.process();
            } catch (e) {
                console.error(e);
                player.requestLogout();
            }
        }, true, false);
    
        World.executor.sync((index: number) => {
            let npc = World.npcs.get(index);
            try {
                npc.process();
            } catch (e) {
                console.error(e);
            }
        }, false, false);
    
        World.executor.sync((index: number) => {
            let player = World.players.get(index);
            try {
                PlayerUpdating.update(player);
                NPCUpdating.update(player);
            } catch (e) {
                console.error(e);
                player.requestLogout();
            }
        }, true);

        executor.sync(new GameSyncTask(true, (index: number) => {
            let player = players.get(index);
            synchronized (player) {
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
        
        executor.sync(new GameSyncTask(false, (index: number) => {
            let npc = npcs.get(index);
            synchronized (npc) {
                try {
                    npc.resetUpdating();
                } catch (e) {
                    console.log(e);
                }
            }
        });
        
        class GameSyncTask {
            constructor(private isPlayer: boolean, private execute: (index: number) => void) {}
        }
        
        export function getPlayerByName(username: string): Player | undefined {
            return players.find(p => p != null && p.getUsername().toLowerCase() === username.toLowerCase());
        }
        
        export function sendMessage(message: string) {
            players.forEach(p => p.getPacketSender().sendMessage(message));
        }
        
        export function sendStaffMessage(message: string) {
            players.filter(p => !Objects.isNull(p) && p.isStaff()).forEach(p => p.getPacketSender().sendMessage(message));
        }
        
        export function savePlayers() {
            players.forEach(PLAYER_PERSISTENCE.save);
        }

        export const players = new MobileList<Player>();
        export const npcs = new MobileList<NPC>();
        export const playerBots = new Map<string, PlayerBot>();
        export const items = new Array<ItemOnGround>();
        export const objects = new Array<GameObject>();
        export const removedObjects = new Set<GameObject>();
        export const addPlayerQueue = new Array<Player>();
        export const removePlayerQueue = new Array<Player>();
        export const addNPCQueue = new Array<NPC>();
        export const removeNPCQueue = new Array<NPC>();

        export function findSpawnedObject(id: number, loc: Location): GameObject | undefined {
            return objects.find(i => i.getId() === id && i.getLocation().equals(loc));
        }

        export function findCacheObject(player: Player, id: number, loc: Location): GameObject {
            return MapObjects.get(player, id, loc);
        }

        export function sendLocalGraphics(id: number, position: Location) {
            players.filter(p => p != null && p.getLocation().isWithinDistance(position, 32))
                .forEach(p => p.getPacketSender().sendGraphic(new Graphic(id), position));
        }
    } 
}




