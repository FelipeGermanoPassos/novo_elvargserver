export class SkillManager {
    public static readonly AMOUNT_OF_SKILLS: number = Skill.values().length;
    public static readonly MAX_EXPERIENCE: number = 1000000000;
    public static readonly EXPERIENCE_FOR_99: number = 13034431;
    public static readonly EXP_ARRAY: number[] = [0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107,
        2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833,
        16456, 18247, 20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983,
        75127, 83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742,
        302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257, 992895,
        1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594,
        3597792, 3972294, 4385776, 4842295, 5346332, 5902831, , 7195629, 7944614, 8771558, 9684577, 10692629,
        11805606, 13034431];
    const LEVEL_UP_GRAPHIC: Graphic = new Graphic(199);

    /**
     * The player associated with this Skills instance.
     */
    private player: Player;
    private skills: Skills;

    public SkillManager(player: Player) {
        this.player = player;
        this.skills = new Skills();
        for (let i = 0; i < AMOUNT_OF_SKILLS; i++) {
            this.skills.level[i] = this.skills.maxLevel[i] = 1;
            this.skills.experience[i] = 0;
        }
        this.skills.level[Skill.HITPOINTS.ordinal()] = this.skills.maxLevel[Skill.HITPOINTS.ordinal()] = 10;
        this.skills.experience[Skill.HITPOINTS.ordinal()] = 1184;
    }

    static getExperienceForLevel(level: number): number {
        if (level <= 99) {
            return EXP_ARRAY[--level > 98 ? 98 : level];
        } else {
            let points = 0;
            let output = 0;
            for (let lvl = 1; lvl <= level; lvl++) {
                points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
                if (lvl >= level) {
                    return output;
                }
                output = Math.floor(points / 4);
            }
        }
        return 0;
    }

    static getLevelForExperience(experience: number): number {
        if (experience <= EXPERIENCE_FOR_99) {
            for (let j = 98; j >= 0; j--) {
                if (EXP_ARRAY[j] <= experience) {
                    return j + 1;
                }
            }
        } else {
            let points = 0, output = 0;
            for (let lvl = 1; lvl <= 99; lvl++) {
                points += Math.floor(lvl + 300.0 * Math.pow(2.0, lvl / 7.0));
                output = Math.floor(points / 4);
                if (output >= experience) {
                    return lvl;
                }
            }
        }
        return 99;
    }

    static getMaxAchievingLevel(skill: Skill): number {
        return 99;
    }

    addExperience(skill: Skill, experience: number): SkillManager {
        return this.addExperience(skill, experience, true);
    }

    addExperience(skill: Skill, experience: number, multipliers: boolean): SkillManager {
        // Multipliers...
        if (multipliers) {
            if (skill == Skill.ATTACK || skill == Skill.DEFENCE || skill == Skill.STRENGTH || skill == Skill.HITPOINTS
                || skill == Skill.RANGED || skill == Skill.MAGIC) {
                experience *= GameConstants.COMBAT_SKILLS_EXP_MULTIPLIER;
            } else {
                experience *= GameConstants.REGULAR_SKILLS_EXP_MULTIPLIER;
            }
        }

        // Send exp drop..
        player.getPacketSender().sendExpDrop(skill, experience);

        // Don't add the experience if it has been locked..
        if (player.experienceLocked())
            return this;

        // If we already have max exp, don't add any more.
        if (this.skills.experience[skill.ordinal()] >= MAX_EXPERIENCE)
            return this;

        // The skill's level before any experience is added
        const startingLevel = skills.maxLevel[skill.ordinal()];

        // Add experience to the selected skill..
        this.skills.experience[skill.ordinal()] = this.skills.experience[skill.ordinal()] + experience > MAX_EXPERIENCE
            ? MAX_EXPERIENCE
            : this.skills.experience[skill.ordinal()] + experience;

        // Get the skill's new level after experience has been added..
        let newLevel = this.getLevelForExperience(this.skills.experience[skill.ordinal()]);

        // Handle level up..
        if (newLevel > startingLevel) {
            let level = newLevel - startingLevel;
            let skillName = skill.toString().toLowerCase().charAt(0).toUpperCase() + skill.toString().toLowerCase().slice(1);
            skills.maxLevel[skill.ordinal()] += level;
            stopSkillable(); // Stop skilling on level up like osrs
            setCurrentLevel(skill, skills.maxLevel[skill.ordinal()]);
            player.getPacketSender().sendInterfaceRemoval();
            player.getPacketSender().sendString(4268, "Congratulations! You have achieved a " + skillName + " level!");
            player.getPacketSender().sendString(4269, "Well done. You are now level " + newLevel + ".");
            player.getPacketSender().sendString(358, "Click here to continue.");
            player.getPacketSender().sendChatboxInterface(skill.getChatboxInterface());
            player.performGraphic(LEVEL_UP_GRAPHIC);
            player.getPacketSender().sendMessage("You've just advanced " + skillName + " level! You have reached level " + newLevel);
            if (skills.maxLevel[skill.ordinal()] == getMaxAchievingLevel(skill)) {
                player.getPacketSender().sendMessage("Well done! You've achieved the highest possible level in this skill!");
                World.sendMessage("<shad=15536940>News: " + player.getUsername()
                    + " has just achieved the highest possible level in " + skillName + "!");
            }
            player.getUpdateFlag().flag(Flag.APPEARANCE);
        }
        updateSkill(skill);
        return this;
    }

    pressedSkill(button: number): boolean {
        let skill = Skill.forButton(button);
        if (skill != null) {
            if (!skill.canSetLevel()) {
                if (player.getRights() != PlayerRights.ADMINISTRATOR && player.getRights() != PlayerRights.DEVELOPER
                    && player.getRights() != PlayerRights.OWNER) {
                    player.getPacketSender().sendMessage("You can currently not set that level.");
                    return true;
                }
            }
            player.getPacketSender().sendInterfaceRemoval();
            player.setEnteredAmountAction((amount: number) => {
                let max = 99;
                if (player.getRights() == PlayerRights.OWNER
                    || player.getRights() == PlayerRights.DEVELOPER) {
                    max = 9999;
                }
                if (amount <= 0 || amount > max) {
                    player.getPacketSender().sendMessage("Invalid syntax. Please enter a level in the range of 1-99.");
                    return;
                }
                player.getSkillManager().setLevel(skill, amount);
            });
            player.getPacketSender()
                .sendEnterAmountPrompt("Please enter your desired " + skill.getName() + " level below.");

            return true;
        }
        return false;
    }

    setLevel(skill: Skill, level: number) {

        // Make sure they aren't in wild
        if (player.getArea() instanceof WildernessArea) {
            if (player.getRights() != PlayerRights.ADMINISTRATOR && player.getRights() != PlayerRights.DEVELOPER
                && player.getRights() != PlayerRights.OWNER) {
                player.getPacketSender().sendMessage("You cannot do this in the Wilderness!");
                return;
            }
        }

        // make sure they aren't wearing any items which arent allowed to be worn at
        // that level.
        if (player.getRights() != PlayerRights.DEVELOPER) {
            for (let item of player.getEquipment().getItems()) {
                if (item == null) {
                    continue;
                }
                if (item.getDefinition().getRequirements() != null) {
                    if (item.getDefinition().getRequirements()[skill.ordinal()] > level) {
                        player.getPacketSender().sendMessage(
                            "Please unequip your " + item.getDefinition().getName() + " before doing that.");
                        return;
                    }
                }
            }
        }

        if (skill == Skill.HITPOINTS) {
            if (level < 10) {
                player.getPacketSender().sendMessage("Hitpoints must be set to at least level 10.");
                return;
            }
        }

        // Set skill level
        player.getSkillManager().setCurrentLevel(skill, level, false).setMaxLevel(skill, level, false)
            .setExperience(skill, SkillManager.getExperienceForLevel(level));
        updateSkill(skill);

        if (skill == Skill.PRAYER) {
            player.getPacketSender().sendConfig(709, PrayerHandler.canUse(player, PrayerData.PRESERVE, false) ? 1 : 0);
            player.getPacketSender().sendConfig(711, PrayerHandler.canUse(player, PrayerData.RIGOUR, false) ? 1 : 0);
            player.getPacketSender().sendConfig(713, PrayerHandler.canUse(player, PrayerData.AUGURY, false) ? 1 : 0);
        }

        // Update weapon tab to send combat level etc.
        player.setHasVengeance(false);
        BonusManager.update(player);
        WeaponInterfaces.assign(player);
        PrayerHandler.deactivatePrayers(player);
        BountyHunter.unassign(player);
        player.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    public updateSkill(skill: Skill) {
        const maxLevel = this.getMaxLevel(skill);
        const currentLevel = this.getCurrentLevel(skill);

        // Update prayer tab if it's the prayer skill.
        if (skill === Skill.PRAYER) {
            this.player.getPacketSender().sendString(687, currentLevel + "/" + maxLevel);
        }

        // Send total level
        this.player.getPacketSender().sendString(31200, "" + this.getTotalLevel());

        // Send combat level
        const combatLevel = "Combat level: " + this.getCombatLevel();
        this.player.getPacketSender().sendString(19000, combatLevel).sendString(5858, combatLevel);

        // Send the skill
        this.player.getPacketSender().sendSkill(skill);

        return this;
    }

    /**
     * Calculates the player's combat level.
     *
     * @return The average of the player's combat skills.
     */
    public getCombatLevel(): number {
        const attack = this.skills.maxLevel[Skill.ATTACK.ordinal()];
        const defence = this.skills.maxLevel[Skill.DEFENCE.ordinal()];
        const strength = this.skills.maxLevel[Skill.STRENGTH.ordinal()];
        const hp = (this.skills.maxLevel[Skill.HITPOINTS.ordinal()]);
        const prayer = (this.skills.maxLevel[Skill.PRAYER.ordinal()]);
        const ranged = this.skills.maxLevel[Skill.RANGED.ordinal()];
        const magic = this.skills.maxLevel[Skill.MAGIC.ordinal()];
        let combatLevel = 3;
        combatLevel = (defence + hp + Math.floor(prayer / 2)) * 0.2535 + 1;
        const melee = (attack + strength) * 0.325;
        const ranger = Math.floor(ranged * 1.5) * 0.325;
        const mage = Math.floor(magic * 1.5) * 0.325;
        if (melee >= ranger && melee >= mage) {
            combatLevel += melee;
        } else if (ranger >= melee && ranger >= mage) {
            combatLevel += ranger;
        } else if (mage >= melee && mage >= ranger) {
            combatLevel += mage;
        }
        if (combatLevel > 126) {
            return 126;
        }
        if (combatLevel < 3) {
            return 3;
        }
        return combatLevel;
    }

    public getTotalLevel(): number {
        let total = 0;
        for (const skill of Object.values(Skill)) {
            total += this.skills.maxLevel[skill];
        }
        return total;
    }

    /**
     * Gets the player's total experience.
     *
     * @return The experience value from the player's every skill summed up.
     */
    public getTotalExp(): number {
        let xp = 0;
        for (const skill of Object.values(Skill)) {
            xp += this.player.getSkillManager().getExperience(skill);
        }
        return xp;
    }

    /**
     * Gets the current level for said skill.
     *
     * @param skill The skill to get current/temporary level for.
     * @return The skill's level.
     */
    public getCurrentLevel(skill: Skill): number {
        return this.skills.level[skill];
    }

    /**
     * Gets the max level for said skill.
     *
     * @param skill The skill to get max level for.
     * @return The skill's maximum level.
     */
    public getMaxLevel(skill: Skill): number {
        return this.skills.maxLevel[skill];
    }

    /**
     * Gets the max level for said skill.
     *
     * @param skill The skill to get max level for.
     * @return The skill's maximum level.
     */
    public getMaxLevel(skill: number): number {
        return this.skills.maxLevel[skill];
    }

    /**
     * Gets the experience for said skill.
     *
     * @param skill The skill to get experience for.
     * @return The experience in said skill.
     */
    public getExperience(skill: Skill): number {
        return this.skills.experience[skill];
    }

    /**
     * Sets the current level of said skill.
     *
     * @param skill The skill to set current/temporary level for.
     * @param level The level to set the skill to.
     * @param refresh If true, the skill's strings will be updated.
     * @return The Skills instance.
     */
    public setCurrentLevel(skill: Skill, level: number, refresh: boolean): SkillManager {
        this.skills.level[skill] = level < 0 ? 0 : level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    setMaxLevel(skill: Skill, level: number, refresh = true) {
        this.skills.maxLevel[skill.ordinal()] = level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    setExperience(skill: Skill, experience: number, refresh = true) {
        this.skills.experience[skill.ordinal()] = experience < 0 ? 0 : experience;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    setCurrentLevel(skill: Skill, level: number, refresh = true) {
        this.skills.maxLevel[skill.ordinal()] = level;
        if (refresh) {
            this.updateSkill(skill);
        }
        return this;
    }

    setMaxLevel(skill: Skill, level: number) {
        return this.setMaxLevel(skill, level, true);
    }

    setExperience(skill: Skill, experience: number) {
        return this.setExperience(skill, experience, true);
    }

    increaseCurrentLevelMax(skill: Skill, amount: number) {
        return this.increaseCurrentLevel(skill, amount, this.getMaxLevel(skill) + amount);
    }

    increaseCurrentLevel(skill: Skill, amount: number, max: number) {
        const curr = this.getCurrentLevel(skill);
        if ((curr + amount) > max) {
            this.setCurrentLevel(skill, max);
            return;
        }
        this.setCurrentLevel(skill, curr + amount);
    }

    decreaseLevelMax(skill: Skill, amount: number) {
        return this.decreaseCurrentLevel(skill, amount, this.getMaxLevel(skill) - amount);
    }

    isBoosted(skill: Skill) {
        return this.getCurrentLevel(skill) > this.getMaxLevel(skill);
    }

    startSkillable(object: GameObject) {
        // Check woodcutting..
        const tree = Tree.forObjectId(object.getId());
        if (tree) {
            this.startSkillable(new Woodcutting(object, tree));
            return true;
        }

        // Check mining..
        const rock = Rock.forObjectId(object.getId());
        if (rock) {
            this.startSkillable(new Mining(object, rock));
            return true;
        }

        // Check runecrafting
        if (Runecrafting.initialize(player, object.getId())) {
            return true;
        }

        return false;
    }

    startSkillable(skill: Skillable) {
        // Stop previous skills..
        this.stopSkillable();

        // Close interfaces..
        player.getPacketSender().sendInterfaceRemoval();

        // Check if we have the requirements to start this skill..
        if (!skill.hasRequirements(player)) {
            return;
        }

        // Start the skill..
        player.setSkill(Optional.of(skill));
        skill.start(player);
    }

    stopSkillable() {
        if (this.player.getSkill()) {
            this.player.getSkill().cancel(this.player);
        }
        this.player.setSkill(null);
        this.player.setCreationMenu(null);
    }

    getSkills() {
        return this.skills;
    }

    setSkills(skills: Skills) {
        this.skills = skills;
    }
}

class Skills {
    private level: number[];
    private maxLevel: number[];
    private experience: number[];
    constructor() {
        this.level = new Array(AMOUNT_OF_SKILLS);
        this.maxLevel = new Array(AMOUNT_OF_SKILLS);
        this.experience = new Array(AMOUNT_OF_SKILLS);
    }

    getLevels() {
        return this.level;
    }

    setLevels(levels: number[]) {
        this.level = levels;
    }

    getMaxLevels() {
        return this.maxLevel;
    }

    setMaxLevels(maxLevels: number[]) {
        this.maxLevel = maxLevels;
    }

    getExperiences() {
        return this.experience;
    }

    setExperiences(experiences: number[]) {
        this.experience = experiences;
    }
}
