import { Task, TaskManager } from "./task.manager";
import { TeleportHandler, TeleportType } from "./teleport.handler";
import { CommandType, BotCommand } from "./bot.command";
import { PlayerBot } from "../playerbot";

export class GoToDuelArena implements BotCommand {
    triggers(): string[] {
        return ["duel arena"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        playerBot.sendChat("Going to Duel Arena - see ya soon!");

        TaskManager.submit(new Task(5, playerBot.getIndex(), false) {
            execute(): void {
                TeleportHandler.teleport(playerBot, DUEL_ARENA.getPosition(), TeleportType.NORMAL, false);
                this.stop();
            }
        });

        playerBot.stopCommand();
    }

    stop(playerBot: PlayerBot): void {
    }

    supportedTypes(): CommandType[] {
        return [PUBLIC_CHAT, PRIVATE_CHAT, CLAN_CHAT];
    }
}