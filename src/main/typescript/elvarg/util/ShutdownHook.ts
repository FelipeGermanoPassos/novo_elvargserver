import {World} from '../game/Worlds'



export class ShutdownHook {


    public run() {
        console.log("The shutdown hook is processing all required actions...");
        World.savePlayers();
        console.log("The shudown hook actions have been completed, shutting the server down...");
    }
}