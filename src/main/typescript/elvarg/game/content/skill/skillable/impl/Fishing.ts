export class Blessing extends DefaultSkillable {
    public static CASKET_ITEMS = [new Item(1061), new Item(592), new Item(1059), new Item(995, 100000), new Item(4212), new Item(995, 50000), new Item(401), new Item(995, 150000), new Item(407)];
    private fishSpot: NPC;
    private tool: BlessingTool;

    constructor(fishSpot: NPC, tool: BlessingTool) {
        super();
        this.fishSpot = fishSpot;
        this.tool = tool;
    }

    public class Fishing extends DefaultSkillable {
        public static readonly Item[] CASKET_ITEMS = [new Item(1061), new Item(592), new Item(1059), new Item(995, 100000), new Item(4212), new Item(995, 50000), new Item(401), new Item(995, 150000), new Item(407)];
        private final NPC fishSpot;
        private final BlessingTool tool;
    
        public Fishing(NPC fishSpot, BlessingTool tool) {
        this.fishSpot = fishSpot;
        this.tool = tool;
    }
    
        public hasRequirements(Player player: Player): boolean {
        if (!player.getInventory().contains(tool.getId())) {
            player.getPacketSender().sendMessage("You need a " + ItemDefinition.forId(tool.getId()).getName().toLowerCase() + " to do this.");
            return false;
        }

        if (player.getSkillManager().getCurrentLevel(Skill.FISHING) < tool.getLevel()) {
            player.getPacketSender().sendMessage("You need a Fishing level of at least " + tool.getLevel() + " to do this.");
            return false;
        }

        if (tool.getNeeded() > 0) {
            if (!player.getInventory().contains(tool.getNeeded())) {
                player.getPacketSender().sendMessage("You do not have any " + ItemDefinition.forId(tool.getNeeded()).getName().toLowerCase() + "(s).");
                return false;
            }
        }

        return super.hasRequirements(player);
    }
    
        public start(Player player: Player) {
        player.getPacketSender().sendMessage("You begin to fish..");
        super.start(player);
    }
    
        public startAnimationLoop(Player player: Player) {
        const animLoop = new Task(4, player, true) {
            execute() {
                player.performAnimation(new Animation(tool.getAnimation()));
            }
    };
    TaskManager.submit(animLoop);
    this.getTasks().add(animLoop);
}

    public onCycle(player: Player) {
    PetHandler.onSkill(player, Skill.FISHING);

    //Handle random event..
    if (Misc.getRandom(1400) == 1) {
        const attackTool = new AttackToolRandomEvent(player, tool, fishSpot);
        TaskManager.submit(attackTool);
        this.cancel(player);
    }
}
    
        public finishedCycle(player: Player) {
    /** Random stop for that 'old school' rs feel :) */
    if (Misc.getRandom(90) == 0) {
        this.cancel(player);
    }

    /** Catch multiple fish with a big net. */
    let amount = 1;
    if (tool == BlessingTool.BIG_NET) {
        amount = Math.min(Misc.getRandom(4) + 1, player.getInventory().getFreeSlots());
    }

    const fishingLevel = player.getSkillManager().getCurrentLevel(Skill.FISHING);
    for (let i = 0; i < amount; i++) {
        const caught = this.determineFish(player, tool);

        const levelDiff = fishingLevel - caught.getLevel();
        let chance = Chance.SOMETIMES;
        if (levelDiff >= 15) chance = Chance.COMMON;
        if (levelDiff >= 25) chance = Chance.VERY_COMMON;

        if (chance.success()) {
            player.getPacketSender().sendMessage(
                "You catch a " + caught.name().toLowerCase().replace("_", " ") + ".");
            player.getInventory().add(new Item(caught.getId()));
            player.getSkillManager().addExperience(Skill.FISHING, caught.getExperience());
        }

        if (chance.success()) {
            player.getPacketSender().sendMessage(
                "You catch a " + caught.name().toLowerCase().replace("_", " ") + ".");
            player.getInventory().add(new Item(caught.getId()));
            player.getSkillManager().addExperience(Skill.FISHING, caught.getExperience());
        }

        if (tool.getNeeded() > 0) {
            player.getInventory().delete(new Item(tool.getNeeded()));
        }

    }

    function loopRequirements(): boolean {
        return true;
    }

    function allowFullInventory(): boolean {
        return false;
    }

    function cyclesRequired(player: Player): number {
        let cycles = 4 + Misc.getRandom(2);
        cycles -= player.getSkillManager().getCurrentLevel(Skill.FISHING) * 0.03;

        return Math.max(3, cycles);
    }

    /**
     * Gets a random fish to be caught for the player based on fishing level and
     * rarity.
     *
     * @param player the player that needs a fish.
     * @param tool   the tool this player is fishing with.
     */
    function determineFish(player: Player, tool: FishingTool): Fish {
        let fishList: Fish[] = [];

        /** Determine which fish are able to be caught. */
        for (let fish of tool.getFish()) {
            if (fish.getLevel() <= player.getSkillManager().getCurrentLevel(Skill.FISHING)) {
                fishList.push(fish);
            }
        }

        /** Filter the fish based on rarity. */
        fishList = fishList.filter(fish => fish.getChance().success());

        /** Return a random fish from the list. */
        return Misc.randomElement(fishList);
    }
}

enum FishingTool {
    NET = { id: 303, level: 1, needed: -1, speed: 3, animation: 621, fish: [Fish.SHRIMP, Fish.ANCHOVY] },
    BIG_NET = { id: 305, level: 16, needed: -1, speed: 3, animation: 620, fish: [Fish.MACKEREL, Fish.OYSTER, Fish.COD, Fish.BASS, Fish.CASKET] },
    FISHING_ROD = { id: 307, level: 5, needed: 313, speed: 1, animation: 622, fish: [Fish.SARDINE, Fish.HERRING, Fish.PIKE, Fish.SLIMY_EEL, Fish.CAVE_EEL, Fish.LAVA_EEL] },
    FLY_FISHING_ROD = { id: 309, level: 20, needed: 314, speed: 1, animation: 622, fish: [Fish.TROUT, Fish.SALMON] },
    HARPOON = { id: 311, level: 35, needed: -1, speed: 4, animation: 618, fish: [Fish.TUNA, Fish.SWORDFISH] },
    SHARK_HARPOON = { id: 311, level: 35, needed: -1, speed: 6, animation: 618, fish: [Fish.SHARK] },
    LOBSTER_POT = { id: 301, level: 40, needed: -1, speed: 4, animation: 619, fish: [Fish.LOBSTER] }

    class BlessingTool {
    constructor(
        private id: number,
        private level: number,
        private needed: number,
        private speed: number,
        private animation: number,
        private fish: Fish[]
    ) { }
    
        public getId(): number {
        return this.id;
    }
    
        public getLevel(): number {
        return this.level;
    }
    
        public getNeeded(): number {
        return this.needed;
    }
    
        public getSpeed(): number {
        return this.speed;
    }
    
        public getAnimation(): number {
        return this.animation;
    }
    
        public getFish(): Fish[] {
        return this.fish;
    }

    enum Fish {
        SHRIMP = { id: 317, level: 1, chance: "VERY_COMMON", experience: 10 },
        SARDINE = { id: 327, level: 5, chance: "VERY_COMMON", experience: 20 },
        HERRING = { id: 345, level: 10, chance: "VERY_COMMON", experience: 30 },
        ANCHOVY = { id: 321, level: 15, chance: "SOMETIMES", experience: 40 },
        MACKEREL = { id: 353, level: 16, chance: "VERY_COMMON", experience: 20 },
        CASKET = { id: 405, level: 16, chance: "ALMOST_IMPOSSIBLE", experience: 100 },
        OYSTER = { id: 407, level: 16, chance: "EXTREMELY_RARE", experience: 80 },
        TROUT = { id: 335, level: 20, chance: "VERY_COMMON", experience: 50 },
        COD = { id: 341, level: 23, chance: "VERY_COMMON", experience: 45 },
        PIKE = { id: 349, level: 25, chance: "VERY_COMMON", experience: 60 },
        SLIMY_EEL = { id: 3379, level: 28, chance: "EXTREMELY_RARE", experience: 65 },
        SALMON = { id: 331, level: 30, chance: "VERY_COMMON", experience: 70 },
        TUNA = { id: 359, level: 35, chance: "VERY_COMMON", experience: 80 },
        CAVE_EEL = { id: 5001, level: 38, chance: "SOMETIMES", experience: 80 },
        LOBSTER = { id: 377, level: 40, chance: "VERY_COMMON", experience: 90 },
        BASS = { id: 363, level: 46, chance: "SOMETIMES", experience: 100 },
        SWORDFISH = { id: 371, level: 50, chance: "COMMON", experience: 100 },
        LAVA_EEL = { id: 2148, level: 53, chance: "VERY_COMMON", experience: 60 },
        SHARK = { id: 383, level: 76, chance: "COMMON", experience: 110 }
    }

            private id: number;

            /**
             * The level needed to be able to catch the fish.
             */
            private level: number;

            /**
             * The chance of catching this fish (when grouped with other fishes).
             */
            private chance: Chance;

            /**
             * The experience gained from catching this fish.
             */
            private experience: number;

            public getId(): number {
        return this.id;
    }
            
            public getLevel(): number {
        return this.level;
    }
            
            public getChance(): Chance {
        return this.chance;
    }
            
            public getExperience(): number {
        return this.experience;
    }

    class AttackToolRandomEvent extends Task {
        private static DEFENCE_ANIM = new Animation(404);
        private static PROJECTILE_ID = 94;
        private player: Player;
        private tool: FishingTool;
        private fishSpot: NPC;
        private tick: number;
        private deletedTool: boolean;

        constructor(player: Player, tool: BlessingTool, fishSpot: NPC) {
            super();
            this.player = player;
            this.tool = tool;
            this.fishSpot = fishSpot;
            this.tick = 0;
            this.deletedTool = false;
        }
    }               
            
            protected execute() {
        switch (this.tick) {
            case 0:
                //Fire projectile at player.
                new Projectile(this.fishSpot, this.player, this.PROJECTILE_ID, 40, 70, 31, 33).sendProjectile();
                break;
            case 2:
                //Defence animation..
                this.player.performAnimation(this.DEFENCE_ANIM);
                break;
            case 3:
                //Delete tool from inventory and put on ground..
                if (this.player.getInventory().contains(this.tool.getId())) {
                    this.player.getInventory().delete(this.tool.getId(), 1);
                    this.deletedTool = true;
                }
                break;
            case 4:
                //Spawn tool on ground if it was deleted from inventory..
                if (this.deletedTool) {
                    ItemOnGroundManager.register(this.player, new Item(this.tool.getId()));
                    this.player.getPacketSender().sendMessage("A big fish attacked and you were forced to drop your " + ItemDefinition.forId(this.tool.getId()).getName().toLowerCase() + ".");
                }
                protected execute() {
                    switch (this.tick) {
                        case 0:
                            //Fire projectile at player.
                            new Projectile(this.fishSpot, this.player, this.PROJECTILE_ID, 40, 70, 31, 33).sendProjectile();
                            break;
                        case 2:
                            //Defence animation..
                            this.player.performAnimation(this.DEFENCE_ANIM);
                            break;
                        case 3:
                            //Delete tool from inventory and put on ground..
                            if (this.player.getInventory().contains(this.tool.getId())) {
                                this.player.getInventory().delete(this.tool.getId(), 1);
                                this.deletedTool = true;
                            }
                            break;
                        case 4:
                            //Spawn tool on ground if it was deleted from inventory..
                            if (this.deletedTool) {
                                ItemOnGroundManager.register(this.player, new Item(this.tool.getId()));
                                this.player.getPacketSender().sendMessage("A big fish attacked and you were forced to drop your " + ItemDefinition.forId(this.tool.getId()).getName().toLowerCase() + ".");
                            }
                            stop();
                            break;
                    }
                    tick++;
                }
        }
    }
}