export class ChatMessage
{
    // *
    // 	 * The color of the message.
    private colour:number;
    // *
    // 	 * The effects of the message.
    private effects:number;
    // *
    // 	 * The actual text of the message.
    private text:number[];
    // *
    //     * The Message constructor.
    //     *
    //     * @param colour  The color the message will have, done through color(#):
    //     * @param effects The effect the message will have, done through effect(#):
    //     * @param text    The actual message it will have.
    constructor(colour:number, effects:number, text:number[])
    {
        this.colour = colour;
        this.effects = effects;
        this.text = text;
    }
    // *
    // 	 * Gets the message's chat color.
    // 	 *
    // 	 * @return colour.
    public getColour()
    {
        return this.colour;
    }
    // *
    // 	 * Gets the message's chat effect.
    // 	 *
    // 	 * @return effects.
    public getEffects()
    {
        return this.effects;
    }
    // *
    // 	 * Gets the message's actual text in byte form.
    // 	 *
    // 	 * @return text.
    public getText()
    {
        return this.text;
    }
}