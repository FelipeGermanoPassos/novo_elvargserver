import { Mobile } from "../../../entity/impl/Mobile";

export class PathFinder {
    static WEST = 0x1280108;
    static EAST = 0x1280180;
    static SOUTH = 0x1280102;
    static NORTH = 0x1280120;
    static SOUTHEAST = 0x1280183;
    static SOUTHWEST = 0x128010e;
    static NORTHEAST = 0x12801e0;
    static NORTHWEST = 0x1280138;

    private static TILE_DISTANCE_DELTAS: Map<number, number[][]> = new Map<number, number[][]>()
        .set(1, [[-1, 0], [0, -1], [0, 1], [1, 0]])
        .set(2, [[-2, 0], [-1, -1], [-1, 1], [0, -2], [0, 2], [1, -1], [1, 1], [2, 0]])
        .set(3, [[-3, 0], [-2, -2], [-2, -1], [-2, 1], [-2, 2], [-1, -2], [-1, 2], [0, -3], [0, 3], [1, -2], [1, 2], [2, -2], [2, -1], [2, 1], [2, 2], [3, 0]])
        .set(4, [[-4, 0], [-3, -2], [-3, -1], [-3, 1], [-3, 2], [-2, -3], [-2, 3], [-1, -3], [-1, 3], [0, -4], [0, 4], [1, -3], [1, 3], [2, -3], [2, 3], [3, -2], [3, -1], [3, 1], [3, 2], [4, 0]])
        .set(5, [[-5, 0], [-4, -3], [-4, -2], [-4, -1], [-4, 1], [-4, 2], [-4, 3], [-3, -4], [-3, -3], [-3, 3], [-3, 4], [-2, -4], [-2, 4], [-1, -4], [-1, 4], [0, -5], [0, 5], [1, -4], [1, 4], [2, -4], [2, 4], [3, -4], [3, -3], [3, 3], [3, 4], [4, -3], [4, -2], [4, -1], [4, 1], [4, 2], [4, 3], [5, 0]])
        .set(6, [[-6, 0], [-5, -3], [-5, -2], [-5, -1], [-5, 1], [-5, 2], [-5, 3], [-4, -4], [-4, 4], [-3, -5], [-3, 5], [-2, -5], [-2, 5], [-1, -5], [-1, 5], [0, -6], [0, 6], [1, -5], [1, 5], [2, -5], [2, 5], [3, -5], [3, 5], [4, -4], [4, 4], [5, -3], [5, -2], [5, -1], [5, 1], [5, 2], [5, 3], [6, 0]])
        .set(7, [[-7, 0], [-6, -3], [-6, -2], [-6, -1], [-6, 1], [-6, 2], [-6, 3], [-5, -4], [-5, 4], [-4, -5], [-4, 5], [-3, -6], [-3, 6], [-2, -6], [-2, 6], [-1, -6], [-1, 6], [0, -7], [0, 7], [1, -6], [1, 6], [2, -6], [2, 6], [3, -6], [3, 6], [4, -5], [4, 5], [5, -4], [5, 4], [6, -3], [6, -2], [6, -1], [6, 1], [6, 2], [6, 3], [7, 0]])
        .set(8, [[-8, 0], [-7, -3], [-7, -2], [-7, -1], [-7, 1], [-7, 2], [-7, 3], [-6, -5], [-6, -4],
        [-6, 4], [-6, 5], [-5, -6], [-5, -5], [-5, 5], [-5, 6], [-4, -6], [-4, 6], [-3, -7], [-3, 7], [-2, -7],
        [-2, 7], [-1, -7], [-1, 7], [0, -8], [0, 8], [1, -7], [1, 7], [2, -7], [2, 7], [3, -7], [3, 7], [4, -6],
        [4, 6], [5, -6], [5, -5], [5, 5], [5, 6], [6, -5], [6, -4], [6, 4], [6, 5], [7, -3], [7, -2], [7, -1],
        [7, 1], [7, 2], [7, 3], [8, 0]])

