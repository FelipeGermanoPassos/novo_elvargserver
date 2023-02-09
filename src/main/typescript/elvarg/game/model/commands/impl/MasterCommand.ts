<<<<<<< Updated upstream
class MasterCommand implements Command {
=======
import { Command } from '../../../model/commands/Command';
import { Player } from '../../../entity/impl/player/Player';
import { PlayerRights } from '../../../model/rights/PlayerRights';
import { SkillManager } from '../../../content/skill/SkillManager'
import { WeaponInterfaces } from '../../../content/combat/WeaponInterfaces'
import { Flag } from '../../Flag';
import { Skill } from '../../Skill';


export class MasterCommand implements Command {
>>>>>>> Stashed changes
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