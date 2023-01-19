import * as Player from "../../Player";
import * as PlayerPersistence from "../PlayerPersistence";
import * as PlayerSave from "../PlayerSave";
import * as PlayerBoth from "../../../playerbot/PlayerBot";



export class DynamoDBPlayerPersistence extends PlayerPersistence {

    private static DynamoDbClient dynamoDbClient = DynamoDbClient.builder().region(Region.EU_WEST_1).build();
    private static DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.builder().dynamoDbClient(dynamoDbClient).build();
    private static playerTableName: string = Window.getenv("PLAYER_TABLE_NAME");

    const Player = new Player();

    @Override
    public save(player: Player): void {
        if (player instanceof PlayerBot) {
            return;
        }
        var Date = new Date();

        var playerSave = PlayerSave.fromPlayer(player);
        DynamoDbTable < PlayerSaveRecord > playerTable = enhancedClient.table(playerTableName, PLAYER_SAVE_TABLE_SCHEMA);

        playerTable.putItem(new PlayerSaveRecord(player.getUsername(), playerSave, Date.gethours()));
    }

    @Override
    public PlayerSave(username: string) {
        DynamoDbTable < PlayerSaveRecord > playerTable = enhancedClient.table(playerTableName, PLAYER_SAVE_TABLE_SCHEMA);

        var PlayerSaveRecord = playerTable.getItem(Key.builder().partitionValue(username).build());

        if (PlayerSaveRecord == null) {
            return null;
        }

        return playerSaveRecord.getPlayerSave();
    }

    @Override
    public exists(username: string): boolean {
        return true;
    }

}