        // Deltas which are exactly 9 squares away
        .set(9, [
            [-9, 0], [-8, -4], [-8, -3], [-8, -2], [-8, -1], [-8, 1], [-8, 2], [-8, 3], [-8, 4],
            [-7, -5], [-7, -4], [-7, 4], [-7, 5], [-6, -6], [-6, 6], [-5, -7], [-5, 7], [-4, -8], [-4, -7], [-4, 7],
            [-4, 8], [-3, -8], [-3, 8], [-2, -8], [-2, 8], [-1, -8], [-1, 8], [0, -9], [0, 9], [1, -8], [1, 8],
            [2, -8], [2, 8], [3, -8], [3, 8], [4, -8], [4, -7], [4, 7], [4, 8], [5, -7], [5, 7], [6, -6], [6, 6],
            [7, -5], [7, -4], [7, 4], [7, 5], [8, -4], [8, -3], [8, -2], [8, -1], [8, 1], [8, 2], [8, 3], [8, 4], [9, 0]])
        .set(10, [
            [-10, 0], [-9, -4], [-9, -3], [-9, -2], [-9, -1], [-9, 1], [-9, 2], [-9, 3], [-9, 4],
            [-8, -6], [-8, -5], [-8, 5], [-8, 6], [-7, -7], [-7, -6], [-7, 6], [-7, 7], [-6, -8], [-6, -7], [-6, 7],
            [-6, 8], [-5, -8], [-5, 8], [-4, -9], [-4, 9], [-3, -9], [-3, 9], [-2, -9], [-2, 9], [-1, -9], [-1, 9],
            [0, -10], [0, 10], [1, -9], [1, 9], [2, -9], [2, 9], [3, -9], [3, 9], [4, -9], [4, 9], [5, -8], [5, 8],
            [6, -8], [6, -7], [6, 7], [6, 8], [7, -7], [7, -6], [7, 6], [7, 7], [8, -6], [8, -5], [8, 5], [8, 6], [9, -4],
            [9, -3], [9, -2], [9, -1], [9, 1], [9, 2], [9, 3], [9, 4], [10, 0]
        ]);

