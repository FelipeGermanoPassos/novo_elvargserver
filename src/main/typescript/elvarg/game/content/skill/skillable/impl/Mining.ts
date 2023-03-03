export class Mining extends DefaultSkillable {
    private rockObject: GameObject;
    private rock: Rock;
    private pickaxe: Optional<Pickaxe> = Optional.empty();

    constructor(rockObject: GameObject, rock: Rock) {
        this.rockObject = rockObject;
        this.rock = rock;
    }

    public start(player: Player) {
        player.getPacketSender().sendMessage("You swing your pickaxe at the rock..");
        super.start(player);
    }

    public startAnimationLoop(player: Player) {
        let animLoop = new Task(6, player, true) {
            protected execute() {
                player.performAnimation(this.pickaxe.get().getAnimation());
            }
    };
    TaskManager.submit(animLoop);
    this.getTasks().add(animLoop);
    }

    public onCycle(player: Player) {
    PetHandler.onSkill(player, Skill.MINING);
}

    public finishedCycle(player: Player) {
    if (rock.getOreId() > 0) {
        player.getInventory().add(rock.getOreId(), 1);
        player.getPacketSender().sendMessage("You get some ores.");
    }
    if (rock.xpReward > 0) {
        player.getSkillManager().addExperience(Skill.MINING, rock.getXpReward());
    }
    cancel(player);
    if (rock == Rock.CASTLE_WARS_ROCKS) {
        let id = rockObject.getId() + 1;
        let loc = rockObject.getLocation();
        let face = rockObject.getFace();
        ObjectManager.deregister(rockObject, false);
        if (id == 4439) {
            ObjectManager.deregister(new GameObject(-1, loc, 10, face, null), true);
            return;
        }
        ObjectManager.register(new GameObject(id, loc, 10, face, null), true);
        return;
    }
    TaskManager.submit(new TimedObjectReplacementTask(rockObject,
        new GameObject(2704, rockObject.getLocation(), 10, 0, player.getPrivateArea()),
        rock.getRespawnTimer()));
}

public cyclesRequired(player: Player): number {
    let cycles: number = rock.getCycles() + Misc.getRandom(4);
    cycles -= player.getSkillManager().getCurrentLevel(Skill.MINING) * 0.1;
    cycles -= cycles * pickaxe.get().getSpeed();

    return Math.max(3, Math.floor(cycles));
}

function hasRequirements(player: Player): boolean {
    //Attempt to find a pickaxe..
    let pickaxe: Pickaxe | undefined;
    for (let a of Pickaxe.values()) {
        if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() == a.getId()
            || player.getInventory().contains(a.getId())) {

            //If we have already found a pickaxe,
            //don't select others that are worse or can't be used
            if (pickaxe) {
                if (player.getSkillManager().getMaxLevel(Skill.MINING) < a.getRequiredLevel()) {
                    continue;
                }
                if (a.getRequiredLevel() < pickaxe.getRequiredLevel()) {
                    continue;
                }
            }

            pickaxe = a;
        }
    }

    //Check if we found one..
    if (!pickaxe) {
        player.getPacketSender().sendMessage("You don't have a pickaxe which you can use.");
        return false;
    }

    //Check if we have the required level to mine this {@code rock} using the {@link Pickaxe} we found..
    if (player.getSkillManager().getCurrentLevel(Skill.MINING) < pickaxe.getRequiredLevel()) {
        player.getPacketSender().sendMessage("You don't have a pickaxe which you have the required Mining level to use.");
        return false;
    }

    //Check if we have the required level to mine this {@code rock}..
    if (player.getSkillManager().getCurrentLevel(Skill.MINING) < rock.getRequiredLevel()) {
        player.getPacketSender().sendMessage("You need a Mining level of at least " + rock.getRequiredLevel() + " to mine this rock.");
        return false;
    }

    //Finally, check if the rock object remains there.
    //Another player may have mined it already.
    if (!MapObjects.exists(rockObject)) {
        return false;
    }

    return super.hasRequirements(player);
}
function loopRequirements(): boolean {
    return true;
}

function allowFullInventory(): boolean {
    return false;
}

function getTreeObject(): GameObject {
    return rockObject;
}

