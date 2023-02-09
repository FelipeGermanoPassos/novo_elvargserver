
import { Queue } from 'queue';
import { List } from 'List'
import { LinkedList } from 'linked-list'
import { iterator } from 'iterator'
import { Task } from './Task';
 
export class TaskManager {
    private static pendingTasks: Queue<Task> = new LinkedList<Task>();
    private static activeTasks: List<Task> = new LinkedList<Task>();
    
    private constructor() {
        throw new Error("This class cannot be instantiated!");
    }
    
    public static process(): void {
        try {
            let t: Task;
            while ((t = TaskManager.pendingTasks.poll()) != null) {
                if (t.isRunning()) {
                    TaskManager.activeTasks.add(t);
                }
            }
    
            const it = TaskManager.activeTasks.iterator();
    
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
    
        TaskManager.pendingTasks.add(task);
    }

    public static cancelTask(keys: any[]): void {
        for (const key of keys) {
        TaskManager.cancelTask(key);
        }
    }
        
    
    public static cancelTasks(key: Object): void {
            try {
                TaskManager.pendingTasks.filter(t => t.getKey() === key).forEach(t => t.stop());
                TaskManager.activeTasks.filter(t => t.getKey() === key).forEach(t => t.stop());
            } catch (e) {
                console.error(e);
            }
    }
        
    public static getTaskAmount(): number {
            return (TaskManager.pendingTasks.size + TaskManager.activeTasks.size);
    }
}
