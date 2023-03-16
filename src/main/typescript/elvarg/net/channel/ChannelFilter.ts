import { ChannelInboundHandlerAdapter } from 'netty';
import { ByteBufUtils } from '../ByteBufUtils';
import { NetworkConstants } from './network';
import { LoginDecoder } from './decoder';
import { LoginResponses } from './login';
import { Multiset } from 'google-collections';
import { ChannelHandlerContext } from 'node-netty';

export class ChannelFilter extends ChannelInboundHandlerAdapter {
    private connections = new Multiset<string>();

    public channelRegistered(ctx: ChannelHandlerContext) {
        let host = ByteBufUtils.getHost(ctx.channel());

        // if this local then, do nothing and proceed to next handler in the pipeline.
        if (host.toLowerCase() === "127.0.0.1") {
            return;
        }

        // add the host
        this.connections.add(host);

        // evaluate the amount of connections from this host.
        if (this.connections.count(host) > NetworkConstants.CONNECTION_LIMIT) {
            LoginDecoder.sendLoginResponse(ctx, LoginResponses.LOGIN_CONNECTION_LIMIT);
            return;
        }

        //CHECK BANS

        // Nothing went wrong, so register the channel and forward the event to next handler in the
        // pipeline.

        ctx.fireChannelRegistered();
    }

    public channelUnregistered(ctx: ChannelHandlerContext) {
        let host = ByteBufUtils.getHost(ctx.channel());

        // if this is local, do nothing and proceed to next handler in the pipeline.
        if (host.toLowerCase() === "127.0.0.1") {
            return;
        }

        // remove the host from the connection list
        this.connections.remove(host);

        // the connection is unregistered so forward the event to the next handler in the pipeline.
        ctx.fireChannelUnregistered();
    }
}
