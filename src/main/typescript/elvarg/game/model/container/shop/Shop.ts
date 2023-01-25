class Shop {
    public static SALES_TAX_MODIFIER = 0.85;
    public static MAX_SHOP_ITEMS = 1000;
    public static MAX_SHOPS = 5000;
    public static INTERFACE_ID = 3824;
    public static ITEM_CHILD_ID = 3900;
    public static NAME_INTERFACE_CHILD_ID = 3901;
    public static INVENTORY_INTERFACE_ID = 3823;
    public static SCROLL_BAR_INTERFACE_ID = 29995;
    public static INFINITY = 2000000000;
    public static CURRENCY_COINS = ShopCurrencies.COINS.get();
    
    Copy code
    private id: number;
    private name: string;
    private originalStock: Item[];
    private currentStock: Item[] = new Array(Shop.MAX_SHOP_ITEMS);
    private restocking: boolean;
    private currency: ShopCurrency;

    onstructor(id: number, name: string, originalStock: Item[]) {
        this.id = id;
        this.name = name;
        this.originalStock = originalStock;
        for (let i = 0; i < originalStock.length; i++) {
            this.currentStock[i] = originalStock[i].clone();
        }
        this.currency = CURRENCY_COINS;
    }
    
    constructor(id: number, name: string, originalStock: Item[], currency: ShopCurrency) {
        this.id = id;
        this.name = name;
        this.originalStock = originalStock;
        for (let i = 0; i < originalStock.length; i++) {
            this.currentStock[i] = originalStock[i].clone();
        }
        this.currency = currency;
    }
    
    constructor(name: string, originalStock: Item[], currency: ShopCurrency) {
        this(ShopManager.generateUnusedId(), name, originalStock, currency);
    }
    
    removeItem(itemId: number, amount: number) {
        for (let i = 0; i < this.currentStock.length; i++) {
            let item = this.currentStock[i];
            if (!item) continue;
            if (item.getId() === itemId) {
                item.setAmount(item.getAmount() - amount);
                if (item.getAmount() <= 1) {
                    if (ShopManager.deletesItems(this.id)) {
                        this.currentStock[i] = null;
                    } else {
                        item.setAmount(1);
                    }
                }
                break;
            }
        }
    }

    addItem(itemId: number, amount: number) {
        let found = false;
        for (let item of this.currentStock) {
            if (!item) continue;
            if (item.getId() === itemId) {
                let amt = item.getAmount() + amount;
                if (amt < Number.MAX_SAFE_INTEGER) {
                    item.setAmount(item.getAmount() + amount);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            for (let i = 0; i < this.currentStock.length; i++) {
                if (!this.currentStock[i]) {
                    this.currentStock[i] = new Item(itemId, amount);
                    break;
                }
            }
        }
    }
    
    isFull(): boolean {
        let amount = 0;
        for (let item of this.currentStock) {
            if (!item) continue;
            amount++;
        }
        return (amount >= this.MAX_SHOP_ITEMS);
    }
    
    getAmount(itemId: number, fromOriginalStock: boolean): number {
        if (!fromOriginalStock) {
            for (let item of this.currentStock) {
                if (!item) continue;
                if (item.getId() === itemId) {
                    return item.getAmount();
                }
            }
        } else {
            for (let item of this.originalStock) {
                if (item.getId() === itemId) {
                    return item.getAmount();
                }
            }
        }
        return 0;
    }

    getCurrentStockList(): Item[] {
        let list: Item[] = [];
        for (let item of this.currentStock) {
            if (!item) continue;
            list.push(item);
        }
        return list;
    }
    
    getId(): number {
        return this.id;
    }
    
    getName(): string {
        return this.name;
    }
    
    getCurrency(): ShopCurrency {
        return this.currency;
    }
    
    getCurrentStock(): Item[] {
        return this.currentStock;
    }
    
    getOriginalStock(): Item[] {
        return this.originalStock;
    }
    
    isRestocking(): boolean {
        return this.restocking;
    }
    
    setRestocking(restocking: boolean) {
        this.restocking = restocking;
    }
}

