import { Player } from "./entity/impl/player/Player";
import {Sound} from '../game/Sound'
class Sounds {
    public static sendSound(player: Player, sound: Sound) {
        if (!player || !sound || player.isPlayerBot()) {
            return;
        }

        this.sendSound(player, sound.getId());
    }
}
