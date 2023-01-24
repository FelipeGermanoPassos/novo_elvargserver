class DialogueManager {
    public static STATIC_DIALOGUES: Map<number, DialogueBuilder> = new Map<number, DialogueBuilder>();

    static {
        DialogueManager.STATIC_DIALOGUES.set(0, new TestStaticDialogue());
    }

    /**
     * Represents the owner of this {@link DialogueManager} instance.
     */
    private player: Player;

    /**
     * A {@link Map} which holds all of the current dialogue entries and indexes.
     */
    private dialogues: Map<number, Dialogue> = new Map<number, Dialogue>();

    /**
     * The current dialogue's index.
     */
    private index: number;

    /**
     * Creates a new {@link DialogueManager} for the given {@link Player}.
     * 
     * @param player
     */
    constructor(player: Player) {
        this.player = player;
    }

    /**
     * Resets all of the attributes of the {@link DialogueManager}.
     */
    public reset() {
        this.dialogues.clear();
        this.index = -1;
    }

    /**
     * Advances, starting the next dialogue.
     */
    public advance() {
        let current = this.dialogues.get(this.index);
        if (current == null) {
            this.reset();
            this.player.getPacketSender().sendInterfaceRemoval();
            return;
        }

        let continueAction = current.getContinueAction();
        if(continueAction != null) {
            // This dialogue has a custom continue action
            continueAction.execute(this.player);
            this.reset();
            return;
        }

        this.start(this.index + 1);
    }
}