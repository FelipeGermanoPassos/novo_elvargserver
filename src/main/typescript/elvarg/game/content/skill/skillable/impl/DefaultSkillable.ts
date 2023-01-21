abstract class DefaultSkillable implements Skillable {
    private tasks: Task[] = [];

    start(player: Player) {
        // Start animation loop..
        this.startAnimationLoop(player);
    
        // Start main process task..
        let task = new Task(1, player, true) {
            let cycle = 0;
    
            execute() {
                // Make sure we still have the requirements to keep skilling..
                if (this.loopRequirements()) {
                    if (!this.hasRequirements(player)) {
                        this.cancel(player);
                        return;
                    }
                }
    
                // Every cycle, call the abstract method..
                this.onCycle(player);
    
                // Sequence the skill, reward players
                // with items once the right amount
                // of cycles have passed.
                if (cycle++ >= this.cyclesRequired(player)) {
                    this.finishedCycle(player);
                    cycle = 0;
                }
            }
        };
    
        // Submit it..
        TaskManager.submit(task);
    
        // Add to our list of tasks..
        this.tasks.push(task);
    }
    
    abstract onCycle(player: Player): void;
    abstract loopRequirements(): boolean;
    abstract hasRequirements(player: Player): boolean;
    abstract cyclesRequired(player: Player): number;
    abstract finishedCycle(player: Player): void;
    abstract startAnimationLoop(player: Player): void;

    cancel(player: Player): void {
        // Stop all tasks..
        const i = tasks.values();
        for (const task of i) {
            task.stop();
            tasks.delete(task);
        }

        // Reset animation..
        player.performAnimation(Animation.DEFAULT_RESET_ANIMATION);
    }

    hasRequirements(player: Player): boolean {
        // Check inventory slots..
        if (!this.allowFullInventory()) {
            if (player.getInventory().getFreeSlots() === 0) {
                player.getInventory().full();
                return false;
            }
        }

        // Check if busy..
        if (player.busy()) {
            return false;
        }

        return true;
    }

    onCycle(player: Player): void {}

    getTasks(): Array<Task> {
        return Array.from(tasks);
    }

    abstract loopRequirements(): boolean;
    abstract allowFullInventory(): boolean;

}    