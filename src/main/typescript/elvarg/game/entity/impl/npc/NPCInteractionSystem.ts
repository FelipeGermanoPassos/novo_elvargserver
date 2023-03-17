import { Player } from "../player/Player";
import { Ids } from "../../../model/Ids";
import { NPCInteraction } from "./NPCInteraction";
import { NPC } from "./NPC";


export class NPCInteractionSystem {
    private static NPC_INTERACT_MAP: Map<number, NPCInteraction>;

    public static handleFirstOption(player: any, npc: any): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.firstOptionClick(player, npc);
    return true;
}

public static handleSecondOption(player: any, npc: any): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.secondOptionClick(player, npc);
    return true;
}

public static handleThirdOption(player: any, npc: any): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.thirdOptionClick(player, npc);
    return true;
}

public static handleForthOption(player: any, npc: any): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.forthOptionClick(player, npc);
    return true;
}

public static handleUseItem(player: any, npc: any, itemId: number, slot: number): boolean {
    if (!(npc instanceof NPCInteraction)) {
        return false;
    }

    npc.useItemOnNpc(player, npc, itemId, slot);
    return true;
}
}