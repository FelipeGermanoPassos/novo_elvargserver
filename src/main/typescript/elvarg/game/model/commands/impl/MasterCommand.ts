class MasterCommand implements Command {
    execute(player: Player, command: string, parts: string[]) {
    for (let skill in Skill) {
    let level = SkillManager.getMaxAchievingLevel(skill);
    player.getSkillManager().setCurrentLevel(skill, level).setMaxLevel(skill, level).setExperience(skill,
    SkillManager.getExperienceForLevel(level));
    }
    WeaponInterfaces.assign(player);
    player.getUpdateFlag().flag(Flag.APPEARANCE);
    }
    
    Copy code
    canUse(player: Player) {
        return player.getRights() === PlayerRights.OWNER || player.getRights() === PlayerRights.DEVELOPER;
    }
}