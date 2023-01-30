import { Presetable } from "../../../../content/presets/Presetable";
import { CombatAction } from "../fightstyle/CombatAction"

export interface FighterPreset {
    getItemPreset(): Presetable;
    getCombatActions(): CombatAction[];
    eatAtPercent(): number
}
export class FighterPreset{
    eatAtPercent(){
        return 40;
    }
}