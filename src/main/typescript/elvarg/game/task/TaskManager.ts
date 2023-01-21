class TaskManager {
    private static pendingTasks: Queue<Task> = new LinkedList<Task>();
    private static activeTasks: List<Task> = new LinkedList<Task>();
    
    private constructor() {
        throw new Error("This class cannot be instantiated!");
    }
    
    public static process(): void {
        try {
            let t: Task;
            while ((t = pendingTasks.poll()) != null) {
                if (t.isRunning()) {
                    activeTasks.add(t);
                }
            }
    
            const it = activeTasks.iterator();
    
            while (it.hasNext()) {
                t = it.next();
                if (!t.tick())
                    it.remove();
            }
        } catch (e) {
            console.error(e);
        }
    }
    
    public static submit(task: Task): void {
        if (task.isRunning()) {
            return;
        }
    
        task.setRunning(true);
    
        if (task.isImmediate()) {
            task.execute();
        }
    
        pendingTasks.add(task);
    }

    public static cancelTasks(keys: Object[]): void {
        for (const key of keys) {
        cancelTasks(key);
        }
        }
        
    
        public static cancelTasks(key: Object): void {
            try {
                pendingTasks.filter(t => t.getKey() === key).forEach(t => t.stop());
                activeTasks.filter(t => t.getKey() === key).forEach(t => t.stop());
            } catch (e) {
                console.error(e);
            }
        }
        
        public static getTaskAmount(): number {
            return (pendingTasks.size + activeTasks.size);
        }
}
