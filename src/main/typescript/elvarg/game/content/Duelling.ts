import { Player } from "../entity/impl/player/Player";

export class Dueling {
    public static readonly MAIN_INTERFACE_CONTAINER = 6669;
    private static readonly DUELING_WITH_FRAME = 6671;
    private static readonly INTERFACE_ID = 6575;
    private static readonly CONFIRM_INTERFACE_ID = 6412;
    private static readonly SCOREBOARD_INTERFACE_ID = 6733;
    private static readonly SCOREBOARD_CONTAINER = 6822;
    private static readonly SCOREBOARD_USERNAME_FRAME = 6840;
    private static readonly SCOREBOARD_COMBAT_LEVEL_FRAME = 6839;
    private static readonly SECOND_INTERFACE_CONTAINER = 6670;
    private static readonly STATUS_FRAME_1 = 6684;
    private static readonly STATUS_FRAME_2 = 6571;
    private static readonly ITEM_LIST_1_FRAME = 6516;
    private static readonly ITEM_LIST_2_FRAME = 6517;
    private static readonly RULES_FRAME_START = 8242;
    private static readonly RULES_CONFIG_ID = 286;
    private static readonly TOTAL_WORTH_FRAME = 24234;
    private player: Player;
    private container: ItemContainer;
    // Rules
    private rules: boolean[];
    private interact: Player;
    private configValue: number;
    private state: DuelState = DuelState.NONE;
    // Delays!!
    private button_delay = new SecondsTimer();
    private request_delay = new SecondsTimer();

    constructor(player: Player) {
        this.player = player;
        this.container = new ItemContainer(player, 28, "Duel Container");
        this.rules = Array(DuelRule.values().length).fill(false);
    }

    class Dueling {
    public static MAIN_INTERFACE_CONTAINER = 6669;
    private static DUELING_WITH_FRAME = 6671;
    private static INTERFACE_ID = 6575;
    private static CONFIRM_INTERFACE_ID = 6412;
    private static SCOREBOARD_INTERFACE_ID = 6733;
    private static SCOREBOARD_CONTAINER = 6822;
    private static SCOREBOARD_USERNAME_FRAME = 6840;
    private static SCOREBOARD_COMBAT_LEVEL_FRAME = 6839;
    private static SECOND_INTERFACE_CONTAINER = 6670;
    private static STATUS_FRAME_1 = 6684;
    private static STATUS_FRAME_2 = 6571;
    private static ITEM_LIST_1_FRAME = 6516;
    private static ITEM_LIST_2_FRAME = 6517;
    private static RULES_FRAME_START = 8242;
    private static RULES_CONFIG_ID = 286;
    private static TOTAL_WORTH_FRAME = 24234;
    private player: Player;
    private container: ItemContainer;
    private rules: boolean[];
    private interact: Player;
    private configValue: number;
    private state: DuelState;
    private button_delay: SecondsTimer;
    private request_delay: SecondsTimer;

    constructor(player: Player) {
        this.player = player;
        this.container = new ItemContainer(player, {
            stackType: StackType.DEFAULT,
            refreshItems: () => {
                player.getPacketSender().sendInterfaceSet(INTERFACE_ID, Trading.CONTAINER_INVENTORY_INTERFACE);
                player.getPacketSender().sendItemContainer(player..getInventory(),
                    Trading.INVENTORY_CONTAINER_INTERFACE);
                player.getPacketSender().sendInterfaceItems(MAIN_INTERFACE_CONTAINER,
                    player.getDueling().getContainer().getValidItems());
                player.getPacketSender().sendInterfaceItems(SECOND_INTERFACE_CONTAINER,
                    interact.getDueling().getContainer().getValidItems());
                interact.getPacketSender().sendInterfaceItems(MAIN_INTERFACE_CONTAINER,
                    interact.getDueling().getContainer().getValidItems());
                interact.getPacketSender().sendInterfaceItems(SECOND_INTERFACE_CONTAINER,
                    player.getDueling().getContainer().getValidItems());
                return this;
            },


            public full(): ItemContainer {
                getPlayer().getPacketSender().sendMessage("You cannot stake more items.");
                return this;
            },

            public capacity(): number {
                return 28;
            }
        })
    }

