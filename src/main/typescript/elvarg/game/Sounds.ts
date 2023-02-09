
import { Player } from '../game/entity/impl/player/Player'
import { Sound } from '../game/Sound'
class Sounds {
    public static sendSound(player: Player, sound: Sound) {
        if (!player || !sound || player.isPlayerBot()) {
            return;
        }

        this.sendSound(player, sound.getId(), sound.getLoopType(), sound.getDelay(), sound.getVolume());
    }

    public static sendSoundEffect(player: Player, soundId: number, loopType: number, delay: number, volume: number) {
        player.getPacketSender().sendSoundEffect(soundId, loopType, delay, volume);
    }
}
