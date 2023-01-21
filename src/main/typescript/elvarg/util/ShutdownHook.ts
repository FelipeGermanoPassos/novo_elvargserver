class ShutdownHook extends Thread {

        private static readonly logger = Logger.getLogger(ShutdownHook.class.name);
        
        run() {
            logger.info("The shutdown hook is processing all required actions...");
            World.savePlayers();
            logger.info("The shudown hook actions have been completed, shutting the server down...");
        }
    }