    private static validate(player: Player, interact: Player, playerStatus: PlayerStatus, ...duelStates: DuelState[]): boolean {
        // Verify player...
        if (player == null || interact == null) {
            return false;
        }

        // Make sure we have proper status
        if (playerStatus != null) {
            if (player.getStatus() != playerStatus) {
                return false;
            }

            // Make sure we're interacting with eachother
            if (interact.getStatus() != playerStatus) {
                return false;
            }
        }

        if (player.getDueling().getInteract() == null || player.getDueling().getInteract() != interact) {
            return false;
        }
        if (interact.getDueling().getInteract() == null || interact.getDueling().getInteract() != player) {
            return false;
        }

        // Make sure we have proper duel state.
        let found = false;
        for (let duelState of duelStates) {
            if (player.getDueling().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }

        // Do the same for our interact
        found = false;
        for (let duelState of duelStates) {
            if (interact.getDueling().getState() == duelState) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
        return true;
    }

    public requestDuel(t_: Player) {
        if (this.state == DuelState.NONE || this.state == DuelState.REQUESTED_DUEL) {
            // Make sure to not allow flooding!
            if (!this.request_delay.finished()) {
                let seconds = this.request_delay.secondsRemaining();
                this.player.getPacketSender().sendMessage(`You must wait another ${seconds == 1 ? "second" : `${seconds} seconds`} before sending more duel challenges.`);
                return;
            }

            // The other players' current duel state.
            const t_state = t_.getDueling().getState();

            // Should we initiate the duel or simply send a request?
            let initiateDuel = false;

            // Update this instance...
            this.setInteract(t_);
            this.setState(DuelState.REQUESTED_DUEL);

            // Check if target requested a duel with us...
            if (t_state == DuelState.REQUESTED_DUEL) {
                if (t_.getDueling().getInteract() != null && t_.getDueling().getInteract() == this.player) {
                    initiateDuel = true;
                }
            }

            // Initiate duel for both players with eachother?
            if (initiateDuel) {
                this.player.getDueling().initiateDuel();
                t_.getDueling().initiateDuel();
            } else {
                this.player.getPacketSender().sendMessage(`You've sent a duel challenge to ${t_.getUsername()}...`);
                t_.getPacketSender().sendMessage(`${this.player.getUsername()}:duelreq:`);

                if (t_.isPlayerBot()) {
                    // Player Bots: Automatically accept any duel request
                    t_.getDueling().requestDuel(this.player);
                }
            }

            // Set the request delay to 2 seconds at least.
            this.request_delay.start(2);
        } else {
            this.player.getPacketSender().sendMessage("You cannot do that right now.");
        }
    }

    public initiateDuel() {
        // Set our duel state
        this.setState(DuelState.DUEL_SCREEN);

        // Set our player status
        this.player.setStatus(PlayerStatus.DUELING);

        // Reset right click options
        this.player.getPacketSender().sendInteractionOption("null", 2, true);
        this.player.getPacketSender().sendInteractionOption("null", 1, false);

        // Reset rule toggle configs
        this.player.getPacketSender().sendConfig(RULES_CONFIG_ID, 0);

        // Update strings on interface
        this.player.getPacketSender()
            .sendString(DUELING_WITH_FRAME, `@or1@Dueling with: @whi@${this.interact.getUsername()}@or1@          Combat level: @whi@${this.interact.getSkillManager().getCombatLevel()}`)
            .sendString(STATUS_FRAME_1, "").sendString(669, "Lock Weapon")
            .sendString(8278, "Neither player is allowed to change weapon.");

        // Send equipment on the interface..
        let equipSlot = 0;
        for (let item of this.player.getEquipment().getItems()) {
            this.player.getPacketSender().sendItemOnInterface(13824, item.getId(), equipSlot, item.getAmount());
            equipSlot++;
        }

        // Reset container
        this.container.resetItems();

        // Refresh and send container...
        this.container.refreshItems();
    }

    public closeDuel() {
        if (this.state != DuelState.NONE) {

            // Cache the current interact
            const interact_ = this.interact;

            // Return all items...
            for (let t of this.container.getValidItems()) {
                this.container.switchItem(this.player.getInventory(), t.clone(), false, false);
            }

            // Refresh inventory
            this.player.getInventory().refreshItems();

            // Reset all attributes...
            this.resetAttributes();

            // Send decline message
            this.player.getPacketSender().sendMessage("Duel declined.");
            this.player.getPacketSender().sendInterfaceRemoval();

            // Reset/close duel for other player aswell (the cached interact)
            if (interact_ != null) {
                if (interact_.getStatus() == PlayerStatus.DUELING) {
                    if (interact_.getDueling().getInteract() != null && interact_.getDueling().getInteract() == this.player) {
                        interact_.getPacketSender().sendInterfaceRemoval();
                    }
                }
            }
        }
    }

    public resetAttributes() {

        // Reset duel attributes
        this.setInteract(null);
        this.setState(DuelState.NONE);

        // Reset player status if it's dueling.
        if (this.player.getStatus() == PlayerStatus.DUELING) {
            this.player.setStatus(PlayerStatus.NONE);
        }

        // Reset container..
        this.container.resetItems();

        // Reset rules
        for (let i = 0; i < this.rules.length; i++) {
            this.rules[i] = false;
        }

        // Clear toggles
        this.configValue = 0;
        this.player.getPacketSender().sendConfig(RULES_CONFIG_ID, 0);

        // Update right click options..
        this.player.getPacketSender().sendInteractionOption("Challenge", 1, false);
        this.player.getPacketSender().sendInteractionOption("null", 2, true);

        // Clear head hint
        this.player.getPacketSender().sendEntityHintRemoval(true);

        // Clear items on interface
        this.player.getPacketSender().clearItemOnInterface(MAIN_INTERFACE_CONTAINER)
            .clearItemOnInterface(SECOND_INTERFACE_CONTAINER);
    }


    public handleItem(id: number, amount: number, slot: number, from: ItemContainer, to: ItemContainer) {
        if (this.player.getInterfaceId() == INTERFACE_ID) {

            // Validate this stake action..
            if (!validate(this.player, this.interact, PlayerStatus.DUELING,
                [DuelState.DUEL_SCREEN, DuelState.ACCEPTED_DUEL_SCREEN])) {
                return;
            }

            if (ItemDefinition.forId(id).getValue() == 0) {
                this.player.getPacketSender().sendMessage("There's no point in staking that. It's spawnable!");
                return;
            }

            // Check if the duel was previously accepted (and now modified)...
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.state = DuelState.DUEL_SCREEN;
            }
            if (this.interact.getDueling().getState() == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.interact.getDueling().setState(DuelState.DUEL_SCREEN);
            }
            this.player.getPacketSender().sendString(STATUS_FRAME_1, "@red@DUEL MODIFIED!");
            this.interact.getPacketSender().sendString(STATUS_FRAME_1, "@red@DUEL MODIFIED!");

            // Handle the item switch..
            if (this.state == DuelState.DUEL_SCREEN && this.interact.getDueling().getState() == DuelState.DUEL_SCREEN) {

                // Check if the item is in the right place
                if (from.getItems()[slot].getId() == id) {

                    // Make sure we can fit that amount in the duel
                    if (from instanceof Inventory) {
                        if (!ItemDefinition.forId(id).isStackable()) {
                            if (amount > this.container.getFreeSlots()) {
                                amount = this.container.getFreeSlots();
                            }
                        }
                    }

                    if (amount <= 0) {
                        return;
                    }

                    const item = new Item(id, amount);

                    // Only sort items if we're withdrawing items from the duel.
                    const sort = (from == (this.player.getDueling().getContainer()));

                    // Do the switch!
                    if (item.getAmount() == 1) {
                        from.switchItem(to, item, slot, sort, true);
                    } else {
                        from.switchItem(to, item, sort, true);
                    }
                }
            } else {
                this.player.getPacketSender().sendInterfaceRemoval
            }
        }
    }

    public acceptDuel() {

        // Validate this stake action..
        if (!this.validate(player, interact, PlayerStatus.DUELING, [DuelState.DUEL_SCREEN,
        DuelState.ACCEPTED_DUEL_SCREEN, DuelState.CONFIRM_SCREEN, DuelState.ACCEPTED_CONFIRM_SCREEN])) {
            return;
        }

        // Check button delay...
        if (!this.button_delay.finished()) {
            return;
        }

        // Cache the interact...
        const interact_ = this.interact;

        // Interact's current trade state.
        const t_state = interact_.getDueling().getState();

        // Check which action to take..
        if (this.state == DuelState.DUEL_SCREEN) {

            // Verify that the interact can receive all items first..
            const slotsRequired = this.getFreeSlotsRequired(player);
            if (player.getInventory().getFreeSlots() < slotsRequired) {
                player.getPacketSender()
                    .sendMessage(`You need at least ${slotsRequired} free inventory slots for this duel.`);
                return;
            }

            if (this.rules[DuelRule.NO_MELEE.ordinal()] && this.rules[DuelRule.NO_RANGED.ordinal()]
                && this.rules[DuelRule.NO_MAGIC.ordinal()]) {
                player.getPacketSender().sendMessage("You must enable at least one of the three combat styles.");
                return;
            }

            // Both are in the same state. Do the first-stage accept.
            this.setState(DuelState.ACCEPTED_DUEL_SCREEN);

            // Update status...
            player.getPacketSender().sendString(STATUS_FRAME_1, "Waiting for other player..");
            interact_.getPacketSender().sendString(STATUS_FRAME_1, `${player.getUsername()} has accepted.`);

            // Check if both have accepted..
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN && t_state == DuelState.ACCEPTED_DUEL_SCREEN) {

                // Technically here, both have accepted.
                // Go into confirm screen!
                player.getDueling().confirmScreen();
                interact_.getDueling().confirmScreen();
            } else {
                if (interact_.isPlayerBot()) {
                    interact_.getDueling().acceptDuel();
                }
            }
        } else if (this.state == DuelState.CONFIRM_SCREEN) {
            // Both are in the same state. Do the second-stage accept.
            this.setState(DuelState.ACCEPTED_CONFIRM_SCREEN);

            // Update status...
            player.getPacketSender().sendString(STATUS_FRAME_2,
                `Waiting for ${interact_.getUsername()}'s confirmation..`);
            interact_.getPacketSender().sendString(STATUS_FRAME_2,
                "" + player.getUsername() + " has accepted. Do you wish to do the same?");

            // Check if both have accepted..
            if (state == DuelState.ACCEPTED_CONFIRM_SCREEN && t_state == DuelState.ACCEPTED_CONFIRM_SCREEN) {

            // Both accepted, start duel

            // Decide where they will spawn in the arena..
            final boolean obstacle = rules[DuelRule.OBSTACLES.ordinal()];
            final boolean movementDisabled = rules[DuelRule.NO_MOVEMENT.ordinal()];

            Location pos1 = getRandomSpawn(obstacle);
            Location pos2 = getRandomSpawn(obstacle);

                // Make them spaw next to eachother
                if (movementDisabled) {
                    pos2 = pos1.clone().add(-1, 0);
                }

                player.getDueling().startDuel(pos1);
                interact_.getDueling().startDuel(pos2);
            } else {
                if (interact_.isPlayerBot()) {
                    interact_.getDueling().acceptDuel();
                }
            }
        }

        button_delay.start(1);
    }

