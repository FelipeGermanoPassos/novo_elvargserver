import { Location } from "../../../model/Location";
import { World } from "../../../Worlds";
import { TaskManager } from "../../../task/TaskManager";
import { FightCavesArea } from "../../../model/areas/impl/FightCavesArea";
import { TztokJad } from "../../../entity/impl/npc/impl/TztokJad";

export class FightCaves {
    public static readonly ENTRANCE: Location = new Location(2413, 5117);
    public static readonly EXIT: Location = new Location(2438, 5168);
    private static readonly JAD_SPAWN_POS: Location = new Location(2401, 5088);
    private static readonly JAD_NPC_ID: number = 3127;

    public static start(player: Player) {
        const area = new FightCavesArea();
        area.add(player);
        TaskManager.submit(new Task(14, player, false, () => {
            if (area.isDestroyed()) {
                return;
            }
            World.getAddNPCQueue().add(new TztokJad(player, area, FightCaves.JAD_NPC_ID, FightCaves.JAD_SPAWN_POS.clone()));
        }));
    }
}
