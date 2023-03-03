import { RegionManager } from "../../collision/RegionManager";
import { Mobile } from "../../entity/impl/Mobile";
import { World } from "../../World";
import { Dueling } from "../../content/Duelling";
import { CombatFactory } from "../../content/combat/CombatFactory";
import { ObjectDefinition } from "../../definition/ObjectDefinition";
import { NPC } from "../../entity/impl/npc/NPC";
import { GameObject } from "../../entity/impl/object/GameObject";
import { Player } from "../../entity/impl/player/Player";
import { Direction, Directions } from "../Direction";
import { Location } from "../Location";
import { Skill } from "../Skill";
import { PathFinder } from "./path/PathFinder";
import { RS317PathFinder } from './path/RS317PathFinder'
import { PlayerRights } from "../rights/PlayerRights";
import { Task } from "../../task/Task";
import { TaskManager } from "../../task/TaskManager";
import { Misc } from "../../../util/Misc";
import { NpcIdentifiers } from "../../../util/NpcIdentifiers";
import { RandomGen } from "../../../util/RandomGen";
import { TimerKey } from "../../../util/timers/TimerKey";
export class MovementQueue {

    private static RANDOM: RandomGen = new RandomGen();

    /**
     * NPC interactions can begin when the player is within this radius of the NPC.
     */
    public static NPC_INTERACT_RADIUS: number = 2;

    /**
     * An enum to represent a Player's Mobility
     */

    /**
         * The maximum size of the queue. If any additional steps are added, they are
         * discarded.
         */
    private static MAXIMUM_SIZE = 100;

    /**
     * The character whose walking queue this is.
     */
    private character: Mobile;

    /**
     * The player who owns this MovementQueue (if if applicable)
     */
    private player: Player;

    /**
     * The queue of directions.
     */
    private points: Array<Point> = new Array<Point>();

    /**
     * Whether movement is currently blocked for this Mobile.
     */
    private blockMovement = false;

    /**
     * Are we currently moving?
     */
    private isMoving = false;

    /**
     * Creates a walking queue for the specified character.
     *
     * @param character The character.
     */
    constructor(character: Mobile) {
        this.character = character;

        if (this.character.isPlayer()) {
            this.player = this.character.getAsPlayer();
        }
    }

    /**
         * Checks if we can walk from one position to another.
         *
         * @param deltaX
         * @param deltaY
         * @return
         */
    public canWalk(deltaX: number, deltaY: number): boolean {
        if (!this.getMobility().canMove()) {
            return false;
        }
        if (this.character.getLocation().getZ() == -1) {
            return true;
        }
        return RegionManager.canMove(this.character.getLocation(), this.character.getLocation().transform(deltaX, deltaY), this.character.size(), this.character.size(), this.character.getPrivateArea());
    }

