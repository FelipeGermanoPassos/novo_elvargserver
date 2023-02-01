export class Server {
    private static flooder = new Flooder();
    public static PRODUCTION = false;
    public static DEBUG_LOGGING = false;
    private static logger = Logger.getLogger(Server.class.getSimpleName());
    private static updating = false;

    public static main(args: string[]) {
        try {
            Runtime.getRuntime().addShutdownHook(new ShutdownHook());

            if (args.length == 1) {
                PRODUCTION = parseInt(args[0]) == 1;
            }

            logger.info("Initializing " + GameConstants.NAME + " in " + (PRODUCTION ? "production" : "non-production") + " mode..");
            new GameBuilder().initialize();
            new NetworkBuilder().initialize(NetworkConstants.GAME_PORT);
            logger.info(GameConstants.NAME + " is now online!");

        } catch (e) {
            logger.log(Level.SEVERE, "An error occurred while binding the Bootstrap!", e);
            System.exit(1);
        }
    }

    public static logDebug(logMessage: string) {
        if (!Server.DEBUG_LOGGING) {
            return;
        }
<<<<<<< HEAD
    
        Server.logger.info(logMessage);
=======

        getLogger().info(logMessage);
>>>>>>> 03ef12a5e231898cd5dce5dce3b92cc40bac36ba
    }

    public static getLogger() {
        return Server.logger;
    }
        
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
