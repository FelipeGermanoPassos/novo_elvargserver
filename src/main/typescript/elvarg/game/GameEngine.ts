import { ThreadFactoryBuilder } from 'com.google.common.util.concurrent';
import { ScheduledExecutorService, Executors } from 'java.util.concurrent';
import { ClanChatManager } from 'com.elvarg.game.content.clan';

/**
 * The engine which processes the game.
 *
 * @author Professor Oak
 */
class GameEngine implements Runnable {
    /**
     * The {@link ScheduledExecutorService} which will be used for
     * this engine.
     */
    private executorService = Executors.newSingleThreadScheduledExecutor(new ThreadFactoryBuilder().setNameFormat("GameThread").build());

    /**
     * Initializes this {@link GameEngine}.
     */
    public init() {
        this.executorService.scheduleAtFixedRate(this, 0, GameConstants.GAME_ENGINE_PROCESSING_CYCLE_RATE, TimeUnit.MILLISECONDS);
    }

    public run() {
        try {
            World.process();
        } catch (e) {
            console.log(e);
            World.savePlayers();
            ClanChatManager.save();
        }
    }
}
