import { PlayerSession } from "./PlayerSession";
import { Player } from "../game/entity/impl/player/Player";

export class PlayerBotSession extends PlayerSession {
    private player: Player;

    constructor() {
        super(new (class extends SocketChannel {
            public parent(): ServerSocketChannel { return null; }
            public config(): SocketChannelConfig { return null; }
            public localAddress(): InetSocketAddress { return null; }
            public remoteAddress(): InetSocketAddress { return null; }
            public isInputShutdown(): boolean { return false; }
            public shutdownInput(): ChannelFuture { return null; }
            public shutdownInput(ChannelPromise channelPromise): ChannelFuture { return null; }
            public isOutputShutdown(): boolean { return false; }
            public shutdownOutput(): ChannelFuture { return null; }
            public shutdownOutput(ChannelPromise channelPromise): ChannelFuture { return null; }
            public isShutdown(): boolean { return false; }
            public shutdown(): ChannelFuture { return null; }
            public shutdown(ChannelPromise channelPromise): ChannelFuture { return null; }
            public ChannelId id() { return null; }
            public eventLoop(): EventLoop { return null; }
            public isOpen(): boolean { return false; }
            public isRegistered(): boolean { return false; }
            public isActive(): boolean { return false; }
            public metadata(): ChannelMetadata { return null; }
            public closeFuture(): ChannelFuture { return null; }
            public isWritable(): boolean { return false; }
            public bytesBeforeUnwritable(): long { return 0; }
            public bytesBeforeWritable(): long { return 0; }
            public unsafe(): Unsafe { return null; }
            public pipeline(): ChannelPipeline { return null; }
            public alloc(): ByteBufAllocator { return null; }
            public read(): Channel { return null; }
            public flush(): Channel { return null; }
            public bind(SocketAddress socketAddress): ChannelFuture { return null; }
            public connect(SocketAddress socketAddress): ChannelFuture { return null; }
            public connect(SocketAddress socketAddress, SocketAddress socketAddress1): ChannelFuture { return null; }
            public disconnect(): ChannelFuture { return null; }
            public close(): ChannelFuture { return null; }
            public deregister(): ChannelFuture { return null; }
            public bind(SocketAddress socketAddress, ChannelPromise channelPromise): ChannelFuture { return null; }
            public connect(SocketAddress socketAddress, ChannelPromise channelPromise): ChannelFuture { return null; }
            public connect(SocketAddress socketAddress, SocketAddress socketAddress1, ChannelPromise channelPromise): ChannelFuture { return null; }
            public disconnect(ChannelPromise channelPromise): ChannelFuture { return null; }
            public close(ChannelPromise channelPromise): ChannelFuture { return null; }
            public deregister(ChannelPromise channelPromise): ChannelFuture { return null; }
            public write(Object o): ChannelFuture { return null; }
            public write(Object o, ChannelPromise channelPromise): ChannelFuture { return null; }
            public writeAndFlush(Object o, ChannelPromise channelPromise): ChannelFuture { return null; }
            public writeAndFlush(Object o): ChannelFuture { return null; }
            public newPromise(): ChannelPromise { return null; }
            public newProgressivePromise(): ChannelProgressivePromise { return null; }
            public newSucceededFuture(): ChannelFuture { return null; }
            public newFailedFuture(Throwable throwable): ChannelFuture { return null; }
            public voidPromise(): ChannelPromise { return null; }
            public attr<T>(attributeKey: AttributeKey<T>): Attribute<T> { return null; }
            public hasAttr<T>(attributeKey: AttributeKey<T>): boolean { return false; }
            public compareTo(o: Channel): number { return 0; }
        })());
    }
}