        function isInDiagonalBlock(attacker: Location, attacked: Location): boolean {
    return attacked.getX() - 1 == attacker.getX() && attacked.getY() + 1 == attacker.getY()
        || attacker.getX() - 1 == attacked.getX() && attacker.getY() + 1 == attacked.getY()
        || attacked.getX() + 1 == attacker.getX() && attacked.getY() - 1 == attacker.getY()
        || attacker.getX() + 1 == attacked.getX() && attacker.getY() - 1 == attacked.getY()
        || attacked.getX() + 1 == attacker.getX() && attacked.getY() + 1 == attacked.getY()
        || attacker.getX() + 1 == attacked.getX() && attacker.getY() + 1 == attacker.getY();
}

function isDiagonalLocation(att: Mobile, def: Mobile): boolean {
    let attacker = att.getLocation().clone();
    let attacked = def.getLocation().clone();
    let isDia = attacker.getX() - 1 == attacked.getX() && attacker.getY() + 1 == attacked.getY() //top left
        || attacker.getX() + 1 == attacked.getX() && attacker.getY() - 1 == attacked.getY() //bottom right
        || attacker.getX() + 1 == attacked.getX() && attacker.getY() + 1 == attacked.getY() //top right
        || attacker.getX() - 1 == attacked.getX() && attacker.getY() - 1 == attacked.getY(); //bottom right
    return isDia;
}

public function calculateCombatRoute(player: Mobile, target: Mobile) {
    calculateRoute(player, 0, target.location.x, target.location.y, 1, 1, 0, 0, false);
    player.mobileInteraction = target;
}

public function calculateEntityRoute(player: Mobile, destX: number, destY: number) {
    calculateRoute(player, 0, destX, destY, 1, 1, 0, 0, false);
}

public static function calculateWalkRoute(player: Mobile, destX: number, destY: number) {
    calculateRoute(player, 0, destX, destY, 0, 0, 0, 0, true);
}

public function calculateObjectRoute(entity: Mobile, size: number, destX: number, destY: number, xLength: number, yLength: number, direction: number, blockingMask: number) {
    calculateRoute(entity, size, destX, destY, xLength, yLength, direction, blockingMask, false);
}

public function getClosestAttackableTile(attacker: Mobile, defender: Mobile, distance: number): Location | null {
    const privateArea = attacker.privateArea;
    const targetLocation = defender.location;

    if (distance === 1) {
        const size = attacker.size;
        const followingSize = defender.size;
        const current = attacker.location;

        const tiles: Location[] = [];
        for (const tile of defender.outterTiles()) {
            if (!RegionManager.canMove(attacker.location, tile, size, size, privateArea)
                || RegionManager.blocked(tile, privateArea)) {
                continue;
            }
            // Projectile attack
            if (attacker.useProjectileClipping() && !RegionManager.canProjectileAttack(tile, targetLocation, size, privateArea)) {
                continue;
            }
            tiles.push(tile);
        }
        if (tiles.length !== 0) {
            tiles.sort((l1, l2) => {
                const distance1 = l1.getDistance(current);
                const distance2 = l2.getDistance(current);
                const delta = (distance1 - distance2);

                // Make sure we don't pick a diagonal tile if we're a small entity and have to
                // attack closely (melee).
                if (distance1 === distance2 && size === 1 && followingSize === 1) {
                    if (l1.isPerpendicularTo(current)) {
                        return -1;
                    } else if (l2.isPerpendicularTo(current)) {
                        return 1;
                    }
                }

                return delta;
            });

            return tiles[0];
        }
    }

    let tile: Location | undefined = undefined;

    // Starting from the max distance, try to find a suitable tile to attack from
    while (tile === undefined) {
        // Fetch the circumference of the closest attackable tiles to the target
        const possibleTiles = getTilesForDistance(targetLocation, distance);

        if (DEBUG_ATTACK_DISTANCE && attacker.isPlayer() && attacker.asPlayer.rights === PlayerRights.DEVELOPER) {
            // If we're debugging attack range
            possibleTiles.forEach(t => attacker.asPlayer.packetSender.sendGraphic(AttackRange.PURPLE_GLOW, t));
        }

        tile = possibleTiles
            // Filter out any tiles which are clipped
            .filter(t => !RegionManager.blocked(t, attacker.privateArea))
            // Filter out any tiles which projectiles are blocked from (i.e. tree is in the way)
            .filter(t => RegionManager.canProjectileAttack(attacker, t, targetLocation))
            // Find the tile closest to the attacker
            .sort((a, b) => attacker.location.getDistance(a) - attacker.location.getDistance(b))[0];

        if (distance === 1) {
            // We've reached the closest attackable tile, break out of the loop as we can't get any closer
            break;
        } else {
            // Check 1 square closer if we don't have any valid tiles at this distance
            distance = Math.max(distance - 1, 1);
        }
    }

    if (!tile) {
        attacker.sendMessage("I can't reach that.");
        return;
    }

    return tile;
}

public static getTilesForDistance(center: Location, distance: number): Location[] {
    const deltas = TILE_DISTANCE_DELTAS.get(Math.min(distance, CombatConstants.MAX_ATTACK_DISTANCE));
    return deltas.map((d) => center.clone().translate(d[0], d[1]));
}

public static getTilesForDistance(center: Location, distance: number): Location[] {
    const deltas = TILE_DISTANCE_DELTAS.get(Math.min(distance, CombatConstants.MAX_ATTACK_DISTANCE));
    return deltas.map((d) => center.clone().translate(d[0], d[1]));
}

export function calculateRoute(entity: Mobile, size: number, destX: number, destY: number, xLength: number, yLength: number, direction: number, blockingMask: number, basicPather: boolean): number {

    /** RS Protocol **/
    const byte0 = 104;
    const byte1 = 104;

    let directions: number[][] = new Array(104);
    for (let i = 0; i < directions.length; i++) {
        directions[i] = new Array(104).fill(0);
    }

    let distanceValues: number[][] = new Array(104);
    for (let i = 0; i < distanceValues.length; i++) {
        distanceValues[i] = new Array(104).fill(0x5f5e0ff);
    }

    let routeStepsX: number[] = new Array(4096);
    let routeStepsY: number[] = new Array(4096);

    let anInt1264 = 0;
    let anInt1288 = 0;

    entity.movementQueue.lastDestX = destX;
    entity.movementQueue.lastDestY = destY;

    for (let l2 = 0; l2 < 104; l2++) {
        for (let i3 = 0; i3 < 104; i3++) {
            directions[l2][i3] = 0;
            distanceValues[l2][i3] = 0x5f5e0ff;
        }
    }

    /** Required for based on client **/
    let localX = entity.location.localX;
    let localY = entity.location.localY;
    /** Stored LocalX/Y into another temp list **/
    let baseX = localX;
    let baseY = localY;
    /** DestinationX for LocalX **/
    let destinationX = destX - (entity.location.regionX << 3);
    /** DestinationY for LocalY **/
    let destinationY = destY - (entity.location.regionY << 3);
    /** RS Protocol **/
    directions[localX][localY] = 99;
    distanceValues[localX][localY] = 0;
    /** Size of the 2nd queue **/
    let tail = 0;
    /** Size of the 1st queue **/
    let queueIndex = 0;
    /** Set in order to loop to find best path **/
    routeStepsX[tail] = localX;
    routeStepsY[tail++] = localY;
    /** Required for custom object walk-to actions. **/
    entity.movementQueue.setRoute(false);
    /** Size of the main queue **/
    let queueSizeX = routeStepsX.length;
    /** Entities height **/
    let height = entity.location.z;
    /** Private Area **/
    let area: PrivateArea = entity.privateArea;
    /** Steps taken to get to best route **/
    let steps = 0;
    /** Loops and checks flags for best route to destination. **/
    while (queueIndex != tail) {
        baseX = routeStepsX[queueIndex];
        baseY = routeStepsY[queueIndex];
        queueIndex = (queueIndex + 1) % queueSizeX;
        let absoluteX = (entity.location.regionX << 3) + baseX;
        let absoluteY = (entity.location.regionY << 3) + baseY;

        if (baseX == destinationX && baseY == destinationY) {
            entity.movementQueue.setRoute(true);
            entity.movementQueue.setPathX(baseX).setPathY(baseY);
            console.log("Already at destination, breaking loop");
            break;
        }

        if (size != 0) {
            /** Used for basic walking and other packet interactions also size 10 **/
            if ((size < 5 || size == 10) && defaultRoutePath(entity, destinationX, baseX, baseY, direction, size - 1, destinationY)) {
                console.log("Using normal entity pathing..");
                entity.movementQueue.setRoute(true);
                break;
            }
            /** Used for larger entities e.g corp/kbd ect **/
            if (size < 10 && largeRoutePath(entity, destinationX, destinationY, baseY, size - 1, direction, baseX)) {
                Server.logDebug("Using larger Size Pathing..");
                entity.movementQueue.setRoute(true);
                break;
            }
        }
        if (size < 10 && largeRoutePath(entity, destinationX, destinationY, baseY, size - 1, direction, baseX)) {
            Server.logDebug("Using larger Size Pathing..");
            entity.movementQueue.setRoute(true);
            break;
        }
        let priceValue = distanceValues[baseX][baseY] + 1;

        if (baseX > 0 && directions[baseX - 1][baseY] == 0 && (RegionManager.getClipping(absoluteX - 1, absoluteY, height, area) & WEST) == 0) {
            routeStepsX[tail] = baseX - 1;
            routeStepsY[tail] = baseY;
            tail = (tail + 1) % queueSizeX;
            directions[baseX - 1][baseY] = 2;
            distanceValues[baseX - 1][baseY] = priceValue;
        }

        if (baseX < byte0 - 1 && directions[baseX + 1][baseY] == 0 && (RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & EAST) == 0) {
            routeStepsX[tail] = baseX + 1;
            routeStepsY[tail] = baseY;
            tail = (tail + 1) % queueSizeX;
            directions[baseX + 1][baseY] = 8;
            distanceValues[baseX + 1][baseY] = priceValue;
        }
        if (baseY > 0 && directions[baseX][baseY - 1] == 0 && (RegionManager.getClipping(absoluteX, absoluteY - 1, height, area) & SOUTH) == 0) {
            routeStepsX[tail] = baseX;
            routeStepsY[tail] = baseY - 1;
            tail = (tail + 1) % queueSizeX;
            directions[baseX][baseY - 1] = 1;
            distanceValues[baseX][baseY - 1] = priceValue;
        }
        if (baseY < byte1 - 1 && directions[baseX][baseY + 1] == 0 && (RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & NORTH) == 0) {
            routeStepsX[tail] = baseX;
            routeStepsY[tail] = baseY + 1;
            tail = (tail + 1) % queueSizeX;
            directions[baseX][baseY + 1] = 4;
            distanceValues[baseX][baseY + 1] = priceValue;
        }
        if (baseX > 0 && baseY > 0 && directions[baseX - 1][baseY - 1] === 0 && (RegionManager.getClipping(absoluteX - 1, absoluteY - 1, height, area) & SOUTHWEST) === 0
            && (RegionManager.getClipping(absoluteX - 1, absoluteY, height, area) & WEST) === 0 && (RegionManager.getClipping(absoluteX, absoluteY - 1, height, area) & SOUTH) === 0) {
            routeStepsX[tail] = baseX - 1;
            routeStepsY[tail] = baseY - 1;
            tail = (tail + 1) % queueSizeX;
            directions[baseX - 1][baseY - 1] = 3;
            distanceValues[baseX - 1][baseY - 1] = priceValue;
        }

        if (baseX < byte0 - 1 && baseY > 0 && directions[baseX + 1][baseY - 1] === 0
            && (RegionManager.getClipping(absoluteX + 1, absoluteY - 1, height, area) & SOUTHEAST) === 0 && (RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & EAST) === 0
            && (RegionManager.getClipping(absoluteX, absoluteY - 1, height, area) & SOUTH) === 0) {
            routeStepsX[tail] = baseX + 1;
            routeStepsY[tail] = baseY - 1;
            tail = (tail + 1) % queueSizeX;
            directions[baseX + 1][baseY - 1] = 9;
            distanceValues[baseX + 1][baseY - 1] = priceValue;
        }

        if (baseX > 0 && baseY < byte1 - 1 && directions[baseX - 1][baseY + 1] === 0
            && (RegionManager.getClipping(absoluteX - 1, absoluteY + 1, height, area) & NORTHWEST) === 0 && (RegionManager.getClipping(absoluteX - 1, absoluteY, height, area) & WEST) === 0
            && (RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & NORTH) === 0) {
            routeStepsX[tail] = baseX - 1;
            routeStepsY[tail] = baseY + 1;
            tail = (tail + 1) % queueSizeX;
            directions[baseX - 1][baseY + 1] = 6;
            distanceValues[baseX - 1][baseY + 1] = priceValue;
        }
        if (baseX < byte0 - 1 && baseY < byte1 - 1 && directions[baseX + 1][baseY + 1] === 0
            && (RegionManager.getClipping(absoluteX + 1, absoluteY + 1, height, area) & NORTHEAST) === 0 && (RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & EAST) === 0
            && (RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & NORTH) === 0) {
            routeStepsX[tail] = baseX + 1;
            routeStepsY[tail] = baseY + 1;
        }
        if (baseX < byte0 - 1 && baseY < byte1 - 1 && directions[baseX + 1][baseY + 1] === 0 &&
            (RegionManager.getClipping(absoluteX + 1, absoluteY + 1, height, area) & NORTHEAST) === 0 &&
            (RegionManager.getClipping(absoluteX + 1, absoluteY, height, area) & EAST) === 0 &&
            (RegionManager.getClipping(absoluteX, absoluteY + 1, height, area) & NORTH) === 0) {
            routeStepsX[tail] = baseX + 1;
            routeStepsY[tail] = baseY + 1;
            tail = (tail + 1) % queueSizeX;
            directions[baseX + 1][baseY + 1] = 12;
            distanceValues[baseX + 1][baseY + 1] = priceValue;
        }
    }
    anInt1264 = 0;
            
            Copy code
    if (!entity.getMovementQueue().hasRoute()) {
        if (basicPather) {
            let cost = 100;
            for (let range = 1; range < 5; range++) {
                for (let xOffset = destinationX - range; xOffset <= destinationX + range; xOffset++) {
                    for (let yOffset = destinationY - range; yOffset <= destinationY + range; yOffset++) {
                        if (xOffset >= 0 && yOffset >= 0 && xOffset < 104 && yOffset < 104 && distanceValues[xOffset][yOffset] < cost) {
                            cost = distanceValues[xOffset][yOffset];
                            baseX = xOffset;
                            baseY = yOffset;
                            anInt1264 = 1;
                            entity.getMovementQueue().setRoute(true);
                        }
                    }
                }
                if (entity.getMovementQueue().hasRoute())
                    break;
            }
        }
        if (!entity.getMovementQueue().hasRoute()) {
            Server.logDebug("error.. no path found... path probably not reachable.");
            return -1;
        }
    }

    queueIndex = 0;
    routeStepsX[queueIndex] = baseX;
    routeStepsY[queueIndex++] = baseY;

    let l5;
    for (let dirc = l5 = directions[baseX][baseY]; baseX !== localX || baseY !== localY; dirc = directions[baseX][baseY]) {
        if (dirc !== l5) {
            l5 = dirc;
            routeStepsX[queueIndex] = baseX;
            routeStepsY[queueIndex++] = baseY;
        }
        if ((dirc & 2) !== 0)
            baseX++;
        else if ((dirc & 8) !== 0)
            baseX--;
        if ((dirc & 1) !== 0)
            baseY++;
        else if ((dirc & 4) !== 0)
            baseY--;
    }

    if (queueIndex > 0) {

        if (queueIndex > 25)
            queueIndex = 25;
        queueIndex = 25;
    }
    while (queueIndex-- > 0) {
        let absX = entity.getLocation().getRegionX() * 8 + routeStepsX[queueIndex];
        let absY = entity.getLocation().getRegionY() * 8 + routeStepsY[queueIndex];
        entity.getMovementQueue().addStep(new Location(absX, absY, height));
        steps++;
    }
}
return steps;
}