export class Bank extends ItemContainer {
    public static readonly TOTAL_BANK_TABS = 11;
    public static readonly CONTAINER_START = 50300;
    public static readonly BANK_SEARCH_TAB_INDEX = TOTAL_BANK_TABS - 1;
    public static readonly BANK_SCROLL_BAR_INTERFACE_ID = 5385;
    public static readonly BANK_TAB_INTERFACE_ID = 5383;
    public static readonly INVENTORY_INTERFACE_ID = 5064;
    
    constructor(public player: Player) {
        super(player);
    }
    
    public static withdraw(player: Player, item: number, slot: number, amount: number, fromBankTab: number) {
        if (player.status !== PlayerStatus.BANKING && player.interfaceId !== 5292) {
            
        let itemTab = Bank.getTabForItem(player, item);
        if (itemTab !== fromBankTab) {
            if (!player.isSearchingBank) {
                return;
            }
        }
        let maxAmount = player.getBank(itemTab).getAmount(item);
        if (amount === -1 || amount > maxAmount) {
            amount = maxAmount;
        }
        if (player.isSearchingBank) {
            if (!player.getBank(itemTab).contains(item) || !player.getBank(BANK_SEARCH_TAB_INDEX).contains(item)
                    || amount <= 0) {
                return;
            }
            if (fromBankTab !== BANK_SEARCH_TAB_INDEX) {
                return;
            }
            slot = player.getBank(itemTab).getSlotForItemId(item);
            player.getBank(itemTab).switchItem(player.inventory, new Item(item, amount),
            player.getBank(itemTab).getSlotForItemId(item), false, false);
            if (slot === 0) {
                Bank.reconfigureTabs(player);
            }
            
            player.getBank(BANK_SEARCH_TAB_INDEX).refreshItems();
            
            } else {
            
            // Withdrawing an item which belongs in another tab from the main tab
            if (player.getCurrentBankTab() === 0 && fromBankTab !== 0) {
                slot = player.getBank(itemTab).getSlotForItemId(item);
            }
            
            // Make sure the item is in the slot we've found
            if (player.getBank(itemTab).getItems()[slot].getId() !== item) {
                return;
            }
            
            // Delete placeholder
            if (amount <= 0) {
                player.getBank(itemTab).getItems()[slot].setId(-1);
                player.getBank(player.getCurrentBankTab()).sortItems().refreshItems();
                return;
            }
            
            // Perform the switch
            player.getBank(itemTab).switchItem(player.getInventory(), new Item(item, amount), slot, false, false);
            
            // Update all tabs if we removed an item from the first item slot
            if (slot === 0) {
                Bank.reconfigureTabs(player);
            }
            
            // Refresh items in our current tab
            player.getBank(player.getCurrentBankTab()).refreshItems();
            
            }
            
            // Refresh inventory
            player.getInventory().refreshItems();
        }
    }

    private static DEPOSIT_BOX_OBJECT_IDS = [9398, 6948];

