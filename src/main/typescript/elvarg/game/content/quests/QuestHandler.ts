export class QuestHandler {
    public static NOT_STARTED = 0;

    public static updateQuestTab(player: Player) {
        player.getPacketSender().sendString("QP: " + player + " ", 3985);

        for (const questRecord of Object.values(Quests)) {
            const quest = questRecord.get();

            player.getPacketSender().sendString(quest.questTabStringId(), questRecord.getProgressColor(player) + questRecord.getName());
        }
    }

    public static firstClickNpc(player: Player, npc: NPC) {
        for (const questRecord of Object.values(Quests)) {
            if (questRecord.quest.firstClickNpc(player, npc)) {
                return true;
            }
        }

        // Return false if no Quest handled this NPC click
        return false;
    }

    private name: string;
    private quest: Quest;

    constructor(name: string, quest: Quest) {
        this.name = name;
        this.quest = quest;
    }

    public getName() {
        return this.name;
    }

    public get() {
        return this.quest;
    }

    public getProgress(player: Player) {
        if (!player.getQuestProgress().has(this.ordinal())) {
            return 0;
        }

        return player.getQuestProgress().get(this.ordinal());
    }

    setProgress(player: Player, progress: number) {
        player.getQuestProgress().set(this.ordinal, progress);
        QuestHandler.updateQuestTab(player);
    }

    getProgressColor(player: Player): string {
        let questProgress = this.getProgress(player);
        if (questProgress === 0) {
            return "@red@";
        }

        let completeProgress = this.get().completeStatus();
        if (questProgress < completeProgress) {
            return "@yel@";
        }

        return "@gre@";
    }

    static forButton(button: number): Quests | null {
        for (const q of Quests.values()) {
            if (q.get().questTabButtonId() === button) {
                return q;
            }
        }
        return null;
    }

    static getOrdinal(quest: Quest): number {
        for (const q of Quests.values()) {
            if (q.get() === quest) {
                return q.ordinal;
            }
        }
        return -1;
    }

    showRewardInterface(player: Player, lines: string[], itemID: number) {
        let questName = this.getName();

        player.getPacketSender().sendString(`You have completed ${questName}!`, 12144);
        player.getPacketSender().sendString(`${this.get().questPointsReward()}`, 12147);

        for (let i = 0; i < 5; i++) {
            player.getPacketSender().sendString(lines[i], 12150 + i);
        }

        if (itemID > 0) {
            player.getPacketSender().sendInterfaceModel(12145, itemID, 250);
        }

        player.getPacketSender().sendInterface(12140);
    }

    static handleQuestButtonClick(player: Player, buttonId: number): boolean {
        let quest = Quests.forButton(buttonId);
        if (!quest) {
            return false;
        }

        let status = player.getQuestProgress().get(quest.ordinal);
        quest.get().showQuestLog(player, status);
        return true;
    }

    static clearQuestLogInterface(player: Player) {
        for (let i = 8144; i < 8195; i++) {
            player.getPacketSender().sendString("", i);
        }
    }
}

