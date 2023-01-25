abstract class DialogueBuilder {
    private dialogues: Map<number, Dialogue> = new Map();

    constructor() {
    }

    public add(...dialogues: Dialogue[]) {
        for (let dialogue of dialogues) {
            this.dialogues.set(dialogue.getIndex(), dialogue);
        }
        return this;
    }

    public getDialogues(): Map<number, Dialogue> {
        return this.dialogues;
    }
}