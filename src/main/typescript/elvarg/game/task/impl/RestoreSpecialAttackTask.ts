export class RestoreSpecialAttackTask extends Task {
    constructor(private character: Mobile) {
    super(50, character, false);
    this.character = character;
    character.setRecoveringSpecialAttack(true);
    }
    
    public execute() {
        if (this.character == null || !this.character.isRegistered() || this.character.getSpecialPercentage() >= 100 || !this.character.isRecoveringSpecialAttack()) {
            this.character.setRecoveringSpecialAttack(false);
            this.stop();
            return;
        }
        let amount = this.character.getSpecialPercentage() + 10;
        if (amount >= 100) {
            amount = 100;
            this.character.setRecoveringSpecialAttack(false);
            this.stop();
        }
        this.character.setSpecialPercentage(amount);
    
        if (this.character.isPlayer()) {
            let player = this.character.getAsPlayer();
            CombatSpecial.updateBar(player);
        }
    }
}