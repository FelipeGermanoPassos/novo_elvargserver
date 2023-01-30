enum SlayerMaster {
    TURAEL(3, 1, [[10, 3], [50, 10], [100, 25], [250, 50], [1000, 75]]),
        MAZCHNA(20, 2, [[10, 5], [50, 15], [100, 50], [250, 70], [1000, 100]]),
        VANNAKA(40, 4, [[10, 20], [50, 60], [100, 100], [250, 140], [1000, 200]]),
        CHAELDAR(70, 10, [[10, 50], [50, 150], [100, 250], [250, 350], [1000, 500]]),
        NIEVE(85, 12, [[10, 60], [50, 180], [100, 300], [250, 420], [1000, 600]]),
        DURADEL(100, 15, [[10, 75], [50, 225], [100, 375], [250, 525], [1000, 750]]);
    
    private readonly combatLevel: number;
    private readonly basePoints: number;
    private readonly consecutiveTaskPoints: number[][];

constructor(combatLevel: number, basePoints: number, consecutiveTaskPoints: number[][]) {
    this.combatLevel = combatLevel;
    this.basePoints = basePoints;
    this.consecutiveTaskPoints = consecutiveTaskPoints;
}
    
    public getCombatLevel(): number {
    return this.combatLevel;
}
    
    public getBasePoints(): number {
    return this.basePoints;
}
    
    public getConsecutiveTaskPoints(): number[][] {
    return this.consecutiveTaskPoints;
}
    
    public canAssign(player: Player): boolean {
    if (player.getSkillManager().getCombatLevel() < this.combatLevel) {
        return false;
    }