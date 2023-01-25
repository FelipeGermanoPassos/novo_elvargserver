import { DefinitionLoader } from './DefinitionLoader';
import { NpcDefinition } from './NpcDefinition';
import { GameConstants } from './GameConstants';

export class NpcDefinitionLoader extends DefinitionLoader {
    load() {
        NpcDefinition.definitions.clear();
        const reader = new FileReader(this.file());
        const defs: NpcDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            NpcDefinition.definitions.set(def.getId(), def);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "npc_defs.json";
    }
}