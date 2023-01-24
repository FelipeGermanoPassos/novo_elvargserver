import { DefinitionLoader } from './DefinitionLoader';
import { ObjectSpawnDefinition } from './ObjectSpawnDefinition';
import { GameConstants } from './GameConstants';
import { GameObject } from './GameObject';
import { ObjectManager } from './ObjectManager';

export class ObjectSpawnDefinitionLoader extends DefinitionLoader {
    load() {
        const reader = new FileReader(this.file());
        const defs: ObjectSpawnDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            ObjectManager.register(new GameObject(def.getId(), def.getPosition(), def.getType(), def.getFace(), null), true);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "object_spawns.json";
    }
}