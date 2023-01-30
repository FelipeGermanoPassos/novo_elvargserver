import { Player } from "./entity/impl/player/Player";

export class Sounds {
    public static sendSounds(player: Player, sound: Sound) {
        if (player == null || sound == null || player.isPlayerBot()) {
            return;
        }

        Sounds.sendSound(player, sound.getId(), sound.getLoopType(), sound.getDelay(), sound.getVolume());

        import { Player } from '../game/entity/impl/player/Player'
        import * as Mobile from '../game/entity/impl/Mobile'
        import { Sound } from '../game/Sound'
        class Sounds {
            public static sendSound(player: Player, sound: Sound) {
                if (!player || !sound || player.isPlayerBot()) {
                    return;
                }

                this.sendSound(player, sound.getId(), sound.getLoopType(), sound.getDelay(), sound.getVolume());
            }

            public static sendSound(player: Player, soundId: number, loopType: number, delay: number, volume: number) {
                player.getPacketSender().sendSoundEffect(soundId, loopType, delay, volume);
            }
        }
    }
}
