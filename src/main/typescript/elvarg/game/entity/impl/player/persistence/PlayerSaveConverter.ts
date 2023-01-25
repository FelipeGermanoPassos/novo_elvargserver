import{JacksonAttributeConverter} from '../JacksonAttributeConverter'
import {PlayerSave} from './PlayerSave'

class PlayerSaveConverter extends JacksonAttributeConverter<PlayerSave> {
    constructor() {
        super(PlayerSave);
    }
}
