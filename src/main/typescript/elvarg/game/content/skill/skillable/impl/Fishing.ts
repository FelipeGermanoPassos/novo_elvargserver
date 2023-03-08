import { Skill } from "../../../../model/Skill";
import { Item } from "../../../../model/Item";
import { TaskManager } from "../../../../task/TaskManager"
import { PetHandler } from "../../../PetHandler";
import { Player } from "../../../../entity/impl/player/Player";
import { NPC } from "../../../../entity/impl/npc/NPC";
import { ItemDefinition } from "../../../../definition/ItemDefinition";
import { Task } from "../../../../task/Task";
import { Misc } from "../../../../../util/Misc";
import { DefaultSkillable } from "./DefaultSkillable";
import { Chance } from '../../../../../util/Chance'

class FishingTask extends Task {
    constructor(n: number, player: Player, b: boolean) {
        super(n, b);
    }
    execute(): void {

    }

}

export class Fishing extends DefaultSkillable {
    public loopRequirements(): boolean {
        return true;
    }
    public allowFullInventory(): boolean {
        return false;
    }
    public static readonly CASKET_ITEMS: Item[] = [new Item(1061), new Item(592), new Item(1059), new Item(995, 100000), new Item(4212), new Item(995, 50000), new Item(401), new Item(995, 150000), new Item(407)];
    private fishSpot: NPC;
    private tool: FishingTool;

    public constructor(fishSpot: NPC, tool: FishingTool) {
        super();
        this.fishSpot = fishSpot;
        this.tool = tool;
    }

    public hasRequirements(player: Player): boolean {
        if (!player.getInventory().contains(this.tool.getId())) {
            player.getPacketSender().sendMessage("You need a " + ItemDefinition.forId(this.tool.getId()).getName().toLowerCase() + " to do this.");
            return false;
        }

        if (player.getSkillManager().getCurrentLevel(Skill.FISHING) < this.tool.getLevel()) {
            player.getPacketSender().sendMessage("You need a Fishing level of at least " + this.tool.getLevel() + " to do this.");
            return false;
        }

        if (this.tool.getNeeded() > 0) {
            if (!player.getInventory().contains(this.tool.getNeeded())) {
                player.getPacketSender().sendMessage("You do not have any " + ItemDefinition.forId(this.tool.getNeeded()).getName().toLowerCase() + "(s).");
                return false;
            }
        }

        return super.hasRequirements(player);
    }

    public start(player: Player) {
        player.getPacketSender().sendMessage("You begin to fish..");
        super.start(player);
    }

    public startAnimationLoop(player: Player) {
        const animLoop = new FishingTask(4, player, true);
        TaskManager.submit(animLoop);
        this.getTasks().add(animLoop);
    }

    public onCycle(player: Player) {
        PetHandler.onSkill(player, Skill.FISHING);

        //Handle random event..
        if (Misc.getRandom(1400) == 1) {
            const attackTool = new AttackToolRandomEvent(player, this.tool, this.fishSpot);
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
        if (this.tool == BlessingTool.BIG_NET) {
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
    }

    public static cyclesRequired(player: Player): number {
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
    public static determineFish(player: Player, tool: FishingTool): Fish {
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

class Fish {
    public static readonly SHRIMP = new Fish(317, 1, Chance.VERY_COMMON, 10);
    public static readonly SARDINE = new Fish(327, 5, Chance.VERY_COMMON, 20);
    public static readonly HERRING = new Fish(345, 10, Chance.VERY_COMMON, 30);
    public static readonly ANCHOVY = new Fish(321, 15, Chance.SOMETIMES, 40);
    public static readonly MACKEREL = new Fish(353, 16, Chance.VERY_COMMON, 20);
    public static readonly CASKET = new Fish(405, 16, Chance.ALMOST_IMPOSSIBLE, 100);
    public static readonly OYSTER = new Fish(407, 16, Chance.EXTREMELY_RARE, 80);
    public static readonly TROUT = new Fish(335, 20, Chance.VERY_COMMON, 50);
    public static readonly COD = new Fish(341, 23, Chance.VERY_COMMON, 45);
    public static readonly PIKE = new Fish(349, 25, Chance.VERY_COMMON, 60);
    public static readonly SLIMY_EEL = new Fish(3379, 28, Chance.EXTREMELY_RARE, 65);
    public static readonly SALMON = new Fish(331, 30, Chance.VERY_COMMON, 70);
    public static readonly TUNA = new Fish(359, 35, Chance.VERY_COMMON, 80);
    public static readonly CAVE_EEL = new Fish(5001, 38, Chance.SOMETIMES, 80);
    public static readonly LOBSTER = new Fish(377, 40, Chance.VERY_COMMON, 90);
    public static readonly BASS = new Fish(363, 46, Chance.SOMETIMES, 100);
    public static readonly SWORDFISH = new Fish(371, 50, Chance.COMMON, 100);
    public static readonly LAVA_EEL = new Fish(2148, 53, Chance.VERY_COMMON, 60);
    public static readonly SHARK = new Fish(383, 76, Chance.COMMON, 110);

    private id: number;
    private level: number;
    private chance: Chance;
    private experience: number;

    constructor(id: number, level: number, chance: Chance, experience: number) {
        this.id = id;
        this.level = level;
        this.chance = chance;
        this.experience = experience;
    }

    getId(): number {
        return this.id;
    }

    getLevel(): number {
        return this.level;
    }

    getChance(): Chance {
        return this.chance;
    }

    getExperience(): number {
        return this.experience;
    }
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


export class FishingTool {
    static NET = new FishingTool(303, 1, -1, 3, 621, [Fish.SHRIMP, Fish.ANCHOVY]);
    static BIG_NET = new FishingTool(305, 16, -1, 3, 620, [Fish.MACKEREL, Fish.OYSTER, Fish.COD, Fish.BASS, Fish.CASKET]);
    static FISHING_ROD = new FishingTool(307, 5, 313, 1, 622, [Fish.SARDINE, Fish.HERRING, Fish.PIKE, Fish.SLIMY_EEL, Fish.CAVE_EEL, Fish.LAVA_EEL]);
    static FLY_FISHING_ROD = new FishingTool(309, 20, 314, 1, 622, [Fish.TROUT, Fish.SALMON]);
    static HARPOON = new FishingTool(311, 35, -1, 4, 618, [Fish.TUNA, Fish.SWORDFISH]);
    static SHARK_HARPOON = new FishingTool(311, 35, -1, 6, 618, [Fish.SHARK]);
    static LOBSTER_POT = new FishingTool(301, 40, -1, 4, 619, [Fish.LOBSTER]);

    private id: number;
    private level: number;
    private needed: number;
    private speed: number;
    private animation: number;
    private fish: Fish[];

    constructor(
        id: number,
        level: number,
        needed: number,
        speed: number,
        animation: number,
        fish: Fish[]
    ) {
        this.id = id;
        this.level = level;
        this.needed = needed;
        this.speed = speed;
        this.animation = animation;
        this.fish = fish;
    }

    getId(): number {
        return this.id;
    }

    getLevel(): number {
        return this.level;
    }

    getNeeded(): number {
        return this.needed;
    }

    getSpeed(): number {
        return this.speed;
    }

    getAnimation(): number {
        return this.animation;
    }

    getFish(): Fish[] {
        return this.fish;
    }
}