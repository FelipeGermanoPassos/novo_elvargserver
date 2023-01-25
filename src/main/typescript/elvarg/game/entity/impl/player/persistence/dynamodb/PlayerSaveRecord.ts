import { PlayerSave } from './PlayerSave';
import { PlayerSaveConverter } from './PlayerSaveConverter';
import { DynamoDbAttribute, DynamoDbBean, DynamoDbConvertedBy, DynamoDbPartitionKey } from 'aws-sdk-lib'

@DynamoDbBean
export class PlayerSaveRecord {
    private username: string;
    private playerSave: PlayerSave;
    private updatedAt: Date;

    constructor(username: string, playerSave: PlayerSave, updatedAt: Date) {
        this.username = username;
        this.playerSave = playerSave;
        this.updatedAt = updatedAt;
    }

    @DynamoDbPartitionKey()
    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    @DynamoDbAttribute("playerSave")
    @DynamoDbConvertedBy(PlayerSaveConverter)
    public getPlayerSave(): PlayerSave {
        return this.playerSave;
    }

    public setPlayerSave(playerSave: PlayerSave): void {
        this.playerSave = playerSave;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setUpdatedAt(updatedAt: Date): void {
        this.updatedAt = updatedAt;
    }
}