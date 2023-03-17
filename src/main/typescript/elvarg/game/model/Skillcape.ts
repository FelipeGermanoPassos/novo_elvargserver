import { Animation } from "./Animation";
import { Item } from "./Item";
import { Graphic } from "./Graphic";
<<<<<<< HEAD
import { Skill } from "./Skill";
=======

>>>>>>> 252876145a1ec4af2cfd19a101625f14378734ce

export class Skillcape {
    public static readonly ATTACK = new Skillcape([9747, 9748, 10639], 4959, 823, 7);
    public static readonly DEFENCE = new Skillcape([9753, 9754, 10641], 4961, 824, 10);
    public static readonly STRENGTH  = new Skillcape([9750, 9751, 10640], 4981, 828, 25);
    public static readonly CONSTITUTION = new Skillcape([9768, 9769, 10647], 14242, 2745, 12);
    public static readonly RANGED = new Skillcape([9756, 9757, 10642], 4973, 832, 12);
    public static readonly PRAYER = new Skillcape ([9759, 9760, 10643], 4979, 829, 15);
    public static readonly MAGIC = new Skillcape ([9762, 9763, 10644], 4939, 813, 6);
    public static readonly COOKING = new Skillcape ([9801, 9802, 10658], 4955, 821, 36);
    public static readonly WOODCUTTING = new Skillcape ([9807, 9808, 10660], 4957, 822, 25);
    public static readonly FLETCHING = new Skillcape ([9783, 9784, 10652], 4937, 812, 20);
    public static readonly FISHING = new Skillcape ([9798, 9799, 10657], 4951, 819, 19);
    public static readonly FIREMAKING = new Skillcape ([9804, 9805, 10659], 4975, 831, 14);
    public static readonly CRAFTING = new Skillcape ([9780, 9781, 10651], 4949, 818, 15);
    public static readonly SMITHING = new Skillcape ([9795, 9796, 10656], 4943, 815, 23);
    public static readonly MINING = new Skillcape ([9792, 9793, 10655], 4941, 814, 8);
    public static readonly HERBLORE = new Skillcape ([9774, 9775, 10649], 4969, 835, 16);
    public static readonly AGILITY = new Skillcape ([9771, 9772, 10648], 4977, 830, 8);
    public static readonly THIEVING = new Skillcape ([9777, 9778, 10650], 4965, 826, 16);
    public static readonly SLAYER = new Skillcape ([9786, 9787, 10653], 4967, 1656, 8);
    public static readonly FARMING = new Skillcape ([9810, 9811, 10661], 4963, - 1, 16);
    public static readonly RUNECRAFTING = new Skillcape ([9765, 9766, 10645], 4947, 817, 10);
    public static readonly CONSTRUCTION = new Skillcape ([9789, 9790, 10654], 4953, 820, 16);
    public static readonly HUNTER = new Skillcape ([9948, 9949, 10646], 5158, 907, 14);
    public static readonly QUEST_POINT = new Skillcape ([9813, 9814, 10662], 4945, 816, 19);

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
    private readonly ordinal: number;

    constructor(itemId: number[], animationId: number, graphicId: number, delay: number, ordinal: number) {
        this.item = itemId.map((id) => new Item(id, 1));
        this.animation = new Animation(animationId);
        this.graphic = new Graphic(graphicId, 0);
        this.delay = delay;
        this.ordinal = ordinal;
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

    static indexOf(valor) {
        for (let prop in this) {
            if (this.hasOwnProperty(prop) && this[prop] === valor) {
                return this[prop];
            }
        }
        return -1;
    }

    public getOrdinal(): number {
        return this.ordinal;
    }
}

export class Skillcapes {

    public static readonly ATTACK = new Skillcape([9747, 9748, 10639], 4959, 823, 7, 0)
    public static readonly DEFENCE = new Skillcape([9753, 9754, 10641], 4961, 824, 10, 1)
    public static readonly STRENGTH = new Skillcape([9750, 9751, 10640], 4981, 828, 25, 2)
    public static readonly CONSTITUTION = new Skillcape([9768, 9769, 10647], 14242, 2745, 12, 3)
    public static readonly RANGED = new Skillcape([9756, 9757, 10642], 4973, 832, 12, 4)
    public static readonly PRAYER = new Skillcape([9759, 9760, 10643], 4979, 829, 15, 5)
    public static readonly MAGIC = new Skillcape([9762, 9763, 10644], 4939, 813, 6, 6)
    public static readonly COOKING = new Skillcape([9801, 9802, 10658], 4955, 821, 36, 7)
    public static readonly WOODCUTTING = new Skillcape([9807, 9808, 10660], 4957, 822, 25, 8)
    public static readonly FLETCHING = new Skillcape([9783, 9784, 10652], 4937, 812, 20, 9)
    public static readonly FISHING = new Skillcape([9798, 9799, 10657], 4951, 819, 19, 10)
    public static readonly FIREMAKING = new Skillcape([9804, 9805, 10659], 4975, 831, 14, 11)
    public static readonly CRAFTING = new Skillcape([9780, 9781, 10651], 4949, 818, 15, 12)
    public static readonly SMITHING = new Skillcape([9795, 9796, 10656], 4943, 815, 23, 13)
    public static readonly MINING = new Skillcape([9792, 9793, 10655], 4941, 814, 8, 14)
    public static readonly HERBLORE = new Skillcape([9774, 9775, 10649], 4969, 835, 16, 15)
    public static readonly AGILITY = new Skillcape([9771, 9772, 10648], 4977, 830, 8, 16)
    public static readonly THIEVING = new Skillcape([9777, 9778, 10650], 4965, 826, 16, 17)
    public static readonly SLAYER = new Skillcape([9786, 9787, 10653], 4967, 1656, 8, 18)
    public static readonly FARMING = new Skillcape([9810, 9811, 10661], 4963, - 1, 16, 19)
    public static readonly RUNECRAFTING = new Skillcape([9765, 9766, 10645], 4947, 817, 10, 20)
    public static readonly CONSTRUCTION = new Skillcape([9789, 9790, 10654], 4953, 820, 16, 21)
    public static readonly HUNTER = new Skillcape([9948, 9949, 10646], 5158, 907, 14, 22)
    public static readonly QUEST_POINT = new Skillcape([9813, 9814, 10662], 4945, 816, 19, 23)
}