    public static useItemOnDepositBox(player: Player, item: Item, slot: number, object: GameObject): boolean {
        if (!DEPOSIT_BOX_OBJECT_IDS.includes(object.getId())) {
            return false;
        }

        if (player.getInventory().getAmount(item.getId()) === 1) {
            Bank.deposit(player, item.getId(), slot, 1, true);
            return true;
        }

        const builder = new DialogueChainBuilder();

        if (player.getInventory().getAmount(item.getId()) <= 5) {
            builder.add(new OptionDialogue(0, (option) => {
                if (option === DialogueOption.FIRST_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 1, true);
                } else {
                    Bank.deposit(player, item.getId(), slot, 5, true);
                }
                player.getPacketSender().sendInterfaceRemoval();
            }, "One", "Five"));
        } else if (player.getInventory().getAmount(item.getId()) <= 10) {
            builder.add(new OptionDialogue(0, (option) => {
                if (option === DialogueOption.FIRST_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 1, true);
                } else if (option === DialogueOption.SECOND_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 5, true);
                } else {
                    Bank.deposit(player, item.getId(), slot, 10, true);
                }
                player.getPacketSender().sendInterfaceRemoval();
            }, "One", "Five", "Ten"));
        } else {
            builder.add(new OptionDialogue(0, (option) => {
                if (option === DialogueOption.FIRST_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 1, true);
                } else if (option === DialogueOption.SECOND_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 5, true);
                } else if (option === DialogueOption.THIRD_OPTION) {
                    Bank.deposit(player, item.getId(), slot, 10, true);
                } else {
                    Bank.deposit(player, item.getId(), slot, player.getInventory().getAmount(item.getId()), true);
                }
                player.getPacketSender().sendInterfaceRemoval();
            }, "One", "Five", "Ten", "All"));
        }

        player.getDialogueManager().start(builder);
        return true;
    }

    public static deposit(player: Player, item: number, slot: number, amount: number) {
        deposit(player, item, slot, amount, false);
    }
    
    /**
     * Deposits an item to the bank.
     *
     * @param player
     * @param item
     * @param slot
     * @param amount
     */
    
    public static deposit(player: Player, item: number, slot: number, amount: number, ignore: boolean) {
        if (ignore || player.getStatus() === PlayerStatus.BANKING
            && player.getInterfaceId() === 5292 /* Regular bank */
            || player.getInterfaceId() === 4465 /* Bank deposit booth */) {
            if (player.getInventory().getItems()[slot].getId() !== item) {
                return;
            }
    
            if (amount === -1 || amount > player.getInventory().getAmount(item)) {
                amount = player.getInventory().getAmount(item);
            }
    
            if (amount <= 0) {
                return;
            }
    
            const tab = Bank.getTabForItem(player, item);
            if (!player.isSearchingBank()) {
                player.setCurrentBankTab(tab);
            }
    
            player.getInventory().switchItem(player.getBank(tab), new Item(item, amount), slot, false,
                !player.isSearchingBank());
            if (player.isSearchingBank()) {
                player.getBank(BANK_SEARCH_TAB_INDEX).refreshItems();
            }
    
            // Refresh inventory
            player.getInventory().refreshItems();
        }
    }

    public static search(player: Player, syntax: string) {
        if (player.getStatus() === PlayerStatus.BANKING && player.getInterfaceId() === 5292) {
    
            // Set search fields
            player.setSearchSyntax(syntax);
            player.setSearchingBank(true);
    
            // Clear search bank tab
            player.getBank(BANK_SEARCH_TAB_INDEX).resetItems();
    
            // Refill search bank tab
            for (let i = 0; i < TOTAL_BANK_TABS; i++) {
                if (i === BANK_SEARCH_TAB_INDEX) {
                    continue;
                }
                const b = player.getBank(i);
                if (b !== null) {
                    b.sortItems();
                    for (let item of b.getValidItems()) {
                        if (item.getAmount() > 0) {
                            addToBankSearch(player, item.clone(), false);
                        }
                    }
                }
            }
    
            player.setCurrentBankTab(0);
    
            // Open the search bank tab
            player.getBank(BANK_SEARCH_TAB_INDEX).open();
        }
    }
    
    public static exitSearch(player: Player, openBank: boolean) {
        if (player.getStatus() === PlayerStatus.BANKING && player.getInterfaceId() === 5292) {
    
            // Set search fields
            player.setSearchSyntax("");
            player.setSearchingBank(false);
    
            // Clear search bank tab
            player.getBank(BANK_SEARCH_TAB_INDEX).resetItems();
    
            // Open last tab we had
            if (player.getCurrentBankTab() === BANK_SEARCH_TAB_INDEX) {
                player.setCurrentBankTab(0);
            }
    
            if (openBank) {
                player.getBank(player.getCurrentBankTab()).open();
            }
        }
    }

    public static addToBankSearch(player: Player, item: Item, refresh: boolean) {

        if (player.getBank(BANK_SEARCH_TAB_INDEX).getFreeSlots() === 0) {
            return;
        }
    
        if (item.getDefinition().getName().toLowerCase().includes(player.getSearchSyntax())) {
            player.getBank(BANK_SEARCH_TAB_INDEX).add(item, refresh);
        }
    }
    
    /**
     * Removes an item from the bank search tab
     *
     * @param player
     * @param item
     */
    public static removeFromBankSearch(player: Player, item: Item, refresh: boolean) {
    
        if (item.getDefinition().isNoted()) {
            item.setId(item.getDefinition().unNote());
        }
    
        player.getBank(BANK_SEARCH_TAB_INDEX).delete(item, refresh);
    }
    
    /**
     * Moves an item from one slot to another using the insert method. It will shift
     * all other items to the right.
     *
     * @param player
     * @param fromSlot
     * @param toSlot
     */
    public static rearrange(player: Player, bank: Bank, fromSlot: number, toSlot: number) {
        if (player.insertMode()) {
    
            let tempFrom = fromSlot;
    
            for (let tempTo = toSlot; tempFrom !== tempTo; ) {
                if (tempFrom > tempTo) {
                    bank.swap(tempFrom, tempFrom - 1);
                    tempFrom--;
                } else if (tempFrom < tempTo) {
                    bank.swap(tempFrom, tempFrom + 1);
                    tempFrom++;
                }
            }
    
        } else {
            bank.swap(fromSlot, toSlot);
        }
    
        if (player.getCurrentBankTab() === 0 && !player.isSearchingBank()) {
            player.getBank(0).refreshItems();
        } else {
            bank.refreshItems();
        }
    
        // Update all tabs if we moved an item from/to the first item slot
        if (fromSlot === 0 || toSlot === 0) {
            Bank.reconfigureTabs(player);
        }
    }

    public static handleButton(player: Player, button: number, action: number): boolean {
        if (player.getInterfaceId() == 32500) {
            // Handle bank settings
            switch (button) {
            case 32503:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            case 32512:
                player.getBank(player.getCurrentBankTab()).open();
                break;
            case 32513:
                player.setPlaceholders(!player.isPlaceholders());
                player.getPacketSender().sendConfig(118, player.isPlaceholders() ? 1 : 0);
                player.getPacketSender().sendMessage(
                        "Placeholders are now " + (player.isPlaceholders() ? "enabled" : "disabled") + ".");
                break;
            }
            return true;
        } else if (player.getInterfaceId() == 5292) {
            if (player.getStatus() == PlayerStatus.BANKING) {
                let tab_select_start = 50070;
                for (let bankId = 0; bankId < TOTAL_BANK_TABS; bankId++) {
                    if (button == tab_select_start + (bankId * 4)) {
    
                        const searching = player.isSearchingBank();
                        if (searching) {
                            exitSearch(player, false);
                        }
    
                        // First, check if empty
                        let empty = bankId > 0 ? Bank.isEmpty(player.getBank(bankId)) : false;

                        if (action === 1) {
                            // Collapse tab!!!
                            if (bankId === 0) {
                                return true;
                            }
                            if (empty) {
                                return true;
                            }
                            let items: Item[] = player.getBank(bankId).getValidItems();
                            if (player.getBank(0).getFreeSlots() < items.length) {
                                player.getPacketSender().sendMessage("You don't have enough free slots in your Main tab to do that.");
                                return true;
                            }
                            let noteWithdrawal: boolean = player.withdrawAsNote();
                            player.setNoteWithdrawal(false);
                            for (let item of items) {
                                player.getBank(bankId).switchItem(player.getBank(0), item.clone(), player.getBank(bankId).getSlotForItemId(item.getId()), false, false);
                            }
                            player.setNoteWithdrawal(noteWithdrawal);
                            reconfigureTabs(player);
                            player.getBank(player.getCurrentBankTab()).refreshItems();
                        } else {
                            if (!empty || bankId === 0) {
                                player.setCurrentBankTab(bankId);
                                player.getBank(bankId).open();
                            } else {
                                player.getPacketSender().sendMessage("To create a new tab, simply drag an item here.");
                                if (searching) {
                                    player.getBank(player.getCurrentBankTab()).open();
                                }
                            }
                        }
                        return true;
                    }
                }
                
                switch (button) {
                    case 50013:
                        // Show menu
                        player.getPacketSender().sendInterfaceRemoval();
                        player.getPacketSender().sendInterface(32500);
                        break;
                    case 5386:
                        player.setNoteWithdrawal(true);
                        break;
                    case 5387:
                        player.setNoteWithdrawal(false);
                        break;
                    case 8130:
                        player.setInsertMode(false);
                        break;
                    case 8131:
                        player.setInsertMode(true);
                        break;
                    case 50004:
                        depositItems(player, player.getInventory(), false);
                        break;
                    case 50007:
                        depositItems(player, player.getEquipment(), false);
                        break;
                    case 5384:
                    case 50001:
                        player.getPacketSender().sendInterfaceRemoval();
                        break;
                    case 50010:
                        if (player.isSearchingBank()) {
                            exitSearch(player, true);
                            return true;
                        }
                        player.setEnteredSyntaxAction((input: string) => {
                            Bank.search(player, input);
                        });
                        player.getPacketSender().sendEnterInputPrompt("What do you wish to search for?");
                        break;
                }
            }
            return true;
        }
        return false;
    }
    public static depositItems(player: Player, from: ItemContainer, ignoreReqs: boolean) {
        if (!ignoreReqs) {
            if (player.getStatus() !== PlayerStatus.BANKING || player.getInterfaceId() !== 5292) {
                return;
            }
        }
        for (let item of from.getValidItems()) {
            from.switchItem(player.getBank(Bank.getTabForItem(player, item.getId())), item.clone(),
                from.getSlotForItemId(item.getId()), false, false);
        }
        from.refreshItems();
        if (player.isSearchingBank()) {
            player.getBank(BANK_SEARCH_TAB_INDEX).refreshItems();
        } else {
            player.getBank(player.getCurrentBankTab()).refreshItems();
        }
        if (from instanceof Equipment) {
            WeaponInterfaces.assign(player);
            BonusManager.update(player);
            player.getUpdateFlag().flag(Flag.APPEARANCE);
        }
    }
    
    /**
     * Is a bank empty?
     *
     * @param bank
     * @return
     */
    public static isEmpty(bank: Bank): boolean {
        return bank.sortItems().getValidItems().length <= 0;
    }
    
    /**
     * Reconfigures our bank tabs
     *
     * @param player
     */
    public static reconfigureTabs(player: Player): boolean {
        let updateRequired = false;
        for (let k = 1; k < BANK_SEARCH_TAB_INDEX - 1; k++) {
            if (isEmpty(player.getBank(k)) || updateRequired) {
                player.setBank(k, player.getBank(k + 1));
                player.setBank(k + 1, new Bank(player));
                updateRequired = true;
            }
        }
    
        // Check if we're in a tab that's empty
        // If so, open the next non-empty tab
        let total_tabs = getTabCount(player);
        if (!player.isSearchingBank()) {
            if (player.getCurrentBankTab() > total_tabs) {
                player.setCurrentBankTab(total_tabs);
                player.getBank(total_tabs).open();
                return true;
            }
        }
        return false;
    }

    public static getTabCount(player: Player): number {
        let tabs = 0;
        for (let i = 1; i < TOTAL_BANK_TABS; i++) {
            if (i === BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (!isEmpty(player.getBank(i))) {
                tabs++;
            } else
                break;
        }
        return tabs;
    }
    
    /**
     * Gets the specific tab in which an item is.
     *
     * @param player
     * @param itemID
     * @return
     */
    public static getTabForItem(player: Player, itemID: number): number {
        if (ItemDefinition.forId(itemID).isNoted()) {
            itemID = ItemDefinition.forId(itemID).unNote();
        }
        for (let k = 0; k < TOTAL_BANK_TABS; k++) {
            if (k === BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (player.getBank(k).contains(itemID)) {
                return k;
            }
        }
    
        // Find empty bank slot
        if (player.getBank(player.getCurrentBankTab()).getFreeSlots() > 0) {
            return player.getCurrentBankTab();
        }
        for (let k = 0; k < TOTAL_BANK_TABS; k++) {
            if (k === BANK_SEARCH_TAB_INDEX) {
                continue;
            }
            if (player.getBank(k).getFreeSlots() > 0) {
                return k;
            }
        }
        return 0;
    }
    
    public static contains(player: Player, item: Item): boolean {
        let tab = getTabForItem(player, item.getId());
        return player.getBank(tab).getAmount(item.getId()) >= item.getAmount();
    }
    
    public capacity(): number {
        return 352;
    }
    
    public stackType(): StackType {
        return StackType.STACKS;
    }
    
    public open(): Bank {
    
        // Update player status
        this.getPlayer().setStatus(PlayerStatus.BANKING);
        this.getPlayer().setEnteredSyntaxAction(null);
    
        // Sort and refresh items in the container
        this.sortItems().refreshItems();
    
        // Send configs
        this.getPlayer().getPacketSender().sendConfig(115, this.getPlayer().withdrawAsNote() ? 1 : 0)
                .sendConfig(304, this.getPlayer().insertMode() ? 1 : 0)
                .sendConfig(117, this.getPlayer().isSearchingBank() ? 1 : 0)
                .sendConfig(118, this.getPlayer().isPlaceholders() ? 1 : 0).sendInterfaceSet(5292, 5063);
    
        // Resets the scroll bar in the interface
        this.getPlayer().getPacketSender().sendInterfaceScrollReset(BANK_SCROLL_BAR_INTERFACE_ID);
    
        return this;
    }

    override public Bank refreshItems(): Bank {
        // Reconfigure bank tabs.
        if (reconfigureTabs(getPlayer())) {
            return this;
        }

        // Send capacity information about the current bank we're in
        getPlayer().getPacketSender().sendString(50053, "" + this.getValidItems().size());
        getPlayer().getPacketSender().sendString(50054, "" + this.capacity());

        // Send all bank tabs and their contents
        for (let i = 0; i < TOTAL_BANK_TABS; i++) {
            getPlayer().getPacketSender().sendItemContainer(getPlayer().getBank(i), CONTAINER_START + i);
        }

        // Send inventory
        getPlayer().getPacketSender().sendItemContainer(getPlayer().getInventory(), INVENTORY_INTERFACE_ID);

        // Update bank title
        if (getPlayer().isSearchingBank()) {
            getPlayer().getPacketSender().sendString(5383, "Results for " + getPlayer().getSearchSyntax() + "..")
                    .sendConfig(117, 1);
        } else {
            getPlayer().getPacketSender().sendString(5383, "Bank of " + GameConstants.NAME).sendConfig(117, 0);
        }

        // Send current bank tab being viewed and total tabs!
        let current_tab = getPlayer().isSearchingBank() ? BANK_SEARCH_TAB_INDEX : getPlayer().getCurrentBankTab();
        getPlayer().getPacketSender().sendCurrentBankTab(current_tab);

        return this;
    }

    override public Bank full(): Bank {
        getPlayer().getPacketSender().sendMessage("Not enough space in bank.");
        return this;
    }

    class Bank {
        switchItem(to: ItemContainer, item: Item, slot: number, sort: boolean, refresh: boolean): Bank {
        // Make sure we're actually banking!
        if (this.getPlayer().getStatus() != PlayerStatus.BANKING || this.getPlayer().getInterfaceId() != 5292) {
        return this;
        }
            // Make sure we have the item!
            if (this.getItems()[slot].getId() != item.getId() || !this.contains(item.getId())) {
                return this;
            }
        
            // Get the item definition for the item which is being withdrawn
            let def = ItemDefinition.forId(item.getId() + 1);
            if (def == null) {
                return this;
            }
        
            // Make sure we have enough space in the other container
            if (to.getFreeSlots() <= 0 && (!(to.contains(item.getId()) && item.getDefinition().isStackable()))
                    && !(this.getPlayer().withdrawAsNote() && def != null && def.isNoted() && to.contains(def.getId()))) {
                to.full();
                return this;
            }
        
            // If bank > inventory and item.amount > inventory.freeslots,
            // change the item amount to the free slots we have in inventory.
            if (item.getAmount() > to.getFreeSlots() && !item.getDefinition().isStackable()) {
                if (to instanceof Inventory) {
                    if (this.getPlayer().withdrawAsNote()) {
                        if (def == null || !def.isNoted())
                            item.setAmount(to.getFreeSlots());
                    } else
                        item.setAmount(to.getFreeSlots());
                }
            }
        
            // Make sure we aren't taking more than we have.
            if (item.getAmount() > this.getAmount(item.getId())) {
                item.setAmount(this.getAmount(item.getId()));
            }
        
            if (to instanceof Inventory) {
                let withdrawAsNote = this.getPlayer().withdrawAsNote() && def != null && def.isNoted()
                        && item.getDefinition() != null && def.getName().toLowerCase() == item.getDefinition().getName().toLowerCase();
                let checkId = withdrawAsNote ? item.getId() + 1 : item.getId();
                if (to.getAmount(checkId) + item.getAmount() > Number.MAX_SAFE_INTEGER
                        || to.getAmount(checkId) + item.getAmount() <= 0) {
                    item.setAmount(Number.MAX_SAFE_INTEGER - (to.getAmount(item.getId())));
                    if (item.getAmount() <= 0) {
                        this.getPlayer().getPacketSender()
                        .sendMessage("You cannot withdraw that entire amount into your inventory.");
                         return this;
                    }
                }
            }
        
            // Make sure the item is still valid
            if (item.getAmount() <= 0) {
                return this;
            }

            delete(item: Item, slot: number, refresh: boolean, to: ItemContainer):
            // Check if we can actually withdraw the item as a note.
            if (this.getPlayer().withdrawAsNote()) {
                let def = ItemDefinition.forId(item.getId() + 1);
                if (def != null && def.isNoted() && item.getDefinition() != null
                        && def.getName().toLowerCase() == item.getDefinition().getName().toLowerCase()
                        && !def.getName().includes("Torva") && !def.getName().includes("Virtus")
                        && !def.getName().includes("Pernix") && !def.getName().includes("Torva"))
                    item.setId(item.getId() + 1);
                else
                    this.getPlayer().getPacketSender().sendMessage("This item cannot be withdrawn as a note.");
            }
        
            // Add the item to the other container
            to.add(item, refresh);
        
            // Sort this container
            if (sort && this.getAmount(item.getId()) <= 0)
                this.sortItems();
        
            // Refresh containers
            if (refresh) {
                this.refreshItems();
                to.refreshItems();
            }
        
            if (this.getPlayer().isSearchingBank()) {
                this.removeFromBankSearch(this.getPlayer(), item.clone(), true);
            }
        
            return this;
        }
    }
}
        



        