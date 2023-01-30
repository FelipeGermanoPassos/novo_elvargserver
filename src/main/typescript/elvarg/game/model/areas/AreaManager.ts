class AreaManager {

    public static areas: Area[] = [];

    static {
        AreaManager.areas.push(new BarrowsArea());
        AreaManager.areas.push(new DuelArenaArea());
        AreaManager.areas.push(new WildernessArea());
        AreaManager.areas.push(new KingBlackDragonArea());
        AreaManager.areas.push(new GodwarsDungeonArea());
        AreaManager.areas.push(CastleWars.LOBBY_AREA);
        AreaManager.areas.push(CastleWars.ZAMORAK_WAITING_AREA);
        AreaManager.areas.push(CastleWars.SARADOMIN_WAITING_AREA);
        AreaManager.areas.push(CastleWars.GAME_AREA);
    }

    /**
     * Processes areas for the given character.
     *
     * @param c
     */
    public static process(c: Mobile): void {
        let position = c.getLocation();
        let area = c.getArea();

        let previousArea: Area | null = null;

        if (area != null) {
            if (!AreaManager.inside(position, area)) {
                area.leave(c, false);
                previousArea = area;
                area = null;
            }
        }

        if (area == null) {
            area = AreaManager.get(position);
            if (area != null) {
                area.enter(c);
            }
        }

        // Handle processing..
        if (area != null) {
            area.process(c);
        }

        // Handle multiicon update..
        if (c.isPlayer()) {
            let player = c.getAsPlayer();

            let multiIcon = 0;

            if (area != null) {
                multiIcon = area.isMulti(player) ? 1 : 0;
            }

            if (player.getMultiIcon() != multiIcon) {
                player.getPacketSender().sendMultiIcon(multiIcon);
            }
        }

        // Update area..
        c.setArea(area);

        // Handle postLeave...
        if (previousArea != null) {
            previousArea.postLeave(c, false);
        }
    }
    static inside(position: Location, area: Area) {
        return true;
    }
    static get(position: Location) {
        return;
    }

    public static inMulti(c: Mobile): boolean {
        if (c.getArea() != null) {
            return c.getArea().isMulti(c);
        }
        return false;
    }

    /**
     * Checks if a {@link Mobile} can attack another one.
     *
     * @param attacker
     * @param target
     * @return {CanAttackResponse}
     */
    public static canAttack(attacker: Mobile, target: Mobile): CanAttackResponse {
        if (attacker.getPrivateArea() != target.getPrivateArea()) {
            return CanAttackResponse.CANT_ATTACK_IN_AREA;
        }

        if (attacker.getArea() != null) {
            return attacker.getArea().canAttack(attacker, target);
        }

        // Don't allow PvP by default
        if (attacker.isPlayer() && target.isPlayer()) {
            return CanAttackResponse.CANT_ATTACK_IN_AREA;
        }

        return CanAttackResponse.CAN_ATTACK;
    }

    /**
     * Gets a {@link Area} based on a given {@link Location}.
     *
     * @param position
     * @return
     */
    public static get(position: Location): Area | null {
        for (let area of this.areas) {
            if (AreaManager.inside(position, area)) {
                return area;
            }
        }
        return null;
    }

    /**
     * Checks if a position is inside of an area's boundaries.
     *
     * @param position
     * @return
     */
    public static inside(position: Location, area: Area): boolean {
        for (let b of area.getBoundaries()) {
            if (b.inside(position)) {
                return true;
            }
        }
        return false;
    }
}