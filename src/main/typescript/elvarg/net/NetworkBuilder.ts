import { ServerBootstrap } from 'socket.io';
import { NioEventLoopGroup } from 'socket.io';
import { SocketChannel } from 'socket.io';
import { NioServerSocketChannel } from 'socket.io';
import { ResourceLeakDetector } from 'socket.io';
import { Level } from 'socket.io';
import { ChannelInitializer } from 'socket.io';
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