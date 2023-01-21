class BackgroundLoader {
    private service = new ExecutorService(
        new ThreadFactoryBuilder().setNameFormat("BackgroundLoaderThread").setDaemon(true).build()
    );
    private tasks = new ArrayDeque<Runnable>();
    private shutdown = false;

    init(backgroundTasks: Collection<Runnable>) {
        if (this.shutdown || this.service.isShutdown) {
            throw new Error("This background loader has been shutdown!");
        }
        this.tasks.push(...backgroundTasks);
        let t: Runnable;
        while ((t = this.tasks.shift()) != null) {
            this.service.execute(t);
        }
        this.service.shutdown();
    }

    awaitCompletion(): boolean {
        if (this.shutdown) {
            throw new Error("This background loader has been shutdown!");
        }
        try {
            this.service.awaitTermination(Number.MAX_SAFE_INTEGER, TimeUnit.DAYS);
        } catch (e) {
            console.log(`The background service loader was interrupted. ${e}`);
            return false;
        }
        this.shutdown = true;
        return true;
    }
}