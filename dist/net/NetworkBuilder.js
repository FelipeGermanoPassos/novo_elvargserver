"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkBuilder = void 0;
var ws_1 = require("ws");
var ws_2 = require("ws");
var ws_3 = require("ws");
var ws_4 = require("ws");
var ws_5 = require("ws");
var ChannelPipelineHandler_1 = require("../net/channel/ChannelPipelineHandler");
var NetworkBuilder = /** @class */ (function () {
    function NetworkBuilder() {
        this.bootstrap = new ws_1.ServerBootstrap();
        this.loopGroup = new ws_2.NioEventLoopGroup();
        this.channelInitializer = new ChannelPipelineHandler_1.ChannelPipelineHandler();
    }
    NetworkBuilder.prototype.initialize = function (port) {
        ws_4.ResourceLeakDetector.setLevel(ws_5.Level.DISABLED);
        this.bootstrap.group(this.loopGroup);
        this.bootstrap.channel(ws_3.NioServerSocketChannel);
        this.bootstrap.childHandler(this.channelInitializer);
        this.bootstrap.bind(port).syncUninterruptibly();
    };
    return NetworkBuilder;
}());
exports.NetworkBuilder = NetworkBuilder;
//TODO: Trocar Netty pelo socket.io
//# sourceMappingURL=NetworkBuilder.js.map