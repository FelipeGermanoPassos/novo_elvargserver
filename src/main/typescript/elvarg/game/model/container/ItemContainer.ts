import { Item } from "../Item";
import { Player } from "../../entity/impl/player/Player";

export class ItemContainer {
    private player: Player;
    public items: Item[] = new Array(this.capacity());
    
    constructor() {
        for (let i = 0; i < this.capacity(); i++) {
            this.items[i] = new Item(-1, 0);
        }
    }
    
    constructor(capacity: number) {
        this.items = new Array(capacity);
        for (let i = 0; i < capacity; i++) {
            this.items[i] = new Item(-1, 0);
        }
    }
    
    constructor(player: Player) {
        this.player = player;
        for (let i = 0; i < this.capacity(); i++) {
            this.items[i] = new Item(-1, 0);
        }
    }
    
    constructor(player: Player, capacity: number) {
        this.player = player;
        this.items = new Array(capacity);
        for (let i = 0; i < capacity; i++) {
            this.items[i] = new Item(-1, 0);
        }
    }

    constructor(player: Player, capacity: number)
    constructor(player: Player)
    constructor(capacity: number)
    constructor()
    constructor(pc?: any, capacity?: any){
        if ()
    }
    
    abstract capacity(): number;
    
    abstract stackType(): StackType;
    
    abstract refreshItems(): ItemContainer;
    
    abstract full(): ItemContainer;
    
    getPlayer(): Player {
        return this.player;
    }
    
    setPlayer(player: Player): ItemContainer {
        this.player = player;
        return this;
    }
    
    public getItems(): Item[] {
        return this.items;
    }
    
    getItemIdsArray(): number[] {
        let array = new Array(this.items.length);
        for (let i = 0; i < this.items.length; i++) {
            array[i] = this.items[i].getId();
        }
        return array;
    }

    setItems(items: Item[]): ItemContainer {
        this.items = items;
        return this;
    }
    
    getCopiedItems(): Item[] {
        let it: Item[] = new Array(this.items.length);
        for (let i = 0; i < it.length; i++) {
            it[i] = this.items[i].clone();
        }
        return it;
    }
    
    getValidItems(): Item[] {
        let items: Item[] = [];
        for (let item of this.items) {
            if (item != null && item.getId() > 0) {
                if (item.getAmount() > 0 || (this instanceof Bank && item.getAmount() == 0)) {
                    items.push(item);
                }
            }
        }
        return items;
    }
    
