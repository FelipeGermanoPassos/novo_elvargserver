import { DefinitionLoader } from './DefinitionLoader';
import { NpcSpawnDefinition } from './NpcSpawnDefinition';
import { GameConstants } from './GameConstants';
import { World } from './World';

export class NpcSpawnDefinitionLoader extends DefinitionLoader {
    load() {
        const reader = new FileReader(this.file());
        const defs: NpcSpawnDefinition[] = JSON.parse(reader.readAsText());
        for (const def of defs) {
            const npc = NPC.create(def.getId(), def.getPosition());
            npc.getMovementCoordinator().setRadius(def.getRadius());
            npc.setFace(def.getFacing());
            World.addNPCQueue.push(npc);
        }
        reader.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "npc_spawns.json";
    }
}