import { DefinitionLoader } from '../DefinitionLoader';
import { NpcSpawnDefinition } from "../../NpcSpawnDefinition"
import { GameConstants } from '../../../GameConstants';
import { FacingDirection } from '../../../model/FacingDirection';
import { Location } from '../../../model/Location';
import fs from "fs";

export class NPCSpawnDumper extends DefinitionLoader {
    load() {
        const r =  fs(this.file());
        let s: string;

        const path = Paths.get(GameConstants.DEFINITIONS_DIRECTORY, "gay.json");
        const file = path.toFile();
        file.parent.writable = true;
        const w =  fs(file, true);
        const builder: JSON = new JSON().setPrettyPrinting().create();;

        while ((s = r.readLine()) != null) {
            if (s.startsWith("/"))
                continue;
            const data = s.split(" ");
            const id = parseInt(data[0]);
            const x = parseInt(data[2]);
            const y = parseInt(data[3]);
            const z = parseInt(data[4]);

            w.write(JSON.stringify(new NpcSpawnDefinition(id, new Location(x, y, z), FacingDirection.SOUTH, 2)));
            w.write(",");
            w.write("\n");
        }
        r.close();
        w.close();
    }

    file(): string {
        return GameConstants.DEFINITIONS_DIRECTORY + "dump.txt";
    }
}