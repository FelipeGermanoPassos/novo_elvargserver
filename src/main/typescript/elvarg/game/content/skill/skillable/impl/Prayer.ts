class Prayer {
    private static BONE_BURY = new Animation(827);
    private static BONE_BURY_DELAY = 1000;
    private static GILDED_ALTAR_EXPERIENCE_MULTIPLIER = 3.5;

    static buryBone(player: Player, itemId: number) {
        let b = BuriableBone.forId(itemId);
        if (b) {
            if (player.getClickDelay().elapsed(Prayer.BONE_BURY_DELAY)) {
                player.getSkillManager().stopSkillable();
                player.getPacketSender().sendInterfaceRemoval();
                player.performAnimation(Prayer.BONE_BURY);
                player.getPacketSender().sendMessage("You dig a hole in the ground..");
                player.getInventory().delete(itemId, 1);
                setTimeout(() => {
                    player.getPacketSender().sendMessage("..and bury the " + ItemDefinition.forId(itemId).getName() + ".");
                    player.getSkillManager().addExperience(Skill.PRAYER, b.getXp());
                }, 1000);
                player.getClickDelay().reset();
            }
            return true;
        }
        return false;
    }

    const bones: Map<number, BuriableBone> = new Map();

    for(const b in BuriableBone) {
    if (typeof BuriableBone[b] === "object") {
        bones.set(BuriableBone[b].boneId, BuriableBone[b]);
    }
}

class BuriableBone {
    private boneId: number;
    private xp: number;
    constructor(boneId: number, buryXP: number) {
        this.boneId = boneId;
        this.xp = buryXP;
    }
    public static forId(itemId: number): BuriableBone | undefined {
        return bones.get(itemId);
    }

    public getBoneID(): number {
        return this.boneId;
    }

    public getXp(): number {
        return this.xp;
    }
}

class AltarOffering extends DefaultSkillable {
    private static ALTAR_OFFERING_ANIMATION = { id: 713 };
    private static ALTAR_OFFERING_GRAPHIC = { id: 624 };
    private bone: BuriableBone;
    private altar: GameObject;
    private amount: number;

    constructor(bone: BuriableBone, altar: GameObject, amount: number) {
        super();
        this.bone = bone;
        this.altar = altar;
        this.amount = amount;
    }

    public startAnimationLoop(player: Player) {
        let task: NodeJS.Timeout = setInterval(() => {
            player.performAnimation(ALTAR_OFFERING_ANIMATION);
        }, 2 * 1000);
        this.getTasks().add(task);
    }

    finishedCycle(player: Player) {
        if (this.amount-- <= 0) {
            clearInterval(this.getTasks()[0]);
        }
        this.altar.performGraphic(ALTAR_OFFERING_GRAPHIC);
        player.getInventory().delete(this.bone.getBoneID(), 1);
        player.getSkillManager().addExperience(Skill.PRAYER, (int)(this.bone.getXp() * GILDED_ALTAR_EXPERIENCE_MULTIPLIER));
        player.getPacketSender().sendMessage("The gods are pleased with your offering.");
    }

    public cyclesRequired(): number {
        return 2;
    }

    public hasRequirements(player: Player): boolean {
        //Check if player has bones..
        if (!player.getInventory().contains(this.bone.getBoneID())) {
            return false;
        }
        //Check if we offered all bones..
        if (this.amount <= 0) {
            return false;
        }
        return super.hasRequirements(player);
    }

    public loopRequirements(): boolean {
        return true;
    }

    public allowFullInventory(): boolean {
        return true;
    }
}

enum BuriableBone {
    BONES = { id: 526, xp: 5 },
    BAT_BONES = { id: 530, xp: 6 },
    WOLF_BONES = { id: 2859, xp: 6 },
    BIG_BONES = { id: 532, xp: 15 },
    BABYDRAGON_BONES = { id: 534, xp: 30 },
    JOGRE_BONE = { id: 3125, xp: 15 },
    ZOGRE_BONES = { id: 4812, xp: 23 },
    LONG_BONES = { id: 10976, xp: 15 },
    CURVED_BONE = { id: 10977, xp: 15 },
    SHAIKAHAN_BONES = { id: 3123, xp: 25 },
    DRAGON_BONES = { id: 536, xp: 72 },
    FAYRG_BONES = { id: 4830, xp: 84 },
    RAURG_BONES = { id: 4832, xp: 96 },
    OURG_BONES = { id: 14793, xp: 140 },
    DAGANNOTH_BONES = { id: 6729, xp: 125 },
    WYVERN_BONES = { id: 6816, xp: 72 },
    LAVA_DRAGON_BONES = { id: 11943, xp: 85 },
}