export class GRangerFighterPreset implements FighterPreset {
    const BOT_G_MAULER_70 = {
        name: "G Mauler (R)",
        items: [
            { name: "Rune crossbow" },
            { name: "Dragon bolts (e)", quantity: 75 },
            { name: "Ranging potion (4)" },
            { name: "Super strength (4)" },
            { name: "Cooked karambwan" },
            { name: "Granite maul" },
            { name: "Super restore (4)" },
            { name: "Super attack (4)" },
            { name: "Cooked karambwan" },
            { name: "Manta ray" },
            { name: "Saradomin brew (4)" },
            { name: "Monkfish" },
            { name: "Cooked karambwan" },
            { name: "Manta ray" },
            { name: "Manta ray" },
            { name: "Manta ray" },
            { name: "Cooked karambwan" },
            { name: "Manta ray" },
            { name: "Manta ray" },
            { name: "Manta ray" },
            { name: "Cooked karambwan" },
            { name: "Manta ray" },
            { name: "Ring of recoil" },
            { name: "Anglerfish" },
        ],
        equipment: [
            { name: "Coif" },
            { name: "Avas accumulator" },
            { name: "Magic shortbow" },
            { name: "Amulet of glory" },
            { name: "Leather body" },
            { name: "null" },
            { name: "Black dhide chaps" },
            { name: "Mithril gloves" },
            { name: "Climbing boots" },
            { name: "Ring of recoil" },
            { name: "Rune arrow", quantity: 75 },
        ],
        stats: {
            atk: 50,
            def: 1,
            str: 99,
            hp: 85,
            range: 99,
            pray: 1,
            mage: 1
        },
        spellbook: "NORMAL",
        specialAttack: true
    };

    const COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch([GRANITE_MAUL], {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return playerBot.getSpecialPercentage() >= 50 &&
                    // Don't switch to Melee if we're frozen
                    playerBot.getMovementQueue().getMobility().canMove() &&
                    // Switch if the enemy has enabled protect from missles or has lowish health
                    (!enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MELEE] && enemy.getHitpointsAfterPendingDamage() < 45);
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
                CombatSpecial.activate(playerBot);
                CombatSpecial.activate(playerBot);
            },
        }),
        new CombatSwitch([RUNE_CROSSBOW, DRAGON_BOLTS_E_], {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return enemy.getHitpoints() < 40;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            },
        }),
        new CombatSwitch([MAGIC_SHORTBOW, RUNE_ARROW], {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return true;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            },
        }),
    ];

    getItemPreset(): Presetable {
        return BOT_G_MAULER_70;
    }

    getCombatActions(): CombatAction[] {
        return COMBAT_ACTIONS;
    }
}    
    
    
    
    
            

]