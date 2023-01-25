import { BackgroundLoader } from "../util/BackgroundLoader";
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
import * as ArrayDeque from 'collections'
import * as Queue from 'collections'


export class GameBuilder {
    private backgroundLoader = new BackgroundLoader();
    
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
    
    public createBackgroundTasks(): Queue<() => void> {
        const tasks = new ArrayDeque<() => void>();
        tasks.add(ClanChatManager.init);
        tasks.add(CombatPoisonData.init);
        tasks.add(PlayerPunishment.init);
    
        // Load definitions..
        tasks.add(new ObjectSpawnDefinitionLoader());
        tasks.add(new ItemDefinitionLoader());
        tasks.add(new ShopDefinitionLoader());
        tasks.add(new NpcDefinitionLoader());
        tasks.add(new NpcDropDefinitionLoader());
        tasks.add(new NpcSpawnDefinitionLoader());
        //tasks.add(new NPCSpawnDumper());        
        return tasks;
    }
}
