import GameConstants from '../../../GameConstants'

export class GameSyncExecutor {
    private service: ExecutorService | null;
    private phaser: Phaser | null;

    constructor() {
        this.service = GameConstants.CONCURRENCY ? this.create(Runtime.getRuntime().availableProcessors()) : null;
        this.phaser = GameConstants.CONCURRENCY ? new Phaser(1) : null;
    }

    public sync(syncTask: GameSyncTask) {
        if (this.service == null || this.phaser == null || !syncTask.isConcurrent()) {
            for (let index = 1; index < syncTask.getCapacity(); index++) {
                if (!syncTask.checkIndex(index)) {
                    continue;
                }
                syncTask.execute(index);
            }
            return;
        }

        this.phaser.bulkRegister(syncTask.getAmount());
        for (let index = 1; index < syncTask.getCapacity(); index++) {
            if (!syncTask.checkIndex(index)) {
                continue;
            }
            let finalIndex = index;
            this.service.execute(() => {
                try {
                    syncTask.execute(finalIndex);
                } finally {
                    this.phaser.arriveAndDeregister();
                }
            });
        }
        this.phaser.arriveAndAwaitAdvance();
    }

    private create(nThreads: number): ExecutorService {
        if (nThreads <= 1)
            return null;
        let executor = Executors.newFixedThreadPool(nThreads) as ThreadPoolExecutor;
        executor.setRejectedExecutionHandler(new CallerRunsPolicy());
        executor.setThreadFactory(new ThreadFactoryBuilder().setNameFormat("GameSyncThread").build());
        return Executors.unconfigurableExecutorService(executor);
    }
}
