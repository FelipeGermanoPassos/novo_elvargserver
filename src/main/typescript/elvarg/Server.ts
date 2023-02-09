import { GameBuilder } from "./game/GameBuilder";
import { GameConstants } from "./game/GameConstants";
import { NetworkBuilder } from "./net/NetworkBuilder";
import { NetworkConstants } from "./net/NetworkConstants";
import { ShutdownHook } from "./util/ShutdownHook";
import { Flooder } from "./util/flood/Flooder";


export class Server {
    private static flooder = new Flooder();
    public static PRODUCTION = false;
    public static DEBUG_LOGGING = false;
    private static updating = false;

    public static main(args: string[]) {
        try {
            process.on('exit', () => {
                new ShutdownHook()
            });

            /*if (args.length == 1) {
                PRODUCTION = parseInt(args[0]) == 1;
            }*/

            console.log("Initializing " + GameConstants.NAME + " in " + (Server.PRODUCTION ? "production" : "non-production") + " mode..");
            //new GameBuilder().initialize();
            new NetworkBuilder().initialize(NetworkConstants.GAME_PORT);
            console.log(GameConstants.NAME + " is now online!");

        } catch (e) {
            console.log(Level.SEVERE, "An error occurred while binding the Bootstrap!", e);
            process.exit(1);
        }
    }

    public static logDebug(logMessage: string) {
        if (!Server.DEBUG_LOGGING) {
            return;
        }

        console.log(logMessage);
    }

    // public static getLogger() {
    //return Server.logger;
    // }

    public static isUpdating() {
        return Server.updating;
    }

    public static setUpdating(isUpdating: boolean) {
        Server.updating = isUpdating;
    }

    public static getFlooder() {
        return Server.flooder;
    }
}
