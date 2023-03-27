import { Player } from '../game/entity/impl/player/Player';
import { World } from '../game/World';
import { PacketDecoder } from './codec/PacketDecoder';
import { PacketEncoder } from './codec/PacketEncoder';
import { LoginDetailsMessage } from './login/LoginDetailsMessage';
import { LoginResponsePacket } from './login/LoginResponsePacket';
import { LoginResponses } from './login/LoginResponses';
import { Packet } from './packet/Packet';
import { PacketBuilder } from './packet/PacketBuilder';
import { PacketConstants } from './packet/PacketConstants';
import { Misc } from '../util/Misc';
import { NetworkConstants } from './NetworkConstants';
import { SocketIO } from 'ws';
import { PlayerRights } from '../game/model/rights/PlayerRights';
import { Channel } from 'ws'

export class PlayerSession {
    private packetsQueue: Packet[] = [];
    private lastPacketOpcodeQueue: number[] = [];
    private channel: SocketIO.Socket;
    public player: Player;

    constructor(channel: SocketIO.Socket) {
        this.channel = channel;
        this.player = new Player(this);
    }

    public async finalizeLogin(msg: LoginDetailsMessage) {
        let response = await LoginResponses.evaluate(this.player, msg);

        this.player.setLongUsername(Misc.stringToLong(this.player.getUsername()));

        this.channel.emit("login_response", new LoginResponsePacket(response, this.player.getRights()));

        if (response != LoginResponses.LOGIN_SUCCESSFUL) {
            this.channel.disconnect();
            return;
        }

        // Replace decoder/encoder to packets
        this.channel.pipeline().replace("encoder", "encoder", new PacketEncoder(msg.getEncryptor()));
        this.channel.pipeline().replace("decoder", "decoder", new PacketDecoder(msg.getDecryptor()));

        // Queue the login
        if (!World.getAddPlayerQueue().includes(this.player)) {
            World.getAddPlayerQueue().push(this.player);
        }
    }

    public queuePacket(msg: Packet) {
        if (PacketConstants.PACKETS[msg.getOpcode()] == null) {
            return;
        }

        let total_size = (this.packetsQueue.length);
        if (total_size >= NetworkConstants.PACKET_PROCESS_LIMIT) {
            return;
        }

        if (msg.getOpcode() == PacketConstants.EQUIP_ITEM_OPCODE
            || msg.getOpcode() == PacketConstants.SPECIAL_ATTACK_OPCODE) {
            this.packetsQueue.unshift(msg);
            return;
        }

        this.packetsQueue.push(msg);
    }

    public processPackets() {
        for (let i = 0; i < NetworkConstants.PACKET_PROCESS_LIMIT; i++) {
            let packet = this.packetsQueue.shift();
            if (packet == null) {
                continue;
            }
            if (this.lastPacketOpcodeQueue.length > 4) {
                this.lastPacketOpcodeQueue.shift();
            }
            this.lastPacketOpcodeQueue.push(packet.getOpcode());
            try {
                PacketConstants.PACKETS[packet.getOpcode()].execute(this.player, packet);
            } catch (e) {
                console.log("processedPackets: " + this.lastPacketOpcodeQueue);
                console.error(e);
            } finally {
                packet.getBuffer().release();
            }
        }
    }

    public write(builder: PacketBuilder) {
        if (!this.channel.connected) {
            return;
        }
        try {
            let packet = builder.toPacket();
            this.channel.emit("packet", packet);
        } catch (ex) {
            console.error(ex);
        }
    }

    public flush() {
        if (!this.channel.connected) {
            return;
        }
        this.channel.flush();
    }

    public getPlayer(): Player {
        return this.player;
    }

    public setPlayer(player: Player) {
        this.player = player;
    }

    public getChannel(): Channel {
        return this.channel;
    }
}
