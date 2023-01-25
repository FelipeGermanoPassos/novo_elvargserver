export enum InteractionState {
    IDLE,
    COMMAND
}

const CHAT_COMMANDS: BotCommand[] = [
    new FollowPlayer(), new HoldItems(), new LoadPreset(), new FightCommand(), new PlayCastleWars(),
    new GoToDuelArena()
];

export class PlayerBot extends Player {

    private spawnPosition = GameConstants.DEFAULT_LOCATION;
    private currentState: InteractionState = InteractionState.IDLE;
    private activeCommand: BotCommand;
    private definition: PlayerBotDefinition;
    private interactingWith: Player;
    private movementInteraction: MovementInteraction;
    private chatInteraction: ChatInteraction;
    private tradingInteraction: TradingInteraction;
    private combatInteraction: CombatInteraction;

    constructor(definition: PlayerBotDefinition) {
        super(new PlayerBotSession(), definition.getSpawnLocation());

        this.setUsername(definition.getUsername()).setLongUsername(Misc.stringToLong(definition.getUsername()))
            .setPasswordHashWithSalt(GameConstants.PLAYER_BOT_PASSWORD).setHostAddress("127.0.0.1");

        this.definition = definition;
        this.tradingInteraction = new TradingInteraction(this);
        this.chatInteraction = new ChatInteraction(this);
        this.movementInteraction = new MovementInteraction(this);
        this.combatInteraction = new CombatInteraction(this);

        this.setRigourUnlocked(true);
        this.setAuguryUnlocked(true);
        this.setAutoRetaliate(true);

        if (!World.getAddPlayerQueue().contains(this)) {
            World.getAddPlayerQueue().add(this);
        }
    }

    public getDefinition(): PlayerBotDefinition {
        return this.definition;
    }

    public getCurrentState(): InteractionState {
        return this.currentState;
    }

    public setCurrentState(interactionState: InteractionState): void {
        this.currentState = interactionState;
    }

    public getChatCommands(): BotCommand[] {
        return CHAT_COMMANDS;
    }

    public getChatInteraction(): ChatInteraction {
        return this.chatInteraction;
    }

    public getTradingInteraction(): TradingInteraction {
        return this.tradingInteraction;
    }

    public getMovementInteraction(): MovementInteraction {
        return this.movementInteraction;
    }

    public getCombatInteraction(): CombatInteraction {
        return this.combatInteraction;
    }

    public getSpawnPosition(): Location {
        return this.spawnPosition;
    }

    public getActiveCommand(): BotCommand {
        return this.activeCommand;
    }

    public stopCommand(): void {
        if (this.getActiveCommand() != null) {
            this.getActiveCommand().stop(this);
        }

        this.setInteractingWith(null);
        this.activeCommand = null;
        this.setCurrentState(InteractionState.IDLE);
    }
    public startCommand(command: BotCommand, player: Player, args: string[]): void {
        this.setInteractingWith(player);
        this.activeCommand = command;
        this.setCurrentState(InteractionState.COMMAND);
        command.start(this, args);
    }

    public sendChat(message: string): void {
        this.getChatMessageQueue().add(new ChatMessage(0, 0, Misc.textPack(message)));
    }

    public updateLocalPlayers(): void {
        if (this.getLocalPlayers().length == 0) {
            return;
        }

        for (let localPlayer of this.getLocalPlayers()) {
            PlayerUpdating.update(localPlayer);
        }
    }

    public process(): void {
        this.combatInteraction.process();
        super.process();
    }

    public onLogin(): void {
        super.onLogin();

        Presetables.load(this, this.getDefinition().getFighterPreset().getItemPreset());
    }

    public resetAttributes(): void {
        super.resetAttributes();

        stopCommand();
    }
}