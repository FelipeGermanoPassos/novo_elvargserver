
import {Player} from '../game/entity/impl/player/Player'
import * as Mobile from '../game/entity/impl/Mobile'
import {Sound} from '../game/Sound'
class Sounds {
    public static sendSound(player: Player, sound: Sound) {
<<<<<<< HEAD
    if (!player || !sound || player.isPlayerBot()) {
    return;
    }
    
=======
        if (!player || !sound || player.isPlayerBot()) {
            return;
        }

>>>>>>> 03ef12a5e231898cd5dce5dce3b92cc40bac36ba
        this.sendSound(player, sound.getId(), sound.getLoopType(), sound.getDelay(), sound.getVolume());
    }

    public static sendSound(player: Player, soundId: number, loopType: number, delay: number, volume: number) {
        player.getPacketSender().sendSoundEffect(soundId, loopType, delay, volume);
    }
} 