enum Quests {
    COOKS_ASSISTANT = "Cook's Assistant", new CooksAssistant();
    BLACK_KNIGHT = "Black Knights' Fortress", 28164;
    DEMON_SLAYER = "Demon Slayer", 28166;
    DORICS_QUEST = "Doric's Quest", 28168;
    DRAGON_SLAYER = "Dragon Slayer", 28215;
    ERNEST = "Ernest the Chicken", 28171;
    GOBLIN = "Goblin Diplomacy", 28170;
    IMP_CATCHER = "Imp Catcher", 28172;
    KNIGHTS_SWORD = "The Knight's Sword", 28178;
    PIRATES_TREASURE = "Pirates Treasure", 28173;
    PRINCE_RESCUE = "Prince Ali Rescue", 28174;
    RESTLESS_GHOST = "Restless Ghost", 28169;
    ROMEO_JULIET = "Romeo Juliet", 28175;
    RUNE_MYSTERIES = "Rune Mysteries", 28167;
    SHEEP_SHEARER = "Sheep Shearer", 28176;
    SHIELD_OF_ARRAV = "Shield of Arrav", 28177;
    VAMPYRE_SLAYER = "Vampyre Slayer", 28179;
    WITCHS_POTION = "Witchs Potion", 28180;
    BETWEEN_A_ROCK = "Between A Rock", 49228;
    CHOMPY = "Big Chompy Bird Hunting", 2161;
    BIOHAZARD = "Biohazard", 28124;
    CABIN = "Cabin Fever", 68102;
    CLOCK = "Clock Tower", 28185;
    DEATH = "Death Plateau", 32246;
    CREATURE = "Creature of Fenkenstrain", 47097;
    DESERT_TREASURE = "Desert Treasure", 50052;
    DRUDIC_RITUAL = "Drudic Ritual", 28187;
    DWARF_CANNON = "Dwarf Cannon", 28188;
    EADGARS_RUSE = "Eadgars Ruse", 33231;
    DEVIOUS = "Devious Minds", 61225;
    DIGSITE = "Digsite Quest", 28186;
    ELEMENTAL = "Elemental Workshop", 29035;
    ENAKHRA = "Enakhra's Lamet", 63021;
    FAIRY1 = "A Fairy Tale Pt. 1", 27075;
    FAMILYCREST = "Family Crest", 28189;
    FEUD = "The Feud", 50036;
    FIGHT_ARENA = "Fight Arena", 28190;
    FISHING_CONTEST = "Fishing Contest", 28191;
    FORGETTABLE_TABLE = "Forgettable Tale...", 50089;
    FREMMY_TRIALS = "The Fremennik Trials", 39131;
    GARDEN = "Garden of Tranquillity", 57012;
    GHOSTS = "Ghosts Ahoy", 47250;
    GIANT_DWARF = "The Giant Dwarf", 53009;
    GOLEM = "The Golem", 50039;
    GRAND_TREE = "The Grand Tree", 28193;
    HAND_IN_THE_SAND = "The Hand in the Sand", 63000;
    HAUNTED_MINE = "Haunted Mine", 46081;
    HAZEEL = "Hazeel Cult", 28194;
    HEROES = "Heroes Quest", 28195;
    HOLY = "Holy Grail", 28196;
    HORROR = "Horror from the Deep", 39151;
    ITCHLARIN = "Itchlarin's Little Helper", 17156;
    AID_OF_MYREQUE = "In Aid of the Myreque", 72085;
    SEARCH_OF_MYREQUE = "In Search of the Myreque", 46131;
    JUNGLE_POTION = "Jungle Potion", 28197;
    LEGENDS_QUEST = "Legends Quest", 28198;
    LOST_CITY = "Lost City", 28199;
    LOST_TRIBE = "The Lost Tribe", 52077;
    MAKING_HISTORY = "Making History", 60127;
    MONKEY_MADNESS = "Monkey Madness", 43124;
    MERLINS_CRYSTAL = "Merlins Crystal", 28200;
    MONKS_FRIEND = "Monks Friend", 28201;
    MOUNTAIN_DAUGHTER = "Mountain Daughter", 48101;
    MOURNINGS_END_1 = "Mourning's Ends Part 1", 54150;
    MOURNINGS_END_2 = "Mourning's Ends Part 2", 23139;
    MURDER_MYSTERY = "Murder Mystery", 28202;
    NATURE_SPIRIT = "Nature Spirit", 31201;
    OBSERVATORY = "Observatory Quest", 28203;
    ONE_SMALL_FAVOUR = "One Small Favour", 48057;
    PLAGUE_CITY = "Plague City", 28204;
    PRIEST_IN_PERIL = "Priest in Peril", 31179;
    RAG_AND_BONE_MAN = "Rag and Bone Man", 72252;
    RAT_CATCHERS = "Rat Catchers", 60139;
    RECIPE = "Recipe for Disaster", 71130;
    RECRUITMENT_DRIVE = "Recruitment Drive",  2156;
    REGICIDE = "Regicide", 33128;
    ROVING_ELVES = "Roving Elves", 47017;
    RUM_DEAL = "Rum Deal", 58064;
    SCORPION_CATCHER = "Scorpion Catcher", 28205;
    SEA_SLUG = "Sea Slug Quest", 28206;
    SHADES_OF_MORTON = "Shades of Mort'ton", 35009;
    SHADOW_OF_THE_STORM = "Shadow of the Storm", 59248;
    SHEEP_HERDER = "Sheep Herder", 28207;
    SHILO_VILLAGE = "Shilo Village", 28208;
    SOULS_BANE = "A Soul's Bane", 28250;
    SPIRITS_OF_THE_ELID = "Spirits of The Elid", 60232;
    SWAN_SON = "Swan Song", G = 249;
    TAI_BWO = "Tai Bwo Wannai Trio",  = 6204;
    TWO_CATS = "A Tail of Two Cats", 59131;
    TEARS_OF_GUTHIX = "Tears of Guthix", 12206;
    TEMPLE_OF_IKOV = "Temple of Ikov", 28210;
    THRONE_OF_MISCELLANIA = "Throne of Miscellania", 25118;
    TOURIST_TRAP = "The Tourist Trap", 28211;
    TREE_GNOME_VILLAGE = "Tree Gnome Village", 28212;
    TRIBAL_TOTEM = "Tribal Totem", 28213;
    TROLL_ROMANCE = "Troll Romance", 46082;
    TROLL_STRONGHOL = "Troll Stronghold", 191;
    UNDERGROUND_PASS = "Underground Pass", 38199;
    WANTED = "Wanted", 23136;
    WATCHTOWER = "Watch Tower", 28181;
    WATERFALL = "Waterfall Quest", 28182;
    WITCH = "Witch's House", 28183;
    ZOGRE = "Zogre Flesh Eaters", 52044;  
}



