class KingBlackDragon extends NPC {
    private static readonly combatMethod = new KingBlackDragonMethod();
    constructor(id: number, position: Location) {
        super(id, position);
    }
    public getCombatMethod(): CombatMethod {
        return combatMethod;
    }
}