import { ScheduledExecutorService, ScheduledThreadPoolExecutor, Executors, CallerRunsPolicy } from 'java.util.concurrent';
import { TimeUnit } from 'timeunit'

export class GameLogic {
    private static logicService: ScheduledExecutorService = GameLogic.createLogicService();

    public static async submit(t: () => void) {
        try {
            await GameLogic.logicService.schedule(t, 0, TimeUnit.MILLISECONDS);
        } catch (e) {
            console.error(e);
        }
    }

    private static createLogicService(): ScheduledExecutorService {
        const executor = new ScheduledThreadPoolExecutor(1);
        executor.setRejectedExecutionHandler(new CallerRunsPolicy());
        executor.setKeepAliveTime(45, TimeUnit.SECONDS);
        executor.allowCoreThreadTimeOut(true);
        return Executors.unconfigurableScheduledExecutorService(executor);
    }
}