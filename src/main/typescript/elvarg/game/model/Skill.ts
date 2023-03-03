import { Misc } from '../../util/Misc';

export class Skills {
    public static ATTACK: 6247 & 8654
    public static DEFENCE: 6253 & 8660
    public static STRENGTH = [6206, 8657]
    public static HITPOINTS: 6216 & 8655
    public static RANGED: 4443 & 8663
    public static PRAYER: 6242 & 8666
    public static MAGIC: 6211 & 8669
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

export class Skill {
    private static readonly ALLOWED_TO_SET_LEVELS = [Skills.ATTACK, Skills.DEFENCE, Skills.STRENGTH, Skills.HITPOINTS, Skills.RANGED, Skills.PRAYER, Skills.MAGIC];
    private static skillMap = new Map<number, Skill>();
    static {
        for (const skill of Skills) {
            Skill.skillMap.set(skill.button, skill);
        }
    }

    public static ATTACK: 6247 & 8654
    public static DEFENCE: 6253 & 8660
    public static STRENGTH: 6206 & 8657
    public static HITPOINTS: 6216 & 8655
    public static RANGED: 4443 & 8663
    public static PRAYER: 6242 & 8666
    public static MAGIC: 6211 & 8669
    public static COOKING: 6226 & 8665
    public static WOODCUTTING: 4272 & 8671
    public static FLETCHING: 6231 & 8670
    public static FISHING: 6258 & 8662
    public static FIREMAKING: 4282 & 8668
    public static CRAFTING: 6263 & 8667
    public static SMITHING: 6221 & 8659
    public static MINING: 4416 & 8656
    public static HERBLORE: 6237 & 8661
    public static AGILITY: 4277 & 8658
    public static THIEVING: 4261 & 8664
    public static SLAYER: 12122 & 12162
    public static FARMING: 5267 & 13928
    public static RUNECRAFTING: 4267 & 8672
    public static CONSTRUCTION: 7267 & 18801
    public static HUNTER: 8267 & 18829





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
    private constructor(chatboxInterface: number, button: number) {
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
}    