import { PlayerSave } from './PlayerSave';
import { Player } from '../Player';
import { PlayerPersistence } from './PlayerPersistence';
import { Misc } from '../../../util/Misc';
import { Gson, GsonBuilder } from 'google-gson';
import { FileReader, FileWriter, File } from 'file-io';
import { Path, Paths } from 'node-path';

export class JSONFilePlayerPersistence extends PlayerPersistence {
    private static PATH = './data/saves/characters/';
    private static BUILDER = new GsonBuilder().create();

    public load(username: string): PlayerSave {
        if (!this.exists(username)) {
            return null;
        }

        const path: Path = Paths.get(JSONFilePlayerPersistence.PATH, username + '.json');
        const file: File = path.toFile();

        try (const fileReader = new FileReader(file)) {
            return JSONFilePlayerPersistence.BUILDER.fromJson(fileReader, PlayerSave);
        } catch (e) {
            throw new Error(e);
        }
    }

    public save(player: Player): void {
        const save: PlayerSave = PlayerSave.fromPlayer(player);

        const path: Path = Paths.get(JSONFilePlayerPersistence.PATH, player.getUsername() + '.json');
        const file: File = path.toFile();
        this.setupDirectory(file);

        const builder = new GsonBuilder().setPrettyPrinting().create();

        try (const writer = new FileWriter(file)) {
            writer.write(builder.toJson(save));
        } catch (e) {
            throw new Error(e);
        }
    }

    public exists(username: string): boolean {
        const formattedUsername = Misc.formatPlayerName(username.toLowerCase());
        return new File(JSONFilePlayerPersistence.PATH + formattedUsername + '.json').exists();
    }

    public encryptPassword(plainPassword: string): string {
        // TODO: Fix password encryption for JSON
        return plainPassword;
    }

    public checkPassword(plainPassword: string, playerSave: PlayerSave): boolean {
        // TODO: Fix password encryption for JSON
        return plainPassword === playerSave.getPasswordHashWithSalt();
    }

    private setupDirectory(file: File): void {
        file.getParentFile().setWritable(true);
        if (!file.getParentFile().exists()) {
            try {
                file.getParentFile().mkdirs();
            } catch (e) {
                throw new Error(e);
            }
        }
    }
}