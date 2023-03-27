"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelEventHandler = void 0;
var NetworkConstants_1 = require("../NetworkConstants");
var World_1 = require("../../game/World");
var ChannelEventHandler = /** @class */ (function () {
    function ChannelEventHandler(socket) {
        this.socket = socket;
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('error', this.onError.bind(this));
    }
    ChannelEventHandler.prototype.onMessage = function (data) {
        try {
            var session = this.socket[NetworkConstants_1.NetworkConstants.SESSION_KEY];
            if (!session) {
                return;
            }
            if (typeof data === 'string') {
                // Handle string messages
            }
            else {
                // Handle binary messages
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    ChannelEventHandler.prototype.onClose = function () {
        var session = this.socket[NetworkConstants_1.NetworkConstants.SESSION_KEY];
        if (!session || !session.getPlayer()) {
            return;
        }
        var player = session.getPlayer();
        if (player.isRegistered()) {
            if (!World_1.World.getRemovePlayerQueue().includes(player)) {
                // Close all open interfaces..
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }
                // After 60 seconds, force a logout.
                player.getForcedLogoutTimer().start(60);
                // Add player to logout queue.
                World_1.World.getRemovePlayerQueue().push(player);
            }
        }
    };
    ChannelEventHandler.prototype.onError = function (error) {
        console.error(error);
        this.socket.close();
    };
    return ChannelEventHandler;
}());
exports.ChannelEventHandler = ChannelEventHandler;
//# sourceMappingURL=ChannelEventHandler.js.map