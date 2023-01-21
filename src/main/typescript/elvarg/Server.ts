class Server {
    private static flooder: Flooder = new Flooder();
    public static PRODUCTION: boolean = false;
    public static DEBUG_LOGGING: boolean = false;
    private static logger = Logger.getLogger(Server.class.getSimpleName());
    private static updating: boolean = false;
    
    Copy code
    public static main(args: string[]) {
        try {
            Runtime.getRuntime().addShutdownHook(new ShutdownHook());
    
            if (args.length == 1) {
                PRODUCTION = parseInt(args[0]) == 1;
            }
    
            logger.info(`Initializing ${GameConstants.NAME} in ${(PRODUCTION ? "production" : "non-production")} mode..`);
            new GameBuilder().initialize();
            new NetworkBuilder().initialize(NetworkConstants.GAME_PORT);
            logger.info(`${GameConstants.NAME} is now online!`);
    
        } catch (e) {
            logger.log(Level.SEVERE, "An error occurred while binding the Bootstrap!", e);
    
            // No point in continuing server startup when the
            // bootstrap either failed to bind or was bound
            // incorrectly.
            System.exit(1);
        }
    }
    
    public static logDebug(logMessage: string) {
        if (!DEBUG_LOGGING) {
            return;
        }
    
        getLogger().info(logMessage);
    }

    public static getLogger(): Logger {
        return logger;
    }
        
    public static isUpdating(): boolean {
        return updating;
    }
        
    public static setUpdating(isUpdating: boolean): void {
        Server.updating = isUpdating;
    }
        
    public static getFlooder(): Flooder {
        return flooder;
    }