    public getRandomSpawn(obstacle: boolean): Location {
        if (obstacle) {
            return new Location(3366 + Misc.getRandom(11), 3246 + Misc.getRandom(6));
        }
        return new Location(3335 + Misc.getRandom(11), 3246 + Misc.getRandom(6));
    }

    private confirmScreen() {
        // Update state
        player.getDueling().setState(DuelState.CONFIRM_SCREEN);

        // Send new interface frames
        let this_items = Trading.listItems(container);
        let interact_item = Trading.listItems(interact.getDueling().getContainer());
        player.getPacketSender().sendString(ITEM_LIST_1_FRAME, this_items);
        player.getPacketSender().sendString(ITEM_LIST_2_FRAME, interact_item);

        // Reset all previous strings related to rules
        for (let i = 8238; i <= 8253; i++) {
            player.getPacketSender().sendString(i, "");
        }

        // Send new ones
        player.getPacketSender().sendString(8250, "Hitpoints will be restored.");
        player.getPacketSender().sendString(8238, "Boosted stats will be restored.");
        if (rules[DuelRule.OBSTACLES.ordinal()]) {
            player.getPacketSender().sendString(8239, "@red@There will be obstacles in the arena.");
        }
        player.getPacketSender().sendString(8240, "");
        player.getPacketSender().sendString(8241, "");

        let ruleFrameIndex = RULES_FRAME_START;
        for (let i = 0; i < DuelRule.values().length; i++) {
            if (i == DuelRule.OBSTACLES.ordinal())
                continue;
            if (rules[i]) {
                player.getPacketSender().sendString(ruleFrameIndex, "" + DuelRule.forId(i).toString());
                ruleFrameIndex++;
            }
        }

        player.getPacketSender().sendString(STATUS_FRAME_2, "");

        // Send new interface..
        player.getPacketSender().sendInterfaceSet(CONFIRM_INTERFACE_ID, Inventory.INTERFACE_ID);
        player.getPacketSender().sendItemContainer(player.getInventory(), Trading.INVENTORY_CONTAINER_INTERFACE);
    }

