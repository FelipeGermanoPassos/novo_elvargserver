import { Player } from "../../../entity/impl/player/Player";


export class PriceChecker extends ItemContainer {

    public static readonly INTERFACE_ID: number = 42000;
    public static readonly CONTAINER_ID: number = 18500;
    private static readonly TEXT_START_ROW_1: number = 18300;
    private static readonly TEXT_START_ROW_2: number = 18400;
    
    constructor(player: Player) {
        super(player);
    }
    
    public open(): ItemContainer {
        this.player.setStatus(PlayerStatus.PRICE_CHECKING);
        this.player.getMovementQueue().reset();
        this.refreshItems();
        return this;
    }
    
    public capacity(): number {
        return 24;
    }
    
    public stackType(): StackType {
        return StackType.DEFAULT;
    }

    override refreshItems(): ItemContainer {
        const items_ = this.getValidItems();
        if (items_.length > 0) {
        this.player.getPacketSender().sendString(18355, "").sendString(18351,
        Misc.insertCommasToNumber(this.getTotalValue())); // TOTAL VALUE
        
        Copy code
            // Send item prices
            for (let i = 0; i < this.capacity(); i++) {
                let itemPrice = "";
                let totalPrice = "";
        
                if (this.getItems()[i].isValid()) {
                    let value = this.getItems()[i].getDefinition().getValue();
                    let amount = this.getItems()[i].getAmount();
                    let total_price = (value * amount);
        
                    if (total_price >= Number.MAX_SAFE_INTEGER) {
                        totalPrice = "Too High!";
                    } else {
                        totalPrice = " = " + Misc.insertCommasToNumber(String(total_price));
                    }
        
                    itemPrice = "" + Misc.insertCommasToNumber(String(value)) + " x" + String(amount);
                }
        
                this.player.getPacketSender().sendString(TEXT_START_ROW_1 + i, itemPrice);
                this.player.getPacketSender().sendString(TEXT_START_ROW_2 + i, totalPrice);
            }
        
        } else {
            this.player.getPacketSender().sendString(18355, "Click an item in your inventory to check it's wealth.")
                    .sendString(18351, "0"); // TOTAL VALUE
        
            // Reset item prices
            for (let i = 0; i < this.capacity(); i++) {
                this.player.getPacketSender().sendString(TEXT_START_ROW_1 + i, "");
                this.player.getPacketSender().sendString(TEXT_START_ROW_2 + i, "");
            }
        }
        
        this.player.getPacketSender().sendInterfaceSet(INTERFACE_ID, 3321);
        this.player.getPacketSender().sendItemContainer(this, CONTAINER_ID);
        this.player.getPacketSender().sendItemContainer(this.player.getInventory(), 3322);
        return this;
    }

    override full(): ItemContainer {
        this.player.getPacketSender().sendMessage("The pricechecker cannot hold any more items.");
        return this;
        }
        
        public withdrawAll(): void {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == INTERFACE_ID) {
        for (const item of this.getValidItems()) {
        this.switchItem(this.player.getInventory(), item.clone(), false, false);
        }
        this.refreshItems();
        this.player.getInventory().refreshItems();
        }
        }
        
        public depositAll(): void {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == INTERFACE_ID) {
        for (const item of this.player.getInventory().getValidItems()) {
        if (item.getDefinition().getValue() > 0) {
        this.player.getInventory().switchItem(this, item.clone(), false, false);
        }
        }
        this.refreshItems();
        this.player.getInventory().refreshItems();
        }
    }

    public deposit(id: number, amount: number, slot: number): boolean {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == INTERFACE_ID) {
        
            // Verify item
            if (this.player.getInventory().getItems()[slot].getId() == id) {
        
                // Perform switch
                const item = new Item(id, amount);
                if (!item.getDefinition().isSellable()) {
                    this.player.getPacketSender()
                        .sendMessage("That item cannot be pricechecked because it isn't sellable.");
                    return true;
                }
                if (item.getDefinition().getValue() == 0) {
                    this.player.getPacketSender()
                        .sendMessage("There's no point pricechecking that item. It has no value.");
                    return true;
                }
        
                if (item.getAmount() == 1) {
                    this.player.getInventory().switchItem(this, item, slot, false, true);
                } else {
                    this.player.getInventory().switchItem(this, item, false, true);
                }
            }
            return true;
        }
        return false;
    }
        
    public withdraw(id: number, amount: number, slot: number): boolean {
        if (this.player.getStatus() == PlayerStatus.PRICE_CHECKING && this.player.getInterfaceId() == INTERFACE_ID) {
        
        Copy code
            // Verify item
            if (this.items[slot].getId() == id) {
        
                // Perform switch
                const item = new Item(id, amount);
                if (item.getAmount() == 1) {
                    this.switchItem(this.player.getInventory(), item, slot, false, true);
                } else {
                    this.switchItem(this.player.getInventory(), item, false, true);
                }
            }
            return true;
        }
        return false;
    }
}