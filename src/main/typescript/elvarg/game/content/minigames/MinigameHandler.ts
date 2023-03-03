import { CastleWars } from "./impl/CastleWars";
import { Player } from "../../entity/impl/player/Player";
import { GameObject } from "../../entity/impl/object/GameObject";

export class MinigameHandler {
    public static minigames = {
        CASTLEWARS: {
            name: "Castlewars",
            minigame: new CastleWars()
        }
    }
    public static getAll() {
        return Object.values(this.minigames).filter(m => m.minigame != null).map(m => m.minigame);
    }

    public static firstClickObject(player: Player, object: GameObject): boolean {
        return this.getAll().some(m => m.firstClickObject(player, object));
    }

    public static handleButtonClick(player: Player, button: number): boolean {
        return this.getAll().some(m => m.handleButtonClick(player, button));
    }

    public static process(): void {
        this.getAll().forEach(m => m.process());
    }
}