    public checkRule(button: number): boolean {
        let rule = DuelRule.forButtonId(button);
        if (rule != null) {
            checkRule(rule);
            return true;
        }
        return false;
    }

    private checkRule(rule: DuelRule) {

        // Check if we're actually dueling..
        if (this.player.getStatus() != PlayerStatus.DUELING) {
            return;
        }

        // Verify stake...
        if (!this.validate(this.player, this.interact, PlayerStatus.DUELING,
            [DuelState.DUEL_SCREEN, DuelState.ACCEPTED_DUEL_SCREEN])) {
            return;
        }

        // Verify our current state..
        if (this.state == DuelState.DUEL_SCREEN || this.state == DuelState.ACCEPTED_DUEL_SCREEN) {

            // Toggle the rule..
            if (!this.rules[rule.ordinal()]) {
                this.rules[rule.ordinal()] = true;
                this.configValue += rule.getConfigId();
            } else {
                this.rules[rule.ordinal()] = false;
                this.configValue -= rule.getConfigId();
            }

            // Update interact's rules to match ours.
            this.interact.getDueling().setConfigValue(this.configValue);
            this.interact.getDueling().getRules()[rule.ordinal()] = this.rules[rule.ordinal()];

            // Send toggles for both players.
            this.player.getPacketSender().sendToggle(RULES_CONFIG_ID, this.configValue);
            this.interact.getPacketSender().sendToggle(RULES_CONFIG_ID, this.configValue);

            // Send modify status
            if (this.state == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.state = DuelState.DUEL_SCREEN;
            }
            if (this.interact.getDueling().getState() == DuelState.ACCEPTED_DUEL_SCREEN) {
                this.interact.getDueling().setState(DuelState.DUEL_SCREEN);
            }
            this.player.getPacketSender().sendString(STATUS_FRAME_1, "@red@DUEL MODIFIED!");
            this.interact.getPacketSender().sendString(STATUS_FRAME_1, "@red@DUEL MODIFIED!");

            // Inform them about this "custom" rule.
            if (rule == DuelRule.LOCK_WEAPON && rules[rule.ordinal()]) {
                player.getPacketSender()
                    .sendMessage(
                        "@red@Warning! The rule 'Lock Weapon' has been enabled. You will not be able to change")
                    .sendMessage("@red@weapon during the duel!");
                interact.getPacketSender()
                    .sendMessage(
                        "@red@Warning! The rule 'Lock Weapon' has been enabled. You will not be able to change")
                    .sendMessage("@red@weapon during the duel!");
            }
        }
    }

