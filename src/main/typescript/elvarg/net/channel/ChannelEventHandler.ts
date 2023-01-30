import { ChannelHandlerContext } from 'netty';
import { NetworkConstants } from './network';
import { Player } from './entity/player';
import { World } from './game';

export class ChannelEventHandler {
    public channelInactive(ctx: ChannelHandlerContext) {
        let session = ctx.channel().attr(NetworkConstants.SESSION_KEY).get();

        if (!session || !session.getPlayer()) {
            return;
        }

        let player = session.getPlayer();

        if (player.isRegistered()) {
            if (!World.getRemovePlayerQueue().includes(player)) {
                // Close all open interfaces..
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }

                // After 60 seconds, force a logout.
                player.getForcedLogoutTimer().start(60);

                // Add player to logout queue.
                World.getRemovePlayerQueue().add(player);
            }
        }
    }

    public exceptionCaught(ctx: ChannelHandlerContext, t: Error) {
        if (!(t instanceof IOError)) {
            console.log(t);
        }

        try {
            ctx.channel().close();
        } catch (e) { }
    }
}
