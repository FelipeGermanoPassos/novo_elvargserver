class TestStaticDialogue extends DialogueBuilder {
    constructor() {
        super();
        add(new PlayerDialogue(0, "Well this works just fine."), new PlayerDialogue(1, "Second test"),
                new NpcDialogue(2, 6797, "okay great."));
    }
}