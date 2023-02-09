
import { NPC } from '../game/entity/impl/npc/NPC';
import requireAll from 'require-all';
import { getOwnMetadata } from '@angular/core';

export class Systems {
    public static init() {
        const npcOverrideClasses = requireAll({
            dirname: `${__dirname}/game/entity/impl/npc`,
            filter: /^(?!.*base).*\.js$/,
            recursive: true,
            map: (name, path) => require(path).default
        });

        const npcClasses = npcOverrideClasses.filter(clazz => getOwnMetadata('Ids', clazz.prototype));
        const implementationClasses = npcClasses.filter(clazz => clazz.prototype instanceof NPC);
        NPC.initImplementations(implementationClasses);
    }
}