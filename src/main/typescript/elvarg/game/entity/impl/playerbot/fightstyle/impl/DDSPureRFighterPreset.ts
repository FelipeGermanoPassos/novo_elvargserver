interface DDSPureRFighterPreset implements FighterPreset {
    BOT_DDS_PURE_R_73: Presetable = {
        name: "DDS Pure (R)",
        items: [
            { name: RUNE_CROSSBOW },
            { name: DRAGON_BOLTS_E_, quantity: 75 },
            { name: RANGING_POTION_4_ },
            { name: SUPER_STRENGTH_4_ },
            { name: COOKED_KARAMBWAN },
            { name: DRAGON_DAGGER_P_PLUS_PLUS_ },
            { name: COOKED_KARAMBWAN },
            { name: COOKED_KARAMBWAN },
            { name: COOKED_KARAMBWAN },
            { name: MANTA_RAY },
            { name: MANTA_RAY },
            { name: MANTA_RAY },
            { name: COOKED_KARAMBWAN },
            { name: MANTA_RAY },
            { name: MANTA_RAY },
            { name: MANTA_RAY },
            { name: COOKED_KARAMBWAN },
            { name: MANTA_RAY },
            { name: MANTA_RAY },
            { name: MANTA_RAY },
            { name: COOKED_KARAMBWAN },
            { name: MANTA_RAY },
            { name: RING_OF_RECOIL },
            { name: ANGLERFISH }
        ],
        equipment: [
            { name: COIF },
            { name: AVAS_ACCUMULATOR },
            { name: MAGIC_SHORTBOW },
            { name: AMULET_OF_GLORY },
            { name: LEATHER_BODY },
            null,
            { name: BLACK_DHIDE_CHAPS },
            { name: MITHRIL_GLOVES },
            { name: CLIMBING_BOOTS },
            { name: RING_OF_RECOIL },
            { name: RUNE_ARROW, quantity: 75 }
        ],
        combat: {
            atk: 60,
            def: 1,
            str: 99,
            hp: 85,
            range: 99,
            pray: 1,
            mage: 1
        },
        spellbook: MagicSpellbook.NORMAL,
        special: true
    }

    COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch(new number[]{ DRAGON_DAGGER_P_PLUS_PLUS_ }) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return playerBot.getSpecialPercentage() >= 25 &&
                    enemy.getHitpoints() < 45;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch(new int[]{ RUNE_CROSSBOW, DRAGON_BOLTS_E_ }) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return enemy.getHitpoints() < 40;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch(new int[]{ MAGIC_SHORTBOW, RUNE_ARROW }) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return true;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }
        },
    ];
    getItemPreset(): Presetable {
    return BOT_DDS_PURE_R_73;
}

    getCombatActions(): CombatAction[] {
        return COMBAT_ACTIONS;
    }
}