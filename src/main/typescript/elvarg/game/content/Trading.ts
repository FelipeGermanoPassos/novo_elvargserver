class Trading {
    public static readonly CONTAINER_INTERFACE_ID: number = 3415;
    public static readonly CONTAINER_INVENTORY_INTERFACE: number = 3321;
    public static readonly INVENTORY_CONTAINER_INTERFACE: number = 3322;
    // Interface data
    private static readonly INTERFACE: number = 3323;
    private static readonly CONTAINER_INTERFACE_ID_2: number = 3416;
    private static readonly CONFIRM_SCREEN_INTERFACE: number = 3443;
    // Frames data
    private static readonly TRADING_WITH_FRAME: number = 3417;
    private static readonly STATUS_FRAME_1: number = 3431;
    private static readonly STATUS_FRAME_2: number = 3535;
    private static readonly ITEM_LIST_1_FRAME: number = 3557;
    private static readonly ITEM_LIST_2_FRAME: number = 3558;
    private static readonly ITEM_VALUE_1_FRAME: number = 24209;
    private static readonly ITEM_VALUE_2_FRAME: number = 24210;

    // Nonstatic
    private player: Player;
    private container: ItemContainer;
    private interact: Player;
    private state: TradeState = TradeState.NONE;

    // Delays!!
    private button_delay: SecondsTimer = new SecondsTimer();
    private request_delay: SecondsTimer = new SecondsTimer();

    constructor(player: Player) {
        this.player = player;
        this.container = new ItemContainer(player) {
            stackType(): StackType {
                return StackType.DEFAULT;
            }
            refreshItems(): ItemContainer {
                player.getPacketSender().sendInterfaceSet(INTERFACE, CONTAINER_INVENTORY_INTERFACE);
                player.getPacketSender().sendItemContainer(this.container, CONTAINER_INTERFACE_ID);
                player.getPacketSender().sendItemContainer(player.getInventory(), INVENTORY_CONTAINER_INTERFACE);
                player.getPacketSender().sendItemContainer(interact.getTrading().getContainer(), CONTAINER_INTERFACE_ID_2);
                interact.getPacketSender().sendItemContainer(player.getTrading().getContainer(), CONTAINER_INTERFACE_ID_2);
                return this;
            }
            full(): ItemContainer {
                player.getPacketSender().sendMessage("You cannot trade more items.");
                return this;
            }
            capacity(): number {
                return 28;
            }
        };
    }

    static listItems(items: ItemContainer): string {
        let string = "";
        let item_counter = 0;
        let list: Item[] = [];
        for (let item of items.getValidItems()) {
            for (let item_ of list) {
                if (item_.getId() == item.getId()) {
                    continue;
                }
            }
            list.push(new Item(item.getId(), items.getAmount(item.getId())));
        }
        for (let item of list) {
            if (item_counter > 0) {
                string += "\n";
            }
            string += item.getDefinition().getName().replace(/_/g, " ");
            let amt = "" + Misc.format(item.getAmount());
            if (item.getAmount() >= 1000000000) {
                amt = "@gre@" + Math.floor(item.getAmount() / 1000000000) + " billion @whi@(" + Misc.format(item.getAmount())
                    + ")";
            } else if (item.getAmount() >= 1000000) {
                amt = "@gre@" + Math.floor(item.getAmount() / 1000000) + " million @whi@(" + Misc.format(item.getAmount()) + ")";
            } else if (item.getAmount() >= 1000) {
                amt = "@cya@" + Math.floor(item.getAmount() / 1000) + "K @whi@(" + Misc.format(item.getAmount()) + ")";
            }
            string += " x @red@" + amt;
            item_counter++;
        }
        if (item_counter == 0) {
            string = "Absolutely nothing!";
        }
        return string;
    }

    private static validate(player: Player, interact: Player, playerStatus: PlayerStatus, ...tradeState: TradeState[]): boolean {
        if (player == null || interact == null) {
            return false;
        }
        if (player.getStatus() != playerStatus) {
            return false;
        }
        if (interact.getStatus() != playerStatus) {
            return false;
        }
        if (player.getTrading().getInteract() == null || player.getTrading().getInteract() != interact) {
            return false;
        }
        if (interact.getTrading().getInteract() == null || interact.getTrading().getInteract() != player) {
            return false;
        }
        let found = false;
        for (let duelState of tradeState) {
            if (player.getTrading().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        found = false;
        for (let duelState of tradeState) {
            if (interact.getTrading().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        return true;
    }

    public requestTrade(t_: Player) {
        if (this.state == TradeState.NONE || this.state == TradeState.REQUESTED_TRADE) {
            if (!this.request_delay.finished()) {
                let seconds = this.request_delay.secondsRemaining();
                player.getPacketSender()
                    .sendMessage("You must wait another " + (seconds == 1 ? "second" : "" + seconds + " seconds")
                        + " before sending more trade requests.");
                return;
            }
            let t_state = t_.getTrading().getState();
            let initiateTrade = false;
            this.setInteract(t_);
            this.setState(TradeState.REQUESTED_TRADE);
            if (t_state == TradeState.REQUESTED_TRADE) {
                if (t_.getTrading().getInteract() != null && t_.getTrading().getInteract() == player) {
                    initiateTrade = true;
                }
            }
            if (initiateTrade) {
                player.getTrading().initiateTrade();
                t_.getTrading().initiateTrade();
            } else {
                player.getPacketSender().sendMessage("You've sent a trade request to " + t_.getUsername() + ".");
                t_.getPacketSender().sendMessage(player.getUsername() + ":tradereq:");
                if (t_ instanceof PlayerBot) {
                    // Player Bots: Automatically accept any trade request
                    ((t_ as PlayerBot).getTradingInteraction().acceptTradeRequest(player));
                }
            }
            this.request_delay.start(2);
        } else {
            player.getPacketSender().sendMessage("You cannot do that right now.");
        }
    }

    public initiateTrade() {
        player.setStatus(PlayerStatus.TRADING);
        this.setState(TradeState.TRADE_SCREEN);
        player.getPacketSender().sendString(TRADING_WITH_FRAME, "Trading with: @whi@" + this.interact.getUsername());
        player.getPacketSender().sendString(STATUS_FRAME_1, "")
            .sendString(STATUS_FRAME_2, "Are you sure you want to make this trade?")
            .sendString(ITEM_VALUE_1_FRAME, "0 bm").sendString(ITEM_VALUE_2_FRAME, "0 bm");
        this.container.resetItems();
        this.container.refreshItems();
        if (player instanceof PlayerBot) {
            ((player as PlayerBot).getTradingInteraction().addItemsToTrade(this.container, this.interact));
        }
    }

    public closeTrade() {
        if (this.state != TradeState.NONE) {
            let interact_ = this.interact;
            for (let t of this.container.getValidItems()) {
                this.container.switchItem(player.getInventory(), t.clone(), false, false);
            }
            player.getInventory().refreshItems();
            this.resetAttributes();
            player.getPacketSender().sendMessage("Trade declined.");
            player.getPacketSender().sendInterfaceRemoval();
            if (interact_ != null) {
                if (interact_.getStatus() == PlayerStatus.TRADING) {
                    if (interact_.getTrading().getInteract() != null && interact_.getTrading().getInteract() == player) {
                        interact_.getPacketSender().sendInterfaceRemoval();
                    }
                }
            }
        }
    }

    public acceptTrade() {
        if (!validate(player, this.interact, PlayerStatus.TRADING, [TradeState.TRADE_SCREEN,
        TradeState.ACCEPTED_TRADE_SCREEN, TradeState.CONFIRM_SCREEN, TradeState.ACCEPTED_CONFIRM_SCREEN])) {
            return;
        }
        if (!this.button_delay.finished()) {
            return;
        }
        let interact_ = this.interact;
        let t_state = interact_.getTrading().getState();
        if (this.state == TradeState.TRADE_SCREEN) {
            let slotsNeeded = 0;
            for (let t of this.container.getValidItems()) {
                slotsNeeded += t.getDefinition().isStackable() && this.interact.getInventory().contains(t.getId()) ? 0 : 1;
            }
            let freeSlots = this.interact.getInventory().getFreeSlots();
            if (slotsNeeded > freeSlots) {
                player.getPacketSender().sendMessage("")
                    .sendMessage("@or3@" + this.interact.getUsername() + " will not be able to hold that item.")
                    .sendMessage(
                        "@or3@They have " + freeSlots + " free inventory slot" + (freeSlots == 1 ? "." : "s."));

                this.interact.getPacketSender()
                    .sendMessage("Trade cannot be accepted, you don't have enough free inventory space.");
                return;
            }
            this.setState(TradeState.ACCEPTED_TRADE_SCREEN);
            player.getPacketSender().sendString(STATUS_FRAME_1, "Waiting for other player..");
            this.interact.getPacketSender().sendString(STATUS_FRAME_1, "" + player.getUsername() + " has accepted.");
            if (this.state == TradeState.ACCEPTED_TRADE_SCREEN && t_state == TradeState.ACCEPTED_TRADE_SCREEN) {
                this.player.getTrading().confirmScreen();
                interact_.getTrading().confirmScreen();
            } else {
                if (interact_ instanceof PlayerBot) {
                    ((PlayerBot) interact_).getTradingInteraction().acceptTrade();
                }
            } else if (this.state === TradeState.CONFIRM_SCREEN) {
                // Both are in the same state. Do the second-stage accept.
                this.setState(TradeState.ACCEPTED_CONFIRM_SCREEN);
                // Update status...
                this.player.getPacketSender().sendString(STATUS_FRAME_2,
                    Waiting for ${ interact_.getUsername() }'s confirmation..);
                interact_.getPacketSender().sendString(STATUS_FRAME_2,
                        ${ this.player.getUsername() } has accepted.Do you wish to do the same ?);
                if (this.state === TradeState.ACCEPTED_CONFIRM_SCREEN && t_state === TradeState.ACCEPTED_CONFIRM_SCREEN) {
                    // Give items to both players...
                    const receivingItems = interact_.getTrading().getContainer().getValidItems();
                    for (const item of receivingItems) {
                        this.player.getInventory().add(item);
                    }
                    const givingItems = this.player.getTrading().getContainer().getValidItems();
                    for (const item of givingItems) {
                        interact_.getInventory().add(item);
                    }
                    if (this.player instanceof PlayerBot && receivingItems.length > 0) {
                        ((this.player as PlayerBot).getTradingInteraction().receivedItems(receivingItems, interact_);
                    }
                    // Reset attributes for both players...
                    this.resetAttributes();
                    interact_.getTrading().resetAttributes();
                    // Send interface removal for both players...
                    this.player.getPacketSender().sendInterfaceRemoval();
                    interact_.getPacketSender().sendInterfaceRemoval();
                    // Send successful trade message!
                    this.player.getPacketSender().sendMessage("Trade accepted!");
                    interact_.getPacketSender().sendMessage("Trade accepted!");
                }
            } else {
                if (interact_ instanceof PlayerBot) {
                    (interact_ as PlayerBot).getTradingInteraction().acceptTrade();
                }
            }
            button_delay.start(1);
        }
    }

    private confirmScreen() {
        // Update state
        this.state = TradeState.CONFIRM_SCREEN;

        // Send new interface
        player.getPacketSender().sendInterfaceSet(CONFIRM_SCREEN_INTERFACE, CONTAINER_INVENTORY_INTERFACE);
        player.getPacketSender().sendItemContainer(player.getInventory(), INVENTORY_CONTAINER_INTERFACE);

        // Send new interface frames
        let thisItems = this.listItems(this.container);
        let interactItems = this.listItems(interact.getTrading().getContainer());
        player.getPacketSender().sendString(ITEM_LIST_1_FRAME, thisItems);
        player.getPacketSender().sendString(ITEM_LIST_2_FRAME, interactItems);
    }

    handleItem(id: number, amount: number, slot: number, from: ItemContainer, to: ItemContainer) {
        if (player.getInterfaceId() === INTERFACE) {

            // Validate this trade action..
            if (!validate(player, interact, PlayerStatus.TRADING,
                [TradeState.TRADE_SCREEN, TradeState.ACCEPTED_TRADE_SCREEN])) {
                return;
            }

            // Check if the trade was previously accepted (and now modified)...
            let modified = false;
            if (state === TradeState.ACCEPTED_TRADE_SCREEN) {
                state = TradeState.TRADE_SCREEN;
                modified = true;
            }
            if (interact.getTrading().getState() === TradeState.ACCEPTED_TRADE_SCREEN) {
                interact.getTrading().setState(TradeState.TRADE_SCREEN);
                modified = true;
            }
            if (modified) {
                player.getPacketSender().sendString(STATUS_FRAME_1, "@red@TRADE MODIFIED!");
                interact.getPacketSender().sendString(STATUS_FRAME_1, "@red@TRADE MODIFIED!");
            }
            if (state === TradeState.TRADE_SCREEN && interact.getTrading().getState() === TradeState.TRADE_SCREEN) {

                // Check if the item is in the right place
                if (from.getItems()[slot].getId() === id) {

                    // Make sure we can fit that amount in the trade
                    if (from instanceof Inventory) {
                        if (!ItemDefinition.forId(id).isStackable()) {
                            if (amount > container.getFreeSlots()) {
                                amount = container.getFreeSlots();
                            }
                        }
                    }

                    if (amount <= 0) {
                        return;
                    }

                    const item = new Item(id, amount);

                    // Do the switch!
                    if (item.getAmount() === 1) {
                        from.switchItem(to, item, slot, false, true);
                    } else {
                        from.switchItem(to, item, false, true);
                    }

                    // Update value frames for both players
                    const plr_value = container.getTotalValue();
                    const other_plr_value = interact.getTrading().getContainer().getTotalValue();
                    player.getPacketSender().sendString(ITEM_VALUE_1_FRAME,
                        Misc.insertCommasToNumber(plr_value) + " bm");
                    player.getPacketSender().sendString(ITEM_VALUE_2_FRAME,
                        Misc.insertCommasToNumber(other_plr_value) + " bm");
                    interact.getPacketSender().sendString(ITEM_VALUE_1_FRAME,
                        Misc.insertCommasToNumber(other_plr_value) + " bm");
                    interact.getPacketSender().sendString(ITEM_VALUE_2_FRAME,
                        Misc.insertCommasToNumber(plr_value) + " bm");

                    if (interact instanceof PlayerBot) {
                        // Automatically accept the trade whenever an item is added by the player
                        interact.getTrading().acceptTrade();
                    }
                }
            } else {
                player.getPacketSender().sendInterfaceRemoval();
            }
        }
    }

    resetAttributes() {
        // Reset trade attributes
        this.setInteract(null);
        this.setState(TradeState.NONE);

        // Reset player status if it's trading.
        if (player.getStatus() === PlayerStatus.TRADING) {
            player.setStatus(PlayerStatus.NONE);
        }

        // Reset container..
        container.resetItems();

        // Send the new empty container to the interface
        // Just to clear the items there.
        player.getPacketSender().sendItemContainer(container, CONTAINER_INTERFACE_ID);
    }

    getState(): TradeState {
        return this.state;
    }

    setState(state: TradeState) {
        this.state = state;
    }

    getButtonDelay(): SecondsTimer {
        return this.button_delay;
    }

    getInteract(): Player {
        return this.interact;
    }

    setInteract(interact: Player) {
        this.interact = interact;
    }

    getContainer(): ItemContainer {
        return this.container;
    }

    // The possible states during a trade
    private state: TradeState = TradeState.NONE;

}

enum TradeState {
    NONE,
    REQUESTED,
    TRADING,
    CONFIRM
}

private enum TradeState {
    NONE, REQUESTED_TRADE, TRADE_SCREEN, ACCEPTED_TRADE_SCREEN, CONFIRM_SCREEN, ACCEPTED_CONFIRM_SCREEN;
}
