class Emotes {
    public static doEmote(player: Player, button: number) {
        const data = EmoteData.forId(button);
        if (data) {
            animation(player, data.animation, data.graphic);
            return true;
        }

        if (button === 19052) {
            const cape = Skillcape.forId(player.getEquipment().getItems()[Equipment.CAPE_SLOT].getId());
            if (cape) {
                if (cape !== Skillcape.QUEST_POINT) {
                    if (cape.ordinal() < Object.values(Skill).length) {
                        const skill = Object.values(Skill)[cape.ordinal()] as Skill;
                        const level = SkillManager.getMaxAchievingLevel(skill);
                        if (player.getSkillManager().getMaxLevel(skill) < level) {
                            player.getPacketSender().sendMessage(`You need ${skill.getName()} level of at least ${level} to do this emote.`);
                            return false;
                        }
                    } else {
                        // custom capes
                    }
                }
                animation(player, cape.getAnimation(), cape.getGraphic());
            }
            return true;
        }
        return false;
    }

    function animation(player: Player, anim: Animation, graphic: Graphic) {
    if (CombatFactory.inCombat(player)) {
        player.getPacketSender().sendMessage("You cannot do this right now.");
        return;
    }

    player.getSkillManager().stopSkillable();
    player.getMovementQueue().reset();

    if (anim) {
        player.performAnimation(anim);
    }
    if (graphic) {
        player.performGraphic(graphic);
    }
}

class EmoteData {
    private static emotes: Map<number, EmoteData> = new Map();

    public animation: Animation;
    public graphic: Graphic;
    private button: number;

    constructor(button: number, animation: Animation, graphic: Graphic) {
        this.button = button;
        this.animation = animation;
        this.graphic = graphic;
    }

    static forId(button: number): EmoteData | undefined {
        return EmoteData.emotes.get(button);
    }

    static init() {
        for (const key in EmoteData) {
            if (isNaN(Number(key))) {
                const emote = EmoteData[key];
                EmoteData.emotes.set(emote.button, emote);
            }
        }
    }
}
EmoteData.init();
}


enum EmoteData {
    YES = 168,
    NO = 169,
    BOW = 164,
    ANGRY = 165,
    THINK = 162,
    WAVE = 163,
    SHRUG = 13370,
    CHEER = 171,
    BECKON = 167,
    LAUGH = 170,
    JUMP_FOR_JOY = 13366,
    YAWN = 13368,
    DANCE = 166,
    JIG = 13363,
    SPIN = 13364,
    HEADBANG = 13365,
    CRY = 161,
    KISS = 11100,
    PANIC = 13362,
    RASPBERRY = 13367,
    CRAP = 172,
    SALUTE = 13369,
    GOBLIN_BOW = 13383,
    GOBLIN_SALUTE = 13384,
    GLASS_BOX = 667,
    CLIMB_ROPE = 6503,
    LEAN = 6506,
    GLASS_WALL = 666,
    ZOMBIE_WALK = 18464,
    ZOMBIE_DANCE = 18465,
    SCARED = 15166,
    RABBIT_HOP = 18686,

    /*ZOMBIE_HAND(15166, new Animation(7272), new Graphic(1244)),
		SAFETY_FIRST(6540, new Animation(8770), new Graphic(1553)),
		AIR_GUITAR(11101, new Animation(2414), new Graphic(1537)),
		SNOWMAN_DANCE(11102, new Animation(7531), null),
		FREEZE(11103, new Animation(11044), new Graphic(1973))*/;

    constructor(
        public readonly id: number,
        public readonly animation: Animation,
        public readonly graphic: Graphic
    ) { }
      
        static forId(id: number): EmoteData | undefined {
    return Object.values(EmoteData).find(emoteData => emoteData.id === id);
}


