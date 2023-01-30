import { DefinitionLoader } from './DefinitionLoader';
import { ShopDefinition } from './ShopDefinition';
import { GameConstants } from './GameConstants';
import { ShopManager } from './ShopManager';

export class ShopDefinitionLoader extends DefinitionLoader {
    load() {
        const reader = new FileReader(this.file());
        const defs: ShopDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            if (def.getCurrency() != null) {
                ShopManager.shops.set(def.getId(), new Shop(def.getId(), def.getName(), def.getOriginalStock(), def.getCurrency().get()));
            } else {
                ShopManager.shops.set(def.getId(), new Shop(def.getId(), def.getName(), def.getOriginalStock()));
            }
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "shops.json";
    }
}