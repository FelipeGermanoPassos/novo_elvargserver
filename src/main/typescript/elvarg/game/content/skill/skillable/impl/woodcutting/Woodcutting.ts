class Woodcutting extends DefaultSkillable {
    // The GameObject to cut down.
    private treeObject: GameObject;
    // The treeObject as an enumerated type which contains information about it, such as required level.
    private tree: Tree;
    // The axe we're using to cut down the tree.
    private axe: Axe | undefined;

    constructor(treeObject: GameObject, tree: Tree) {
        super();
        this.treeObject = treeObject;
        this.tree = tree;
    }

    public start(player: Player) {
        player.getPacketSender().sendMessage("You swing your axe at the tree..");
        super.start(player);
    }

    public startAnimationLoop(player: Player) {
        const animLoop = new Task(4, player, true, () => {
            Sounds.sendSound(player, Sound.WOODCUTTING_CHOP);
            player.performAnimation(this.axe.getAnimation());
        });
        TaskManager.submit(animLoop);
        this.getTasks().add(animLoop);

        const soundLoop = new Task(2, player, false, () => {
            Sounds.sendSound(player, Sound.WOODCUTTING_CHOP);
        });
        TaskManager.submit(soundLoop);
        this.getTasks().add(soundLoop);
    }

    public onCycle(player: Player) {
        PetHandler.onSkill(player, Skill.WOODCUTTING);
    }

    public finishedCycle(player: Player) {
        //Add logs..
        player.getInventory().add(this.tree.getLogId(), 1);
        player.getPacketSender().sendMessage("You get some logs.");
        //Add exp..
        player.getSkillManager().addExperience(Skill.WOODCUTTING, this.tree.getXpReward());
        //The chance of getting a bird nest from a tree is 1/256 each time you would normally get a log, regardless of the type of tree.
        if (Misc.getRandom(NEST_DROP_CHANCE) == 1) {
            handleDropNest(player);
        }
        //Regular trees should always despawn.
        //Multi trees are random.
        if (!this.tree.isMulti() || Misc.getRandom(15) >= 2) {
            //Stop skilling...
            this.cancel(player);

            //Despawn object and respawn it after a short period of time...
            TaskManager.submit(new TimedObjectReplacementTask(this.treeObject, new GameObject(1343, this.treeObject.getLocation(), 10, 0, player.getPrivateArea()), this.tree.getRespawnTimer()));
        }
    }

    function cyclesRequired(player: Player): number {
    let cycles = tree.getCycles() + Misc.getRandom(4);
    cycles -= player.getSkillManager().getMaxLevel(Skill.WOODCUTTING) * 0.1;
    cycles -= cycles * axe.get().getSpeed();
    return Math.max(3, (int) cycles);
}

hasRequirements(player: Player): boolean {
    //Attempt to find an axe..
    axe = Optional.empty();
    for (let a of Axe.values()) {
        if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() == a.getId()
            || player.getInventory().contains(a.getId())) {

            //If we have already found an axe,
            //don't select others that are worse or can't be used
            if (axe.isPresent()) {
                if (player.getSkillManager().getMaxLevel(Skill.WOODCUTTING) < a.getRequiredLevel()) {
                    continue;
                }
                if (a.getRequiredLevel() < axe.get().getRequiredLevel()) {
                    continue;
                }
            }

            axe = Optional.of(a);
        }
    }

    //Check if we found one..
    if (!axe.isPresent()) {
        player.getPacketSender().sendMessage("You don't have an axe which you can use.");
        return false;
    }

    //Check if we have the required level to cut down this {@code tree} using the {@link Axe} we found..
    if (player.getSkillManager().getCurrentLevel(Skill.WOODCUTTING) < axe.get().getRequiredLevel()) {
        player.getPacketSender().sendMessage("You don't have an axe which you have the required Woodcutting level to use.");
        return false;
    }

    //Check if we have the required level to cut down this {@code tree}..
    if (player.getSkillManager().getCurrentLevel(Skill.WOODCUTTING) < tree.getRequiredLevel()) {
        player.getPacketSender().sendMessage("You need a Woodcutting level of at least " + tree.getRequiredLevel() + " to cut this tree.");
        return false;
    }

    //Finally, check if the tree object remains there.
    //Another player may have cut it down already.
    if (!MapObjects.exists(treeObject)) {
        return false;
    }

    return super.hasRequirements(player);
}

    public loopRequirements(): boolean {
    return true;
}

        public allowFullInventory(): boolean {
    return false;
}
        
        public getTreeObject(): GameObject {
    return this.treeObject;
}

class Axe {
    private id: number;
    private requiredLevel: number;
    private speed: number;
    private animation: Animation;

    constructor(id: number, level: number, speed: number, animation: Animation) {
        this.id = id;
        this.requiredLevel = level;
        this.speed = speed;
        this.animation = animation;
    }

