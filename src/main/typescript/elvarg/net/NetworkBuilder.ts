import { ServerBootstrap } from 'netty';
import { NioEventLoopGroup } from 'netty';
import { SocketChannel } from 'netty';
import { NioServerSocketChannel } from 'netty';
import { ResourceLeakDetector } from 'netty';
import { Level } from 'netty';
import { ChannelInitializer } from 'netty';
import { ChannelPipelineHandler } from './channelPipelineHandler';

export class NetworkBuilder {
    private readonly bootstrap = new ServerBootstrap();
    private readonly loopGroup = new NioEventLoopGroup();
    private readonly channelInitializer = new ChannelPipelineHandler();
    public initialize(port: number): void {
        ResourceLeakDetector.setLevel(Level.DISABLED);
        this.bootstrap.group(this.loopGroup);
        this.bootstrap.channel(NioServerSocketChannel);
        this.bootstrap.childHandler(this.channelInitializer);
        this.bootstrap.bind(port).syncUninterruptibly();
    }
}

//TODO: Trocar Netty pelo socket.io