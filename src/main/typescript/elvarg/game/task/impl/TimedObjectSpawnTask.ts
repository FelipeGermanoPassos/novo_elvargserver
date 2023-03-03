import { GameObject } from "../../entity/impl/object/GameObject";
import { ObjectManager } from "../../entity/impl/object/ObjectManager";
import { Optional } from 'optional'
import { Action } from '../../model/Action';
import { Task } from "../Task";
export class TimedObjectSpawnTask extends Task {
    private temp: GameObject;
    private ticks: number;
    private action: Optional<Action>;
    public static tick = 0;

    constructor(temp: GameObject, ticks: number, action: Optional<Action>) {
        super();
        this.temp = temp;
        this.action = action;
        this.ticks = ticks;
    }

    execute() {
        if (TimedObjectSpawnTask.tick === 0) {
            ObjectManager.register(this.temp, true);
        } else if (TimedObjectSpawnTask.tick >= this.ticks) {
            ObjectManager.deregister(this.temp, true);

            if (this.action && this.action.isPresent()) {
                this.action.get().execute();
            }

            stop();
        }
        TimedObjectSpawnTask.tick++;
    }

    onExecute() {

    }
}