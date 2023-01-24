import { RegionManager } from "com.elvarg.game.collision";
import { PlayerRights } from "com.elvarg.game.model.rights";
import { Location } from "com.elvarg.game.model";
import { Area } from "com.elvarg.game.model.areas";
import { PrivateArea } from "com.elvarg.game.model.areas.impl";
import { Player } from "com.elvarg.game.entity.impl.player";
import { GameObject } from "com.elvarg.game.entity.impl.object";

export class MapObjects {

    public static mapObjects: Map<number, GameObject[]> = new Map<number, GameObject[]>();

    public static get(player: Player, id: number, location: Location): GameObject {
        let object = this.get(id, location, player.getPrivateArea());

        if (object == null && player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("@red@Object with id " + id + " does not exist.");
            object = new GameObject(id, location, 10, 0, player.getPrivateArea());
        }

        return object;
    }

    public static get(id: number, location: Location, privateArea: PrivateArea): GameObject {
        // Check instanced objects..
        if (privateArea != null) {
            for (let object of privateArea.getObjects()) {
                if (object.getId() == id && object.getLocation().equals(location)) {
                    return object;
                }
            }
        }

        // Load region..
        RegionManager.loadMapFiles(location.getX(), location.getY());

        // Get hash..
        if (location.getZ() >= 4) {
            location = location.clone().setZ(0);
        }
        let hash = this.getHash(location.getX(), location.getY(), location.getZ());

        // Check if the map contains the hash..
        if (!this.mapObjects.has(hash)) {
            return null;
        }

        // Go through the objects in the list..
        let list = this.mapObjects.get(hash);
        if (list != null) {
            for (let o of list) {
                if (o.getId() == id && o.getLocation().equals(location)) {
                    return o;
                }
            }
        }
        return null;
    }

    public static get(location: Location, type: number, privateArea: PrivateArea): GameObject {
        // Check instanced objects..
        if (privateArea != null) {
            for (let object of privateArea.getObjects()) {
                if (object.getType() == type && object.getLocation().equals(location)) {
                    return object;
                }
            }
        }

        // Load region..
        RegionManager.loadMapFiles(location.getX(), location.getY());

        // Get hash..
        if (location.getZ() >= 4) {
            location = location.clone().setZ(0);
        }
        let hash = getHash(location.getX(), location.getY(), location.getZ());

        // Check if the map contains the hash..
        if (!mapObjects.has(hash)) {
            return null;
        }

        // Go through the objects in the list..
        let list = mapObjects.get(hash);
        if (list != null) {
            for (let o of list) {
                if (o.getType() == type && o.getLocation().equals(location)) {
                    return o;
                }
            }
        }
        return null;
    }
}