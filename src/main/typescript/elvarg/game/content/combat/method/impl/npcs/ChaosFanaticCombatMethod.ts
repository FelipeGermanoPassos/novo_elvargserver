class ChaosFanaticCombatMethod extends CombatMethod {

    private static readonly QUOTES: string[] = ["Burn!", "WEUGH!", "Develish Oxen Roll!",
        "All your wilderness are belong to them!", "AhehHeheuhHhahueHuUEehEahAH",
        "I shall call him squidgy and he shall be my squidgy!",];

    private static readonly Attack = {
        SPECIAL_ATTACK, DEFAULT_MAGIC_ATTACK
    }

    private attack = Attack.DEFAULT_MAGIC_ATTACK;
    private static readonly ATTACK_END_GFX = new Graphic(305, GraphicHeight.HIGH);
    private static readonly EXPLOSION_END_GFX = new Graphic(157, GraphicHeight.MIDDLE);
    private static readonly MAGIC_ATTACK_ANIM = new Animation(811);

    public hits(character: Mobile, target: Mobile): PendingHit[] {
        if (attack == Attack.SPECIAL_ATTACK) {
            return null;
        }
        return [new PendingHit(character, target, this, 2)];
    }

    start(character: Mobile, target: Mobile) {
        if (!character.isNpc() || !target.isPlayer())
            return;

        character.performAnimation(MAGIC_ATTACK_ANIM);

        attack = Attack.DEFAULT_MAGIC_ATTACK;

        if (Misc.getRandom(9) < 3) {
            attack = Attack.SPECIAL_ATTACK;
        }

        character.forceChat(QUOTES[Misc.getRandom(QUOTES.length - 1)]);

        if (attack == Attack.DEFAULT_MAGIC_ATTACK) {
            new Projectile(character, target, 554, 62, 80, 31, 43).sendProjectile();
            if (Misc.getRandom(1) == 0) {
                TaskManager.submit(new Task(3, target, false) {
                    public execute() {
                        target.performGraphic(ATTACK_END_GFX);
                        this.stop();
                    }
                });
            }
        } else if (attack == Attack.SPECIAL_ATTACK) {
            let targetPos = target.getLocation();
            let attackPositions = new Array<Location>();
            attackPositions.push(targetPos);
            for (let i = 0; i < 3; i++) {
                attackPositions.push(new Location((targetPos.getX() - 1) + Misc.getRandom(3),
                    (targetPos.getY() - 1) + Misc.getRandom(3)));
            }
            for (let pos of attackPositions) {
                new Projectile(character.getLocation(), pos, null, 551, 40, 80, 31, 43, character.getPrivateArea())
                    .sendProjectile();
            }
            TaskManager.submit(new Task(4) {
                public execute() {
                    for (let pos of attackPositions) {
                        target.getAsPlayer().getPacketSender().sendGlobalGraphic(EXPLOSION_END_GFX, pos);
                        for (let player of character.getAsNpc().getPlayersWithinDistance(10)) {
                            if (player.getLocation().equals(pos)) {
                                player.getCombat().getHitQueue()
                                    .addPendingDamage(new HitDamage(Misc.getRandom(25), HitMask.RED));
                            }
                        }
                    }
                    finished(character, target);
                    this.stop();
                }
            });
            character.getTimers().register(TimerKey.COMBAT_ATTACK, 5);
        }
    }

    attackDistance(character: Mobile): number {
        return 8;
    }

    finished(character: Mobile, target: Mobile) {
        if (Misc.getRandom(10) == 1) {
            if (target.isPlayer()) {
                ChaosElementalCombatMethod.disarmAttack(target.getAsPlayer());
            }
        }
    }

    type(): CombatType {
        return CombatType.MAGIC;
    }


}
