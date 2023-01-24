class ResetCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    for (const skill in Skill) {
    const level = skill === Skill.HITPOINTS ? 10 : 1;
    player.getSkillManager().setCurrentLevel(skill, level).setMaxLevel(skill, level).setExperience(skill,
    SkillManager.getExperienceForLevel(level));
    }
    WeaponInterfaces.assign(player);
    }
    
    Copy code
    canUse(player: Player) {
        const rights = player.getRights();
        return (rights === PlayerRights.OWNER || rights === PlayerRights.DEVELOPER);
    }
}