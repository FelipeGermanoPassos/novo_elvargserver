export interface Command {
    execute(player: Player, command: string, parts: string[]): void;
    canUse(player: Player): boolean;
}