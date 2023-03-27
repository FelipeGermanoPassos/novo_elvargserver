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
exports.PacketDecoder = void 0;
var ws_1 = require("ws");
var Packet_1 = require("../packet/Packet");
var NetworkConstants_1 = require("../NetworkConstants");
var PacketDecoder = exports.PacketDecoder = /** @class */ (function (_super) {
    __extends(PacketDecoder, _super);
    function PacketDecoder(random) {
        var _this = _super.call(this) || this;
        _this.random = random;
        _this.opcode = -1;
        _this.size = -1;
        return _this;
    }
    PacketDecoder.prototype.decode = function (ctx, buffer, out) {
        var session = ctx.channel().attr(NetworkConstants_1.NetworkConstants.SESSION_KEY).get();
        if (session == null || session.getPlayer() == null) {
            return;
        }
        var opcode = this.opcode;
        var size = this.size;
        if (opcode == -1) {
            if (buffer.isReadable(1)) {
                opcode = buffer.readUnsignedByte();
                opcode = opcode - this.random.nextInt() & 0xFF;
                size = PacketDecoder.PACKET_SIZES[opcode];
                this.opcode = opcode;
                this.size = size;
            }
            else {
                buffer.discardReadBytes();
                return;
            }
        }
        if (size == -1) {
            if (buffer.isReadable()) {
                size = buffer.readUnsignedByte() & 0xFF;
                this.size = size;
            }
            else {
                buffer.discardReadBytes();
                return;
            }
        }
        if (buffer.isReadable(size)) {
            var data = new Uint8Array(size);
            buffer.readBytes(data);
            this.opcode = -1;
            this.size = -1;
            out.push(new Packet_1.Packet(opcode, data));
        }
    };
    PacketDecoder.PACKET_SIZES = [
        0, 0, 6, 1, -1, -1, 2, 4, 4, 4,
        4, -1, -1, -1, 8, 0, 6, 2, 2, 0,
        0, 2, 0, 6, 0, 12, 0, 0, 0, 0,
        9, 0, 0, 0, 0, 8, 4, 0, 0, 2,
        2, 6, 0, 8, 0, -1, 0, 0, 0, 1,
        0, 0, 0, 12, 0, 0, 0, 8, 0, 0,
        -1, 8, 0, 0, 0, 0, 0, 0, 0, 0,
        6, 0, 2, 2, 8, 6, 0, -1, 0, 6,
        -1, 0, 0, 0, 0, 1, 4, 6, 0, 0,
        0, 0, 0, 0, 0, 3, 0, 0, -1, 0,
        0, 13, 0, -1, -1, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 8, 0, 0,
        1, 0, 6, 0, 0, 0, -1, 0, 2, 8,
        0, 4, 6, 8, 0, 8, 0, 0, 6, 2,
        0, 0, 0, 0, 0, 8, 0, 0, 0, 0,
        0, 0, 1, 2, 0, 2,
    ];
    return PacketDecoder;
}(ws_1.ByteToMessageDecoder));
//# sourceMappingURL=PacketDecoder.js.map