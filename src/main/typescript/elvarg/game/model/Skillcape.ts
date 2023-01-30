import { Animation } from "./Animation";
import { Item } from "./Item";
import { Graphic } from "./Graphic";

const Skillcapes = {
    ATTACK: [9747, 9748, 10639, 4959, 823, 7],
    DEFENCE: [9753, 9754, 10641, 4961, 824, 10],
    STRENGTH: [9750, 9751, 10640, 4981, 828, 25],
    CONSTITUTION: [9768, 9769, 10647, 14242, 2745, 12],
    RANGED: [9756, 9757, 10642, 4973, 832, 12],
    PRAYER: [9759, 9760, 10643, 4979, 829, 15],
    MAGIC: [9762, 9763, 10644, 4939, 813, 6],
    COOKING: [9801, 9802, 10658, 4955, 821, 36],
    WOODCUTTING: [9807, 9808, 10660, 4957, 822, 25],
    FLETCHING: [9783, 9784, 10652, 4937, 812, 20],
    FISHING: [9798, 9799, 10657, 4951, 819, 19],
    FIREMAKING: [9804, 9805, 10659, 4975, 831, 14],
    CRAFTING: [9780, 9781, 10651, 4949, 818, 15],
    SMITHING: [9795, 9796, 10656, 4943, 815, 23],
    MINING: [9792, 9793, 10655, 4941, 814, 8],
    HERBLORE: [9774, 9775, 10649, 4969, 835, 16],
    AGILITY: [9771, 9772, 10648, 4977, 830, 8],
    THIEVING: [9777, 9778, 10650, 4965, 826, 16],
    SLAYER: [9786, 9787, 10653, 4967, 1656, 8],
    FARMING: [9810, 9811, 10661, 4963, - 1, 16],
    RUNECRAFTING: [9765, 9766, 10645, 4947, 817, 10],
    CONSTRUCTION: [9789, 9790, 10654, 4953, 820, 16],
    HUNTER: [9948, 9949, 10646, 5158, 907, 14],
    QUEST_POINT: [9813, 9814, 10662, 4945, 816, 19],
}

class Skillcape {
    private static dataMap = new Map<number, Skillcape>();
    static {
        for (let data of Object.values(Skillcape)) {
            for (let item of data.item) {
                Skillcape.dataMap.set(item.getId(), data);
            }
        }
    }

    private readonly item: Item[];
    private readonly animation: Animation;
    private readonly graphic: Graphic;
    private readonly delay: number;

    constructor(itemId: number[], animationId: number, graphicId: number, delay: number) {
        this.item = itemId.map((id) => new Item(id, 1));
        this.animation = new Animation(animationId);
        this.graphic = new Graphic(graphicId, 0);
        this.delay = delay;
    }

    public static forId(id: number): Skillcape {
        return Skillcape.dataMap.get(id);
    }

    public getAnimation(): Animation {
        return this.animation;
    }

    public getGraphic(): Graphic {
        return this.graphic;
    }

    public getDelay(): number {
        return this.delay;
    }
}    