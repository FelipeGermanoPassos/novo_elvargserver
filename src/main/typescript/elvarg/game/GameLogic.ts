import { ScheduledExecutorService, ScheduledThreadPoolExecutor, Executors, CallerRunsPolicy } from 'java.util.concurrent';
import { ThreadFactoryBuilder } from 'com.google.common.util.concurrent';

class GameLogic {
    private static logicService = GameLogic.createLogicService();
    
    public static submit(t: () => void) {
        try {
            this.logicService.execute(t);
        } catch (e) {
            console.error(e);
        }
    }
    
    private static createLogicService(): ScheduledExecutorService {
        const executor = new ScheduledThreadPoolExecutor(1);
        executor.setRejectedExecutionHandler(new CallerRunsPolicy());
        executor.setThreadFactory(new ThreadFactoryBuilder().setNameFormat("LogicServiceThread").build());
        executor.setKeepAliveTime(45, TimeUnit.SECONDS);
        executor.allowCoreThreadTimeOut(true);
        return Executors.unconfigurableScheduledExecutorService(executor);
    }
}