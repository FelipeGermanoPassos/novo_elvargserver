interface FighterPreset {
    getItemPreset(): Presetable;
    getCombatActions(): CombatAction[];
    eatAtPercent(): number{
        return 40;
    }
    }