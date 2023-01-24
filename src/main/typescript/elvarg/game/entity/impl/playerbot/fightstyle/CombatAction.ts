interface CombatAction {
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean;
    perform(playerBot: PlayerBot, enemy: Mobile);
    stopAfter(): boolean{
    return true;
};
}