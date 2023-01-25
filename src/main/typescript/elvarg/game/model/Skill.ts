import { Misc } from '../../util/Misc';

const Skills = {
    ATTACK: { id: 6247, button: 8654 },
    DEFENCE: { id: 6253, button: 8660 },
    STRENGTH: { id: 6206, button: 8657 },
    HITPOINTS: { id: 6216, button: 8655 },
    RANGED: { id: 4443, button: 8663 },
    PRAYER: { id: 6242, button: 8666 },
    MAGIC: { id: 6211, button: 8669 },
    COOKING: { id: 6226, button: 8665 },
    WOODCUTTING: { id: 4272, button: 8671 },
    FLETCHING: { id: 6231, button: 8670 },
    FISHING: { id: 6258, button: 8662 },
    FIREMAKING: { id: 4282, button: 8668 },
    CRAFTING: { id: 6263, button: 8667 },
    SMITHING: { id: 6221, button: 8659 },
    MINING: { id: 4416, button: 8656 },
    HERBLORE: { id: 6237, button: 8661 },
    AGILITY: { id: 4277, button: 8658 },
    THIEVING: { id: 4261, button: 8664 },
    SLAYER: { id: 12122, button: 12162 },
    FARMING: { id: 5267, button: 13928 },
    RUNECRAFTING: { id: 4267, button: 8672 },
    CONSTRUCTION: { id: 7267, button: 18801 },
    HUNTER: { id: 8267, button: 18829 },
}

export class Skill {
    private static readonly ALLOWED_TO_SET_LEVELS = [Skills.ATTACK, Skills.DEFENCE, Skills.STRENGTH, Skills.HITPOINTS, Skills.RANGED, Skills.PRAYER, Skills.MAGIC];
    private static skillMap = new Map<number, Skill>();
    static {
        for (const skill of Skills) {
            Skill.skillMap.set(skill.button, skill);
        }
    }

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

    public canSetLevel(): boolean {
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