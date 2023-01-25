class KingBlackDragonMethod extends CombatMethod {
    currentAttackType = CombatType.MAGIC;
    currentBreath = Breath.DRAGON;

    start(character: Mobile, target: Mobile) {
        if (this.currentAttackType === CombatType.MAGIC) {
            character.performAnimation({ animationId: 84 });
            switch (this.currentBreath) {
                case Breath.DRAGON:
                    new Projectile(character, target, 393, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.ICE:
                    new Projectile(character, target, 396, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.POISON:
                    new Projectile(character, target, 394, 40, 55, 31, 43).sendProjectile();
                    break;
                case Breath.SHOCK:
                    new Projectile(character, target, 395, 40, 55, 31, 43).sendProjectile();
                    break;
                default:
                    break;
            }
        } else if (this.currentAttackType === CombatType.MELEE) {
            character.performAnimation({ animationId: 91 });
        }
    }

    attackSpeed(character: Mobile): number {
        return this.currentAttackType === CombatType.MAGIC ? 6 : 4;
    }

    attackDistance(character: Mobile): number {
        return 8;
    }

    type(): CombatType {
        return this.currentAttackType;
    }

    hits(character: Mobile, target: Mobile): PendingHit[] {
        let hit = new PendingHit(character, target, this, 1);
        if (target.isPlayer()) {
            let p = target.getAsPlayer();
            if (this.currentAttackType === CombatType.MAGIC && this.currentBreath === Breath.DRAGON) {
                if (PrayerHandler.isActivated(p, PrayerHandler.PROTECT_FROM_MAGIC) && CombatEquipment.hasDragonProtectionGear(p) && !p.getCombat().getFireImmunityTimer().finished()) {
                    target.getPacketSender().sendMessage("You're protected against the dragonfire breath.");
                    return [hit];
                }
                let extendedHit = 25;
                if (PrayerHandler.isActivated(p, PrayerHandler.PROTECT_FROM_MAGIC)) {
                    extendedHit -= 5;
                }
                if (!p.getCombat().getFireImmunityTimer().finished()) {
                    extendedHit -= 10;
                }
                if (CombatEquipment.hasDragonProtectionGear(p)) {
                    extendedHit -= 10;
                }
                p.getPacketSender().sendMessage("The dragonfire burns you.");
                hit.getHits()[0].incrementDamage(extendedHit);
            }
            if (this.currentAttackType === CombatType.MAGIC) {
                switch (this.currentBreath) {
                    case Breath.ICE:
                        CombatFactory.freeze(hit.getTarget().getAsPlayer(), 5);
                        break;
                    case Breath.POISON:
                        CombatFactory.poisonEntity(hit.getTarget().getAsPlayer(), PoisonType.SUPER);
                        break;
                    default:
                        break;
                }
            }
        }
        return [hit];
    }

    finished(character: Mobile, target: Mobile) {
        if (character.getLocation().getDistance(target.getLocation()) <= 3) {
            if (Misc.randomInclusive(0, 2) === 0) {
                this.currentAttackType = CombatType.MAGIC;
            } else {
                this.currentAttackType = CombatType.MELEE;
            }
        } else {
            this.currentAttackType = CombatType.MAGIC;
        }
        if (this.currentAttackType === CombatType.MAGIC) {
            let random = Misc.randomInclusive(0, 10);
            if (random >= 0 && random <= 3) {
                this.currentBreath = Breath.DRAGON;
            } else if (random >= 4 && random <= 6) {
                this.currentBreath = Breath.SHOCK;
            } else if (random >= 7 && random <= 9) {
                this.currentBreath = Breath.POISON;
            } else {
                this.currentBreath = Breath.ICE;
            }
        }
    }
}

enum Breath {
    ICE, POISON, SHOCK, DRAGON
}

enum CombatType {
    MAGIC,
    MELEE
}

enum Breath {
    DRAGON,
    ICE,
    POISON,
    SHOCK
}

interface Mobile {
    performAnimation(animation: Animation): void;
}

interface Animation {
    animationId: number;
}

class Projectile {
    constructor(
        public character: Mobile,
        public target: Mobile,
        public projectileId: number,
        public startHeight: number,
        public endHeight: number,
        public speed: number,
        public delay: number
    ) { }
}
