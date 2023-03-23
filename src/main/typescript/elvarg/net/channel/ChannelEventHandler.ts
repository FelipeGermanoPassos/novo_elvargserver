import { ChannelHandlerContext } from 'socket.io'
import { NetworkConstants } from '../NetworkConstants';
import { World } from '../../game/World';

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
                World.getRemovePlayerQueue().push(player);
            }
        }
    }

    public exceptionCaught(ctx: ChannelHandlerContext, t: Error) {
        if (!(t instanceof Error)) {
            console.log(t);
        }

        try {
            ctx.channel().close();
        } catch (e) { }
    }
}
