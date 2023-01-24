class ObbyMaulerFighterPreset implements FighterPreset {
    private static readonly BOT_OBBY_MAULER_57 = new Presetable(
        "Obby Mauler",
        [
            new Item(SUPER_STRENGTH_4_),
            new Item(RANGING_POTION_4_),
            new Item(MAGIC_SHORTBOW),
            new Item(RING_OF_RECOIL),
            new Item(BERSERKER_NECKLACE),
            new Item(FIRE_CAPE),
            new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN),
            new Item(TZHAAR_KET_OM),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(MANTA_RAY),
            new Item(ANGLERFISH),
        ],
        [
            new Item(COIF),
            new Item(AVAS_ACCUMULATOR),
            new Item(MAGIC_SHORTBOW),
            new Item(RUNE_ARROW, 200),
            new Item(AMULET_OF_GLORY),
            new Item(LEATHER_BODY),
            new Item(BLACK_DHIDE_CHAPS),
            new Item(MITHRIL_GLOVES),
            new Item(CLIMBING_BOOTS),
            new Item(RING_OF_RECOIL),
        ],
        [1, 1, 99, 80, 70, 13, 1],
        MagicSpellbook.NORMAL,
        true
    );

    public static readonly COMBAT_ACTIONS = [
        new CombatSwitch([MAGIC_SHORTBOW, RUNE_ARROW, AVAS_ACCUMULATOR], [PrayerHandler.PrayerData.SHARP_EYE]) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return (
                    playerBot.getSpecialPercentage() >= 55 &&
                    (!enemy.getPrayerActive()[PrayerHandler.PROTECT_FROM_MISSILES] &&
                        enemy.getHitpointsAfterPendingDamage() < 40)
                );
            }
    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                if (!playerBot.isSpecialActivated()) {
                    CombatSpecial.activate(playerBot);
                }
                playerBot.getCombat().attack(enemy);
            }
        },
        class CombatSwitch {
            constructor(
                public items: Array<number>,
                public prayers?: Array<PrayerHandler.PrayerData>
            ) { }

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean { };

            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void { };
        }
          
          const COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch([TZHAAR_KET_OM, BERSERKER_NECKLACE, FIRE_CAPE], [PrayerHandler.PrayerData.SUPERHUMAN_STRENGTH]) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                const canAttackNextTick = playerBot.getTimers().willEndIn(TimerKey.COMBAT_ATTACK, 1);
                return canAttackNextTick && playerBot.getMovementQueue().getMobility().canMove() && enemy.getHitpointsAfterPendingDamage() < 38;
            }
              performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch([RING_OF_RECOIL]) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                const hasRing = ItemInSlot.getFromInventory(RING_OF_RECOIL, playerBot.getInventory()) != null;
                return hasRing && playerBot.getEquipment().getById(RING_OF_RECOIL) == null;
            }
              performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },
        new CombatSwitch([MAGIC_SHORTBOW, RUNE_ARROW, AVAS_ACCUMULATOR], [PrayerHandler.PrayerData.SHARP_EYE]) {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return true;
            }
              performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },
    ];
          
          class BotObbyMauler57 implements CombatPreset {
    getItemPreset(): Presetable {
        return BOT_OBBY_MAULER_57;
    }

    getCombatActions(): CombatAction[] {
        return COMBAT_ACTIONS;
    }
}
}
