import {World} from '../game/Worlds'

import { Logger } from 'winston-logger';


export class ShutdownHook {

    private static readonly logger: Logger = new Logger({
        level: 'info',
        transports: [
            new Logger.transports.Console()
        ]
    });

    public run() {
        ShutdownHook.logger.info("The shutdown hook is processing all required actions...");
        World.savePlayers();
        ShutdownHook.logger.info("The shudown hook actions have been completed, shutting the server down...");
    }
}