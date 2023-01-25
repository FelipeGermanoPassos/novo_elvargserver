class CrazyArchaeologistCombatMethod extends CombatMethod {

    private static readonly QUOTES: string[] = ["I'm Bellock - respect me!", "Get off my site!",
        "No-one messes with Bellock's dig!", "These ruins are mine!", "Taste my knowledge!",
        "You belong in a museum!",];

    private static readonly Attack = {
        SPECIAL_ATTACK, DEFAULT_RANGED_ATTACK, DEFAULT_MELEE_ATTACK
    }

    private attack = Attack.DEFAULT_RANGED_ATTACK;
    private static readonly RANGED_END_GFX = new Graphic(305, GraphicHeight.HIGH);
    private static readonly MAKE_IT_RAIN_START_GFX = new Graphic(157, GraphicHeight.MIDDLE);
    private static readonly MELEE_ATTACK_ANIM = new Animation(423);
    private static readonly RANGED_ATTACK_ANIM = new Animation(3353);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        if (attack == Attack.SPECIAL_ATTACK) {
            return null;
        }
        const delay = 2;
        if (attack == Attack.DEFAULT_MELEE_ATTACK) {
            delay = 0;
        }
        return new PendingHit[] { new PendingHit(character, target, this, delay) };
    }

    public start(character: Mobile, target: Mobile) {
        if (!character.isNpc() || !target.isPlayer())
            return;

        attack = Attack.DEFAULT_RANGED_ATTACK;

        if (target.getLocation().getDistance(character.getLocation()) < 2 && Misc.getRandom(1) == 0) {
            attack = Attack.DEFAULT_MELEE_ATTACK;
        }

        if (Misc.getRandom(10) < 3) {
            attack = Attack.SPECIAL_ATTACK;
        }

        character.forceChat(QUOTES[Misc.getRandom(QUOTES.length - 1)]);

        if (attack == Attack.DEFAULT_RANGED_ATTACK) {
            character.performAnimation(RANGED_ATTACK_ANIM);
            new Projectile(character, target, 1259, 40, 65, 31, 43).sendProjectile();
            TaskManager.submit(new Task(3, target, false) {
                execute() {
                    target.performGraphic(RANGED_END_GFX);
                    stop();
                }
            });
        } else if (attack == Attack.SPECIAL_ATTACK) {
            character.performAnimation(RANGED_ATTACK_ANIM);
            character.forceChat("Rain of Knowledge!");
            let targetPos = target.getLocation();
            let attackPositions: Location[] = [];
            attackPositions.push(targetPos);
            for (let i = 0; i < 2; i++) {
                attackPositions.push(new Location((targetPos.getX() - 1) + Misc.getRandom(3),
                    (targetPos.getY() - 1) + Misc.getRandom(3)));
            }
            for (let pos of attackPositions) {
                new Projectile(character.getLocation(), pos, null, 1260, 40, 80, 31, 43, character.getPrivateArea()).sendProjectile();
            }
            TaskManager.submit(new Task(4) {
                execute() {
                    for (let pos of attackPositions) {
                        target.getAsPlayer().getPacketSender().sendGlobalGraphic(MAKE_IT_RAIN_START_GFX, pos);
                        for (let player of character.getAsNpc().getPlayersWithinDistance(10)) {
                            if (player.getLocation().equals(pos)) {
                                player.getCombat().getHitQueue().addPendingDamage(new HitDamage(Misc.getRandom(25), HitMask.RED));
                            }
                        }
                    }
                    finished(character, target);
                    stop();
                }
            });
            character.getTimers().register(TimerKey.COMBAT_ATTACK, 5);
        } else if (attack == Attack.DEFAULT_MELEE_ATTACK) {
            character.performAnimation(MELEE_ATTACK_ANIM);
        }
    }

    attackSpeed(character: Mobile) {
        if (this.attack === Attack.DEFAULT_MELEE_ATTACK) {
            return 3;
        }
        return super.attackSpeed(character);
    }
    
    attackDistance(character: Mobile) {
        if (this.attack === Attack.DEFAULT_MELEE_ATTACK) {
            return 1;
        }
        if (this.attack === Attack.SPECIAL_ATTACK) {
            return 8;
        }
        return 6;
    }
    
    type() {
        if (this.attack === Attack.DEFAULT_MELEE_ATTACK) {
            return CombatType.MELEE;
        }
        return CombatType.RANGED;
    }
    


}
