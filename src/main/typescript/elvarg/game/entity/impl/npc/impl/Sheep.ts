import { NPC, NPCInteraction, Player } from "../../..";
import { Item, ItemOnGroundManager } from "../../../entity";
import { Animation, Sound, Sounds } from "../../../model";
import { SHEEP_FULL_BLACK_HEAD, SHEEP_FULL_GREY_HEAD, SHEEP_FULL_WHITE_HEAD, SHEEP_FULL_YELLOW_GREY_HEAD, SHEEP_FULL_YELLOW_BLACK_HEAD, SHEARS, WOOL } from "../../../util/ItemIdentifiers";
import { Task, TaskManager } from "../../../task";

@Ids([SHEEP_FULL_BLACK_HEAD, SHEEP_FULL_GREY_HEAD, SHEEP_FULL_WHITE_HEAD, SHEEP_FULL_YELLOW_GREY_HEAD, SHEEP_FULL_YELLOW_BLACK_HEAD])
export class Sheep implements NPCInteraction {
    private static readonly SHEARING = new Animation(893);
    private static readonly SHEEP_EATING = new Animation(5335);
    private static readonly ITEM_WOOL = new Item(WOOL);

    public firstOptionClick(player: Player, npc: NPC): void {
        this.shear(player, npc);
    }

    public secondOptionClick(player: Player, npc: NPC): void {
    }

    public thirdOptionClick(player: Player, npc: NPC): void {
    }

    public forthOptionClick(player: Player, npc: NPC): void {
    }

    public useItemOnNpc(player: Player, npc: NPC, itemId: number, slot: number): void {
        if (itemId !== SHEARS) {
            return;
        }

        this.shear(player, npc);
    }

    /**
     * Function to handle shearing of sheep.
     *
     * @param player
     */
    public shear(player: Player, npc: NPC): void {
        if (!player.getInventory().contains(SHEARS)) {
            player.getPacketSender().sendMessage("You need a set of shears to do this.");
            return;
        }

        player.performAnimation(Sheep.SHEARING);
        Sounds.sendSound(player, Sound.CUTTING);

        // Shear the sheep and add the wool
        TaskManager.submit(new Task(3, npc, false, () => {
            npc.setNpcTransformationId(this.getSheepTransformId(npc));
            npc.forceChat("Baa!");

            if (player.getInventory().getFreeSlots() > 0) {
                player.getInventory().add(Sheep.ITEM_WOOL);
            } else {
                ItemOnGroundManager.register(player, Sheep.ITEM_WOOL);
                player.getPacketSender().sendMessage("You did not have enough inventory space so the Wool was dropped on the ground.");
            }
        }));
        // Ensure the sheep's coat grows back after 10 game ticks
        TaskManager.submit(new Task(13, npc, false) {
            protected execute() {
                npc.performAnimation(SHEEP_EATING);
                npc.setNpcTransformationId(npc.getRealId());
                this.stop();
            }
        });
    }

    private getSheepTransformId(NPC npc: NPC): number {
        switch (npc.getId()) {
            case SHEEP_FULL_BLACK_HEAD:
                return SHEEP_BALD_BLACK_HEAD;
            case SHEEP_BALD_BLACK_HEAD:
                return SHEEP_FULL_BLACK_HEAD;
            case SHEEP_FULL_GREY_HEAD:
                return SHEEP_BALD_GREY_HEAD;
            case SHEEP_BALD_GREY_HEAD:
                return SHEEP_FULL_GREY_HEAD;
            case SHEEP_FULL_WHITE_HEAD:
                return SHEEP_BALD_WHITE_HEAD;
            case SHEEP_BALD_WHITE_HEAD:
                return SHEEP_FULL_WHITE_HEAD;
            case SHEEP_FULL_YELLOW_GREY_HEAD:
                return SHEEP_BALD_YELLOW_GREY_HEAD;
            case SHEEP_FULL_YELLOW_BLACK_HEAD:
                return SHEEP_BALD_YELLOW_BLACK_HEAD;
            default:
                return -1;
        }
    }
}