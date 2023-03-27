import WebSocket from 'ws';
import { NetworkConstants } from '../NetworkConstants';
import { World } from '../../game/World';

export class ChannelEventHandler {

    private socket: WebSocket;

    constructor(socket: WebSocket) {
        this.socket = socket;
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('error', this.onError.bind(this));
    }

    private onMessage(data: WebSocket.Data) {
        try {
            const session = this.socket[NetworkConstants.SESSION_KEY];

            if (!session) {
                return;
            }

            if (typeof data === 'string') {
                // Handle string messages
            } else {
                // Handle binary messages
            }

        } catch (e) {
            console.error(e);
        }
    }

    private onClose() {
        const session = this.socket[NetworkConstants.SESSION_KEY];

        if (!session || !session.getPlayer()) {
            return;
        }

        const player = session.getPlayer();

        if (player.isRegistered()) {
            if (!World.getRemovePlayerQueue().includes(player)) {
                // Close all open interfaces..
                if (player.busy()) {
                    player.getPacketSender().sendInterfaceRemoval();
                }

                // After 60 seconds, force a logout.
                player.getForcedLogoutTimer().start(60);

                // Add player to logout queue.
                World.getRemovePlayerQueue().push(player);
            }
        }
    }

    private onError(error: Error) {
        console.error(error);
        this.socket.close();
    }

}
