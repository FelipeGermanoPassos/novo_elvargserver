class DuelArenaArea extends Area {
    constructor() {
        super(Arrays.asList(new Boundary(3326, 3383, 3197, 3295)));
    }

    postEnter(character: Mobile) {
        if (character.isPlayer()) {
            let player = character.getAsPlayer();
            player.getPacketSender().sendInteractionOption("Challenge", 1, false);
            player.getPacketSender().sendInteractionOption("null", 2, true);
        }

        if (character.isPlayerBot() && this.getPlayers().size() == 0) {
            // Allow this PlayerBot to wait for players for 5 minutes
            character.getAsPlayerBot().getTimers().register(TimerKey.BOT_WAIT_FOR_PLAYERS);
        }
    }

    postLeave(character: Mobile, logout: boolean) {
        if (character.isPlayer()) {
            let player = character.getAsPlayer();
            if (player.getDueling().inDuel()) {
                player.getDueling().duelLost();
            }
            player.getPacketSender().sendInteractionOption("null", 2, true);
            player.getPacketSender().sendInteractionOption("null", 1, false);

            if (this.getPlayers().size() == 0 && this.getPlayerBots().size() > 0) {
                // Last player has left duel arena and there are bots
                this.getPlayerBots().forEach(pb => pb.getTimers().register(TimerKey.BOT_WAIT_FOR_PLAYERS));
            }
        }
    }

    process(character: Mobile) {
    }

    canTeleport(player: Player): boolean {
        if (player.getDueling().inDuel()) {
            return false;
        }
        return true;
    }

    canAttack(character: Mobile, target: Mobile): CanAttackResponse {
        if (character.isPlayer() && target.isPlayer()) {
            let a = character.getAsPlayer();
            let t = target.getAsPlayer();
            if (a.getDueling().getState() == DuelState.IN_DUEL && t.getDueling().getState() == DuelState.IN_DUEL) {
                return CanAttackResponse.CAN_ATTACK;
            } else if (a.getDueling().getState() == DuelState.STARTING_DUEL
                || t.getDueling().getState() == DuelState.STARTING_DUEL) {
                return CanAttackResponse.DUEL_NOT_STARTED_YET;
            }

            return CanAttackResponse.DUEL_WRONG_OPPONENT;
        }

        return CanAttackResponse.CAN_ATTACK;
    }

    canTrade(player: Player, target: Player): boolean {
        if (player.getDueling().inDuel()) {
            return false;
        }
        return true;
    }

    isMulti(character: Mobile): boolean {
        return true;
    }

    canEat(player: Player, itemId: number): boolean {
        if (player.getDueling().inDuel() && player.getDueling().getRules()[DuelRule.NO_FOOD.ordinal()]) {
            return false;
        }
        return true;
    }

    canDrink(player: Player, itemId: number): boolean {
        if (player.getDueling().inDuel() && player.getDueling().getRules()[DuelRule.NO_POTIONS.ordinal()]) {
            return false;
        }
        return true;
    }

    dropItemsOnDeath(player: Player, killer: Optional<Player>): boolean {
        if (player.getDueling().inDuel()) {
            return false;
        }
        return true;
    }

    handleDeath(player: Player, killer: Optional<Player>): boolean {
        if (player.getDueling().inDuel()) {
            player.getDueling().duelLost();
            return true;
        }
        return false;
    }

    onPlayerRightClick(player: Player, rightClicked: Player, option: number) {
        if (option == 1) {
            if (player.busy()) {
                player.getPacketSender().sendMessage("You cannot do that right now.");
                return;
            }
            if (rightClicked.busy()) {
                player.getPacketSender().sendMessage("That player is currently busy.");
                return;
            }
            player.getDueling().requestDuel(rightClicked);
        }
    }

    defeated(player: Player, character: Mobile) {
    }

    handleObjectClick(player: Player, objectId: number, type: number): boolean {
        return false;
    }

    canPlayerBotIdle(playerBot: PlayerBot): boolean {
        if (this.getPlayers().size > 0) {
            // Player bots can idle here if there are any real players here
            return true;
        }

        if (playerBot.getTimers().has(TimerKey.BOT_WAIT_FOR_PLAYERS)) {
            // Player bot can idle here while waiting for players
            return true;
        }

        return false;
    }
}
