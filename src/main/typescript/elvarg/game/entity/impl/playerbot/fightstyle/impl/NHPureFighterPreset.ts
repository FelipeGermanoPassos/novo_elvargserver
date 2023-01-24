class NHPureFighterPreset implements FighterPreset {
    public static readonly BOT_NH_PURE_83 = new Presetable("BOT NH Pure",
        [
            new Item(RUNE_CROSSBOW), new Item(BLACK_DHIDE_CHAPS), new Item(RANGING_POTION_4_), new Item(SUPER_STRENGTH_4_),
            new Item(AVAS_ACCUMULATOR), new Item(GRANITE_MAUL), new Item(MANTA_RAY), new Item(MANTA_RAY),
            new Item(DRAGON_BOLTS_E_, 75), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(COOKED_KARAMBWAN),
            new Item(COOKED_KARAMBWAN), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(MANTA_RAY),
            new Item(COOKED_KARAMBWAN), new Item(MANTA_RAY), new Item(MANTA_RAY), new Item(MANTA_RAY),
            new Item(WATER_RUNE, 1000), new Item(BLOOD_RUNE, 1000), new Item(DEATH_RUNE, 1000), new Item(ANGLERFISH)
        ],
        [new Item(GHOSTLY_HOOD), new Item(ZAMORAK_CAPE), new Item(MAGIC_SHORTBOW), new Item(AMULET_OF_GLORY), new Item(GHOSTLY_ROBE), null, new Item(GHOSTLY_ROBE_2), new Item(MITHRIL_GLOVES), new Item(CLIMBING_BOOTS), new Item(RING_OF_RECOIL), new Item(RUNE_ARROW, 175),],
        /* atk, def, str, hp, range, pray, mage */
        [60, 1, 85, 99, 99, 1, 99],
        MagicSpellbook.ANCIENT,
        true
    );
    public static readonly COMBAT_ACTIONS: CombatAction[] = [
        {
            shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
                return playerBot.getSpecialPercentage() >= 50 && playerBot.getMovementQueue().getMobility().canMove() &&
                    enemy.getHitpointsAfterPendingDamage() <= 45;
            },
            performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
                playerBot.getCombat().attack(enemy);
                CombatSpecial.activate(playerBot);
                CombatSpecial.activate(playerBot);
            }
        }
    ]
    class CombatSwitch {
    constructor(private items: number[]) { }
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        let hasRing = ItemInSlot.getFromInventory(RING_OF_RECOIL, playerBot.getInventory()) != null;
        return hasRing && playerBot.getEquipment().getById(RING_OF_RECOIL) == null;
    }
    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile): void {
        playerBot.getCombat().attack(enemy);
    }
}
class CombatAction {
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        let combatMethod = CombatFactory.getMethod(enemy);
        let distance = playerBot.calculateDistance(enemy);
        let cantAttack = playerBot.getTimers().has(TimerKey.COMBAT_ATTACK) && playerBot.getTimers().left(TimerKey.COMBAT_ATTACK) > 1;
        return cantAttack
            && !enemy.getMovementQueue().getMobility().canMove()
            && distance == 1
            && CombatFactory.canReach(enemy, combatMethod, playerBot);
    }

    perform(playerBot: PlayerBot, enemy: Mobile): void {
        if (playerBot.getMovementQueue().size() > 0) {
            return;
        }
        playerBot.setFollowing(null);
        MovementQueue.randomClippedStepNotSouth(playerBot, 3);
    }
}
const combatSwitch = new CombatSwitch([ZAMORAK_CAPE, GHOSTLY_ROBE_2, GHOSTLY_ROBE]);

class CombatSwitch {
    constructor(private items: number[]) { }

    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        // Freeze the player if they can move
        return (
            enemy.getMovementQueue().getMobility().canMove() &&
            !enemy.getTimers().has(TimerKey.FREEZE_IMMUNITY) &&
            CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false)
        );
    }

    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
        playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
        playerBot.getCombat().attack(enemy);
    }
}
const combatSwitch = new CombatSwitch([RUNE_CROSSBOW, DRAGON_BOLTS_E_, AVAS_ACCUMULATOR, BLACK_DHIDE_CHAPS]);
class CombatSwitch {
    constructor(private items: number[]) { }

    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return enemy.getHitpoints() < 40;
    }

    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
        playerBot.getCombat().attack(enemy);
    }
}
class CombatSwitch {
    constructor(private items: number[]) { }

    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        throw new Error("Method not implemented.");
    }

    performAfterSwitch(playerBot: PlayerBot, enemy: Mobile) {
        throw new Error("Method not implemented.");
    }
}

class AttackStyleSwitch {
    constructor(private combatType: CombatType, private switch: CombatSwitch) { }
    }

class EnemyDefenseAwareCombatSwitch {
    constructor(private attackStyles: AttackStyleSwitch[]) { }
}

const magicCombatSwitch = new CombatSwitch([ZAMORAK_CAPE, GHOSTLY_ROBE_2, GHOSTLY_ROBE])
magicCombatSwitch.shouldPerform = (playerBot: PlayerBot, enemy: Mobile) => {
    return CombatSpells.ICE_BARRAGE.getSpell().canCast(playerBot, false);
};
magicCombatSwitch.performAfterSwitch = (playerBot: PlayerBot, enemy: Mobile) => {
    playerBot.getCombat().setCastSpell(CombatSpells.ICE_BARRAGE.getSpell());
    playerBot.getCombat().attack(enemy);
};

const rangedCombatSwitch = new CombatSwitch([MAGIC_SHORTBOW, RUNE_ARROW, AVAS_ACCUMULATOR, BLACK_DHIDE_CHAPS])
rangedCombatSwitch.shouldPerform = (playerBot: PlayerBot, enemy: Mobile) => {
    return true;
};
rangedCombatSwitch.performAfterSwitch = (playerBot: PlayerBot, enemy: Mobile) => {
    playerBot.setSpecialActivated(false);
    playerBot.getCombat().attack(enemy);
};

const magicAttackStyle = new AttackStyleSwitch(CombatType.MAGIC, magicCombatSwitch);
const rangedAttackStyle = new AttackStyleSwitch(CombatType.RANGED, rangedCombatSwitch);

const enemyDefenseAwareCombatSwitch = new EnemyDefenseAwareCombatSwitch([
    magicAttackStyle,
    rangedAttackStyle
]); {
    shouldPerform(playerBot: PlayerBot, enemy: Mobile): boolean {
        return true;
    },
},
    
    public getItemPreset(): Presetable {
    return BOT_NH_PURE_83;
}
    
    public getCombatActions(): CombatAction[] {
    return BotNhPure83.COMBAT_ACTIONS;
}
    



}