    /**
         * Steps away from a Gamecharacter
         *
         * @param character The gamecharacter to step away from
         */
    public static clippedStep(character: Mobile) {
        let size = character.getSize();
        if (character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (character.getMovementQueue().canWalk(0, -size))
            character.getMovementQueue().walkStep(0, -size);
        else if (character.getMovementQueue().canWalk(0, -size))
            character.getMovementQueue().walkStep(0, -size);
    }

    public static randomClippedStep(character: Mobile, size: number) {
        let rng = this.RANDOM.getInclusive(1, 4);
        if (rng == 1 && character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (rng == 2 && character.getMovementQueue().canWalk(size, 0))
            character.getMovementQueue().walkStep(size, 0);
        else if (rng == 3 && character.getMovementQueue().canWalk(0, -size))
            character.getMovementQueue().walkStep(0, -size);
        else if (rng == 4 && character.getMovementQueue().canWalk(0, size))
            character.getMovementQueue().walkStep(0, size);
    }

    public static randomClippedStepNotSouth(character: Mobile, size: number) {
        let rng = this.RANDOM.getInclusive(1, 3);
        if (rng == 1 && character.getMovementQueue().canWalk(-size, 0))
            character.getMovementQueue().walkStep(-size, 0);
        else if (rng == 2 && character.getMovementQueue().canWalk(size, 0))
            character.getMovementQueue().walkStep(size, 0);
        else if (rng == 3 && character.getMovementQueue().canWalk(0, size))
            character.getMovementQueue().walkStep(0, size);
    }

    /**
         * Adds the first step to the queue, attempting to connect the server and client
         * position by looking at the previous queue.
         *
         * @param clientConnectionPosition The first step.
         * @return {@code true} if the queues could be connected correctly,
         * {@code false} if not.
         */
    public addFirstStep(clientConnectionPosition: Location): boolean {
        this.reset();
        this.addSteps(clientConnectionPosition);
        return true;
    }

    /**
         * Adds a step to walk to the queue.
         *
         * @param x       X to walk to
         * @param y       Y to walk to
         */
    public walkStep(x: number, y: number) {
        let position = this.character.getLocation().clone();
        position.setX(position.getX() + x);
        position.setY(position.getY() + y);
        this.addSteps(position);
    }

    /**
         * Adds a step to this MovementQueue.
         *
         * @param x           The x coordinate of this step.
         * @param y           The y coordinate of this step.
         * @param heightLevel
         */
    private addStep(x: number, y: number, heightLevel: number) {
        if (!this.getMobility().canMove()) {
            return;
        }

        if (this.points.length >= MovementQueue.MAXIMUM_SIZE)
            return;

        const last = this.getLast();
        const deltaX = x - last.position.getX();
        const deltaY = y - last.position.getY();
        const direction = Direction.fromDeltas(deltaX, deltaY);
        if (direction != Directions.NONE)
            this.points.add(new Point(new Location(x, y), direction));
    }

    /**
         * Adds a step to the queue.
         *
         * @param step The step to add.
         */
    public addSteps(step: Location) {
        if (!this.getMobility().canMove()) {
            return;
        }

        const last = this.getLast();
        const x = step.getX();
        const y = step.getY();
        let deltaX = x - last.position.getX();
        let deltaY = y - last.position.getY();
        const max = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        for (let i = 0; i < max; i++) {
            if (deltaX < 0)
                deltaX++;
            else if (deltaX > 0)
                deltaX--;
            if (deltaY < 0)
                deltaY++;
            else if (deltaY > 0)
                deltaY--;
            this.addStep(x - deltaX, y - deltaY, step.getZ());
        }
    }

    /**
         * Determines the Player's Mobility status
         *
         * @return {Mobility} mobility
         */
    public getMobility(): Mobility {
        if (this.character.getTimers().has(TimerKey.FREEZE)) {
            return Mobility.FROZEN_SPELL;
        }

        if (this.character.getTimers().has(TimerKey.STUN)) {
            return Mobility.STUNNED;
        }

        if (this.character.isNeedsPlacement() || this.isMovementBlocked()) {
            return Mobility.INVALID;
        }

        if (this.player != null) {
            // Player related checks

            let playerDueling = this.player.getDueling();
            if (!this.player.getTrading().getButtonDelay().finished() || !playerDueling.getButtonDelay().finished()) {
                return Mobility.BUSY;
            }

            if (playerDueling.inDuel() && playerDueling.getRules()[Dueling.DuelRule.NO_MOVEMENT.ordinal()]) {
                return Mobility.DUEL_MOVEMENT_DISABLED;
            }
        }

        return Mobility.MOBILE;
    }

    /**
         * Validates a destination for a given player movement.
         *
         * @param destination The intended/potential destination.
         * @return {boolean} destinationValid
         */
    public checkDestination(destination: Location): boolean {
        if (destination.getZ() < 0) {
            return false;
        }

        if (this.character.getLocation().getZ() !== destination.getZ()) {
            return false;
        }

        if (destination.getX() > 32767 || destination.getX() < 0 || destination.getY() > 32767 || destination.getY() < 0) {
            return false;
        }

        const distance = this.character.getLocation().getDistance(destination);
        if (distance > 25) {
            return false;
        }

        return true;
    }

    private getLast(): Point {
        let last = this.points.peekLast();
        if (!last)
            return new Point(this.character.getLocation(), Directions.NONE);
        return last;
    }

    public followX = -1;
    public followY = -1;

    /**
     * @return true if the character is moving.
     */
    public isMovings(): boolean {
        return this.isMoving;
    }

    public process() {
        if (!this.getMobility().canMove()) {
            this.reset();
            return;
        }

        if (this.character.getCombatFollowing() != null) {
            this.processCombatFollowing();
        }

        let walkPoint: Point = null;
        let runPoint: Point = null;

        walkPoint = this.points.poll();

        if (this.isRunToggled()) {
            runPoint = this.points.poll();
        }

        let oldPosition: Location = this.character.getLocation();
        let moved: boolean = false;

        if (walkPoint != null && walkPoint.direction != Directions.NONE) {
            let next: Location = walkPoint.position;
            if (this.canWalkTo(next)) {
                this.followX = oldPosition.getX();
                this.followY = oldPosition.getY();
                this.character.setLocation(next);
                this.character.setWalkingDirection(walkPoint.direction);
                moved = true;
            } else {
                this.reset();
                return;
            }
        }

        if (runPoint != null && runPoint.direction != Directions.NONE) {
            let next: Location = runPoint.position;
            if (this.canWalkTo(next)) {
                this.followX = oldPosition.getX();
                this.followY = oldPosition.getY();
                oldPosition = next;
                this.character.setLocation(next);
                this.character.setRunningDirection(runPoint.direction);
                moved = true;
            } else {
                this.reset();
                return;
            }
        }

        if (this.character.isPlayer()) {
            if (moved) {
                this.handleRegionChange();
                this.drainRunEnergy();
                this.character.getAsPlayer().setOldPosition(oldPosition);
            }
        }

        this.isMoving = moved;
    }

    public canWalkTo(next: Location) {
        if (this.character.isNpc() && !(this.character as NPC).canWalkThroughNPCs()) {
            for (let npc of World.getNpcs()) {
                if (npc == null) {
                    continue;
                }
                if (npc.getLocation().equals(next)) {
                    return false;
                }
            }
        }
        return true;
    }


    public handleRegionChange() {
        const player = (this.character as Player);
        const diffX = this.character.getLocation().getX() - this.character.getLastKnownRegion().getRegionX() * 8;
        const diffY = this.character.getLocation().getY() - this.character.getLastKnownRegion().getRegionY() * 8;
        let regionChanged = false;
        if (diffX < 16)
            regionChanged = true;
        else if (diffX >= 88)
            regionChanged = true;
        if (diffY < 16)
            regionChanged = true;
        else if (diffY >= 88)
            regionChanged = true;
        if (regionChanged || player.getRegionHeight() != player.getLocation().getZ()) {
            player.getPacketSender().sendMapRegion();
            player.setRegionHeight(player.getLocation().getZ());
        }
    }

    private drainRunEnergy() {
        const player = (this.character as Player);
        if (player.isRunning()) {
            player.setRunEnergy(player.getRunEnergy() - 1);
            if (player.getRunEnergy() <= 0) {
                player.setRunEnergy(0);
                player.setRunning(false);
                player.getPacketSender().sendRunStatus();
            }
            player.getPacketSender().sendRunEnergy();
        }
    }

    public static runEnergyRestoreDelay(p: Player) {
        return 1700 - (p.getSkillManager().getCurrentLevel(Skill.AGILITY) * 10);
    }

    public reset(): MovementQueue {
        this.points.clear();
        this.followX = -1;
        this.followY = -1;
        this.isMoving = false;
        this.foundRoute = false;
        return this;
    }

    public resetFollow() {
        this.character.setCombatFollowing(null);
        this.character.setFollowing(null);
        this.character.setPositionToFace(null);
    }

    public processCombatFollowing() {
        const following = this.character.getCombatFollowing();
        const size = this.character.size();
        const followingSize = following.size();

        // Update interaction
        this.character.setMobileInteraction(following);

        // Make sure we reset the current movement queue to prevent erratic back and forth
        this.reset();

        // Block if our movement is locked.
        if (!this.getMobility().canMove()) {
            return;
        }

        let combatFollow = this.character.getCombat().getTarget().equals(following);
        const method = CombatFactory.getMethod(this.character);

        if (combatFollow && CombatFactory.canReach(this.character, method, following)) {
            // Don't continue finding a path if we can reach our opponent
            this.reset();
            return;
        }

        // If we're way too far away from eachother, simply reset following completely.
        if (!this.character.getLocation().isViewableFrom(following.getLocation()) || !following.isRegistered() || following.getPrivateArea() != this.character.getPrivateArea()) {

            let reset = true;

            // Handle pets, they should teleport to their owner
            // when they're too far away.
            if (this.character.isNpc()) {
                const npc = this.character.getAsNpc();
                if (npc.isPet()) {
                    npc.setVisible(false);
                    const tiles = new Array<Location>();
                    for (const tile of following.outterTiles()) {
                        if (RegionManager.blocked(tile, following.getPrivateArea())) {
                            continue;
                        }
                        tiles.push(tile);
                    }
                    if (tiles.length !== 0) {
                        npc.moveTo(tiles[Misc.getRandom(tiles.length - 1)]);
                        npc.setVisible(true);
                        npc.setArea(following.getArea());
                    }
                    return;
                }

                switch (npc.getId()) {
                    case NpcIdentifiers.TZTOK_JAD:
                        reset = false;
                        break;
                }
            }

            if (reset) {
                if (this.character.isPlayer() && following.isPlayer()) {
                    this.character.sendMessage(`Unable to find ${following.getAsPlayer().getUsername()}.`);
                    if (this.character.getAsPlayer().getRights() === PlayerRights.DEVELOPER) {
                        const p = Misc.delta(this.character.getLocation(), following.getLocation());
                        character.sendMessage("Delta: " + p.getX() + ", " + p.getZ());
                    }
                }
                if (combatFollow) {
                    character.getCombat().reset();
                }
                character.getMovementQueue().reset();
                character.setCombatFollowing(null);
                character.setMobileInteraction(null);
                return;
            }
        }

        let dancing = (!combatFollow && character.isPlayer() && following.isPlayer() && following.getCombatFollowing() == character);
        let basicPathing = (combatFollow && character.isNpc() && !((character as NPC).canUsePathFinding()));
        let current = character.getLocation();
        let destination = following.getLocation();
        if (dancing) {
            destination = following.getAsPlayer().getOldPosition();
        }

        if (!dancing) {
            if (!combatFollow && character.calculateDistance(following) == 1 && !RS317PathFinder.isInDiagonalBlock(current, destination)) {
                return;
            }

            // Handle simple walking to the destination for NPCs which don't use pathfinding.
            if (basicPathing) {

                // Same spot, step away.
                if (destination.equals(current) && !following.getMovementQueue().isMoving()
                    && character.size() == 1 && following.size() == 1) {
                    let tiles = new Array<Location>();
                    for (let tile of following.outterTiles()) {
                        if (!RegionManager.canMove(character.getLocation(), tile, size, size, character.getPrivateArea())
                            || RegionManager.blocked(tile, character.getPrivateArea())) {
                            continue;
                        }
                        // Projectile attack
                        if (character.useProjectileClipping() && !RegionManager.canProjectileAttack(tile, following.getLocation(), character.size(), character.getPrivateArea())) {
                            continue;
                        }
                        tiles.push(tile);
                    }
                    if (tiles.length > 0) {
                        addFirstStep(tiles[Misc.getRandom(tiles.length - 1)]);
                    }
                    return;
                }

                let deltaX = destination.getX() - current.getX();
                let deltaY = destination.getY() - current.getY();
                if (deltaX < -1) {
                    deltaX = -1;
                } else if (deltaX > 1) {
                    deltaX = 1;
                }
                if (deltaY < -1) {
                    deltaY = -1;
                } else if (deltaY > 1) {
                    deltaY = 1;
                }
                let direction: Direction = Direction.fromDeltas(deltaX, deltaY);

                switch (direction) {
                    case Directions.NORTH_WEST:
                        if (RegionManager.canMove(current, Directions.WEST, size, character.getPrivateArea())) {
                            direction = Directions.WEST;
                        } else if (RegionManager.canMove(current, Directions.NORTH, size, character.getPrivateArea())) {
                            direction = Directions.NORTH;
                        } else {
                            direction = Directions.NONE;
                        }
                        break;
                    case Directions.NORTH_EAST:
                        if (RegionManager.canMove(current, Directions.NORTH, size, character.getPrivateArea())) {
                            direction = Direction.NORTH;
                        } else if (RegionManager.canMove(current, Directions.EAST, size, character.getPrivateArea())) {
                            direction = Directions.EAST;
                        } else {
                            direction = Directions.NONE;
                        }
                        break;
                    case Directions.SOUTH_WEST:
                        if (RegionManager.canMove(current, Directions.WEST, size, character.getPrivateArea())) {
                            direction = Directions.WEST;
                        } else if (RegionManager.canMove(current, Directions.SOUTH, size, character.getPrivateArea())) {
                            direction = Directions.SOUTH;
                        } else {
                            direction = Directions.NONE;
                        }
                        break;
                    case Direction.SOUTH_EAST:
                        if (RegionManager.canMove(current, Directions.EAST, size, character.getPrivateArea())) {
                            direction = Directions.EAST;
                        } else if (RegionManager.canMove(current, Directions.SOUTH, size, character.getPrivateArea())) {
                            direction = Directions.SOUTH;
                        } else {
                            direction = Directions.NONE;
                        }
                        break;
                    default:
                        break;
                }

                if (direction == Directions.NONE) {
                    return;
                }

                let next = current.transform(direction.getX(), direction.getY());
                if (RegionManager.canMove(current, next, size, size, character.getPrivateArea())) {
                    this.addStep(next);
                }
                return;
            }
            let attackDistance = CombatFactory.getMethod(character).attackDistance(character);

            // Find the nearest tile surrounding the target
            let destination = PathFinder.getClosestAttackableTile(character, following, attackDistance);
            if (destination == null) {
                return;
            }
        }

        PathFinder.calculateWalkRoute(character, destination.getX(), destination.getY());
    }

    // Gets the size of the queue.
    public size(): number {
        return this.points.length;
    }

    public isRunToggled(): boolean {
        return this.character.isPlayer() && (this.character as Player).isRunningReturn();
    }

    public setBlockMovement(blockMovement: boolean): MovementQueue {
        this.blockMovement = blockMovement;
        return this;
    }

    public isMovementBlocked(): boolean {
        return this.blockMovement;
    }

    public lastDestX: number;
    public lastDestY: number;
    public pathX: number;
    public pathY: number;

    public setPathX(x: number): MovementQueue {
        this.pathX = (this.character.getLocation().getRegionX() * 8) + x;
        return this;
    }

    public setPathY(y: number): MovementQueue {
        this.pathY = (this.character.getLocation().getRegionY() * 8) + y;
        return this;
    }

    private foundRoute: boolean;

    public setRoute(route: boolean) {
        this.foundRoute = route;
    }

    public hasRoute(): boolean {
        return this.foundRoute;
    }

    public pointsReturn(): Deque < Point > {
        return this.points;
    }

    public walkToGroundItem(pos: Location, action: () => void) {
        if (this.player.getLocation().getDistance(pos) == 0) {
            // If player is already at the ground item, run the action now
            action();
            return;
        }

        let mobility = this.getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(this.player);
            this.reset();
            return;
        }

        if (!this.checkDestination(pos)) {
            this.reset();
            return;
        }

        let destX = pos.getX();
        let destY = pos.getY();

        this.reset();

        this.walkToReset();

        PathFinder.calculateWalkRoute(this.player, destX, destY);

        TaskManager.submit(new Task(0, this.player.getIndex(), true), function () {

            let stage = 0;

            protected execute(): void {

            if(stage != 0) {
            this.player.getMovementQueue().reset();
            this.stop();
            this.player.getPacketSender().sendMessage("You can't reach that!");
            return;
        }

        if (!this.player.getMovementQueue().points.isEmpty()) {
            return;
        }

        if (!this.player.getMovementQueue().hasRoute() || this.player.getLocation().getX() != destX || this.player.getLocation().getY() != destY) {
            stage = -1;
            return;
        }

        if (action != null) {
            action();
        }
        this.player.getMovementQueue().reset();
        this.stop();
    }
        });
    }

    public walkToReset() {
        if (this.player == null) {
            return;
        }

        TaskManager.cancelTasks(this.player.getIndex());
        this.player.getCombat().setCastSpell(null);
        this.player.getCombat().reset();
        this.player.getSkillManager().stopSkillable();
        this.resetFollow();
    }

    public walkToEntity(entity: Mobile, runnable ?: () => void) {
        let destX = entity.getLocation().getX();
        let destY = entity.getLocation().getY();

        let mobility = this.getMobility();
        if (!mobility.canMove()) {
            mobility.sendMessage(this.player);
            this.reset();
            return;
        }

        if (!this.checkDestination(entity.getLocation())) {
            this.reset();
            return;
        }

        this.reset();

        this.walkToReset();

        PathFinder.calculateEntityRoute(this.player, destX, destY);

        if (!this.player.getMovementQueue().foundRoute) {
            // If the path finder couldn't find a route, you can't reach the entity
            this.player.getPacketSender().sendMessage("I can't reach that!");
            return;
        }

        let finalDestinationX = this.player.getMovementQueue().pathX;
        let finalDestinationY = this.player.getMovementQueue().pathY;

        TaskManager.submit(new Task(0, this.player.getIndex(), true), function () => {
            let currentX = entity.getLocation().getX();
            let currentY = entity.getLocation().getY();
            let reachStage = 0;
            protected execute() {
                this.player.setMobileInteraction(entity);
                if (currentX != entity.getLocation().getX() || currentY != entity.getLocation().getY()) {
                    this.reset();
                    currentX = entity.getLocation().getX();
                    currentY = entity.getLocation().getY();
                    PathFinder.calculateEntityRoute(this.player, currentX, currentY);
                }

                if (runnable && this.player.getMovementQueue().isWithinEntityInteractionDistance(entity.getLocation())) {
                    // Executes the runnable and stops the task. However, It will still path to the destination.
                    runnable();
                    return;
                }

                if (reachStage !== 0) {
                    if (reachStage === 1) {
                        player.getMovementQueue().reset();
                        stop();
                        return;
                    }
                    player.getMovementQueue().reset();
                    stop();
                    player.getPacketSender().sendMessage("I can't reach that!");
                    return;
                }

                if (!player.getMovementQueue().points.isEmpty()) {
                    return;
                }

                if (!player.getMovementQueue().hasRoute() || player.getLocation().getX() !== finalDestinationX || player.getLocation().getY() !== finalDestinationY) {
                    // Player hasn't got a route or they're not already at destination
                    reachStage = -1;
                    return;
                }

                reachStage = 1;
                return;
            }
        });
    }

    public walkToObject(object: GameObject, action: Action), {
        let mobility = this.getMobility();
        if(!mobility.canMove()) {
        mobility.sendMessage(this.player);
        this.reset();
        return;
    }
        
        Copy code
    if (!this.checkDestination(object.getLocation())) {
        this.reset();
        return;
    }

    this.reset();

    this.walkToReset();

    let objectX = object.getLocation().getX();
    let objectY = object.getLocation().getY();
    let type = object.getType();
    let id = object.getId();
    let direction = object.getFace();

    if (type == 10 || type == 11 || type == 22) {
        let xLength, yLength;
        let def = ObjectDefinition.forId(id);
        if (direction == 0 || direction == 2) {
            yLength = def.objectSizeX;
            xLength = def.objectSizeY;
        } else {
            yLength = def.objectSizeY;
            xLength = def.objectSizeX;
        }
        let blockingMask = def.blockingMask;

        if (direction != 0) {
            blockingMask = (blockingMask << direction & 0xf) + (blockingMask >> 4 - direction);
        }
        PathFinder.calculateObjectRoute(player, 0, objectX, objectY, xLength, yLength, 0, blockingMask);
    } else {
        PathFinder.calculateObjectRoute(player, type + 1, objectX, objectY, 0, 0, direction, 0);
    }

    const finalDestinationX = player.getMovementQueue().pathX;

    const finalDestinationY = player.getMovementQueue().pathY;

    //System.err.println("RequestedX=" + objectX + " requestedY=" + objectY + " givenX=" + finalDestinationX + " givenY=" + finalDestinationY);

    let finalObjectY = objectY;

    player.setPositionToFace(new Location(objectX, objectY));
    TaskManager.submit(new Task(1, player.getIndex(), true), {

        let, walkStage = 0,

        execute() {

            if (walkStage != 0) {

                if (objectX == player.getLocation().getX() && finalObjectY == player.getLocation().getY()) {
                    if (direction == 0)
                        player.setDirection(Direction.WEST);
                    else if (direction === 1) {
                        player.setDirection(Direction.NORTH);
                    } else if (direction === 2) {
                        player.setDirection(Direction.EAST);
                    } else if (direction === 3) {
                        player.setDirection(Direction.SOUTH);
                    }
                }
                pathX = player.getLocation().getX();
                pathY = player.getLocation().getY();
                if (walkStage === 1) {
                    if (action !== null) {
                        action.execute();
                    }
                    stop();
                    return;
                }
                stop();
                return;
            }
            if (points.isEmpty()) {
                return;
            }
                                
                                Copy code
            if (!player.getMovementQueue().hasRoute() || player.getLocation().getX() !== finalDestinationX || player.getLocation().getY() !== finalDestinationY) {
                walkStage = -1;
                /** When no destination is set = no possible route to requested tiles **/
                player.getPacketSender().sendMessage("You can't reach that!");
                return;
            }
            walkStage = 1;
        }
    });
    }

    private isAtPointOfFocus(destX: number, destY: number): boolean {
        return this.character.getLocation().getX() === destX && this.character.getLocation().getY() === destY;
    }
        
        public isAtDestination(): boolean {
        return this.points.isEmpty();
    }

    public isWithinEntityInteractionDistance(entityLocation: Location): boolean {
        return this.points.size() <= NPC_INTERACT_RADIUS &&
            this.player.getLocation().getDistance(entityLocation) <= NPC_INTERACT_RADIUS;
    }

    canMove(): boolean {
        return this == Mobility.MOBILE;
    },

    /**
     * Sends the appropriate message to the player about their (lack of) mobility.
     *
     * @param player The player to send the message to.
     */
     sendMessage(player: Player) {
        if (player == null) {
            return;
        }

        let message: string;

        switch (this) {
            case Mobility.FROZEN_SPELL:
                message = "A magical spell has made you unable to move.";
                break;
            case Mobility.STUNNED:
                message = "You're stunned!";
                break;
            case Mobility.BUSY:
                message = "You cannot do that right now.";
                break;
            case Mobility.DUEL_MOVEMENT_DISABLED:
                message = "Movement has been disabled in this duel!";
                break;
            default:
                // No message associated with this Mobility
                return;
        }

        player.getPacketSender().sendMessage(message);
    }
}

enum Mobility {
    INVALID,
    BUSY,
    FROZEN_SPELL,
    STUNNED,
    DUEL_MOVEMENT_DISABLED,
    MOBILE,

    /**
     * Determines whether the player is able to move.
     *
     * @return {boolean} canMove
     */
}

class Point {
    position: Location;
    direction: Direction;

    constructor(position: Location, direction: Direction) {
        this.position = position;
        this.direction = direction;
    }

    toString() {
        return `Point [direction=${this.direction}, position=${this.position}]`;
    }
}