    private startDuel(telePos: Location) {
        // Set current duel state
        this.setState(DuelState.STARTING_DUEL);

        // Close open interfaces
        player.getPacketSender().sendInterfaceRemoval();

        // Unequip items based on the rules set for this duel
        for (let i = 11; i < this.rules.length; i++) {
            const rule = DuelRule.forId(i);
            if (this.rules[i]) {
                if (rule.getEquipmentSlot() < 0)
                    continue;
                if (player.getEquipment().getItems()[rule.getEquipmentSlot()].getId() > 0) {
                    const item = new Item(player.getEquipment().getItems()[rule.getEquipmentSlot()].getId(),
                        player.getEquipment().getItems()[rule.getEquipmentSlot()].getAmount());
                    player.getEquipment().delete(item);
                    player.getInventory().add(item);
                }
            }
        }
        if (this.rules[DuelRule.NO_WEAPON.ordinal()] || this.rules[DuelRule.NO_SHIELD.ordinal()]) {
            if (player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId() > 0) {
                if (ItemDefinition.forId(player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId())
                    .isDoubleHanded()) {
                    const item = new Item(player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getId(),
                        player.getEquipment().getItems()[Equipment.WEAPON_SLOT].getAmount());
                    player.getEquipment().delete(item);
                    player.getInventory().add(item);
                }
            }
        }

        player.getPacketSender().clearItemOnInterface(MAIN_INTERFACE_CONTAINER)
            .clearItemOnInterface(SECOND_INTERFACE_CONTAINER);

        // Update right click options..
        player.getPacketSender().sendInteractionOption("Attack", 2, true);
        player.getPacketSender().sendInteractionOption("null", 1, false);

        // Reset attributes..
        player.resetAttributes();

        // Freeze the player
        if (rules[DuelRule.NO_MOVEMENT.ordinal()]) {
            player.getMovementQueue().reset().setBlockMovement(true);
        }

        // Send interact hints
        player.getPacketSender().sendPositionalHint(interact.getLocation().clone(), 10);
        player.getPacketSender().sendEntityHint(interact);

        // Teleport the player
        player.moveTo(telePos);

        // Make them interact with eachother
        player.setMobileInteraction(interact);

        // Send countdown as a task
        setTimeout(() => {
            let timer = 3;
            const countdown = setInterval(() => {
                if (player.getDueling().getState() != DuelState.STARTING_DUEL) {
                    clearInterval(countdown);
                    return;
                }
                if (timer === 3 || timer === 2 || timer === 1) {
                    player.forceChat(`${timer}..`);
                } else {
                    player.getDueling().setState(DuelState.IN_DUEL);
                    player.forceChat("FIGHT!!");
                    clearInterval(countdown);
                }
                timer--;
            }, 1000);
        }, 2000);
    }

