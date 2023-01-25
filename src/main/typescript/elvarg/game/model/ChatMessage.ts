export class ChatMessage {
    private colour: number;
    private effects: number;
    private text: number[];
    constructor(colour: number, effects: number, text: number[]) {
        this.colour = colour;
        this.effects = effects;
        this.text = text;
    }
    public getColour() {
        return this.colour;
    }
    public getEffects() {
        return this.effects;
    }
    public getText() {
        return this.text;
    }
}