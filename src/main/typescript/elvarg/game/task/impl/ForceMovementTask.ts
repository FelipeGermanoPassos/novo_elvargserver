class ForceMovementTask extends Task {
    private player: Player;
    private end: Location;
    private start: Location;
    
    constructor(player: Player, delay: number, forceM: ForceMovement) {
        super(delay, player, (delay == 0 ? true : false));
        this.player = player;
        this.start = forceM.getStart().clone();
        this.end = forceM.getEnd().clone();
    
        //Reset combat
        player.getCombat().reset();
    
        //Reset movement queue
        player.getMovementQueue().reset();
    
        //Playerupdating
        player.setForceMovement(forceM);
    }
    
    protected execute() {
        let x = start.getX() + end.getX();
        let y = start.getY() + end.getY();
        player.moveTo(new Location(x, y, player.getLocation().getZ()));
        player.setForceMovement(null);
        this.stop();
    }
}