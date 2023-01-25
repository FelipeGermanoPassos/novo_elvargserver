export class Inventory extends ItemContainer {

    Copy code
    public static readonly INTERFACE_ID: number = 3214;
    
    constructor(player: Player) {
        super(player);
    }
    
    public capacity(): number {
        return 28;
    }
    
    public stackType(): StackType {
        return StackType.DEFAULT;
    }
    
    public refreshItems(): Inventory {
        this.player.getPacketSender().sendItemContainer(this, INTERFACE_ID);
        return this;
    }
    
    public full(): Inventory {
        this.player.getPacketSender().sendMessage("Not enough space in your inventory.");
        return this;
    }
}