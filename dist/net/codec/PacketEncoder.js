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
exports.PacketEncoder = void 0;
var ws_1 = require("ws");
var ws_2 = require("ws");
var PacketType_1 = require("../packet/PacketType");
var PacketEncoder = /** @class */ (function (_super) {
    __extends(PacketEncoder, _super);
    function PacketEncoder(encoder) {
        var _this = _super.call(this) || this;
        _this.CLIENTS_PACKET_SIZES = [
            0, 0, 0, 1, 6, 0, 0, 0, 4, 4,
            6, 2, -1, 1, 1, -1, 1, 0, 0, 0,
            0, 0, 0, 0, 1, 0, 0, -1, 1, 1,
            0, 0, 0, 0, -2, 4, 3, 0, 2, 0,
            0, 0, 0, 0, 7, 8, 0, 6, 0, 0,
            9, 8, 0, -2, 4, 1, 0, 0, 0, 0,
            -2, 1, 0, 0, 2, -2, 0, 0, 0, 0,
            6, 3, 2, 4, 2, 4, 0, 0, 0, 4,
            0, -2, 0, 0, 11, 2, 1, 6, 6, 0,
            0, 0, 0, 0, 0, 0, 0, 2, 0, 1,
            2, 2, 0, 1, -1, 8, 1, 0, 8, 0,
            1, 1, 1, 1, 2, 1, 5, 15, 0, 0,
            0, 4, 4, -1, 9, -1, -2, 2, 0, 0,
            -1, 0, 0, 0, 13, 0, 0, 1, 0, 0,
            3, 10, 2, 0, 0, 0, 0, 14, 0, 0,
            0, 4, 5, 3, 0, 0, 3, 0, 0, 0,
            4, 5, 0, 0, 2, 0, 6, 5, 0, 0,
            0, 5, -2, -2, 7, 5, 10, 6, 0, -2,
            0, 0, 0, 1, 1, 2, 1, -1, 0, 0,
            0, 0, 0, 0, 0, 2, -1, 0, -1, 0,
            4, 0, 0, 0, 0, 0, 3, 0, 4, 0,
            0, 0, 0, 0, -2, 7, 0, -2, 2, 0,
            0, 1, -2, -2, 0, 0, 0, 0, 0, 0,
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            2, -2, 0, 0, -1, 0, 6, 0, 4, 3,
            -1, 0, -1, -1, 6, 0, 0 //250
        ];
        _this.encoder = encoder;
        _this.CLIENT_PACKET_SIZES = [];
        return _this;
    }
    PacketEncoder.prototype.encode = function (ctx, packet, out) {
        var opcode = (packet.getOpcode() + this.encoder.nextInt()) & 0xFF;
        var type = packet.getType();
        var size = packet.getSize();
        if (type === PacketType_1.PacketType.FIXED) {
            var currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (size !== currSize) {
                console.error("{PacketEncoder} Opcode ".concat(packet.getOpcode(), " has defined size ").concat(currSize, " but is actually ").concat(size, "."));
                return;
            }
        }
        else if (type === PacketType_1.PacketType.VARIABLE) {
            var currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (currSize !== -1) {
                console.error("{PacketEncoder} Opcode ".concat(packet.getOpcode(), "'s size needs to be -1, it's currently ").concat(currSize, "."));
                return;
            }
        }
        else if (type === PacketType_1.PacketType.VARIABLE_SHORT) {
            var currSize = this.CLIENT_PACKET_SIZES[packet.getOpcode()];
            if (currSize !== -2) {
                console.error("{PacketEncoder} Opcode ".concat(packet.getOpcode(), "'s size needs to be -2, it's currently ").concat(currSize, "."));
                return;
            }
        }
        var finalSize = size + 1;
        switch (type) {
            case PacketType_1.PacketType.VARIABLE:
                if (size > 255) {
                    throw new Error("Tried to send packet length ".concat(size, " in variable-byte packet"));
                }
                finalSize++;
                break;
            case PacketType_1.PacketType.VARIABLE_SHORT:
                if (size > 65535) {
                    throw new Error("Tried to send packet length ".concat(size, " in variable-short packet"));
                }
                finalSize += 2;
                break;
            default:
                break;
        }
        var buffer = ws_1.Unpooled.buffer(finalSize);
        buffer.writeByte(opcode);
        switch (type) {
            case PacketType_1.PacketType.VARIABLE:
                buffer.writeByte(size);
                break;
            case PacketType_1.PacketType.VARIABLE_SHORT:
                buffer.writeShort(size);
                break;
            default:
                break;
        }
        // Write packet
        buffer.writeBytes(packet.getBuffer());
        // Write the packet to the out buffer
        out.writeBytes(buffer);
    };
    return PacketEncoder;
}(ws_2.MessageToByteEncoder));
exports.PacketEncoder = PacketEncoder;
//# sourceMappingURL=PacketEncoder.js.map