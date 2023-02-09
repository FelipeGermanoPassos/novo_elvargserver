import { Player } from "../player/Player";
import { Ids } from "../../../model/Ids";
import { NPCInteraction } from "./NPCInteraction";
import { NPC } from "./NPC";

export class NPCInteractionSystem {
    private static NPC_INTERACT_MAP: Map<number, NPCInteraction>;

    public static init(interactClasses: NPCInteraction[]) {
        NPCInteractionSystem.NPC_INTERACT_MAP = interactClasses.flatMap(clazz => {
            try {
                let instance = new NPCInteraction(clazz.getDeclaredConstructor().newInstance());
                return clazz.ids.map(id => [id, instance] as [number, NPCInteraction]);
            } catch (e) {
                throw new Error(e);
            }
        }).reduce((map, [id, instance]) => {
            map.set(id, instance);
            return map;
        }, new Map<number, NPCInteraction>());
    }

    public static handleFirstOption(player: Player, npc: NPC) {
        var npcInteraction = NPCInteractionSystem.NPC_INTERACT_MAP.get(npc.getId());
        if (!npcInteraction) {
            return false;
        }

        npcInteraction.firstOptionClick(player, npc);
        return true;
    }

    public static handleSecondOption(player: Player, npc: NPC) {
        var npcInteraction = NPCInteractionSystem.NPC_INTERACT_MAP.get(npc.getId());
        if (!npcInteraction) {
            return false;
        }

        npcInteraction.secondOptionClick(player, npc);
        return true;
    }

    public static handleThirdOption(player: Player, npc: NPC) {
        var npcInteraction = NPCInteractionSystem.NPC_INTERACT_MAP.get(npc.getId());
        if (!npcInteraction) {
            return false;
        }

        npcInteraction.thirdOptionClick(player, npc);
        return true;
    }

    public static handleForthOption(player: Player, npc: NPC) {
        var npcInteraction = NPCInteractionSystem.NPC_INTERACT_MAP.get(npc.getId());
        if (!npcInteraction) {
            return false;
        }

        npcInteraction.forthOptionClick(player, npc);
        return true;
    }

    public static handleUseItem(player: Player, npc: NPC, itemId: number, slot: number) {
        var npcInteraction = NPCInteractionSystem.NPC_INTERACT_MAP.get(npc.getId());
        if (!npcInteraction) {
            return false;
        }

        npcInteraction.useItemOnNpc(player, npc, itemId, slot);
        return true;
    }
}