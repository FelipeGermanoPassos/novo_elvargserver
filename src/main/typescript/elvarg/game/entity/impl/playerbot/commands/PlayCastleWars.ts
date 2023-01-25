export class PlayCastleWars implements BotCommand {
    public triggers(): string[] {
        return ["castlewars", " cw"];
    }

    public start(playerBot: PlayerBot, args: string[]): void {
        // Remove head and cape
        playerBot.getEquipment().set(Equipment.CAPE_SLOT, Equipment.NO_ITEM);
        playerBot.getEquipment().set(Equipment.HEAD_SLOT, Equipment.NO_ITEM);

        playerBot.updateLocalPlayers();

        playerBot.sendChat("Going to play Castlewars, BRB!");

        playerBot.performAnimation(WAVE_ANIM);

        TaskManager.submit(new Task(5, playerBot.getIndex(), false) {
            public execute(): void {
                CastleWars.addToWaitRoom(playerBot, CastleWars.TEAM_GUTHIX);
                this.stop();
            }
        });
    }

    public stop(playerBot: PlayerBot): void {
        playerBot.getCombatInteraction().reset();
    }

    public supportedTypes(): CommandType[] {
        return [PUBLIC_CHAT, PRIVATE_CHAT, CLAN_CHAT];
    }
}



