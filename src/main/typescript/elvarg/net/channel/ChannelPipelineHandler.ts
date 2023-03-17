import { ChannelInitializer, socket } from 'netty';
import { NetworkConstants } from './network';
import { PlayerSession } from './session';
import { LoginDecoder } from './decoder';
import { LoginEncoder } from './encoder';
import { IdleStateHandler } from 'netty';
import { ChannelFilter } from './ChannelFilter';
import { ChannelEventHandler } from './ChannelEventHandler';
import { SocketChannel } from 'netty';

export class ChannelPipelineHandler extends ChannelInitializer<SocketChannel> {
    private readonly FILTER = new ChannelFilter();
    private readonly HANDLER = new ChannelEventHandler();

    protected initChannel(channel: socket.SocketChannel) {
        let pipeline = channel.pipeline();

        channel.attr(NetworkConstants.SESSION_KEY).setIfAbsent(new PlayerSession(channel));

        pipeline.addLast("channel-filter", this.FILTER);
        pipeline.addLast("decoder", new LoginDecoder());
        pipeline.addLast("encoder", new LoginEncoder());
        pipeline.addLast("timeout", new IdleStateHandler(NetworkConstants.SESSION_TIMEOUT, 0, 0));
        pipeline.addLast("channel-handler", this.HANDLER);
    }
}
