class Cooking extends ItemCreationSkillable {
    protected static ANIMATION = new Animation(896);

    private object: GameObject;
    private cookable: Cookable;

    constructor(object: GameObject, cookable: Cookable, amount: number) {
        super(
            [new RequiredItem(new Item(cookable.getRawItem()), true)],
            new Item(cookable.getCookedItem()), amount,
            Optional.of(new AnimationLoop(ANIMATION, 4)),
            cookable.getLevelReq(), cookable.getXp(), Skill.COOKING
        );
        this.object = object;
        this.cookable = cookable;
    }

    static success(player: Player, burnBonus: number, levelReq: number, stopBurn: number): boolean {
        if (player.getSkillManager().getCurrentLevel(Skill.COOKING) >= stopBurn) {
            return true;
        }
        let burn_chance = (45.0 - burnBonus);
        let cook_level = player.getSkillManager().getCurrentLevel(Skill.COOKING);
        let lev_needed = (double) levelReq;
        let burn_stop = (double) stopBurn;
        let multi_a = (burn_stop - lev_needed);
        let burn_dec = (burn_chance / multi_a);
        let multi_b = (cook_level - lev_needed);
        burn_chance -= (multi_b * burn_dec);
        let randNum = Misc.getRandomDouble() * 100.0;
        return burn_chance <= randNum;
    }

    finishedCycle(player: Player) {
        // Decrement amount left to cook..
        decrementAmount();

        // Delete raw food..
        player.getInventory().delete(cookable.getRawItem(), 1);

        // Add burnt or cooked item..
        if (success(player, 3, cookable.getLevelReq(), cookable.getStopBurn())) {
            player.getInventory().add(cookable.getCookedItem(), 1);
            player.getPacketSender()
                .sendMessage("You cook the " + ItemDefinition.forId(cookable.getRawItem()).getName() + ".");
            player.getSkillManager().addExperience(Skill.COOKING, cookable.getXp());
        } else {
            player.getInventory().add(cookable.getBurntItem(), 1);
            player.getPacketSender()
                .sendMessage("You burn the " + ItemDefinition.forId(cookable.getRawItem()).getName() + ".");
        }
    }

    hasRequirements(player: Player): boolean {
        // If we're using a fire, make sure to check it's still there.
        if (object.getId() == ObjectIdentifiers.FIRE_5
            && !ObjectManager.exists(ObjectIdentifiers.FIRE_5, object.getLocation())) {
            return false;
        }
        return super.hasRequirements(player);
    }

    enum Cookable {
        SHRIMP(317, 315, 7954, 1, 30, 33, "shrimp"),
        ANCHOVIES(321, 319, 323, 1, 30, 34, "anchovies"),
        TROUT(335, 333, 343, 15, 70, 50, "trout"),
        COD(341, 339, 343, 18, 75, 54, "cod"),
        SALMON(331, 329, 343, 25, 90, 58, "salmon"),
        TUNA(359, 361, 367, 30, 100, 58, "tuna"),
        LOBSTER(377, 379, 381, 40, 120, 74, "lobster"),
        BASS(363, 365, 367, 40, 130, 75, "bass"),
        SWORDFISH(371, 373, 375, 45, 140, 86, "swordfish"),
        MONKFISH(7944, 7946, 7948, 62, 150, 91, "monkfish"),
        SHARK(383, 385, 387, 80, 210, 94, "shark"),
        SEA_TURTLE(395, 397, 399, 82, 212, 105, "sea turtle"),
        MANTA_RAY(389, 391, 393, 91, 217, 99, "manta ray");
    
        private static cookables: { [key: number]: Cookable } = {};
    
        rawItem: number;
        cookedItem: number;
        burntItem: number;
        levelReq: number;
        xp: number;
        stopBurn: number;
        name: string;
    
        static init() {
            for (let c of Cookable) {
                cookables[c.rawItem] = c;
                cookables[c.cookedItem] = c;
            }
        }
    
        static getForItem(item: number): Cookable | undefined {
            return cookables[item];
        }
    
        constructor(rawItem: number, cookedItem: number, burntItem: number, levelReq: number, xp: number, stopBurn: number, name: string) {
            this.rawItem = rawItem;
            this.cookedItem = cookedItem;
            this.burntItem = burntItem;
            this.levelReq = levelReq;
            this.xp = xp;
            this.stopBurn = stopBurn;
            this.name = name;
        }

        static getForItem(item: number) {
            return Optional.ofNullable(cookables.get(item));
            }
            
            get rawItem(): number {
            return this.rawItem;
            }
            
            get cookedItem(): number {
            return this.cookedItem;
            }
            
            get burntItem(): number {
            return this.burntItem;
            }
            
            get levelReq(): number {
            return this.levelReq;
            }
            
            get xp(): number {
            return this.xp;
            }
            
            get stopBurn(): number {
            return this.stopBurn;
            }
            
            get name(): string {
            return this.name;
            }
        }
    }
}
       