class Pickaxe {
    constructor(
        private id: number,
        private requiredLevel: number,
        private animation: Animation,
        private speed: number) { }

    getId(): number {
        return this.id;
    }

    getRequiredLevel(): number {
        return this.requiredLevel;
    }

    getAnimation(): Animation {
        return this.animation;
    }

    getSpeed(): number {
        return this.speed;
    }
}

interface Rock {
    ids: number[],
    requiredLevel: number,
    experience: number,
    oreId: number,
    respawnTimer: number,
    stamina: number
}

const rocks: Map<number, Rock> = new Map<number, Rock>();

// initialize the rocks map in the constructor
for (const t of Object.values(Rock)) {
    for (const obj of t.ids) {
        rocks.set(obj, t);
    }
    rocks.set(t.oreId, t);
}

class Rock {
    ids: number[];
    oreId: number;
    requiredLevel: number;
    experience: number;
    cycles: number;
    respawnTimer: number;

    constructor(ids: number[], requiredLevel: number, experience: number, oreId: number, cycles: number, respawnTimer: number) {
        this.ids = ids;
        this.requiredLevel = requiredLevel;
        this.experience = experience;
        this.oreId = oreId;
        this.cycles = cycles;
        this.respawnTimer = respawnTimer;
    }

    public static forObjectId(objectId: number): Rock | undefined {
        return rocks.get(objectId);
    }

    getRespawnTimer(): number {
        return this.respawnTimer;
    }

    getRequiredLevel(): number {
        return this.requiredLevel;
    }

    getXpReward(): number {
        return this.experience;
    }

    getOreId(): number {
        return oreId;
    }

    public getCycles(): number {
        return cycles;
    }


enum Rock {
    CLAY = { ids: [9711, 9712, 9713, 15503, 15504, 15505], requiredLevel: 1, experience: 5, oreId: 434, respawnTimer: 11, stamina: 2 },
    COPPER = { ids: [7453], requiredLevel: 1, experience: 18, oreId: 436, respawnTimer: 12, stamina: 4 },
    TIN = { ids: [7486], requiredLevel: 1, experience: 18, oreId: 438, respawnTimer: 12, stamina: 4 },
    IRON = { ids: [7455, 7488], requiredLevel: 15, experience: 35, oreId: 440, respawnTimer: 13, stamina: 5 },
    SILVER = { ids: [7457], requiredLevel: 20, experience: 40, oreId: 442, respawnTimer: 14, stamina: 7 },
    COAL = { ids: [7456], requiredLevel: 30, experience: 50, oreId: 453, respawnTimer: 15, stamina: 7 },
    GOLD = { ids: [9720, 9721, 9722, 11951, 11183, 11184, 11185, 2099], requiredLevel: 40, experience: 65, oreId: 444, respawnTimer: 15, stamina: 10 },
    MITHRIL = { ids: [7492, 7459], requiredLevel: 50, experience: 80, oreId: 447, respawnTimer: 17, stamina: 11 },
    ADAMANTITE = { ids: [7460], requiredLevel: 70, experience: 95, oreId: 449, respawnTimer: 18, stamina: 14 },
    RUNITE = { ids: [14859, 4860, 2106, 2107, 7461], requiredLevel: 85, experience: 125, oreId: 451, respawnTimer: 23, stamina: 45 },
    CASTLE_WARS_ROCKS = { ids: [4437, 4438], requiredLevel: 1, experience: 0, oreId: -1, respawnTimer: 12, stamina: -1 },
}



enum Pickaxe {
    BRONZE = { id: 1265, requiredLevel: 1, animation: new Animation(625), speed: 0.03 },
    IRON = { id: 1267, requiredLevel: 1, animation: new Animation(626), speed: 0.05 },
    STEEL = { id: 1269, requiredLevel: 6, animation: new Animation(627), speed: 0.09 },
    MITHRIL = { id: 1273, requiredLevel: 21, animation: new Animation(628), speed: 0.13 },
    ADAMANT = { id: 1271, requiredLevel: 31, animation: new Animation(629), speed: 0.16 },
    RUNE = { id: 1275, requiredLevel: 41, animation: new Animation(624), speed: 0.20 },
    DRAGON = { id: 15259, requiredLevel: 61, animation: new Animation(624), speed: 0.25 },
}
