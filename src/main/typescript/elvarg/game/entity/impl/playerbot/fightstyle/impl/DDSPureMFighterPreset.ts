class DDSPureMFighterPreset implements FighterPreset {
    private static BOT_DDS_PURE_M_73: Presetable = {
        name: "DDS Pure (M)",
        items: [
            { id: DRAGON_DAGGER_P_PLUS_PLUS_, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: SUPER_STRENGTH_4_, amount: 1 },
            { id: COOKED_KARAMBWAN, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: COOKED_KARAMBWAN, amount: 1 },
            { id: SUPER_ATTACK_4_, amount: 1 },
            { id: COOKED_KARAMBWAN, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: COOKED_KARAMBWAN, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: COOKED_KARAMBWAN, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: COOKED_KARAMBWAN, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: MANTA_RAY, amount: 1 },
            { id: ANGLERFISH, amount: 1 }
        ],
        equipment: [
            { id: IRON_FULL_HELM, amount: 1 },
            { id: OBSIDIAN_CAPE, amount: 1 },
            { id: DRAGON_SCIMITAR, amount: 1 },
            { id: AMULET_OF_GLORY, amount: 1 },
            { id: IRON_PLATEBODY, amount: 1 },
            { id: BOOK_OF_DARKNESS, amount: 1 },
            { id: BLACK_DHIDE_CHAPS, amount: 1 },
            { id: MITHRIL_GLOVES, amount: 1 },
            { id: CLIMBING_BOOTS, amount: 1 },
            { id: RING_OF_RECOIL, amount: 1 },
            null
        ],
        stats: {
            atk: 60, def: 1, str: 99, hp: 85, range: 1, pray: 1, mage: 1
        },
        spellbook: MagicSpellbook.NORMAL,
        isMembers: true
    }
    const COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch([DRAGON_DAGGER_P_PLUS_PLUS_]) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                const canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
                return canAttackNextTick && playerBot.getSpecialPercentage() >= 25 &&
                    // Switch if the enemy has lowish health
                    enemy.getHitpoints() < 46;
            }
    
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch([DRAGON_SCIMITAR]) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return true;
            }
    
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.setSpecialActivated(false);
                playerBot.getCombat().attack(enemy);
            }
        },
    ];

    getItemPreset(): Presetable {
        return BOT_DDS_PURE_M_73;
    }

    getCombatActions(): CombatAction[] {
        return COMBAT_ACTIONS;
    }
}