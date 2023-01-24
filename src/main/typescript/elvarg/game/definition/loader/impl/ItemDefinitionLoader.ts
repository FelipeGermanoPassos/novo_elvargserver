import { DefinitionLoader } from './DefinitionLoader';
import { ItemDefinition } from './ItemDefinition';
import { GameConstants } from './GameConstants';

export class ItemDefinitionLoader extends DefinitionLoader {
    load() {
        ItemDefinition.definitions.clear();
        const reader = new FileReader(this.file());
        const defs: ItemDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            ItemDefinition.definitions.set(def.getId(), def);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "items.json";
    }
}