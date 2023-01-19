import { BackgroundLoader } from "./BackgroundLoader";
import { ClanChatManager } from "./content/clan/ClanChatManager";
import { CombatPoisonData } from "./task/impl/CombatPoisonEffect/CombatPoisonData";
import { PlayerPunishment } from "./util/PlayerPunishment";
import { Systems } from "./Systems";
import { RegionManager } from "./collision/RegionManager";
import { GameEngine } from "./GameEngine";
import { ObjectSpawnDefinitionLoader } from "./definition/loader/impl/ObjectSpawnDefinitionLoader";
import { ItemDefinitionLoader } from "./definition/loader/impl/ItemDefinitionLoader";
import { ShopDefinitionLoader } from "./definition/loader/impl/ShopDefinitionLoader";
import { NpcDefinitionLoader } from "./definition/loader/impl/NpcDefinitionLoader";
import { NpcDropDefinitionLoader } from "./definition/loader/impl/NpcDropDefinitionLoader";
import { NpcSpawnDefinitionLoader } from "./definition/loader/impl/NpcSpawnDefinitionLoader";

class GameBuilder {

    private backgroundLoader: BackgroundLoader = new BackgroundLoader();

    public initialize(): void {
        // Setup systems
        Systems.init();

        // Start immediate tasks..
        RegionManager.init();

        // Start background tasks..
        this.backgroundLoader.init(this.createBackgroundTasks());

        // Start global tasks..

        // Start game engine..
        new GameEngine().init();

        // Make sure the background tasks loaded properly..
        if (!this.backgroundLoader.awaitCompletion())
            throw new Error("Background load did not complete normally!");
    }

    public createBackgroundTasks(): Array<() => void> {
        let tasks: Array<() => void> = [];
        tasks.push(ClanChatManager.init);
        tasks.push(CombatPoisonData.init);
        tasks.push(PlayerPunishment.init);

        // Load definitions..
        tasks.push(new ObjectSpawnDefinitionLoader());
        tasks.push(new ItemDefinitionLoader());
        tasks.push(new ShopDefinitionLoader());
        tasks.push(new NpcDefinitionLoader());
        tasks.push(new NpcDropDefinitionLoader());
        tasks.push(new NpcSpawnDefinitionLoader());
    //    tasks.add(new NPCSpawnDumper());        
        return tasks;
    }
}
