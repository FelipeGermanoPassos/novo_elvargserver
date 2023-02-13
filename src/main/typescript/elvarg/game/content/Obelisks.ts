import { World } from '../../game/Worlds';
import { GameObject } from '../entity/impl/object/GameObject';
import { ObjectManager } from '../entity/impl/object/ObjectManager';
import { Graphic } from '../model/Graphic';
import { Location } from '../model/Location';
import { WildernessArea } from '../model/areas/impl/WildernessArea';
import { Task } from '../task/Task';
import { TaskManager } from '../task/TaskManager';
import { Misc } from '../../util/Misc';
import { TeleportType } from '../model/teleportation/TeleportType';


export class Obelisks {

    static activate(objectId: number): boolean {
        const index = this.getObeliskIndex(objectId);
        if (index >= 0) {
            if (!Obelisks.OBELISK_ACTIVATED[index]) {
                Obelisks.OBELISK_ACTIVATED[index] = true;
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0], Obelisks.OBELISK_COORDS[index][1]), 10, 0, null), true);
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0] + 4, Obelisks.OBELISK_COORDS[index][1]), 10, 0, null), true);
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0], Obelisks.OBELISK_COORDS[index][1] + 4), 10, 0, null), true);
                ObjectManager.register(new GameObject(14825, new Location(Obelisks.OBELISK_COORDS[index][0] + 4, Obelisks.OBELISK_COORDS[index][1] + 4), 10, 0, null), true);
                TaskManager.submit(new Task(4, false) {
                    public execute() {
                        const obeliskLocation = new Location(Obelisks.OBELISK_COORDS[index][0] + 2,
                            OBELISK_COORDS[index][1] + 2);
                        const random = Misc.getRandom(5);
                        while (random == index)
                            random = Misc.getRandom(5);
                        const newLocation = new Location(OBELISK_COORDS[random][0] + 2,
                            OBELISK_COORDS[random][1] + 2);
                        for (const player of World.getPlayers()) {
                            if (player == null || !(player.getArea() instanceof WildernessArea))
                                continue;
                            if (player.getLocation().isWithinDistance(obeliskLocation, 1) && !player.getCombat().getTeleBlockTimer().finished())
                                player.getPacketSender().sendMessage("A magical spell is blocking you from teleporting.");

                            if (player.getLocation().isWithinDistance(obeliskLocation, 1) && player.getCombat().getTeleBlockTimer().finished()) {
                                player.performGraphic(new Graphic(661));
                                player.moveTo(newLocation);
                                player.performAnimation(TeleportType.NORMAL.getEndAnimation());
                            }
                        }
                        Obelisks.deactivate(index);
                        this.stop();
                    }

                    public stop() {
                        super.stop();
                        OBELISK_ACTIVATED[index] = false;
                    }
                });
            }
            return true;
        }
        return false;
    }

    /*
     * Obelisk ids
     */
    public static readonly OBELISK_IDS: number[] = [14829, 14830, 14827, 14828, 14826, 14831];

    /*
     * The obelisks
     */
    public static readonly obelisks: GameObject[] = new Array(4);

    /*
     * Are the obelisks activated?
     */
    private static readonly OBELISK_ACTIVATED: boolean[] = new Array(Obelisks.OBELISK_IDS.length);

    /*
     * Obelisk coords
     */
    private static readonly OBELISK_COORDS: number[][] = [
        [3154, 3618],
        [3225, 3665],
        [3033, 3730],
        [3104, 3792],
        [2978, 3864],
        [3305, 3914]
    ];

    public static getObeliskIndex(id: number) {
        for (let j = 0; j < Obelisks.OBELISK_IDS.length; j++) {
            if (Obelisks.OBELISK_IDS[j] == id)
                return j;
        }
        return -1;
    }
}