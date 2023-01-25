export class Smithing extends ItemIdentifiers {
    static handleButton(player: Player, button: number): boolean {
        for (let bar of Bar.values()) {
            for (let b of bar.getButtons()) {
                if (b[0] == button) {
                    let amount = b[1];
                    if (amount == -1) {
                        player.setEnteredAmountAction((input: number) => {
                            player.getSkillManager().startSkillable(new Smelting(bar, input));
                        });
                        player.getPacketSender().sendEnterAmountPrompt("Enter amount of bars to smelt:");
                    } else {
                        player.getSkillManager().startSkillable(new Smelting(bar, amount));
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public RUNE_ITEMS = new Set<SmithableEquipment>([
        SmithableEquipment.RUNE_DAGGER, SmithableEquipment.RUNE_AXE, SmithableEquipment.RUNE_MACE, SmithableEquipment.RUNE_MED_HELM,
        SmithableEquipment.RUNE_DART_TIPS, SmithableEquipment.RUNE_SWORD, SmithableEquipment.RUNE_ARROWTIPS, SmithableEquipment.RUNE_SCIMITAR,
        SmithableEquipment.RUNE_LONG_SWORD, SmithableEquipment.RUNE_THROWING_KNIVES, SmithableEquipment.RUNE_FULL_HELM,
        SmithableEquipment.RUNE_SQUARE_SHIELD, SmithableEquipment.RUNE_WARHAMMER, SmithableEquipment.RUNE_BATTLE_AXE,
        SmithableEquipment.RUNE_CHAINBODY, SmithableEquipment.RUNE_KITE_SHIELD, SmithableEquipment.RUNE_CLAWS,
        SmithableEquipment.RUNE_2_HAND_SWORD, SmithableEquipment.RUNE_PLATESKIRT, SmithableEquipment.RUNE_PLATELEGS,
        SmithableEquipment.RUNE_PLATEBODY, SmithableEquipment.RUNE_NAILS, SmithableEquipment.RUNE_UNF_BOLTS, SmithableEquipment.ADAMANT_DAGGER, SmithableEquipment.ADAMANT_AXE, SmithableEquipment.ADAMANT_MACE, SmithableEquipment.ADAMANT_MED_HELM, SmithableEquipment.ADAMANT_DART_TIPS, SmithableEquipment.ADAMANT_SWORD, SmithableEquipment.ADAMANT_ARROWTIPS, SmithableEquipment.ADAMANT_SCIMITAR, SmithableEquipment.ADAMANT_LONG_SWORD,
        SmithableEquipment.ADAMANT_THROWING_KNIVES, SmithableEquipment.ADAMANT_FULL_HELM, SmithableEquipment.ADAMANT_SQUARE_SHIELD, SmithableEquipment.ADAMANT_WARHAMMER, SmithableEquipment.ADAMANT_BATTLE_AXE, SmithableEquipment.ADAMANT_CHAINBODY, SmithableEquipment.ADAMANT_KITE_SHIELD,
        SmithableEquipment.ADAMANT_CLAWS, SmithableEquipment.ADAMANT_2_HAND_SWORD, SmithableEquipment.ADAMANT_PLATESKIRT, SmithableEquipment.ADAMANT_PLATELEGS, SmithableEquipment.ADAMANT_PLATEBODY, SmithableEquipment.ADAMANT_NAILS, SmithableEquipment.ADAMANT_UNF_BOLTS, SmithableEquipment.MITHRIL_DAGGER, SmithableEquipment.MITHRIL_AXE, SmithableEquipment.MITHRIL_MACE, SmithableEquipment.MITHRIL_MED_HELM, SmithableEquipment.MITHRIL_DART_TIPS, SmithableEquipment.MITHRIL_SWORD, SmithableEquipment.MITHRIL_ARROWTIPS, SmithableEquipment.MITHRIL_SCIMITAR, SmithableEquipment.MITHRIL_LONG_SWORD,
        SmithableEquipment.MITHRIL_THROWING_KNIVES, SmithableEquipment.MITHRIL_FULL_HELM, SmithableEquipment.MITHRIL_SQUARE_SHIELD, SmithableEquipment.MITHRIL_WARHAMMER, SmithableEquipment.MITHRIL_BATTLE_AXE, SmithableEquipment.MITHRIL_CHAINBODY, SmithableEquipment.MITHRIL_KITE_SHIELD,
        SmithableEquipment.MITHRIL_CLAWS, SmithableEquipment.MITHRIL_2_HAND_SWORD, SmithableEquipment.MITHRIL_PLATESKIRT, SmithableEquipment.MITHRIL_PLATELEGS, SmithableEquipment.MITHRIL_PLATEBODY, SmithableEquipment.MITHRIL_NAILS, SmithableEquipment.MITHRIL_UNF_BOLTS,
        SmithableEquipment.STEEL_DAGGER, SmithableEquipment.STEEL_AXE, SmithableEquipment.STEEL_MACE, SmithableEquipment.STEEL_MED_HELM, SmithableEquipment.STEEL_DART_TIPS, SmithableEquipment.STEEL_SWORD, SmithableEquipment.STEEL_ARROWTIPS, SmithableEquipment.STEEL_SCIMITAR, SmithableEquipment.STEEL_LONG_SWORD,
        SmithableEquipment.STEEL_THROWING_KNIVES, SmithableEquipment.STEEL_FULL_HELM, SmithableEquipment.STEEL_SQUARE_SHIELD, SmithableEquipment.STEEL_WARHAMMER, SmithableEquipment.STEEL_BATTLE_AXE, SmithableEquipment.STEEL_CHAINBODY, SmithableEquipment.STEEL_KITE_SHIELD,
        SmithableEquipment.STEEL_CLAWS, SmithableEquipment.STEEL_2_HAND_SWORD, SmithableEquipment.STEEL_PLATESKIRT, SmithableEquipment.STEEL_PLATELEGS, SmithableEquipment.STEEL_PLATEBODY, SmithableEquipment.STEEL_NAILS, SmithableEquipment.STEEL_UNF_BOLTS, SmithableEquipment.STEEL_STUDS, SmithableEquipment.CANNONBALL,
        SmithableEquipment.IRON_DAGGER, SmithableEquipment.IRON_AXE, SmithableEquipment.IRON_MACE, SmithableEquipment.IRON_MED_HELM, SmithableEquipment.IRON_DART_TIPS, SmithableEquipment.IRON_SWORD, SmithableEquipment.IRON_ARROWTIPS, SmithableEquipment.IRON_SCIMITAR, SmithableEquipment.IRON_LONG_SWORD,
        SmithableEquipment.IRON_THROWING_KNIVES, SmithableEquipment.IRON_FULL_HELM, SmithableEquipment.IRON_SQUARE_SHIELD, SmithableEquipment.IRON_WARHAMMER, SmithableEquipment.IRON_BATTLE_AXE, SmithableEquipment.IRON_CHAINBODY, SmithableEquipment.IRON_KITE_SHIELD,
        SmithableEquipment.IRON_CLAWS, SmithableEquipment.IRON_2_HAND_SWORD, SmithableEquipment.IRON_PLATESKIRT, SmithableEquipment.IRON_PLATELEGS, SmithableEquipment.IRON_PLATEBODY, SmithableEquipment.IRON_NAILS, SmithableEquipment.IRON_UNF_BOLTS,
        SmithableEquipment.BRONZE_DAGGER, SmithableEquipment.BRONZE_AXE, SmithableEquipment.BRONZE_MACE, SmithableEquipment.BRONZE_MED_HELM, SmithableEquipment.BRONZE_DART_TIPS, SmithableEquipment.BRONZE_SWORD, SmithableEquipment.BRONZE_ARROWTIPS, SmithableEquipment.BRONZE_SCIMITAR, SmithableEquipment.BRONZE_LONG_SWORD,
        SmithableEquipment.BRONZE_THROWING_KNIVES, SmithableEquipment.BRONZE_FULL_HELM, SmithableEquipment.BRONZE_SQUARE_SHIELD, SmithableEquipment.BRONZE_WARHAMMER, SmithableEquipment.BRONZE_BATTLE_AXE, SmithableEquipment.BRONZE_CHAINBODY, SmithableEquipment.BRONZE_KITE_SHIELD,
        SmithableEquipment.BRONZE_CLAWS, SmithableEquipment.BRONZE_2_HAND_SWORD, SmithableEquipment.BRONZE_PLATESKIRT, SmithableEquipment.BRONZE_PLATELEGS, SmithableEquipment.BRONZE_PLATEBODY, SmithableEquipment.BRONZE_NAILS, SmithableEquipment.BRONZE_UNF_BOLTS]);
}

class SmithableEquipment {
    private name: string;
    private barId: number;
    private itemId: number;
    private amount: number;
    private itemFrame: number;
    private itemSlot: number;
    private nameFrame: number;
    private requiredLevel: number;
    private barsRequired: number;
    private barFrame: number;

    constructor(name: string, barId: number, itemId: number, amount: number, itemFrame: number, itemSlot: number, nameFrame: number, requiredLevel: number, barsRequired: number, barFrame: number) {
        this.name = name;
        this.barId = barId;
        this.itemId = itemId;
        this.amount = amount;
        this.itemFrame = itemFrame;
        this.itemSlot = itemSlot;
        this.nameFrame = nameFrame;
        this.requiredLevel = requiredLevel;
        this.barsRequired = barsRequired;
        this.barFrame = barFrame;
    }

    getItemId(): number {
        return this.itemId;
    }

    getAmount(): number {
        return this.amount;
    }

    getItemFrame(): number {
        return this.itemFrame;
    }

    getItemSlot(): number {
        return this.itemSlot;
    }

    getNameFrame(): number {
        return this.nameFrame;
    }

    getRequiredLevel(): number {
        return this.requiredLevel;
    }

    getBarsRequired(): number {
        return this.barsRequired;
    }

    getBarFrame(): number {
        return this.barFrame;
    }

    getBarId(): number {
        return this.barId;
    }

    getName(): string {
        return this.name;
    }

    private static Map<Integer, Bar> smeltables = new HashMap<Integer, Bar>();

    static {
        for (Bar s : Bar.values()) {
            smeltables.put(s.getBar(), s);
        }
    }

    private final int bar;
    private final RequiredItem[] ores;
    private final int levelReq;
    private final int xpReward;
    private final int frame;
    private final int[][] buttons;
    private final Optional<ImmutableSet<SmithableEquipment>> items;

Bar(int bar, RequiredItem[] ores, int levelReq, int xpReward, int frame, int[][] buttons, Optional < ImmutableSet < SmithableEquipment >> items) {
    this.bar = bar;
    this.ores = ores;
    this.levelReq = levelReq;
    this.xpReward = xpReward;
    this.frame = frame;
    this.buttons = buttons;
    this.items = items;
}

        public static Optional < Bar > forBarId(int barId) {
    return Optional.ofNullable(smeltables.get(barId));
}

        public int getBar() {
    return bar;
}

        public getOres(): RequiredItem[] {
    return this.ores;
}

        public getLevelReq(): number {
    return this.levelReq;
}

        public getXpReward(): number {
    return this.xpReward;
}

        public getFrame(): number {
    return this.frame;
}

        public getItems(): Optional < ImmutableSet < SmithableEquipment >> {
    return this.items;
}

        public getButtons(): number[][] {
    return this.buttons;
}


    }

export class EquipmentMaking {
    public static readonly EQUIPMENT_CREATION_INTERFACE_ID: number = 994;
    public static readonly EQUIPMENT_CREATION_COLUMN_1: number = 1119;
    public static readonly EQUIPMENT_CREATION_COLUMN_2: number = 1120;
    public static readonly EQUIPMENT_CREATION_COLUMN_3: number = 1121;
    public static readonly EQUIPMENT_CREATION_COLUMN_4: number = 1122;
    public static readonly EQUIPMENT_CREATION_COLUMN_5: number = 1123;

    export function openInterface(player: Player) {
    let bar = Optional.empty<Bar>();
    for (let b of Bar.values()) {
        if (!b.getItems().isPresent()) {
            continue;
        }
        if (player.getInventory().contains(b.getBar())) {
            if (player.getSkillManager().getCurrentLevel(Skill.SMITHING) >= b.getLevelReq()) {
                bar = Optional.of(b);
            }
        }
    }

    if (bar.isPresent()) {
        for (let i = 1119; i <= 1123; i++) {
            player.getPacketSender().clearItemOnInterface(i);
        }

        player.getPacketSender()
            .sendString(1132, "")
            .sendString(1096, "")
            .sendString(1135, "")
            .sendString(1134, "");

        for (let b of bar.get().getItems().get()) {
            player.getPacketSender().sendSmithingData(b.getItemId(), b.getItemSlot(), b.getItemFrame(), b.getAmount());
            let barColor = "@red@";
            let itemColor = "@bla@";
            if (player.getInventory().getAmount(b.getBarId()) >= b.getBarsRequired()) {
                barColor = "@gre@";
            }
            if (player.getSkillManager().getCurrentLevel(Skill.SMITHING) >= b.getRequiredLevel()) {
                itemColor = "@whi@";
            }
            player.getPacketSender().sendString(b.getBarFrame(), barColor + b.getBarsRequired() + " " + (b.getBarsRequired() > 1 ? "bars" : "bar"));
            player.getPacketSender().sendString(b.getNameFrame(), itemColor + b.getName());
        }

        player.getPacketSender().sendInterface(EQUIPMENT_CREATION_INTERFACE_ID);
    } else {
        player.getPacketSender().sendMessage("You don't have any bars in your inventory which can be used with your Smithing level.");
    }
}

public static initialize(player: Player, itemId: number, interfaceId: number, slot: number, amount: number) {
    //First verify the item we're trying to make..
    for (let smithable of SmithableEquipment.values()) {
        if (smithable.getItemId() === itemId && smithable.getItemFrame() === interfaceId
            && smithable.getItemSlot() === slot) {
            //Start making items..
            player.getSkillManager().startSkillable(new ItemCreationSkillable(
                [new RequiredItem(new Item(HAMMER)), new RequiredItem(new Item(smithable.getBarId(), smithable.getBarsRequired()), true)],
                new Item(smithable.getItemId(), smithable.getAmount()), amount, Optional.of(new AnimationLoop(new Animation(898), 3)), smithable.getRequiredLevel(), 10, Skill.SMITHING));
            break;
        }
    }
}
class Smelting extends ItemCreationSkillable {
    private static readonly ANIMATION = new Animation(896);
    private readonly bar: Bar;

    constructor(bar: Bar, amount: number) {
        super(
            [bar.getOres()],
            new Item(bar.getBar()),
            amount,
            Optional.of(new AnimationLoop(ANIMATION, 4)),
            bar.getLevelReq(),
            bar.getXpReward(),
            Skill.SMITHING
        );
        this.bar = bar;
    }

    finishedCycle(player: Player) {
        if (this.bar === Bar.IRON_BAR) {
            if (Misc.getRandom(2) === 1) {
                player.getPacketSender().sendMessage("The Iron ore was too impure and you were unable to make an Iron bar.");
                this.filterRequiredItems(r => r.isDelete()).forEach(r => player.getInventory().delete(r.getItem()));
                this.decrementAmount();
                return;
            }
        }

        super.finishedCycle(player);
    }
}

    
}


enum Bar {
    BRONZE_BAR = {
        id: 2349,
        requiredItems: [{ item: { id: 438, amount: 1 }, required: true }, { item: { id: 436, amount: 1 }, required: true }],
        level: 1,
        experience: 120,
        interfaceId: 2405,
        buttons: [[3987, 1], [3986, 5], [2807, 10], [2414, -1]],
        smithableEquipment: Optional.of(SmithableEquipment.BRONZE_ITEMS)
    },
    IRON_BAR = {
        id: 2351,
        requiredItems: [{ item: { id: 440, amount: 1 }, required: true }],
        level: 15,
        experience: 540,
        interfaceId: 2406,
        buttons: [[3991, 1], [3990, 5], [3989, 10], [3988, -1]],
        smithableEquipment: Optional.of(SmithableEquipment.IRON_ITEMS)
    },
    SILVER_BAR = {
        id: 2355,
        requiredItems: [{ item: { id: 442, amount: 1 }, required: true }],
        level: 20,
        experience: 725,
        interfaceId: 2407,
        buttons: [[3995, 1], [3994, 5], [3993, 10], [3992, -1]],
        smithableEquipment: Optional.empty()
    },
    STEEL_BAR = {
        id: 2353,
        requiredItems: [
            { item: { id: 440, amount: 1 }, required: true },
            { item: { id: 453, amount: 2 }, required: true }
        ],
        level: 30,
        experience: 1350,
        smithFrame: 2409,
        furnaceCoords: [[3999, 1], [3998, 5], [3997, 10], [3996, -1]],
        smithableEquipment: Optional.of(SmithableEquipment.STEEL_ITEMS)
    },
    GOLD_BAR = {
        id: 2357,
        requiredItems: [
            { item: { id: 444, amount: 1 }, required: true }
        ],
        level: 40,
        experience: 2400,
        smithFrame: 2410,
        furnaceCoords: [[4003, 1], [4002, 5], [4001, 10], [4000, -1]],
        smithableEquipment: Optional.empty()
    },
    MITHRIL_BAR = {
        id: 2359,
        requiredItems: [
            { item: { id: 447, amount: 1 }, required: true },
            { item: { id: 453, amount: 4 }, required: true }
        ],
        level: 50,
        experience: 3450,
        smithFrame: 2411,
        furnaceCoords: [[7441, 1], [7440, 5], [6397, 10], [4158, -1]],
        smithableEquipment: Optional.of(SmithableEquipment.MITHRIL_ITEMS)
    },
    ADAMANTITE_BAR = {
        barId: 2361,
        requiredItems: [
            { itemId: 449, required: true },
            { itemId: 453, required: true, amount: 6 }
        ],
        requiredLevel: 70,
        experience: 4500,
        animation: 2412,
        smithLocations: [[7446, 1], [7444, 5], [7443, 10], [7442, -1]],
        smithableEquipment: SmithableEquipment.ADAMANT_ITEMS
    },
    RUNITE_BAR = {
        barId: 2363,
        requiredItems: [
            { itemId: 451, required: true },
            { itemId: 453, required: true, amount: 8 }
        ],
        requiredLevel: 85,
        experience: 5560,
        animation: 2413,
        smithLocations: [[7450, 1], [7449, 5], [7448, 10], [7447, -1]],
        smithableEquipment: SmithableEquipment.RUNE_ITEMS
    }
}

export enum SmithableEquipment {
    BRONZE_DAGGER = { name: "Dagger", barId: 2349, itemId: 1205, amount: 1, item1Id: 1119, item1Amount: 0, item2Id: 1094, item2Amount: 1, level: 1, xp: 1125 },
    BRONZE_AXE = { name: "Axe", barId: 2349, itemId: 1351, amount: 1, item1Id: 1120, item1Amount: 0, item2Id: 1091, item2Amount: 1, level: 1, xp: 1126 },
    BRONZE_MACE = { name: "Mace", barId: 2349, itemId: 1422, amount: 1, item1Id: 1120, item1Amount: 1, item2Id: 1093, item2Amount: 2, level: 1, xp: 1129 },
    BRONZE_MED_HELM = { name: "Med helm", barId: 2349, itemId: 1139, amount: 1, item1Id: 1122, item1Amount: 0, item2Id: 1102, item2Amount: 3, level: 1, xp: 1127 },
    BRONZE_DART_TIPS = { name: "Dart tips", barId: 2349, itemId: 819, amount: 10, item1Id: 1123, item1Amount: 0, item2Id: 1107, item2Amount: 4, level: 1, xp: 1128 },
    BRONZE_SWORD = { name: "Sword", barId: 2349, itemId: 1277, amount: 1, item1Id: 1119, item1Amount: 1, item2Id: 1085, item2Amount: 4, level: 1, xp: 1124 },
    BRONZE_ARROWTIPS = { name: "Arrowtips", barId: 2349, itemId: 39, amount: 15, item1Id: 1123, item1Amount: 1, item2Id: 1108, item2Amount: 5, level: 1, xp: 1130 },
    BRONZE_SCIMITAR = { name: "Scimitar", barId: 2349, itemId: 1321, amount: 1, item1Id: 1119, item1Amount: 2, item2Id: 1087, item2Amount: 5, level: 2, xp: 1116 },
    BRONZE_LONG_SWORD = { name: "Long sword", bardId: 2349, itemId: 1291, amount: 1, item1Id: 1119, item1Amount: 3, item2Id: 1086, item2Amount: 6, level: 2, xp: 1089 },
    BRONZE_THROWING_KNIVES = { name: "Throwing knives", bardId: 2349, itemId: 864, amount: 5, item1Id: 1123, item1Amount: 2, item2Id: 1106, item2Amount: 7, level: 1, xp: 1131 },
    BRONZE_FULL_HELM = { name: "Full helm", bardId: 2349, itemId: 1155, amount: 1, item1Id: 1122, item1Amount: 1, item2Id: 1103, item2Amount: 7, level: 2, xp: 1113 },
    BRONZE_SQUARE_SHIELD = { name: "Square shield", bardId: 2349, itemId: 1173, amount: 1, item1Id: 1122, item1Amount: 2, item2Id: 1104, item2Amount: 8, level: 2, xp: 1114 },
    BRONZE_WARHAMMER = { name: "Warhammer", bardId: 2349, itemId: 1337, amount: 1, item1Id: 1120, item1Amount: 2, item2Id: 1083, item2Amount: 9, level: 3, xp: 1118 },
    BRONZE_BATTLE_AXE = { name: "Battle axe", bardId: 2349, itemId: 1375, amount: 1, item1Id: 1120, item1Amount: 3, item2Id: 1092, item2Amount: 10, level: 3, xp: 1095 },
    BRONZE_CHAINBODY = { name: "Chainbody", bardId: 2349, itemId: 1103, amount: 1, item1Id: 1121, item1Amount: 0, item2Id: 1098, item2Amount: 11, level: 3, xp: 1109 },
    BRONZE_KITE_SHIELD = { name: "Kite shield", bardId: 2349, itemId: 1189, amount: 1, item1Id: 1122, item1Amount: 3, item2Id: 1105, item2Amount: 12, level: 3, xp: 1115 },
    BRONZE_CLAWS = { name: "Claws", bardId: 2349, itemId: 3095, amount: 1, item1Id: 1120, item1Amount: 4, item2Id: 8429, item2Amount: 13, level: 2, xp: 8428 },
    BRONZE_2_HAND_SWORD = { name: "2 hand sword", bardId: 2349, itemId: 1307, amount: 1, item1Id: 1119, item1Amount: 4, item2Id: 1088, item2Amount: 14, level: 3, xp: 1090 },
    BRONZE_PLATESKIRT = { name: "Plate skirt", bardId: 2349, itemId: 1087, amount: 1, item1Id: 1121, item1Amount: 2, item2Id: 1100, item2Amount: 16, level: 3, xp: 1111 },
    BRONZE_PLATELEGS = { name: "Plate legs", bardId: 2349, itemId: 1075, amount: 1, item1Id: 1121, item1Amount: 1, item2Id: 1099, item2Amount: 16, level: 3, xp: 1110 },
    BRONZE_PLATEBODY = { name: "Plate body", bardId: 2349, itemId: 1117, amount: 1, item1Id: 1121, item1Amount: 3, item2Id: 1101, item2Amount: 18, level: 5, xp: 1112 },
    BRONZE_NAILS = { name: "Nails", bardId: 2349, itemId: 4819, amount: 15, item1Id: 1122, item1Amount: 4, item2Id: 13358, item2Amount: 4, level: 1, xp: 13357 },
    BRONZE_UNF_BOLTS = { name: "Bolts  = {name: unf}", bardId: 2349, itemId: 9375, amount: 10, item1Id: 1121, item1Amount: 4, item2Id: 11461, item2Amount: 3, level: 1, xp: 11459 },
    IRON_DAGGER = { name: "Dagger", bardId: 2351, itemId: 1203, amount: 1, item1Id: 1119, item1Amount: 0, item2Id: 1094, item2Amount: 15, level: 1, xp: 1125 },
    IRON_AXE = { name: "Axe", bardId: 2351, itemId: 1349, amount: 1, item1Id: 1120, item1Amount: 0, item2Id: 1091, item2Amount: 16, level: 1, xp: 1126 },
    IRON_MACE = { name: "Mace", bardId: 2351, itemId: 1420, amount: 1, item1Id: 1120, item1Amount: 1, item2Id: 1093, item2Amount: 17, level: 1, xp: 1129 },
    IRON_MED_HELM = { name: "Med helm", bardId: 2351, itemId: 1137, amount: 1, item1Id: 1122, item1Amount: 0, item2Id: 1102, item2Amount: 18, level: 1, xp: 1127 },
    IRON_DART_TIPS = { name: "Dart tips", bardId: 2351, itemId: 820, amount: 10, item1Id: 1123, item1Amount: 0, item2Id: 1107, item2Amount: 19, level: 1, xp: 1128 },
    IRON_SWORD = { name: "Sword", bardId: 2351, itemId: 1279, amount: 1, item1Id: 1119, item1Amount: 1, item2Id: 1085, item2Amount: 19, level: 1, xp: 1124 },
    IRON_ARROWTIPS = { name: "Arrowtips", bardId: 2351, itemId: 40, amount: 15, item1Id: 1123, item1Amount: 1, item2Id: 1108, item2Amount: 20, level: 1, xp: 1130 },
    IRON_SCIMITAR = { name: "Scimitar", bardId: 2351, itemId: 1323, amount: 1, item1Id: 1119, item1Amount: 2, item2Id: 1087, item2Amount: 20, level: 2, xp: 1116 },
    IRON_LONG_SWORD = { name: "Long sword", bardId: 2351, itemId: 1293, amount: 1, item1Id: 1119, item1Amount: 3, item2Id: 1086, item2Amount: 21, level: 2, xp: 1089 },
    IRON_THROWING_KNIVES = { name: "Throwing knives", bardId: 2351, itemId: 863, amount: 5, item1Id: 1123, item1Amount: 2, item2Id: 1106, item2Amount: 22, level: 1, xp: 1131 },
    IRON_FULL_HELM = { name: "Full helm", bardId: 2351, itemId: 1153, amount: 1, item1Id: 1122, item1Amount: 1, item2Id: 1103, item2Amount: 22, level: 2, xp: 1113 },
    IRON_SQUARE_SHIELD = { name: "Square shield", bardId: 2351, itemId: 1175, amount: 1, item1Id: 1122, item1Amount: 2, item2Id: 1104, item2Amount: 23, level: 2, xp: 1114 },
    IRON_WARHAMMER = { name: "Warhammer", bardId: 2351, itemId: 1335, amount: 1, item1Id: 1120, item1Amount: 2, item2Id: 1083, item2Amount: 24, level: 3, xp: 1118 },
    IRON_BATTLE_AXE = { name: "Battle axe", bardId: 2351, itemId: 1363, amount: 1, item1Id: 1120, item1Amount: 3, item2Id: 1092, item2Amount: 25, level: 3, xp: 1095 },
    IRON_CHAINBODY = { name: "Chainbody", bardId: 2351, itemId: 1101, amount: 1, item1Id: 1121, item1Amount: 0, item2Id: 1098, item2Amount: 26, level: 3, xp: 1109 },
    IRON_KITE_SHIELD = { name: "Kite shield", bardId: 2351, itemId: 1191, amount: 1, item1Id: 1122, item1Amount: 3, item2Id: 1105, item2Amount: 27, level: 3, xp: 1115 },
    IRON_CLAWS = { name: "Claws", bardId: 2351, itemId: 3096, amount: 1, item1Id: 1120, item1Amount: 4, item2Id: 8429, item2Amount: 28, level: 2, xp: 8428 },
    IRON_2_HAND_SWORD = { name: "2 hand sword", bardId: 2351, itemId: 1309, amount: 1, item1Id: 1119, item1Amount: 4, item2Id: 1088, item2Amount: 29, level: 3, xp: 1090 },
    IRON_PLATESKIRT = { name: "Plate skirt", bardId: 2351, itemId: 1081, amount: 1, item1Id: 1121, item1Amount: 2, item2Id: 1100, item2Amount: 31, level: 3, xp: 1111 },
    IRON_PLATELEGS = { name: "Plate legs", bardId: 2351, itemId: 1067, amount: 1, item1Id: 1121, item1Amount: 1, item2Id: 1099, item2Amount: 31, level: 3, xp: 1110 },
    IRON_PLATEBODY = { name: "Plate body", bardId: 2351, itemId: 1115, amount: 1, item1Id: 1121, item1Amount: 3, item2Id: 1101, item2Amount: 33, level: 5, xp: 1112 },
    IRON_NAILS = { name: "Nails", bardId: 2351, itemId: 4820, amount: 15, item1Id: 1122, item1Amount: 4, item2Id: 13358, item2Amount: 19, level: 1, xp: 13357 },
    IRON_UNF_BOLTS = { name: "Bolts  = {name: unf}", bardId: 2351, itemId: 9377, amount: 10, item1Id: 1121, item1Amount: 4, item2Id: 11461, item2Amount: 19, level: 1, xp: 11459 },
    STEEL_DAGGER = { name: "Dagger", bardId: 2353, itemId: 1207, amount: 1, item1Id: 1119, item1Amount: 0, item2Id: 1094, item2Amount: 30, level: 1, xp: 1125 },
    STEEL_AXE = { name: "Axe", bardId: 2353, itemId: 1353, amount: 1, item1Id: 1120, item1Amount: 0, item2Id: 1091, item2Amount: 31, level: 1, xp: 1126 },
    STEEL_MACE = { name: "Mace", bardId: 2353, itemId: 1424, amount: 1, item1Id: 1120, item1Amount: 1, item2Id: 1093, item2Amount: 32, level: 1, xp: 1129 },
    STEEL_MED_HELM = { name: "Med helm", bardId: 2353, itemId: 1141, amount: 1, item1Id: 1122, item1Amount: 0, item2Id: 1102, item2Amount: 33, level: 1, xp: 1127 },
    STEEL_DART_TIPS = { name: "Dart tips", bardId: 2353, itemId: 821, amount: 10, item1Id: 1123, item1Amount: 0, item2Id: 1107, item2Amount: 34, level: 1, xp: 1128 },
    STEEL_SWORD = { name: "Sword", bardId: 2353, itemId: 1281, amount: 1, item1Id: 1119, item1Amount: 1, item2Id: 1085, item2Amount: 34, level: 1, xp: 1124 },
    STEEL_ARROWTIPS = { name: "Arrowtips", bardId: 2353, itemId: 41, amount: 15, item1Id: 1123, item1Amount: 1, item2Id: 1108, item2Amount: 35, level: 1, xp: 1130 },
    STEEL_SCIMITAR = { name: "Scimitar", bardId: 2353, itemId: 1325, amount: 1, item1Id: 1119, item1Amount: 2, item2Id: 1087, item2Amount: 35, level: 2, xp: 1116 },
    STEEL_LONG_SWORD = { name: "Long sword", bardId: 2353, itemId: 1295, amount: 1, item1Id: 1119, item1Amount: 3, item2Id: 1086, item2Amount: 36, level: 2, xp: 1089 },
    STEEL_THROWING_KNIVES = { name: "Throwing knives", bardId: 2353, itemId: 865, amount: 5, item1Id: 1123, item1Amount: 2, item2Id: 1106, item2Amount: 37, level: 1, xp: 1131 },
    STEEL_FULL_HELM = { name: "Full helm", bardId: 2353, itemId: 1157, amount: 1, item1Id: 1122, item1Amount: 1, item2Id: 1103, item2Amount: 37, level: 2, xp: 1113 },
    STEEL_SQUARE_SHIELD = { name: "Square shield", bardId: 2353, itemId: 1177, amount: 1, item1Id: 1122, item1Amount: 2, item2Id: 1104, item2Amount: 38, level: 2, xp: 1114 },
    STEEL_WARHAMMER = { name: "Warhammer", bardId: 2353, itemId: 1339, amount: 1, item1Id: 1120, item1Amount: 2, item2Id: 1083, item2Amount: 39, level: 3, xp: 1118 },
    STEEL_BATTLE_AXE = { name: "Battle axe", bardId: 2353, itemId: 1365, amount: 1, item1Id: 1120, item1Amount: 3, item2Id: 1092, item2Amount: 40, level: 3, xp: 1095 },
    STEEL_CHAINBODY = { name: "Chainbody", bardId: 2353, itemId: 1105, amount: 1, item1Id: 1121, item1Amount: 0, item2Id: 1098, item2Amount: 41, level: 3, xp: 1109 },
    STEEL_KITE_SHIELD = { name: "Kite shield", bardId: 2353, itemId: 1193, amount: 1, item1Id: 1122, item1Amount: 3, item2Id: 1105, item2Amount: 42, level: 3, xp: 1115 },
    STEEL_CLAWS = { name: "Claws", bardId: 2353, itemId: 3097, amount: 1, item1Id: 1120, item1Amount: 4, item2Id: 8429, item2Amount: 43, level: 2, xp: 8428 },
    STEEL_2_HAND_SWORD = { name: "2 hand sword", bardId: 2353, itemId: 1311, amount: 1, item1Id: 1119, item1Amount: 4, item2Id: 1088, item2Amount: 44, level: 3, xp: 1090 },
    STEEL_PLATESKIRT = { name: "Plate skirt", bardId: 2353, itemId: 1083, amount: 1, item1Id: 1121, item1Amount: 2, item2Id: 1100, item2Amount: 46, level: 3, xp: 1111 },
    STEEL_PLATELEGS = { name: "Plate legs", bardId: 2353, itemId: 1069, amount: 1, item1Id: 1121, item1Amount: 1, item2Id: 1099, item2Amount: 46, level: 3, xp: 1110 },
    STEEL_PLATEBODY = { name: "Plate body", bardId: 2353, itemId: 1119, amount: 1, item1Id: 1121, item1Amount: 3, item2Id: 1101, item2Amount: 48, level: 5, xp: 1112 },
    STEEL_NAILS = { name: "Nails", bardId: 2353, itemId: 1539, amount: 15, item1Id: 1122, item1Amount: 4, item2Id: 13358, item2Amount: 34, level: 1, xp: 13357 },
    STEEL_UNF_BOLTS = { name: "Bolts  = {name: unf}", bardId: 2353, itemId: 9378, amount: 10, item1Id: 1121, item1Amount: 4, item2Id: 11461, item2Amount: 33, level: 1, xp: 11459 },
    CANNONBALL = { name: "Cannon ball", bardId: 2353, itemId: 2, amount: 4, item1Id: 1123, item1Amount: 3, item2Id: 1096, item2Amount: 35, level: 1, xp: 1132 },
    STEEL_STUDS = { name: "Studs", bardId: 2353, itemId: 2370, amount: 1, item1Id: 1123, item1Amount: 4, item2Id: 1134, item2Amount: 36, level: 1, xp: 1135 },
    MITHRIL_DAGGER = { name: "Dagger", bardId: 2359, itemId: 1209, amount: 1, item1Id: 1119, item1Amount: 0, item2Id: 1094, item2Amount: 50, level: 1, xp: 1125 },
    MITHRIL_AXE = { name: "Axe", bardId: 2359, itemId: 1355, amount: 1, item1Id: 1120, item1Amount: 0, item2Id: 1091, item2Amount: 51, level: 1, xp: 1126 },
    MITHRIL_MACE = { name: "Mace", bardId: 2359, itemId: 1428, amount: 1, item1Id: 1120, item1Amount: 1, item2Id: 1093, item2Amount: 52, level: 1, xp: 1129 },
    MITHRIL_MED_HELM = { name: "Med helm", bardId: 2359, itemId: 1143, amount: 1, item1Id: 1122, item1Amount: 0, item2Id: 1102, item2Amount: 53, level: 1, xp: 1127 },
    MITHRIL_DART_TIPS = { name: "Dart tips", bardId: 2359, itemId: 822, amount: 10, item1Id: 1123, item1Amount: 0, item2Id: 1107, item2Amount: 54, level: 1, xp: 1128 },
    MITHRIL_SWORD = { name: "Sword", bardId: 2359, itemId: 1285, amount: 1, item1Id: 1119, item1Amount: 1, item2Id: 1085, item2Amount: 54, level: 1, xp: 1124 },
    MITHRIL_ARROWTIPS = { name: "Arrowtips", bardId: 2359, itemId: 42, amount: 15, item1Id: 1123, item1Amount: 1, item2Id: 1108, item2Amount: 55, level: 1, xp: 1130 },
    MITHRIL_SCIMITAR = { name: "Scimitar", bardId: 2359, itemId: 1329, amount: 1, item1Id: 1119, item1Amount: 2, item2Id: 1087, item2Amount: 55, level: 2, xp: 1116 },
    MITHRIL_LONG_SWORD = { name: "Long sword", bardId: 2359, itemId: 1299, amount: 1, item1Id: 1119, item1Amount: 3, item2Id: 1086, item2Amount: 56, level: 2, xp: 1089 },
    MITHRIL_THROWING_KNIVES = { name: "Throwing knives", bardId: 2359, itemId: 866, amount: 5, item1Id: 1123, item1Amount: 2, item2Id: 1106, item2Amount: 57, level: 1, xp: 1131 },
    MITHRIL_FULL_HELM = { name: "Full helm", bardId: 2359, itemId: 1159, amount: 1, item1Id: 1122, item1Amount: 1, item2Id: 1103, item2Amount: 57, level: 2, xp: 1113 },
    MITHRIL_SQUARE_SHIELD = { name: "Square shield", bardId: 2359, itemId: 1181, amount: 1, item1Id: 1122, item1Amount: 2, item2Id: 1104, item2Amount: 58, level: 2, xp: 1114 },
    MITHRIL_WARHAMMER = { name: "Warhammer", bardId: 2359, itemId: 1343, amount: 1, item1Id: 1120, item1Amount: 2, item2Id: 1083, item2Amount: 59, level: 3, xp: 1118 },
    MITHRIL_BATTLE_AXE = { name: "Battle axe", bardId: 2359, itemId: 1369, amount: 1, item1Id: 1120, item1Amount: 3, item2Id: 1092, item2Amount: 60, level: 3, xp: 1095 },
    MITHRIL_CHAINBODY = { name: "Chainbody", bardId: 2359, itemId: 1109, amount: 1, item1Id: 1121, item1Amount: 0, item2Id: 1098, item2Amount: 61, level: 3, xp: 1109 },
    MITHRIL_KITE_SHIELD = { name: "Kite shield", bardId: 2359, itemId: 1197, amount: 1, item1Id: 1122, item1Amount: 3, item2Id: 1105, item2Amount: 62, level: 3, xp: 1115 },
    MITHRIL_CLAWS = { name: "Claws", bardId: 2359, itemId: 3099, amount: 1, item1Id: 1120, item1Amount: 4, item2Id: 8429, item2Amount: 63, level: 2, xp: 8428 },
    MITHRIL_2_HAND_SWORD = { name: "2 hand sword", bardId: 2359, itemId: 1315, amount: 1, item1Id: 1119, item1Amount: 4, item2Id: 1088, item2Amount: 64, level: 3, xp: 1090 },
    MITHRIL_PLATESKIRT = { name: "Plate skirt", bardId: 2359, itemId: 1085, amount: 1, item1Id: 1121, item1Amount: 2, item2Id: 1100, item2Amount: 66, level: 3, xp: 1111 },
    MITHRIL_PLATELEGS = { name: "Plate legs", bardId: 2359, itemId: 1071, amount: 1, item1Id: 1121, item1Amount: 1, item2Id: 1099, item2Amount: 66, level: 3, xp: 1110 },
    MITHRIL_PLATEBODY = { name: "Plate body", bardId: 2359, itemId: 1121, amount: 1, item1Id: 1121, item1Amount: 3, item2Id: 1101, item2Amount: 68, level: 5, xp: 1112 },
    MITHRIL_NAILS = { name: "Nails", bardId: 2359, itemId: 4822, amount: 15, item1Id: 1122, item1Amount: 4, item2Id: 13358, item2Amount: 54, level: 1, xp: 13357 },
    MITHRIL_UNF_BOLTS = { name: "Bolts  = {name: unf}", bardId: 2359, itemId: 9379, amount: 10, item1Id: 1121, item1Amount: 4, item2Id: 11461, item2Amount: 53, level: 1, xp: 11459 },
    ADAMANT_DAGGER = { name: "Dagger", bardId: 2361, itemId: 1211, amount: 1, item1Id: 1119, item1Amount: 0, item2Id: 1094, item2Amount: 70, level: 1, xp: 1125 },
    ADAMANT_AXE = { name: "Axe", bardId: 2361, itemId: 1357, amount: 1, item1Id: 1120, item1Amount: 0, item2Id: 1091, item2Amount: 71, level: 1, xp: 1126 },
    ADAMANT_MACE = { name: "Mace", bardId: 2361, itemId: 1430, amount: 1, item1Id: 1120, item1Amount: 1, item2Id: 1093, item2Amount: 72, level: 1, xp: 1129 },
    ADAMANT_MED_HELM = { name: "Med helm", bardId: 2361, itemId: 1145, amount: 1, item1Id: 1122, item1Amount: 0, item2Id: 1102, item2Amount: 73, level: 1, xp: 1127 },
    ADAMANT_DART_TIPS = { name: "Dart tips", bardId: 2361, itemId: 823, amount: 10, item1Id: 1123, item1Amount: 0, item2Id: 1107, item2Amount: 74, level: 1, xp: 1128 },
    ADAMANT_SWORD = { name: "Sword", bardId: 2361, itemId: 1287, amount: 1, item1Id: 1119, item1Amount: 1, item2Id: 1085, item2Amount: 74, level: 1, xp: 1124 },
    ADAMANT_ARROWTIPS = { name: "Arrowtips", bardId: 2361, itemId: 43, amount: 15, item1Id: 1123, item1Amount: 1, item2Id: 1108, item2Amount: 75, level: 1, xp: 1130 },
    ADAMANT_SCIMITAR = { name: "Scimitar", bardId: 2361, itemId: 1331, amount: 1, item1Id: 1119, item1Amount: 2, item2Id: 1087, item2Amount: 75, level: 2, xp: 1116 },
    ADAMANT_LONG_SWORD = { name: "Long sword", bardId: 2361, itemId: 1301, amount: 1, item1Id: 1119, item1Amount: 3, item2Id: 1086, item2Amount: 76, level: 2, xp: 1089 },
    ADAMANT_THROWING_KNIVES = { name: "Throwing knives", bardId: 2361, itemId: 867, amount: 5, item1Id: 1123, item1Amount: 2, item2Id: 1106, item2Amount: 77, level: 1, xp: 1131 },
    ADAMANT_FULL_HELM = { name: "Full helm", bardId: 2361, itemId: 1161, amount: 1, item1Id: 1122, item1Amount: 1, item2Id: 1103, item2Amount: 77, level: 2, xp: 1113 },
    ADAMANT_SQUARE_SHIELD = { name: "Square shield", bardId: 2361, itemId: 1183, amount: 1, item1Id: 1122, item1Amount: 2, item2Id: 1104, item2Amount: 78, level: 2, xp: 1114 },
    ADAMANT_WARHAMMER = { name: "Warhammer", bardId: 2361, itemId: 1345, amount: 1, item1Id: 1120, item1Amount: 2, item2Id: 1083, item2Amount: 79, level: 3, xp: 1118 },
    ADAMANT_BATTLE_AXE = { name: "Battle axe", bardId: 2361, itemId: 1371, amount: 1, item1Id: 1120, item1Amount: 3, item2Id: 1092, item2Amount: 80, level: 3, xp: 1095 },
    ADAMANT_CHAINBODY = { name: "Chainbody", bardId: 2361, itemId: 1111, amount: 1, item1Id: 1121, item1Amount: 0, item2Id: 1098, item2Amount: 81, level: 3, xp: 1109 },
    ADAMANT_KITE_SHIELD = { name: "Kite shield", bardId: 2361, itemId: 1199, amount: 1, item1Id: 1122, item1Amount: 3, item2Id: 1105, item2Amount: 82, level: 3, xp: 1115 },
    ADAMANT_CLAWS = { name: "Claws", bardId: 2361, itemId: 3100, amount: 1, item1Id: 1120, item1Amount: 4, item2Id: 8429, item2Amount: 83, level: 2, xp: 8428 },
    ADAMANT_2_HAND_SWORD = { name: "2 hand sword", bardId: 2361, itemId: 1317, amount: 1, item1Id: 1119, item1Amount: 4, item2Id: 1088, item2Amount: 84, level: 3, xp: 1090 },
    ADAMANT_PLATESKIRT = { name: "Plate skirt", bardId: 2361, itemId: 1091, amount: 1, item1Id: 1121, item1Amount: 2, item2Id: 1100, item2Amount: 86, level: 3, xp: 1111 },
    ADAMANT_PLATELEGS = { name: "Plate legs", bardId: 2361, itemId: 1073, amount: 1, item1Id: 1121, item1Amount: 1, item2Id: 1099, item2Amount: 86, level: 3, xp: 1110 },
    ADAMANT_PLATEBODY = { name: "Plate body", bardId: 2361, itemId: 1123, amount: 1, item1Id: 1121, item1Amount: 3, item2Id: 1101, item2Amount: 88, level: 5, xp: 1112 },
    ADAMANT_NAILS = { name: "Nails", bardId: 2361, itemId: 4823, amount: 15, item1Id: 1122, item1Amount: 4, item2Id: 13358, item2Amount: 74, level: 1, xp: 13357 },
    ADAMANT_UNF_BOLTS = { name: "Bolts  = {name: unf}", bardId: 2361, itemId: 9380, amount: 10, item1Id: 1121, item1Amount: 4, item2Id: 11461, item2Amount: 73, level: 1, xp: 11459 },
    RUNE_DAGGER = { name: "Dagger", bardId: 2363, itemId: 1213, amount: 1, item1Id: 1119, item1Amount: 0, item2Id: 1094, item2Amount: 85, level: 1, xp: 1125 },
    RUNE_AXE = { name: "Axe", bardId: 2363, itemId: 1359, amount: 1, item1Id: 1120, item1Amount: 0, item2Id: 1091, item2Amount: 86, level: 1, xp: 1126 },
    RUNE_MACE = { name: "Mace", bardId: 2363, itemId: 1432, amount: 1, item1Id: 1120, item1Amount: 1, item2Id: 1093, item2Amount: 87, level: 1, xp: 1129 },
    RUNE_MED_HELM = { name: "Med helm", bardId: 2363, itemId: 1147, amount: 1, item1Id: 1122, item1Amount: 0, item2Id: 1102, item2Amount: 88, level: 1, xp: 1127 },
    RUNE_DART_TIPS = { name: "Dart tips", bardId: 2363, itemId: 824, amount: 10, item1Id: 1123, item1Amount: 0, item2Id: 1107, item2Amount: 89, level: 1, xp: 1128 },
    RUNE_SWORD = { name: "Sword", bardId: 2363, itemId: 1289, amount: 1, item1Id: 1119, item1Amount: 1, item2Id: 1085, item2Amount: 89, level: 1, xp: 1124 },
    RUNE_ARROWTIPS = { name: "Arrowtips", bardId: 2363, itemId: 44, amount: 15, item1Id: 1123, item1Amount: 1, item2Id: 1108, item2Amount: 90, level: 1, xp: 1130 },
    RUNE_SCIMITAR = { name: "Scimitar", bardId: 2363, itemId: 1333, amount: 1, item1Id: 1119, item1Amount: 2, item2Id: 1087, item2Amount: 90, level: 2, xp: 1116 },
    RUNE_LONG_SWORD = { name: "Long sword", bardId: 2363, itemId: 1303, amount: 1, item1Id: 1119, item1Amount: 3, item2Id: 1086, item2Amount: 91, level: 2, xp: 1089 },
    RUNE_THROWING_KNIVES = { name: "Throwing knives", bardId: 2363, itemId: 868, amount: 5, item1Id: 1123, item1Amount: 2, item2Id: 1106, item2Amount: 92, level: 1, xp: 1131 },
    RUNE_FULL_HELM = { name: "Full helm", bardId: 2363, itemId: 1163, amount: 1, item1Id: 1122, item1Amount: 1, item2Id: 1103, item2Amount: 92, level: 2, xp: 1113 },
    RUNE_SQUARE_SHIELD = { name: "Square shield", bardId: 2363, itemId: 1185, amount: 1, item1Id: 1122, item1Amount: 2, item2Id: 1104, item2Amount: 93, level: 2, xp: 1114 },
    RUNE_WARHAMMER = { name: "Warhammer", bardId: 2363, itemId: 1347, amount: 1, item1Id: 1120, item1Amount: 2, item2Id: 1083, item2Amount: 94, level: 3, xp: 1118 },
    RUNE_BATTLE_AXE = { name: "Battle axe", bardId: 2363, itemId: 1373, amount: 1, item1Id: 1120, item1Amount: 3, item2Id: 1092, item2Amount: 95, level: 3, xp: 1095 },
    RUNE_CHAINBODY = { name: "Chainbody", bardId: 2363, itemId: 1113, amount: 1, item1Id: 1121, item1Amount: 0, item2Id: 1098, item2Amount: 96, level: 3, xp: 1109 },
    RUNE_KITE_SHIELD = { name: "Kite shield", bardId: 2363, itemId: 1201, amount: 1, item1Id: 1122, item1Amount: 3, item2Id: 1105, item2Amount: 97, level: 3, xp: 1115 },
    RUNE_CLAWS = { name: "Claws", bardId: 2363, itemId: 3101, amount: 1, item1Id: 1120, item1Amount: 4, item2Id: 8429, item2Amount: 98, level: 2, xp: 8428 },
    RUNE_2_HAND_SWORD = { name: "2 hand sword", bardId: 2363, itemId: 1319, amount: 1, item1Id: 1119, item1Amount: 4, item2Id: 1088, item2Amount: 99, level: 3, xp: 1090 },
    RUNE_PLATESKIRT = { name: "Plate skirt", bardId: 2363, itemId: 1093, amount: 1, item1Id: 1121, item1Amount: 2, item2Id: 1100, item2Amount: 99, level: 3, xp: 1111 },
    RUNE_PLATELEGS = { name: "Plate legs", bardId: 2363, itemId: 1079, amount: 1, item1Id: 1121, item1Amount: 1, item2Id: 1099, item2Amount: 99, level: 3, xp: 1110 },
    RUNE_PLATEBODY = { name: "Plate body", bardId: 2363, itemId: 1127, amount: 1, item1Id: 1121, item1Amount: 3, item2Id: 1101, item2Amount: 99, level: 5, xp: 1112 },
    RUNE_NAILS = { name: "Nails", bardId: 2363, itemId: 4824, amount: 15, item1Id: 1122, item1Amount: 4, item2Id: 13358, item2Amount: 89, level: 1, xp: 13357 },
    RUNE_UNF_BOLTS = { name: "Bolts  = {name: unf}", bardId: 2363, itemId: 9381, amount: 10, item1Id: 1121, item1Amount: 4, item2Id: 11461, item2Amount: 88, level: 1, xp: 11459 }
}