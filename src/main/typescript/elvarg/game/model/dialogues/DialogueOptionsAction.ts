import { Player } from "../../entity/impl/player/Player";

interface DialogueOptionsAction {
    execute(player: Player): void;
}