import { PlayerBot } from "../PlayerBot";
import { TeleportHandler } from "../../../../model/teleportation/TeleportHandler";
import { TeleportType } from "../../../../model/teleportation/TeleportType";
import { Task } from "../../../../task/Task";
import { TaskManager } from "../../../../task/TaskManager";
import { BotCommand } from "./BotCommand";
import { CommandType } from "./CommandType";
import { Teleportable } from "../../../../model/teleportation/Teleportable";

export class GoToDuelArena implements BotCommand {
    triggers(): string[] {
        return ["duel arena"];
    }

    start(playerBot: PlayerBot, args: string[]): void {
        playerBot.sendChat("Going to Duel Arena - see ya soon!");

        TaskManager.submit(new Task({ delay: 5, key: playerBot.getIndex(), immediate: false }) {
            execute() {
                TeleportHandler.teleport(playerBot, Teleportable.DUEL_ARENA.getPosition(), TeleportType.NORMAL, false)
                stop();
            }
        })

        playerBot.stopCommand();
    }

    stop(playerBot: PlayerBot): void {
    }

    supportedTypes(): CommandType[] {
        return [CommandType.PUBLIC_CHAT, CommandType.PRIVATE_CHAT, CommandType.CLAN_CHAT];
    }
}