    public duelLost() {
        // Make sure both players are in a duel..
        if (validate(player, interact, null, [DuelState.STARTING_DUEL, DuelState.IN_DUEL])) {
            // Add won items to a list..
            let totalValue = 0;
            let winnings: Item[] = [];
            for (let item of interact.getDueling().getContainer().getValidItems()) {
                interact.getInventory().add(item);
                winnings.push(item);
                totalValue += item.getDefinition().getValue();
            }
            for (let item of player.getDueling().getContainer().getValidItems()) {
                interact.getInventory().add(item);
                winnings.push(item);
                totalValue += item.getDefinition().getValue();
            }

            // Send interface data..
            interact.getPacketSender().sendString(SCOREBOARD_USERNAME_FRAME, player.getUsername())
                .sendString(SCOREBOARD_COMBAT_LEVEL_FRAME, "" + player.getSkillManager().getCombatLevel())
                .sendString(TOTAL_WORTH_FRAME,
                    "@yel@Total: @or1@" + Misc.insertCommasToNumber("" + totalValue + "") + " value!");

            // Send winnings onto interface
            interact.getPacketSender().sendInterfaceItems(SCOREBOARD_CONTAINER, winnings);

            // Send the scoreboard interface
            interact.getPacketSender().sendInterface(SCOREBOARD_INTERFACE_ID);

            // Restart the winner's stats
            interact.resetAttributes();

            // Move players home
            let spawn = new Location(3366, 3266);
            interact.moveTo(spawn.clone().add(Misc.getRandom(4), Misc.getRandom(2)));
            player.moveTo(spawn.clone().add(Misc.getRandom(4), Misc.getRandom(2)));

            // Send messages
            interact.getPacketSender().sendMessage("You won the duel!");
            player.getPacketSender().sendMessage("You lost the duel!");

            // Reset attributes for both
            interact.getDueling().resetAttributes();
            player.getDueling().resetAttributes();
        } else {

            player.getDueling().resetAttributes();
            player.getPacketSender().sendInterfaceRemoval();

            if (interact != null) {
                interact.getDueling().resetAttributes();
                interact.getPacketSender().sendInterfaceRemoval();
            }
        }
    }

