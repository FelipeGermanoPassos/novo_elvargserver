class KingBlackDragonArea extends Area {
    public static BOUNDARY = new Boundary(2249, 2292, 4672, 4720);
    
    constructor() {
    super([BOUNDARY]);
    }
    
    process(character: Mobile) {}
    
    canTeleport(player: Player) {
    return true;
    }
    
    canTrade(player: Player, target: Player) {
    return true;
    }
    
    isMulti(character: Mobile) {
    return true;
    }
    
    canEat(player: Player, itemId: number) {
    return true;
    }
    
    canDrink(player: Player, itemId: number) {
    return true;
    }
    
    dropItemsOnDeath(player: Player, killer: Optional<Player>) {
    return true;
    }
    
    handleDeath(player: Player, killer: Optional<Player>) {
    return false;
    }
    
    onPlayerRightClick(player: Player, rightClicked: Player, option: number) {}
    
    defeated(player: Player, character: Mobile) {}
    
    handleObjectClick(player: Player, objectId: number, type: number) {
    return false;
    }
}