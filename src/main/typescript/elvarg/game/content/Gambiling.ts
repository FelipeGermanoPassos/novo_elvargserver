import { Player } from '../entity/impl/player/Player';
import { ObjectManager } from '../entity/impl/object/ObjectManager';
import { MovementQueue } from '../model/movement/MovementQueue';
import { TaskManager } from '../task/TaskManager';
class Gambling {
    public static MITHRIL_SEEDS = 299;

    public static plantFlower(player: Player) {
        if (!player.getClickDelay().elapsed(3000)) {
            return;
        }
        for (let npc of player.getLocalNpcs()) {
            if (npc != null && npc.getLocation().equals(player.getLocation())) {
                player.getPacketSender().sendMessage("You cannot plant a seed right here.");
                return;
            }
        }
        if (ObjectManager.exists(player.getLocation())) {
            player.getPacketSender().sendMessage("You cannot plant a seed right here.");
            return;
        }
        const flowers = FlowersData.generate();
        const flowerObject = new GameObject(flowers.objectId, player.getLocation().clone(), 10, 0, player.getPrivateArea());

        //Stop skilling..
        player.getSkillManager().stopSkillable();
        player.getMovementQueue().reset();
        player.getInventory().delete(Gambling.MITHRIL_SEEDS, 1);
        player.performAnimation(new Animation(827));
        player.getPacketSender().sendMessage("You plant the seed and suddenly some flowers appear..");
        MovementQueue.clippedStep(player);
        //Start a task which will spawn and then delete them after a period of time.
        TaskManager.submit(new TimedObjectSpawnTask(flowerObject, 60, Optional.empty()));
        player.setPositionToFace(flowerObject.getLocation());
        player.getClickDelay().reset();
    }

    forObject(object: number) {
        for (const data of Object.values(FlowersData)) {
            if (data.objectId === object) {
                return data;
            }
        }
        return null;
    }

    generate() {
        const RANDOM = Math.random() * 100;
        if (RANDOM >= 1) {
            return FlowersData[Math.floor(Math.random() * 7)];
        } else {
            return Math.floor(Math.random() * 3) === 1 ? FlowersData.WHITE_FLOWERS : FlowersData.BLACK_FLOWERS;
        }
    }

}

let FlowersData: {
    PASTEL_FLOWERS: { objectId: 2980, itemId: 2460 },
    RED_FLOWERS: { objectId: 2981, itemId: 2462 },
    BLUE_FLOWERS: { objectId: 2982, itemId: 2464 },
    YELLOW_FLOWERS: { objectId: 2983, itemId: 2466 },
    PURPLE_FLOWERS: { objectId: 2984, itemId: 2468 },
    ORANGE_FLOWERS: { objectId: 2985, itemId: 2470 },
    RAINBOW_FLOWERS: { objectId: 2986, itemId: 2472 },
    WHITE_FLOWERS: { objectId: 2987, itemId: 2474 },
    BLACK_FLOWERS: { objectId: 2988, itemId: 2476 }
}

