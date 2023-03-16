import { Misc } from '../../util/Misc';

<<<<<<< Updated upstream
export class Skills {
    public static ATTACK: 6247 & 8654
    public static DEFENCE: [number, number] = [6253, 8660]
    public static STRENGTH = [6206, 8657]
    public static HITPOINTS: 6216 & 8655
    public static RANGED: [4443, 8663]
    public static PRAYER: [6242, 8666]
    public static MAGIC: [6211, 8669]
    public static COOKING: [6226, 8665]
    public static WOODCUTTING: [4272, 8671]
    public static FLETCHING: [6231, 8670]
    public static FISHING: [6258, 8662]
    public static FIREMAKING: [4282, 8668]
    public static CRAFTING: [6263, 8667]
    public static SMITHING: [6221, 8659]
    public static MINING: [4416, 8656]
    public static HERBLORE: [6237, 8661]
    public static AGILITY: [4277, 8658]
    public static THIEVING: [4261, 8664]
    public static SLAYER: [12122, 12162]
    public static FARMING: [5267, 13928]
    public static RUNECRAFTING: [4267, 8672]
    public static CONSTRUCTION: [7267, 18801]
    public static HUNTER: [8267, 18829]
}
=======

>>>>>>> Stashed changes

export class Skill {

    public static readonly ATTACK = new Skill(6247, 8654)
    public static readonly DEFENCE = new Skill(6253, 8660)
    public static readonly STRENGTH = new Skill(6206, 8657)
    public static readonly HITPOINTS = new Skill(6216, 8655)
    public static readonly RANGED = new Skill(4443, 8663)
    public static readonly PRAYER = new Skill(6242, 8666)
    public static readonly MAGIC = new Skill(6211, 8669)
    public static readonly COOKING = new Skill(6226, 8665)
    public static readonly WOODCUTTING = new Skill(4272, 8671)
    public static readonly FLETCHING = new Skill(6231, 8670)
    public static readonly FISHING = new Skill(6258, 8662)
    public static readonly FIREMAKING = new Skill(4282, 8668)
    public static readonly CRAFTING = new Skill(6263, 8667)
    public static readonly SMITHING = new Skill(6221, 8659)
    public static readonly MINING = new Skill(4416, 8656)
    public static readonly HERBLORE = new Skill(6237, 8661)
    public static readonly AGILITY = new Skill(4277, 8658)
    public static readonly THIEVING = new Skill(4261, 8664)
    public static readonly SLAYER = new Skill(12122, 12162)
    public static readonly FARMING = new Skill(5267, 13928)
    public static readonly RUNECRAFTING = new Skill(4267, 8672)
    public static readonly CONSTRUCTION = new Skill(7267, 18801)
    public static readonly HUNTER = new Skill(8267, 18829)

    private static readonly ALLOWED_TO_SET_LEVELS = [this.ATTACK, Skill.DEFENCE, Skill.STRENGTH, Skill.HITPOINTS, Skill.RANGED, Skill.PRAYER, Skill.MAGIC];
    private static skillMap = new Map<number, Skill>();
    static {
        for (const skill of Skill) {
            Skill.skillMap.set(skill.button, skill);
        }
    }

<<<<<<< Updated upstream
    public static ATTACK: [6247, 8654]
    public static DEFENCE: [6253, 8660]
    public static STRENGTH: [6206, 8657]
    public static HITPOINTS: [6216, 8655]
    public static RANGED: [4443, 8663]
    public static PRAYER: [6242, 8666]
    public static MAGIC: [6211, 8669]
    public static COOKING: [6226, 8665]
    public static WOODCUTTING: [4272, 8671]
    public static FLETCHING: [6231, 8670]
    public static FISHING: [6258, 8662]
    public static FIREMAKING: [4282, 8668]
    public static CRAFTING: [6263, 8667]
    public static SMITHING: [6221, 8659]
    public static MINING: [4416, 8656]
    public static HERBLORE: [6237, 8661]
    public static AGILITY: [4277, 8658]
    public static THIEVING: [4261, 8664]
    public static SLAYER: [12122, 12162]
    FARMING: [5267, 13928]
    RUNECRAFTING: [4267, 8672]
    CONSTRUCTION: [7267, 18801]
    HUNTER: [8267, 18829]




=======
>>>>>>> Stashed changes

    /**
     * The {@link Skill}'s chatbox interface
     * The interface which will be sent
     * on levelup.
     */
    private readonly chatboxInterface: number;
    /**
     * The {@link Skill}'s button in the skills tab
     * interface.
     */
    private readonly button: number;

    /**
     * Constructor
     *
     * @param chatboxInterface
     * @param button
     */
    public constructor(chatboxInterface: number, button: number) {
        this.chatboxInterface = chatboxInterface;
        this.button = button;
    }

    /**
     * Gets a skill for its button id.
     *
     * @param button The button id.
     * @return The skill with the matching button.
     */
    public static forButton(button: number): Skill {
        return Skill.skillMap.get(button);
    }

    public canSetLevel() {
        return Skill.ALLOWED_TO_SET_LEVELS.includes(this);
    }

    /**
    
    Gets the {@link Skill}'s chatbox interface.
    @return The interface which will be sent on levelup.
    */
    public getChatboxInterface(): number {
        return this.chatboxInterface;
    }
    /**
    
    Gets the {@link Skill}'s button id.
    @return The button for this skill.
    */
    public getButton(): number {
        return this.button;
    }
    /**
    
    Gets the {@link Skill}'s name.
    @return The {@link Skill}'s name in a suitable format.
    */
    public getName(): string {
        return Misc.FORMATTER(this.toString().toLowerCase());
    }

    static values(): Skill[] {
        const valuesArray = Object.values(Skill);
        const skillValuesArray = valuesArray.filter((value) => value instanceof Skill);
        return skillValuesArray as Skill[];
    }


     static [Symbol.iterator]() {
        let index = 0;
        const skills = Object.values(this);

        return {
            next: () => {
                const done = index >= skills.length;
                const value = !done ? skills[index++] : undefined;

                return { done, value };
            }
        };
    }
}