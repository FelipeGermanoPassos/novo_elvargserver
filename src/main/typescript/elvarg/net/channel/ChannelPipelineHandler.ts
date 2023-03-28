import { PlayerSession } from "../PlayerSession"; 
import { ChannelFilter } from "./ChannelFilter";
import { ChannelEventHandler } from "./ChannelEventHandler";
import { LoginDecoder } from "../codec/LoginDecoder";
import { LoginEncoder } from "../codec/LoginEncoder";
import * as websocket from "ws";
import * as io from 'socket.io';
import { NetworkConstants } from "../NetworkConstants";

/**

Handles a channel's events.
*/
export class ChannelPipelineHandler {
    /*
    The part of the pipeline that limits connections and checks for any banned hosts.
    */
    private readonly FILTER: ChannelFilter = new ChannelFilter();


    /**
    
    The part of the pipeline that handles exceptions caught, channels being read, inactive
    channels, and channel-triggered events.
    */
    private readonly HANDLER: ChannelEventHandler = new ChannelEventHandler(io);
    public async initChannel(channel: any): Promise<void> {
        const pipeline = channel.pipeline();


        channel.attr(NetworkConstants.SESSION_KEY).setIfAbsent(new PlayerSession(channel));

        pipeline.addLast("channel-filter", this.FILTER);
        pipeline.addLast("decoder", new LoginDecoder());
        pipeline.addLast("encoder", new LoginEncoder());
        pipeline.addLast("timeout", new websocket.IdleStateHandler(NetworkConstants.SESSION_TIMEOUT, 0, 0));
        pipeline.addLast("channel-handler", this.HANDLER);
    }
}