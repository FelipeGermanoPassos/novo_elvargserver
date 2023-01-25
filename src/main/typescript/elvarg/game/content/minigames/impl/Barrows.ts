class Barrows {
    public static ENTRANCE = new Location(3565, 3306);
    public static KILLCOUNTER_INTERFACE_ID = 4535;
    public static KILLCOUNTER_FRAME_ID = 4536;
    private static CHEST_ENTRANCE = new Location(3551, 9691);
    private static BOSS_SPAWN = new Location(3550, 9694);
    private static CHEST_OBJECT_ID = 20973;
    private static TUNNEL_DIALOGUE_ID = 26;
    private static BARROW_ITEMS = ImmutableList.of(4708, 4710, 4712, 4714, 4716, 4718, 4720, 4722, 4724, 4726, 4728, 4730,
        4732, 4734, 4736, 4738, 4745, 4747, 4749, 4751, 4753, 4755, 4757, 4759);
    private static RUNES = ImmutableList.of(558, 560, 562, 565);
    private static REWARDS_INTERFACE_ID = 42560;

    public static dig(player: Player) {
        const digLocation = getDiggingLocation(player);
        if (digLocation) {
            player.getPacketSender().sendMessage("You've found a crypt!");
            player.moveTo(digLocation.digSpawn);
        }
    }

    public static handleObject(player: Player, object: number): boolean {
        const brother: Brother | undefined = getBrotherForCrypt(object);
        if (brother) {

            if (CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You cannot do that whilst in combat.");
                return true;
            }

            if (player.getBarrowsCrypt() <= 0) {
                player.setBarrowsCrypt(getRandomCrypt());
            }

            if (player.getCurrentBrother() != null || player.getKilledBrothers()[brother.ordinal()]) {
                player.getPacketSender().sendMessage("The sarcophagus appears to be empty.");
                return false;
            }

            if (player.getBarrowsCrypt() == object) {
                /*player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        switch (option) {
                            case 1:
                                if (getKillcount(player) < 5) {
                                    player.getPacketSender()
                                            .sendMessage("You need a killcount of at least 5 to enter this tunnel.");
                                } else {
                                    player.moveTo(CHEST_ENTRANCE.clone().add(Misc.getRandom(2), Misc.getRandom(1)));
                                }
                                break;
                        }
                        player.getPacketSender().sendInterfaceRemoval();
                    }
                });
                DialogueManager.start(player, TUNNEL_DIALOGUE_ID);*/
                return true;
            }
            if (player.getCurrentBrother() != null || player.getKilledBrothers()[brother.get().ordinal()]) {
                player.getPacketSender().sendMessage("The sarcophagus appears to be empty.");
                return false;
            }

            brotherSpawn(player, brother.get(), brother.get().getSpawn());
            return true;
        }

        const stairs: Brother | undefined = getStairs(object);
        if (stairs) {
            player.moveTo(stairs.stairSpawn);
            return true;
        }

        // Handle chest
        if (object == CHEST_OBJECT_ID) {

            if (CombatFactory.inCombat(player)) {
                player.getPacketSender().sendMessage("You cannot do that whilst in combat.");
                return true;
            }

            if (getKillcount(player) >= 5) {
                const boss = getBrotherForCrypt(player.getBarrowsCrypt());
                if (boss) {

                    /** They might have already spawned the boss **/
                    if (player.getCurrentBrother() != null && player.getCurrentBrother().isRegistered()) {
                        player.getPacketSender().sendMessage("You cannot do this right now.");
                        return false;
                    }

                    if (player.getKilledBrothers()[boss.ordinal]) {
                        player.getPacketSender().clearInterfaceItems(42563, 42568);
                        const rewards = new Array<Item>();
                        if (Misc.randomInclusive(1, 5) == 1) {
                            rewards.push(new Item(Misc.randomTypeOfList(BARROW_ITEMS)));
                        }
                        for (let i = 0; i < 3; i++) {
                            rewards.push(new Item(Misc.randomTypeOfList(RUNES), Misc.randomInclusive(50, 300)));
                        }
                        if (Misc.getRandom(1) == 0) {
                            rewards.push(new Item(ItemIdentifiers.BOLT_RACK, Misc.randomInclusive(50, 150)));
                        }
                        for (let i = 0; i < rewards.length; i++) {
                            const item = rewards[i];
                            player.getInventory().forceAdd(player, item);
                            player.getPacketSender().sendItemOnInterface(42563 + i, item.getId(), item.getAmount());
                        }
                        player.setBarrowsChestsLooted(player.getBarrowsChestsLooted() + 1);
                        player.getPacketSender().sendInterface(REWARDS_INTERFACE_ID)
                            .sendMessage("@or3@You've looted a total of " + player.getBarrowsChestsLooted() + " chests.");
                        reset(player);
                    } else {
                        brotherSpawn(player, boss.get(), BOSS_SPAWN.clone());
                    }

                } else {
                    reset(player);
                }
            } else {
                player.getPacketSender().sendMessage("The chest appears to be empty.");
            }
            return true;
        }
        return false;
    }

    public static brotherSpawn(player: Player, brother: Brother, pos: Location) {
        const npc = new NPC(brother.npcId, pos) {
            onAdd() {
                this.setOwner(player);
                this.forceChat("You dare disturb my rest!");
                this.getTimers().extendOrRegister(TimerKey.COMBAT_ATTACK, 3);
                this.getCombat().attack(player);
                player.getPacketSender().sendEntityHint(this);
            }
        };
        World.getAddNPCQueue().add(npc);
        player.setCurrentBrother(npc);
    }

    public static brotherDespawn(player: Player) {
    const brother = player.getCurrentBrother();
        if (brother && brother.isRegistered() && !brother.isDying()) {
            World.getRemoveNPCQueue().add(brother);
            player.setCurrentBrother(null);
            player.getPacketSender().sendEntityHintRemoval(false);
        }
    }

    public static brotherDeath(player: Player, npc: NPC) {
    const brother = getBrotherForNpcId(npc.getId());
        if (brother && player.getCurrentBrother() == npc) {
            player.getPacketSender().sendEntityHintRemoval(false);
            player.getKilledBrothers()[brother.get().ordinal()] = true;
            updateInterface(player);
            player.setCurrentBrother(null);
        }
    }

    public static reset(player: Player) {
        player.setBarrowsCrypt(0);
        player.getPacketSender().sendEntityHintRemoval(false);
        for (let i = 0; i < player.getKilledBrothers().length; i++) {
            player.getKilledBrothers()[i] = false;
        }
        updateInterface(player);
    }

    public static updateInterface(player: Player) {
        player.getPacketSender().sendString(Barrows.KILLCOUNTER_FRAME_ID,
            "Killcount: " + getKillcount(player));
    }
    
    private static getKillcount(player: Player) {
        let defeated = 0;
        for (let brotherDefeated of player.getKilledBrothers()) {
            if (brotherDefeated) {
                defeated++;
            }
        }
        return defeated;
    }

    private static getBrotherForCrypt(crypt: number) {
        return Brother.values().filter(x => x.getCoffinId() == crypt)[0];
    }

    private static getBrotherForNpcId(npcId: number) {
        return Brother.values().filter(x => x.getNpcId() == npcId)[0];
    }

    private static getStairs(object: number) {
        return Brother.values().filter(x => x.getStairs() == object)[0];
    }

    private static getDiggingLocation(player: Player) {
        return Brother.values().filter(x => x.getBoundary().inside(player.getLocation()))[0];
    }

    private static getRandomCrypt() {
        return Brother.values()[Misc.getRandom(Brother.values().length - 1)].getCoffinId();
    }

    enum Brother {
        AHRIM_THE_BLIGHTED = {
            npcId: 1672,
            coffinId: 20770,
            spawn: new Location(3557, 9701, 3),
            boundary: new Boundary(3562, 3568, 3285, 3292),
            digSpawn: new Location(3557, 9703, 3),
            stairs: 20667,
            stairSpawn: new Location(3565, 3288, 0)
        },
        DHAROK_THE_WRETCHED = {
            npcId: 1673,
            coffinId: 20720,
            spawn: new Location(3553, 9716, 3),
            boundary: new Boundary(3572, 3578, 3294, 3301),
            digSpawn: new Location(3556, 9718, 3),
            stairs: 20668,
            stairSpawn: new Location(3574, 3297, 0)
        },
        GUTHAN_THE_INFESTED = {
            npcId: 1674,
            coffinId: 20722,
            spawn: new Location(3540, 9705, 3),
            boundary: new Boundary(3574, 3584, 3279, 3285),
            digSpawn: new Location(3534, 9704, 3),
            stairs: 20669,
            stairSpawn: new Location(3577, 3282, 0)
        },
        KARIL_THE_TAINTED = {
            npcId: 1675,
            coffinId: 20771,
            spawn: new Location(3549, 9685, 3),
            boundary: new Boundary(3564, 3568, 3273, 3278),
            digSpawn: new Location(3546, 9684, 3),
            stairs: 20670,
            stairSpawn: new Location(3566, 3275, 0)
        },
        TORAG_THE_CORRUPTED = {
            npcId: 1676,
            coffinId: 20721,
            spawn: new Location(3568, 9688, 3),
            boundary: new Boundary(3550, 3556, 3280, 3284),
            new Location(3568, 9683, 3), 20671,
            new Location(3554, 3282, 0)
        },
        VERAC_THE_DEFILED = {
            npcId: 1677,
            coffinId: 20772,
            spawn: new Location(3575, 9708, 3),
            boundary: new Boundary(3553, 3560, 3294, 3301),
            new Location(3578, 9706, 3), 20672,
            new Location(3557, 3297, 0))
        }
    }
    
        private npcId: number;
        private coffinId: number;
        private stairs: number;
        private spawn: Location;
        private digSpawn: Location;
        private stairSpawn: Location;
        private boundary: Boundary;
    
        private Brother(npcId: number, coffin: number, brotherSpawn: Location, boundary: Boundary, digSpawn: Location, stairs: number, stairSpawn: Location) {
            this.npcId = npcId;
            this.coffinId = coffin;
            this.spawn = brotherSpawn;
            this.boundary = boundary;
            this.digSpawn = digSpawn;
            this.stairs = stairs;
            this.stairSpawn = stairSpawn;
        }
    
        public getNpcId(): number {
            return this.npcId;
        }
    
        public getCoffinId(): number {
            return this.coffinId;
        }
        
        public getSpawn(): Location {
            return this.spawn;
        }
        
        public getBoundary(): Boundary {
            return this.boundary;
        }
        
        public getDigSpawn(): Location {
            return this.digSpawn;
        }
        
        public getStairs(): number {
            return this.stairs;
        }
        
        public getStairSpawn(): Location {
            return this.stairSpawn;
        }
