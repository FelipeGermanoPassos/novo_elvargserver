import { ExecutorService} from 'executor-service'
import { Runnable } from 'runnable';
import { Collection } from 'collections'
import { ArrayDeque } from 'collections';
import {ThreadFactoryBuilder} from 'java.js/java.util.concurrent'
import {TimeUnit} from 'timeunit'

export class BackgroundLoader {
    private service = new ExecutorService(
        new ThreadFactoryBuilder().setNameFormat("BackgroundLoaderThread").setDaemon(true).build()
    );
    private tasks = new ArrayDeque<Runnable>();
    private isShutdown = false;

    init(backgroundTasks: Collection<Runnable>) {
        if (this.isShutdown || this.service.isTerminated()) {
            throw new Error("This background loader has been shutdown!");
        }
        this.tasks.addAll(backgroundTasks);
        let t: Runnable;
        while ((t = this.tasks.poll()) != null) {
            this.service.execute(t);
        }
    }

    awaitCompletion(): boolean {
        if (this.isShutdown) {
            throw new Error("This background loader has been shutdown!");
        }
        try {
            this.service.awaitTermination(1, TimeUnit.HOURS);
        } catch (e) {
            console.log(`The background service loader was interrupted. ${e}`);
            return false;
        }
        this.isShutdown = true;
        return true;
    }

    stop() {
        this.service.shutdown();
    }
}