"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDecoder = void 0;
var ws_1 = require("ws");
var Server_1 = require("../../Server");
var GameConstants_1 = require("../../game/GameConstants");
var ByteBufUtils_1 = require("../ByteBufUtils");
var NetworkConstants_1 = require("../NetworkConstants");
var LoginDetailsMessage_1 = require("../login/LoginDetailsMessage");
var LoginResponses_1 = require("../login/LoginResponses");
var IsaacRandom_1 = require("../security/IsaacRandom");
var Misc_1 = require("../../util/Misc");
var DiscordUtil_1 = require("../../util/DiscordUtil");
var big_integer_1 = require("big-integer");
var Random = require("seedrandom");
var LoginDecoderState;
(function (LoginDecoderState) {
    LoginDecoderState[LoginDecoderState["LOGIN_REQUEST"] = 0] = "LOGIN_REQUEST";
    LoginDecoderState[LoginDecoderState["LOGIN_TYPE"] = 1] = "LOGIN_TYPE";
    LoginDecoderState[LoginDecoderState["LOGIN"] = 2] = "LOGIN";
})(LoginDecoderState || (LoginDecoderState = {}));
var LoginDecoder = exports.LoginDecoder = /** @class */ (function (_super) {
    __extends(LoginDecoder, _super);
    function LoginDecoder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = LoginDecoderState.LOGIN_REQUEST;
        _this.hostAddressOverride = null;
        return _this;
    }
    LoginDecoder.sendLoginResponse = function (ctx, response) {
        var buffer = ws_1.Unpooled.buffer(1);
        buffer.writeByte(response);
        ctx.writeAndFlush(buffer).addListener(ws_1.ChannelFutureListener.CLOSE);
    };
    LoginDecoder.prototype.decode = function (ctx, buffer, out) {
        switch (this.state) {
            case LoginDecoderState.LOGIN_REQUEST:
                this.decodeRequest(ctx, buffer);
                break;
            case LoginDecoderState.LOGIN_TYPE:
                this.decodeType(ctx, buffer);
                break;
            case LoginDecoderState.LOGIN:
                this.decodeLogin(ctx, buffer, out);
                break;
        }
    };
    LoginDecoder.prototype.decodeRequest = function (ctx, buffer) {
        if (!buffer.isReadable()) {
            ctx.channel().close();
            return;
        }
        var request = buffer.readUnsignedByte();
        if (request != NetworkConstants_1.NetworkConstants.LOGIN_REQUEST_OPCODE) {
            console.log("Session rejected for bad login request id: ".concat(request));
            LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }
        if (buffer.isReadable(8)) {
            var secret = buffer.readInt();
            if (secret != LoginDecoder.SECRET_VALUE) {
                console.log("Invalid secret value given: ".concat(secret));
                LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_BAD_SESSION_ID);
                return;
            }
            var ip = buffer.readInt();
            this.hostAddressOverride = "".concat(ip & 0xff, ".").concat(ip >> 8 & 0xff, ".").concat(ip >> 16 & 0xff, ".").concat(ip >> 24 & 0xff);
        }
        // Send information to the client
        var buf = ws_1.Unpooled.buffer(1 + 8);
        buf.writeByte(0); // 0 = continue login
        buf.writeLong(LoginDecoder.random.next); // This long will be used for encryption later on
        ctx.writeAndFlush(buf);
        this.state = LoginDecoderState.LOGIN_TYPE;
    };
    LoginDecoder.prototype.decodeType = function (ctx, buffer) {
        if (!buffer.isReadable()) {
            ctx.channel().close();
            return;
        }
        var connectionType = buffer.readUnsignedByte();
        if (connectionType != NetworkConstants_1.NetworkConstants.NEW_CONNECTION_OPCODE && connectionType != NetworkConstants_1.NetworkConstants.RECONNECTION_OPCODE) {
            Server_1.Server.getLogger().info("Session rejected for bad connection type id: " + connectionType);
            LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_BAD_SESSION_ID);
            return;
        }
        this.state = LoginDecoderState.LOGIN;
    };
    LoginDecoder.prototype.decodeLogin = function (ctx, buffer, out) {
        if (!buffer.isReadable()) {
            ctx.channel().close();
            return;
        }
        var encryptedLoginBlockSize = buffer.readUnsignedByte();
        if (encryptedLoginBlockSize != buffer.readableBytes()) {
            Server_1.Server.getLogger().info("[host= ".concat(ctx.channel().remoteAddress(), "] encryptedLoginBlockSize != readable bytes"));
            LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
            return;
        }
        if (buffer.isReadable(encryptedLoginBlockSize)) {
            var magicId = buffer.readUnsignedByte();
            if (magicId != 0xFF) {
                Server_1.Server.getLogger().info("[host= ".concat(ctx.channel().remoteAddress(), "] [magic= ").concat(magicId, "] was rejected for the wrong magic value."));
                LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }
            var memory = buffer.readByte();
            if (memory != 0 && memory != 1) {
                Server_1.Server.getLogger().info("[host= ".concat(ctx.channel().remoteAddress(), "] was rejected for having the memory setting."));
                LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }
            var length_1 = buffer.readUnsignedByte();
            var rsaBytes = new Uint8Array(length_1);
            buffer.readBytes(rsaBytes);
            var rsaBuffer = ws_1.Unpooled.wrappedBuffer((0, big_integer_1.default)(Buffer.from(rsaBytes).toString('hex'), 16)
                .modPow(NetworkConstants_1.NetworkConstants.RSA_EXPONENT, NetworkConstants_1.NetworkConstants.RSA_MODULUS)
                .toArray(256));
            var securityId = rsaBuffer.readByte();
            if (securityId != 10 && securityId != 11) {
                Server_1.Server.getLogger().info("[host= ".concat(ctx.channel().remoteAddress(), "] was rejected for having the wrong securityId."));
                LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.LOGIN_REJECT_SESSION);
                return;
            }
            var clientSeed = rsaBuffer.readLong();
            var seedReceived = rsaBuffer.readLong();
            var seed = [(clientSeed >> 32), (clientSeed), (seedReceived >> 32), (seedReceived)];
            var decodingRandom = new IsaacRandom_1.IsaacRandom(seed);
            for (var i = 0; i < seed.length; i++) {
                seed[i] += 50;
            }
            var uid = rsaBuffer.readInt();
            if (uid != GameConstants_1.GameConstants.CLIENT_UID) {
                Server_1.Server.getLogger().info("[host= ".concat(ctx.channel().remoteAddress(), "] was rejected for having the wrong UID."));
                LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.OLD_CLIENT_VERSION);
                return;
            }
            var host = this.hostAddressOverride;
            if (host == null) {
                host = ByteBufUtils_1.ByteBufUtils.getHost(ctx.channel);
            }
            var rawUsername = ByteBufUtils_1.ByteBufUtils.readString(rsaBuffer);
            var password = ByteBufUtils_1.ByteBufUtils.readString(rsaBuffer);
            if (securityId == 10) {
                var username = Misc_1.Misc.formatText(rawUsername.toLowerCase());
                if (username.length < 3 || username.length > 30 || password.length < 3 || password.length > 30) {
                    LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                    return;
                }
                out.push(new LoginDetailsMessage_1.LoginDetailsMessage(ctx, username, password, host, new IsaacRandom_1.IsaacRandom(seed), decodingRandom));
            }
            else if (securityId == 11) {
                if (rawUsername == DiscordUtil_1.DiscordUtil.DiscordConstants.USERNAME_CACHED_TOKEN || rawUsername == DiscordUtil_1.DiscordUtil.DiscordConstants.USERNAME_AUTHZ_CODE) {
                    var msg = new LoginDetailsMessage_1.LoginDetailsMessage(ctx, rawUsername, password, host, new IsaacRandom_1.IsaacRandom(seed), decodingRandom);
                    msg.setDiscord(true);
                    out.push(msg);
                }
                else {
                    LoginDecoder.sendLoginResponse(ctx, LoginResponses_1.LoginResponses.INVALID_CREDENTIALS_COMBINATION);
                }
            }
        }
    };
    LoginDecoder.random = new Random();
    LoginDecoder.SECRET_VALUE = 345749224;
    return LoginDecoder;
}(ws_1.ByteToMessageDecoder));
//# sourceMappingURL=LoginDecoder.js.map