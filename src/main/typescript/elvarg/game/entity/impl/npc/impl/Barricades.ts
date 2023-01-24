import { Location, RegionManager } from './RegionManager';
import { Player } from './Player';
import { ConcurrentSet } from 'netty';
import { Sound, Sounds } from './Sounds';
import { World } from './World';
import { Firemaking } from './skillable/Firemaking';
import { NPC } from './NPC';
import { Animation } from './Animation';
import { Item } from './Item';
import { Skill } from './Skill';
import { Task, TaskManager } from './Task';

class Barricades extends NPC {
    @Ids(5722, 5723)
    public static readonly NPC_ID: number = 5722;
    public static readonly NPC_ID_BURNING: number = 5723;
    public static readonly ITEM_ID: number = 4053;
    public static readonly FIREMAKING_EXPERIENCE: number = 10;

    private static barricades: Set<Location> = new ConcurrentSet<Location>();

    private static getBlackListedTiles(player: Player, requestedTile: Location): boolean {
        return [new Location(1, 1, 0)].find(t => t.equals(requestedTile)) !== undefined;
    }

    public static checkTile(tile: Location): void {
        barricades.forEach(t => {
            if (t.equals(tile)) {
                RegionManager.removeClipping(t.getX(), t.getY(), t.getZ(), 0x200000, null);
                barricades.delete(t);
            }
        });
    }

    public static canSetup(player: Player): boolean {
        const tile: Location = player.getLocation();
        const existsAtTile: boolean = barricades.find(t => t.equals(tile)) !== undefined;
        if (existsAtTile) {
            player.getPacketSender().sendMessage("You can't set up a barricade here.");
            return true;
        }
        if (RegionManager.getClipping(tile.getX(), tile.getY(), tile.getZ(), player.getPrivateArea()) !== 0) {
            player.getPacketSender().sendMessage("You can't set up a barricade here.");
            return true;
        }
        this.deploy(player);
        return true;
    }
    private static handleTinderbox(player: Player, npc: NPC) {
        if (npc.barricadeOnFire) {
            player.getPacketSender().sendMessage("This barricade is already on fire!");
            return;
        }
        if (!player.getInventory().contains(590)) {
            player.getPacketSender().sendMessage("You need a tinderbox to set the barricade on fire.");
            return;
        }

        player.performAnimation(Firemaking.LIGHT_FIRE);
        Sounds.sendSound(player, Sound.FIRE_FIRST_ATTEMPT);

        TaskManager.submit(new Task(3, player, false) {
            protected execute() {
                npc.setNpcTransformationId(NPC_ID_BURNING);
                npc.barricadeOnFire = true;
                player.getSkillManager().addExperience(Skill.FIREMAKING, FIREMAKING_EXPERIENCE);
                player.performAnimation(Animation.DEFAULT_RESET_ANIMATION);
                this.stop();
            }
        });
    }

    private static handleBucketOfWater(player: Player, npc: NPC) {
        if (!npc.barricadeOnFire) {
            player.getPacketSender().sendMessage("This barricade is not on fire.");
            return;
        }
        if (!player.getInventory().contains(1929)) {
            player.getPacketSender().sendMessage("You need a bucket of water to extinguish the fire.");
            return;
        }
        player.getInventory().delete(new Item(1929, 1));
        player.getInventory().add(new Item(1925, 1));
        npc.setNpcTransformationId(NPC_ID);
        npc.barricadeOnFire = false;
        player.getPacketSender().sendMessage("You put out the fire!");
    }

    /**
     * Upon placing and passing successful checks.
     * @param player
     */
    private static deploy(player: Player) {
        let tile = player.getLocation();
        RegionManager.addClipping(tile.getX(), tile.getY(), tile.getZ(), 0x200000, player.getPrivateArea());
        player.getInventory().delete(ITEM_ID, 1);
        barricades.add(tile);
        World.getAddNPCQueue().add(new NPC(NPC_ID, tile.clone()));
        Sounds.sendSound(player, Sound.PICK_UP_ITEM);
    }

    public static handleInteractiveOptions(player: Player, npc: NPC, opcode: number): boolean {
        let isBarricade = [NPC_ID, NPC_ID_BURNING].some((n) => n === npc.getId());
        if (!isBarricade) {
            return false;
        }
        if (opcode === 17) {
            /**
             * Option 2 (BURN/EXTINGUISH)
             */
            if (npc.barricadeOnFire) {
                handleBucketOfWater(player, npc);
                return true;
            }
            handleTinderbox(player, npc);
            return true;
        }
        return false;
    }

    public static itemOnBarricade(player: Player, npc: NPC, item: Item): boolean {
        switch (item.getId()) {
            case 590:
                handleTinderbox(player, npc);
                return true;
            case 1929:
                handleBucketOfWater(player, npc);
                return true;
            default:
                return false;
        }
    }
}