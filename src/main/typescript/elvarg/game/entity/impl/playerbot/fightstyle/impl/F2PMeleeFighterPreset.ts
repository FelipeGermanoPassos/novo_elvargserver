export class F2PMeleeFighterPreset implements FighterPreset {



    static PRESETABLE: Presetable = new Presetable("F2P Pure",
        [
            new Item(RUNE_2H_SWORD), new Item(STRENGTH_POTION_4_), new Item(SWORDFISH), new Item(SWORDFISH),
            new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH),
            new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH),
            new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH),
            new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH),
            new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH),
            new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH), new Item(SWORDFISH),
        ],
        [
            new Item(IRON_FULL_HELM),
            new Item(CAPE_OF_LEGENDS),
            new Item(MAPLE_SHORTBOW),
            new Item(AMULET_OF_POWER),
            new Item(LEATHER_BODY),
            new Item(GREEN_DHIDE_VAMB),
            new Item(GREEN_DHIDE_CHAPS),
            null,
            new Item(LEATHER_BOOTS),
            null,
            new Item(ADAMANT_ARROW, 100),
        ],
        /* atk, def, str, hp, range, pray, mage */
        [40, 1, 90, 58, 84, 1, 1],
        MagicSpellbook.NORMAL,
        true
    );

    static COMBAT_ACTIONS: CombatAction[] = [
        new CombatSwitch(new int[]{ RUNE_2H_SWORD }) {

            /**
             * KO Weapon - Rune 2H sword
             */

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                let canAttackNextTick = playerBot.getTimers().getTicks(TimerKey.COMBAT_ATTACK) <= 1;
                return canAttackNextTick &&
                    enemy.getHitpoints() < 25;
            }

            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },

        new CombatSwitch(new int[]{ MAPLE_SHORTBOW }) {

            /**
             * Default Weapon - Maple Shortbow (Max DPS)
             */

            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return enemy.getHitpoints() >= 25;
            }

            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
            }
        },
    ];

    getItemPreset(): Presetable {
        return this.PRESETABLE;
    }

    getCombatActions(): CombatAction[] {
        return this.COMBAT_ACTIONS;
    }
}