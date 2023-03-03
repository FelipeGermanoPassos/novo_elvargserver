import {CastleWars} from '../../../../content/minigames/impl/CastleWars';
import {Lanthus} from '../../../../entity/impl/npc/impl/Lanthus';
import {Player} from '../../../../entity/impl/player/Player'
import {PlayerBot} from '../../../../entity/impl/playerbot/PlayerBot'
import {Arrays} from 'collections'
import {Boundary} from '../../../../model/Boundary';
import {Area} from '../../../../model/areas/Area';
import {obj} from  '../../../../../util/ObjectIdentifiers';



export class CastleWarsLobbyArea extends Area {
    private lanthus: Lanthus;

    constructor() {
        super(Arrays.asList(new Boundary(2435, 2446, 3081, 3098,0)));
    }

    public getName(): string {
        return "the Castle Wars Lobby";
    }

    public handleObjectClick(player: Player, objectId: number, type: number): boolean {
        switch (objectId) {
            case obj.ZAMORAK_PORTAL:
                CastleWars.addToWaitingRoom(player, CastleWars.Team.ZAMORAK);
                return true;

            case obj.SARADOMIN_PORTAL:
                CastleWars.addToWaitingRoom(player, CastleWars.Team.SARADOMIN);
                return true;

            case obj.GUTHIX_PORTAL:
                CastleWars.addToWaitingRoom(player, CastleWars.Team.GUTHIX);
                return true;

            case obj.CASTLEWARS_BANK_CHEST:
                if (type === 1) {
                    player.getBank(player.getCurrentBankTab()).open();
                } else {
                    player.getPacketSender().sendMessage("The Grand Exchange is not available yet.");
                }

                return true;
        }

        return false;
    }

    public canPlayerBotIdle(playerBot: PlayerBot): boolean {
        // Allow Player Bots to idle here
        return true;
    }

    public getLanthus(): Lanthus {
        return this.lanthus;
    }

    public setLanthus(lanthus: Lanthus): void {
        this.lanthus = lanthus;
    }
}