    public inDuel(): boolean {
        return this.state == DuelState.STARTING_DUEL || this.state == DuelState.IN_DUEL;
    }

    private getFreeSlotsRequired(player: Player): number {
        let slots = 0;
        // Count equipment that needs to be taken off
        for (let i = 11; i < player.getDueling().getRules().length; i++) {
            let rule = DuelRule.values()[i];
            if (player.getDueling().getRules()[rule.ordinal()]) {
                let item = player.getEquipment().getItems()[rule.getEquipmentSlot()];
                if (!item.isValid()) {
                    continue;
                }
                if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                    slots += rule.getInventorySpaceReq();
                }
                if (rule == DuelRule.NO_WEAPON || rule == DuelRule.NO_SHIELD) {
                }
            }
        }

        // Count inventory slots from interact's container aswell as ours
        for (let item of container.getItems()) {
            if (item == null || !item.isValid())
                continue;
            if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                slots++;
            }
        }

        for (let item of interact.getDueling().getContainer().getItems()) {
            if (item == null || !item.isValid())
                continue;
            if (!(item.getDefinition().isStackable() && player.getInventory().contains(item.getId()))) {
                slots++;
            }
        }

        return slots;
    }

    public getButtonDelay(): SecondsTimer {
        return button_delay;
    }

    public getState(): DuelState {
        return state;
    }

    public setState(state: DuelState) {
        this.state = state;
    }

    public getContainer(): ItemContainer {
        return this.container;
    }

    public getInteract(): Player {
        return this.interact;
    }

    public setInteract(interact: Player): void {
        this.interact = interact;
    }

    public getRules(): boolean[] {
        return this.rules;
    }

    public getConfigValue(): number {
        return this.configValue;
    }

    public setConfigValue(configValue: number): void {
        this.configValue = configValue;
    }

    public incrementConfigValue(configValue: number): void {
        this.configValue += configValue;
    }
}

class DuelRule {
    private configId: number;
    private buttonId: number;
    private inventorySpaceReq: number;
    private equipmentSlot: number;

    constructor(configId: number, buttonId: number, inventorySpaceReq: number, equipmentSlot: number) {
        this.configId = configId;
        this.buttonId = buttonId;
        this.inventorySpaceReq = inventorySpaceReq;
        this.equipmentSlot = equipmentSlot;
    }

    public static forId(i: number) {
        for (const r of Object.values(DuelRule)) {
            if (r.ordinal() === i) {
                return r;
            }
        }
        return null;
    }

    public static forButtonId(buttonId: number) {
        for (const r of Object.values(DuelRule)) {
            if (r.getButtonId() === buttonId) {
                return r;
            }
        }
        return null;
    }

    public getConfigId() {
        return this.configId;
    }

    public getButtonId() {
        return this.buttonId;
    }

    public getInventorySpaceReq() {
        return this.inventorySpaceReq;
    }

    public getEquipmentSlot() {
        return this.equipmentSlot;
    }

    public toString() {
        return this.name().toLowerCase();
    }
}


public enum DuelState {
    NONE, REQUESTED_DUEL, DUEL_SCREEN, ACCEPTED_DUEL_SCREEN, CONFIRM_SCREEN, ACCEPTED_CONFIRM_SCREEN, STARTING_DUEL, IN_DUEL;
}

enum DuelRule {
    NO_RANGED = 16,
    NO_MELEE = 32,
    NO_MAGIC = 64,
    NO_SPECIAL_ATTACKS = 8192,
    LOCK_WEAPON = 4096,
    NO_FORFEIT = 1,
    NO_POTIONS = 128,
    NO_FOOD = 256,
    NO_PRAYER = 512,
    NO_MOVEMENT = 2,
    OBSTACLES = 1024,
    NO_HELM = 16384,
    NO_CAPE = 32768,
    NO_AMULET = 65536,
    NO_AMMUNITION = 134217728,
    NO_WEAPON = 131072,
    NO_BODY = 262144,
    NO_SHIELD = 524288,
    NO_LEGS = 2097152,
    NO_RING = 67108864,
    NO_BOOTS = 16777216,
    NO_GLOVES = 8388608,
}
}