export abstract class CombatSpell extends Spell {
    startCast(cast: Mobile, castOn: Mobile) {
        let castAnimation = -1;
        let npc = cast.isNpc() ? cast as NPC : null;
        /if(npc != null) {
        if (npc.getId() == 3496 || npc.getId() == 6278 || npc.getId() == 2000 || npc.getId() == 109 || npc.getId() == 3580 || npc.getId() == 2007) {
            castAnimation = npc.getDefinition().getAttackAnim();
        }
    }/
    
    Copy code
if (castAnimation().isPresent() && castAnimation == -1) {
    castAnimation().ifPresent(anim => cast.performAnimation(anim));
} else {
    cast.performAnimation(new Animation(castAnimation));
}

// Then send the starting graphic.
if (npc != null) {
    if (npc.getId() != 2000 && npc.getId() != 109 && npc.getId() != 3580 && npc.getId() != 2007) {
        startGraphic().ifPresent(g => cast.performGraphic(g));
    }
} else {
    startGraphic().ifPresent(g => cast.performGraphic(g));
}

// Finally send the projectile after two ticks.
castProjectile(cast, castOn).ifPresent(g => {
    //g.sendProjectile();
    TaskManager.submit(new Task(2, cast, false) {
        execute() {
            g.sendProjectile();
            this.stop();
        }
    });
});

