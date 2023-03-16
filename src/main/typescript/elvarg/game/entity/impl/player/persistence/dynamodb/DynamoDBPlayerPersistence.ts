import { Player, PlayerBot } from "../player/Player";
import { PlayerPersistence } from "./PlayerPersistence";
import { PlayerSave } from "./PlayerSave";
import * as AWS from "aws-sdk";
import { DynamoDbTable, DynamoDbEnhancedClient } from "aws-sdk-lib";
import { PlayerSaveRecord } from "./PlayerSaveRecord";
import { TableSchema } from 'tableschema'

export class DynamoDBPlayerPersistence extends PlayerPersistence {
    private static dynamoDbClient = new AWS.DynamoDB({ region: "eu-west-1" });
    private static enhancedClient = new DynamoDbEnhancedClient({ client: DynamoDBPlayerPersistence.dynamoDbClient });
    private static playerTableName = process.env.PLAYER_TABLE_NAME;

    private static readonly PLAYER_SAVE_TABLE_SCHEMA = TableSchema.fromObject(PlayerSaveRecord);

    public save(player: Player): void {
        if (player instanceof PlayerBot) {
            return;
        }

        const playerSave = PlayerSave.fromPlayer(player);
        const playerTable: DynamoDbTable<PlayerSaveRecord> = DynamoDBPlayerPersistence.enhancedClient.table(
            DynamoDBPlayerPersistence.playerTableName,
            DynamoDBPlayerPersistence.PLAYER_SAVE_TABLE_SCHEMA
        );

        playerTable.putItem({
            username: player.username,
            playerSave,
            timestamp: new Date().toISOString()
        });
    }

    public load(username: string): PlayerSave | null {
        const playerTable: DynamoDbTable<PlayerSaveRecord> = DynamoDBPlayerPersistence.enhancedClient.table(
            DynamoDBPlayerPersistence.playerTableName,
            DynamoDBPlayerPersistence.PLAYER_SAVE_TABLE_SCHEMA
        );

        const playerSaveRecord = playerTable.getItem({ partitionKey: { username } });

        if (!playerSaveRecord) {
            return null;
        }

        return playerSaveRecord.playerSave;
    }

    public exists(username: string): boolean {
        // Have to do it properly later. Have to make sure we dont block main loop
        return true;
    }
}