    public getId(): number {
        return this.id;
    }

    public getRequiredLevel(): number {
        return this.requiredLevel;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getAnimation(): Animation {
        return this.animation;
    }
}
interface TreeInfo {
    objects: number[];
    requiredLevel: number;
    xpReward: number;
    logId: number;
    cycles: number;
    respawnTimer: number;
    multi: boolean;
}

const trees = new Map<number, TreeInfo>();

(() => {
    for (const t of Object.values(Tree)) {
        for (const obj of t.objects) {
            trees.set(obj, t);
        }
    }
})();

class Tree {
    private objects: number[];
    private requiredLevel: number;
    private xpReward: number;
    private logId: number;
    private cycles: number;
    private respawnTimer: number;
    private multi: boolean;

    constructor(req: number, xp: number, log: number, obj: number[], cycles: number, respawnTimer: number, multi: boolean) {
        this.requiredLevel = req;
        this.xpReward = xp;
        this.logId = log;
        this.objects = obj;
        this.cycles = cycles;
        this.respawnTimer = respawnTimer;
        this.multi = multi;
    }

    public static forObjectId(objectId: number): Tree | undefined {
        return trees.get(objectId);
    }

    public isMulti(): boolean {
        return this.multi;
    }

    public getCycles(): number {
        return this.cycles;
    }

    public getRespawnTimer(): number {
        return this.respawnTimer;
    }

    public getLogId(): number {
        return this.logId;
    }

    public getXpReward(): number {
        return this.xpReward;
    }

    public getRequiredLevel(): number {
        return this.requiredLevel;
    }
}

enum Axe {
    BRONZE_AXE = { id: 1351, level: 1, speed: 0.03, animation: new Animation(879) },
    IRON_AXE = { id: 1349, level: 1, speed: 0.05, animation: new Animation(877) },
    STEEL_AXE = { id: 1353, level: 6, speed: 0.09, animation: new Animation(875) },
    BLACK_AXE = { id: 1361, level: 6, speed: 0.11, animation: new Animation(873) },
    MITHRIL_AXE = { id: 1355, level: 21, speed: 0.13, animation: new Animation(871) },
    ADAMANT_AXE = { id: 1357, level: 31, speed: 0.16, animation: new Animation(869) },
    RUNE_AXE = { id: 1359, level: 41, speed: 0.19, animation: new Animation(867) },
    DRAGON_AXE = { id: 6739, level: 61, speed: 0.25, animation: new Animation(2846) },
    INFERNAL = { id: 13241, level: 61, speed: 0.3, animation: new Animation(2117) },
}

enum Tree {
    NORMAL = {
        level: 1,
        exp: 25,
        logId: 1511,
        logs: [2091, 2890, 1276, 1277, 1278, 1279, 1280, 1282, 1283, 1284, 1285, 1286, 1289, 1290, 1291, 1315, 1316, 1318, 1319, 1330, 1331, 1332, 1365, 1383, 1384, 3033, 3034, 3035, 3036, 3881, 3882, 3883, 5902, 5903, 5904],
        time: 10,
        tick: 8,
        member: false,
    },
    ACHEY = {
        level: 1,
        exp: 25,
        logId: 2862,
        logs: [2023],
        time: 13,
        tick: 9,
        member: false,
    },
    OAK = {
        level: 15,
        exp: 38,
        logId: 1521,
        logs: [1281, 3037, 9734, 1751],
        time: 14,
        tick: 11,
        member: true,
    },
    WILLOW = {
        level: 30,
        exp: 68,
        logId: 1519,
        logs: [1308, 5551, 5552, 5553, 1750, 1758],
        time: 15,
        tick: 14,
        member: true,
    },
    TEAK = {
        level: 35,
        exp: 85,
        logId: 6333,
        logs: [9036],
        time: 16,
        tick: 16,
        member: true,
    },
    DRAMEN = {
        level: 36,
        exp: 88,
        logId: 771,
        logs: [1292],
        time: 16,
        tick: 17,
        member: true,
    },
    MAPLE = {
        level: 45,
        exp: 100,
        logId: 1517,
        logs: [1759, 4674],
        time: 17,
        tick: 18,
        member: true,
    },
    MAHOGANY = {
        level: 50,
        exp: 125,
        logId: 6332,
        logs: [9034],
        time: 17,
        tick: 20,
        member: true,
    },
    YEW = {
        level: 60,
        exp: 175,
        logId: 1515,
        logs: [1309, 1753],
        time: 18,
        tick: 28,
        member: true,
    },
    MAGIC = {
        level: 75,
        exp: 250,
        logId: 1513,
        logs: [1761],
        time: 20,
        tick: 40,
        member: true,
    },
    REDWOOD = {
        level: 90,
        exp: 380,
        logId: 19669,
        logs: [],
        time: 22,
        tick: 43,
        member: true,
    },
}