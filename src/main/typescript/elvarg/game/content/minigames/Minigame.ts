interface Minigame {
    firstClickObject(player: Player, object: GameObject): boolean;
    handleButtonClick(player: Player, button: number): boolean;
    process(): void;
}