    getValidItemsArray(): Item[] {
        let items = this.getValidItems();
        let array: Item[] = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
            array[i] = items[i];
        }
        return array;
    }
    
    copyValidItemsArray(): Item[] {
        let items = this.getValidItems();
        let array: Item[] = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
            array[i] = new Item(items[i].getId(), items[i].getAmount());
        }
        return array;
    }
    
    setItem(slot: number, item: Item): ItemContainer {
        this.items[slot] = item;
        return this;
    }
    
    isSlotOccupied(slot: number): boolean {
        return this.items[slot] != null && this.items[slot].getId() > 0 && this.items[slot].getAmount() > 0;
    }
    
    swap(fromSlot: number, toSlot: number): ItemContainer {
        let temporaryItem = this.getItems()[fromSlot];
        if (temporaryItem == null || temporaryItem.getId() <= 0) {
            return this;
        }
        this.setItem(fromSlot, this.getItems()[toSlot]);
        this.setItem(toSlot, temporaryItem);
        return this;
    }

  
    shiftSwap(fromSlot: number, toSlot: number): ItemContainer {
        let temporaryItem = this.getItems()[fromSlot];
        if (temporaryItem == null || temporaryItem.getId() <= 0) {
        return this;
        }
        return this;
    }

    getFreeSlots(): number {
        let space = 0;
        for (let item of this.items) {
            if (item.getId() == -1) {
                space++;
            }
        }
        return space;
    }
    
    isFull(): boolean {
        return this.getEmptySlot() == -1;
    }
    
    isEmpty(): boolean {
        return this.getFreeSlots() == this.capacity();
    }
    
    contains(id: number): boolean {
        for (let items of this.items) {
            if (items.getId() == id) {
                return true;
            }
        }
        return false;
    }
    
    contains(item: Item): boolean {
        return this.getAmount(item.getId()) >= item.getAmount();
    }
    
    contains(item: Item[]): boolean {
        if (item.length == 0) {
            return false;
        }
    
        for (let nextItem of item) {
            if (nextItem == null) {
                continue;
            }
    
            if (!this.contains(nextItem.getId())) {
                return false;
            }
        }
        return true;
    }

    containsAny(itemIds: number[]): boolean {
        if (itemIds.length == 0 || this.isEmpty()) {
        return false;
        }
        
        for (let itemId of itemIds) {
            if (itemId == -1) {
                continue;
            }

            if (this.contains(itemId)) {
                return true;
            }
        }
        return false;
    }

    getEmptySlot(): number {
        for (let i = 0; i < this.capacity(); i++) {
            if (this.items[i].getId() <= 0 || this.items[i].getAmount() <= 0 && !(this instanceof Bank)) {
                return i;
            }
        }
        return -1;
    }

    getSlot(slotId: number): number {
        if (this.items.length < slotId || !this.items[slotId].isValid()) {
            return -1;
        }

        return this.items[slotId].getId();
    }

    getSlotForItemId(id: number): number {
        for (let i = 0; i < this.capacity(); i++) {
        if (this.items[i].getId() == id) {
        if (this.items[i].getAmount() > 0 || (this instanceof Bank && this.items[i].getAmount() == 0)) {
        return i;
        }
        }
        }
        return -1;
    }
    
    getAmount(id: number): number {
        let totalAmount = 0;
        for (let item of this.items) {
            if (item.getId() == id) {
                totalAmount += item.getAmount();
            }
        }
        return totalAmount;
    }
    
    getAmountForSlot(slot: number): number {
        return this.items[slot].getAmount();
    }
    
    resetItems(): ItemContainer {
        for (let i = 0; i < this.capacity(); i++) {
            this.items[i] = new Item(-1, 0);
        }
        return this;
    }
    
    forSlot(slot: number): Item {
        return this.items[slot];
    }

    public switchItem(to: ItemContainer, item: Item, slot: number, sort: boolean, refresh: boolean): ItemContainer {
        if (this.getItems()[slot].getId() !== item.getId()) {
        return this;
        }
        
        if (to.getFreeSlots() <= 0 && !(to.contains(item.getId()) && item.getDefinition().isStackable())) {
            to.full();
            return this;
        }
        
        if ((this instanceof Inventory || this instanceof Equipment) && to instanceof Bank) {
            if (to.getAmount(item.getId()) + item.getAmount() > Number.MAX_SAFE_INTEGER
                    || to.getAmount(item.getId()) + item.getAmount() <= 0) {
                item.setAmount(Number.MAX_SAFE_INTEGER - (to.getAmount(item.getId())));
                if (item.getAmount() <= 0) {
                    this.getPlayer().getPacketSender()
                    .sendMessage("You cannot deposit that entire amount into your bank.");
                        return this;
                }
            }
        }
    
        this.delete(item, slot, refresh, to);
    
        // Noted items should not be in bank. Un-note if it's noted..
        if (to instanceof Bank && ItemDefinition.forId(item.getId()).isNoted()
                && !ItemDefinition.forId(item.getId() - 1).isNoted()) {
            item.setId(item.getId() - 1);
        }
    
        to.add(item, refresh);
    
        if (sort && this.getAmount(item.getId()) <= 0) {
            this.sortItems();
        }
    
        if (refresh) {
            this.refreshItems();
            to.refreshItems();
        }
    
        // Add item to bank search aswell!!
        if (to instanceof Bank) {
            if (this.getPlayer().isSearchingBank()) {
                Bank.addToBankSearch(this.getPlayer(), item, false);
            }
        }
    
        return this;
    }

    public switchItem(to: ItemContainer, item: Item, sort: boolean, refresh: boolean): ItemContainer {
        if (to.getFreeSlots() <= 0 && !(to.contains(item.getId()) && item.getDefinition().isStackable())) {
        to.full();
        return this;
        }
        let proper_amt = this.getAmount(item.getId());
    
        if (item.getAmount() > proper_amt) {
            item.setAmount(proper_amt);
        }
    
        if (item.getAmount() <= 0) {
            return this;
        }
    
        this.delete(item, refresh);
    
        to.add(item, refresh);
    
        if (sort && this.getAmount(item.getId()) <= 0) {
            this.sortItems();
        }
        if (refresh) {
            this.refreshItems();
            to.refreshItems();
        }
        return this;
    }
    
    /*
        * Checks if container is full
        */
    public full(itemId: number): boolean {
        return this.getFreeSlots() <= 0 && !(this.contains(itemId) && ItemDefinition.forId(itemId).isStackable());
    }
    
    public addItems(items: Item[], refresh: boolean): ItemContainer {
        if (items == null) {
            return this;
        }
        for (let item of items) {
            if (item.getId() > 0 && (item.getAmount() > 0
                    || (item.getAmount() == 0 && this instanceof Bank))) {
                this.add(item, refresh);
            }
        }
        return this;
    }

    public sortItems(): ItemContainer {
        for (let k = 0; k < this.capacity(); k++) {
        if (this.getItems()[k] == null) {
        continue;
        }
        for (let i = 0; i < (this.capacity() - 1); i++) {
        if (this.getItems()[i] == null || this.getItems()[i].getId() <= 0
        || (this.getItems()[i].getAmount() <= 0 && !(this instanceof Bank))) {
        this.swap((i + 1), i);
        }
        }
        }
        return this;
    }
        
    /**
     * Adds an item to the item container.
     *
     * @param item The item to add.
     * @return The ItemContainer instance.
     */
    public add(item: Item): ItemContainer {
        return this.add(item, true);
    }
        
    /**
     * Adds an item to the item container.
     *
     * @param id     The id of the item.
     * @param amount The amount of the item.
     * @return The ItemContainer instance.
     */
    public add(id: number, amount: number): ItemContainer {
        return this.add(new Item(id, amount));
    }

    public add(item: Item, refresh: boolean): ItemContainer {
        if (item.getId() <= 0 || (item.getAmount() <= 0 && !(this instanceof Bank))) {
        return this;
        }
        if (ItemDefinition.forId(item.getId()).isStackable() || this.stackType() == StackType.STACKS) {
        let slot = this.getSlotForItemId(item.getId());
        if (slot == -1) {
        slot = this.getEmptySlot();
        }
        if (slot == -1) {
        if (this.getPlayer() != null) {
        this.getPlayer().getPacketSender().sendMessage("You couldn't hold all those items.");
        }
        if (refresh) {
        this.refreshItems();
        }
        return this;
        }
        let totalAmount = (this.items[slot].getAmount() + item.getAmount());
        this.items[slot].setId(item.getId());
        if (totalAmount > Number.MAX_SAFE_INTEGER) {
        this.items[slot].setAmount(Number.MAX_SAFE_INTEGER);
        } else {
        this.items[slot].setAmount(this.items[slot].getAmount() + item.getAmount());
        }
        } else {
        let amount = item.getAmount();
        while (amount > 0) {
        let slot = this.getEmptySlot();
        if (slot == -1) {
        this.getPlayer().getPacketSender().sendMessage("You couldn't hold all those items.");
        if (refresh) {
        this.refreshItems();
        }
        return this;
        } else {
        this.items[slot].setId(item.getId());
        this.items[slot].setAmount(1);
        }
        amount--;
        }
        }
        if (refresh) {
            this.refreshItems();
        }
        return this;
    }

    public delete(item: Item): ItemContainer {
        return this.delete(item.getId(), item.getAmount());
    }
        
    /**
     * Deletes an item from the item container.
     *
     * @param item The item to delete.
     * @param slot The slot of the item (used to delete the item from said slot, not
     *             the first one found).
     * @return The ItemContainer instance.
     */
    public delete(item: Item, slot: number): ItemContainer {
        return this.delete(item, slot, true);
    }
    
    /**
     * Deletes an item from the item container.
     *
     * @param id     The id of the item to delete.
     * @param amount The amount of the item to delete.
     * @return The ItemContainer instance.
     */
    public delete(id: number, amount: number): ItemContainer {
        return this.delete(id, amount, true);
    }
    
    public delete(item: Item, refresh: boolean): ItemContainer {
        return this.delete(item.getId(), item.getAmount(), refresh);
    }
    
    /**
     * Deletes an item from the item container.
     *
     * @param id      The id of the item to delete.
     * @param amount  The amount of the item to delete.
     * @param refresh If <code>true</code> the item container interface will refresh.
     * @return The ItemContainer instance.
     */
    public delete(id: number, amount: number, refresh: boolean): ItemContainer {
        return this.delete(new Item(id, amount), this.getSlotForItemId(id), refresh);
    }

    public delete(item: Item, slot: number, refresh: boolean, toContainer: ItemContainer): ItemContainer {
        if (item.getId() <= 0 || (item.getAmount() <= 0 && !(this instanceof Bank)) || slot < 0) {
        return this;
        }
        let leavePlaceHolder = (toContainer instanceof Inventory && this instanceof Bank
        && this.getPlayer().isPlaceholders());
        if (item.getAmount() > this.getAmount(item.getId())) {
        item.setAmount(this.getAmount(item.getId()));
        }
        if (item.getDefinition().isStackable() || this.stackType() == StackType.STACKS) {
        this.items[slot].setAmount(this.items[slot].getAmount() - item.getAmount());
        if (this.items[slot].getAmount() < 1) {
        this.items[slot].setAmount(0);
        if (!leavePlaceHolder) {
        this.items[slot].setId(-1);
        }
        }
        } else {
        let amount = item.getAmount();
        while (amount > 0) {
        if (slot == -1 || (toContainer != null && toContainer.isFull())) {
        break;
        }
        if (!leavePlaceHolder) {
        this.items[slot].setId(-1);
        }
        items[slot].setAmount(0);
        slot = this.getSlotForItemId(item.getId());
        amount--;
        }
        }
        if (refresh) {
        this.refreshItems();
        }
        return this;
    }

    deleteItemSet(optional?: Item[]) {
        if (optional) {
            for (let deleteItem of optional) {
                if (!deleteItem) {
                    continue;
                }
                this.delete(deleteItem);
            }
        }
    }
    
    getById(id: number): Item | null {
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i]) {
                continue;
            }
            if (this.items[i].id === id) {
                return this.items[i];
            }
        }
        return null;
    }
    
    containsAll(ids: number[]): boolean {
        return ids.every(id => this.contains(id));
    }
    
    containsAll(items: Item[]): boolean {
        return items.filter(item => item).every(item => this.contains(item.id));
    }
    
    containsAny(ids: number[]): boolean {
        return ids.some(id => this.contains(id));
    }
    
    set(slot: number, item: Item) {
        this.items[slot] = item;
    }
    
    get(slot: number): Item | undefined {
        return this.items[slot];
    }
    
    isSlotFree(slot: number): boolean {
        return !this.items[slot] || this.items[slot].id === -1;
    }
    
    toSafeArray(): Item[] {
        return this.items.filter(item => item) as Item[];
    }

    moveItems(to: ItemContainer, refreshOrig = true, refreshTo = true) {
        for (let it of this.getValidItems()) {
            if (to.getFreeSlots() <= 0 && !(to.contains(it.id) && it.definition.isStackable())) {
                break;
            }
            to.add(it, false);
            this.delete(it.id, it.amount, false);
        }
    
        if (refreshOrig) {
            this.refreshItems();
        }
        if (refreshTo) {
            to.refreshItems();
        }
    }
    
    addItemSet(item: Item[]) {
        for (let addItem of item) {
            if (!addItem) {
                continue;
            }
            this.add(addItem);
        }
    }
    
    deleteItemSet(item: Item[]) {
        for (let deleteItem of item) {
            if (!deleteItem) {
                continue;
            }
            this.delete(deleteItem);
        }
    }

    forceAdd(player: Player, item: Item) {
        if (this.getFreeSlots() <= 0 && !(this.contains(item.id) && item.definition.isStackable())) {
            TaskManager.submit(new Task(1, () => {
                ItemOnGroundManager.register(player, item);
            }));
        } else {
            this.add(item);
        }
    }
    
    getTotalValue(): string {
        let value = 0;
    
        for (let item of this.getValidItems()) {
            value += item.definition.value * item.amount;
        }
    
        if (value >= Number.MAX_SAFE_INTEGER) {
            return "Too High!";
        }
    
        return value.toString();
    }
    
    hasAt(slot: number, item: number): boolean {
        let at = this.items[slot];
        return at != null && at.id === item;
    }
    
    hasAt(slot: number): boolean {
        return slot >= 0 && slot < this.items.length && this.items[slot] != null;
    }
}


