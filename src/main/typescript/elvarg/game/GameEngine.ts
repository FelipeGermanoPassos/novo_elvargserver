import { ThreadFactoryBuilder } from 'com.google.common.util.concurrent';
import { ScheduledExecutorService, Executors } from 'java.util.concurrent';
import { ClanChatManager } from 'com.elvarg.game.content.clan';

/**
 * The engine which processes the game.
 *
 * @author Professor Oak
 */
class GameEngine implements Runnable {
    private executorService = new ScheduledExecutorService();
    
    constructor() {
        this.executorService = Executors.newSingleThreadScheduledExecutor(new ThreadFactoryBuilder().setNameFormat("GameThread").build());
    }
    
    public init() {
        this.executorService.scheduleAtFixedRate(this.run.bind(this), 0, GameConstants.GAME_ENGINE_PROCESSING_CYCLE_RATE, TimeUnit.MILLISECONDS);
    }
    
    public async run() {
        try {
            await World.process();
        } catch (e) {
            console.log(e);
            World.savePlayers();
            ClanChatManager.save();
        }
    }
}
