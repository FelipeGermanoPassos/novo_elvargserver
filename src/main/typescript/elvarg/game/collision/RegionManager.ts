import { Region } from './Region';

export static class RegionManager {
    public static PROJECTILE_NORTH_WEST_BLOCKED = 0x200;
    public static PROJECTILE_NORTH_BLOCKED = 0x400;
    public static PROJECTILE_NORTH_EAST_BLOCKED = 0x800;
    public static PROJECTILE_EAST_BLOCKED = 0x1000;
    public static PROJECTILE_SOUTH_EAST_BLOCKED = 0x2000;
    public static PROJECTILE_SOUTH_BLOCKED = 0x4000;
    public static PROJECTILE_SOUTH_WEST_BLOCKED = 0x8000;
    public static PROJECTILE_WEST_BLOCKED = 0x10000;
    public static PROJECTILE_TILE_BLOCKED = 0x20000;
    public static UNKNOWN = 0x80000;
    public static BLOCKED_TILE = 0x200000;
    public static UNLOADED_TILE = 0x1000000;
    public static OCEAN_TILE = 2097152;

    public static regions: Map<number, Region> = new Map<number, Region>();

    public static init(): void {
        // Load object definitions..
        ObjectDefinition.init();
        // Load regions..
        let map_index = new File(GameConstants.CLIPPING_DIRECTORY + "map_index");
        if (!map_index.exists()) {
            throw new OperationNotSupportedException("map_index was not found!");
        }
        let data = Files.readAllBytes(map_index.toPath());
        let stream = new Buffer(data);
        let size = stream.readUShort();
        for (let i = 0; i < size; i++) {
            let regionId = stream.readUShort();
            let terrainFile = stream.readUShort();
            let objectFile = stream.readUShort();
            RegionManager.regions.put(regionId, newRegion(regionId, terrainFile, objectFile));
        }
    }

    public static getRegion(regionId: number): Optional<Region> {
        return Optional.ofNullable(regions.get(regionId));
    }

    public static getRegion(x: number, y: number): Optional<Region> {
        loadMapFiles(x, y);
        let regionX = x >> 3;
        let regionY = y >> 3;
        let regionId = ((regionX / 8) << 8) + (regionY / 8);
        return getRegion(regionId);
    }
    private static addClippingForVariableObject(x: number, y: number, height: number, type: number, direction: number, tall: boolean, privateArea: PrivateArea) {
        if (type == 0) {
            if (direction == 0) {
                addClipping(x, y, height, 128, privateArea);
                addClipping(x - 1, y, height, 8, privateArea);
            } else if (direction == 1) {
                addClipping(x, y, height, 2, privateArea);
                addClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 2) {
                addClipping(x, y, height, 8, privateArea);
                addClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 3) {
                addClipping(x, y, height, 32, privateArea);
                addClipping(x, y - 1, height, 2, privateArea);
            }
        } else if (type == 1 || type == 3) {
            if (direction == 0) {
                addClipping(x, y, height, 1, privateArea);
                addClipping(x - 1, y, height, 16, privateArea);
            } else if (direction == 1) {
                addClipping(x, y, height, 4, privateArea);
                addClipping(x + 1, y + 1, height, 64, privateArea);
            } else if (direction == 2) {
                addClipping(x, y, height, 16, privateArea);
                addClipping(x + 1, y - 1, height, 1, privateArea);
            } else if (direction == 3) {
                addClipping(x, y, height, 64, privateArea);
                addClipping(x - 1, y - 1, height, 4, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                addClipping(x, y, height, 130, privateArea);
                addClipping(x - 1, y, height, 8, privateArea);
                addClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 1) {
                addClipping(x, y, height, 10, privateArea);
                addClipping(x, y + 1, height, 32, privateArea);
                addClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 2) {
                addClipping(x, y, height, 40, privateArea);
                addClipping(x + 1, y, height, 128, privateArea);
                addClipping(x, y - 1, height, 2, privateArea);
            } else if (direction == 3) {
                addClipping(x, y, height, 160, privateArea);
                addClipping(x, y - 1, height, 2, privateArea);
                addClipping(x - 1, y, height, 8, privateArea);
            }
        }
    }
    if(tall) {
        // If an object is tall, it blocks projectiles too
        if (type == 0) {
            if (direction == 0) {
                addClipping(x, y, height, 65536, privateArea);
                addClipping(x - 1, y, height, 4096, privateArea);
            } else if (direction == 1) {
                addClipping(x, y, height, 1024, privateArea);
                addClipping(x, y + 1, height, 16384, privateArea);
            } else if (direction == 2) {
                addClipping(x, y, height, 4096, privateArea);
                addClipping(x + 1, y, height, 65536, privateArea);
            } else if (direction == 3) {
                addClipping(x, y, height, 16384, privateArea);
                addClipping(x, y - 1, height, 1024, privateArea);
            }
        } else if (type == 1 || type == 3) {
            if (direction == 0) {
                addClipping(x, y, height, 512, privateArea);
                addClipping(x - 1, y + 1, height, 8192, privateArea);
            } else if (direction == 1) {
                addClipping(x, y, height, 2048, privateArea);
                addClipping(x + 1, y + 1, height, 32768, privateArea);
            } else if (direction == 2) {
                addClipping(x, y, height, 8192, privateArea);
                addClipping(x + 1, y + 1, height, 512, privateArea);
            } else if (direction == 3) {
                addClipping(x, y, height, 32768, privateArea);
                addClipping(x - 1, y - 1, height, 2048, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                addClipping(x, y, height, 66560, privateArea);
                addClipping(x - 1, y, height, 4096, privateArea);
                addClipping(x, y + 1, height, 16384, privateArea);
            } else if (direction == 1) {
                addClipping(x, y, height, 5120, privateArea);
                addClipping(x, y + 1, height, 16384, privateArea);
                addClipping(x + 1, y, height, 65536, privateArea);
            } else if (direction == 2) {
                addClipping(x, y, height, 20480, privateArea);
                addClipping(x + 1, y, height, 65536, privateArea);
                addClipping(x, y - 1, height, 1024, privateArea);
            } else if (direction == 3) {
                addClipping(x, y, height, 81920, privateArea);
                addClipping(x, y - 1, height, 1024, privateArea);
                addClipping(x - 1, y, height, 4096, privateArea);
            }
        }
    }
    removeClippingForVariableObject(x: number, y: number, height: number, type: number, direction: number, tall: boolean, privateArea: PrivateArea) {
        if (type == 0) {
            if (direction == 0) {
                removeClipping(x, y, height, 128, privateArea);
                removeClipping(x - 1, y, height, 8, privateArea);
            } else if (direction == 1) {
                removeClipping(x, y, height, 2, privateArea);
                removeClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 2) {
                removeClipping(x, y, height, 8, privateArea);
                removeClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 3) {
                removeClipping(x, y, height, 32, privateArea);
                removeClipping(x, y - 1, height, 2, privateArea);
            }
        } else if (type == 1 || type == 3) {
            if (direction == 0) {
                removeClipping(x, y, height, 1, privateArea);
                removeClipping(x - 1, y, height, 16, privateArea);
            } else if (direction == 1) {
                removeClipping(x, y, height, 4, privateArea);
                removeClipping(x + 1, y + 1, height, 64, privateArea);
            } else if (direction == 2) {
                removeClipping(x, y, height, 16, privateArea);
                removeClipping(x + 1, y - 1, height, 1, privateArea);
            } else if (direction == 3) {
                removeClipping(x, y, height, 64, privateArea);
                removeClipping(x - 1, y - 1, height, 4, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                removeClipping(x, y, height, 130, privateArea);
                removeClipping(x - 1, y, height, 8, privateArea);
                removeClipping(x, y + 1, height, 32, privateArea);
            } else if (direction == 1) {
                removeClipping(x, y, height, 10, privateArea);
                removeClipping(x, y + 1, height, 32, privateArea);
                removeClipping(x + 1, y, height, 128, privateArea);
            } else if (direction == 2) {
                removeClipping(x, y, height, 40, privateArea);
                removeClipping(x + 1, y, height, 128, privateArea);
                removeClipping(x, y - 1, height, 2, privateArea);
            } else if (direction == 3) {
                removeClipping(x, y, height, 160, privateArea);
                removeClipping(x, y - 1, height, 2, privateArea);
                removeClipping(x - 1, y, height, 8, privateArea);
            }
        }

        if (tall) {
            // If an object is tall, it blocks projectiles too
            if (type === 0) {
                if (direction === 0) {
                    removeClipping(x, y, height, 65536, privateArea);
                    removeClipping(x - 1, y, height, 4096, privateArea);
                } else if (direction === 1) {
                    removeClipping(x, y, height, 1024, privateArea);
                    removeClipping(x, y + 1, height, 16384, privateArea);
                } else if (direction === 2) {
                    removeClipping(x, y, height, 4096, privateArea);
                    removeClipping(x + 1, y, height, 65536, privateArea);
                } else if (direction === 3) {
                    removeClipping(x, y, height, 16384, privateArea);
                    removeClipping(x, y - 1, height, 1024, privateArea);
                }
            }
        }
        if (type == 1 || type == 3) {
            if (direction == 0) {
                removeClipping(x, y, height, 512, privateArea);
                removeClipping(x - 1, y + 1, height, 8192, privateArea);
            } else if (direction == 1) {
                removeClipping(x, y, height, 2048, privateArea);
                removeClipping(x + 1, y + 1, height, 32768, privateArea);
            } else if (direction == 2) {
                removeClipping(x, y, height, 8192, privateArea);
                removeClipping(x + 1, y + 1, height, 512, privateArea);
            } else if (direction == 3) {
                removeClipping(x, y, height, 32768, privateArea);
                removeClipping(x - 1, y - 1, height, 2048, privateArea);
            }
        } else if (type == 2) {
            if (direction == 0) {
                removeClipping(x, y, height, 66560, privateArea);
                removeClipping(x - 1, y, height, 4096, privateArea);
                removeClipping(x, y + 1, height, 16384, privateArea);
            } else if (direction == 1) {
                removeClipping(x, y, height, 5120, privateArea);
                removeClipping(x, y + 1, height, 16384, privateArea);
                removeClipping(x + 1, y, height, 65536, privateArea);
            } else if (direction == 2) {
                removeClipping(x, y, height, 20480, privateArea);
                removeClipping(x + 1, y, height, 65536, privateArea);
                removeClipping(x, y - 1, height, 1024, privateArea);
            } else if (direction == 3) {
                this.removeClipping(x, y, height, 81920, privateArea);
                removeClipping(x, y - 1, height, 1024, privateArea);
                removeClipping(x - 1, y, height, 4096, privateArea);
            }
        }
    }
    private static addClippingForSolidObject(x: number, y: number, height: number, xLength: number, yLength: number, flag: boolean, privateArea: PrivateArea): void {
        let clipping: number = 256;
        if (flag) {
            clipping += 0x20000;
        }
        for (let i = x; i < x + xLength; i++) {
            for (let i2 = y; i2 < y + yLength; i2++) {
                addClipping(i, i2, height, clipping, privateArea);
            }
        }
    }

    private static removeClippingForSolidObject(x: number, y: number, height: number, xLength: number, yLength: number, flag: boolean, privateArea: PrivateArea): void {
        let clipping: number = 256;
        if (flag) {
            clipping += 0x20000;
        }

        for (let x_ = x; x_ < x + xLength; x_++) {
            for (let y_ = y; y_ < y + yLength; y_++) {
                removeClipping(x_, y_, height, clipping, privateArea);
            }
        }
    }

export function addObject(objectId: number, x: number, y: number, height: number, type: number, direction: number) {
    const position = new Location(x, y, height);

    if (height === 0) {
        if (x >= 3092 && x <= 3094 && (y === 3513 || y === 3514 || y === 3507 || y === 3506)) {
            objectId = -1;
        }
    }

    switch (objectId) {
        case 14233: // pest control gates
        case 14235: // pest control gates
            return;
    }

    if (objectId === -1) {
        MapObjects.clear(position, type);
    } else {
        MapObjects.add(new GameObject(objectId, position, type, direction, null));
    }
}
export static function addObjectClipping(object: GameObject) {
    const id = object.getId();
    const x = object.getLocation().getX();
    const y = object.getLocation().getY();
    const height = object.getLocation().getZ();
    const type = object.getType();
    const direction = object.getFace();
    
    Copy code
    if (id === -1) {
        removeClipping(x, y, height, 0x000000, object.getPrivateArea());
        return;
    }

    const def = object.getDefinition();
    if (!def) {
        return;
    }

    let xLength: number;
    let yLength: number;
    if (direction !== 1 && direction !== 3) {
        xLength = def.getSizeX();
        yLength = def.getSizeY();
    } else {
        yLength = def.getSizeX();
        xLength = def.getSizeY();
    }

    if (type === 22) {
        if (def.hasActions() && def.solid) {
            addClipping(x, y, height, 0x200000, object.getPrivateArea());
        }
    } else if (type >= 9) {
        if (def.solid) {
            addClippingForSolidObject(x, y, height, xLength, yLength, def.impenetrable, object.getPrivateArea());
        }
    } else if (type >= 0 && type <= 3) {
        if (def.solid) {
            addClippingForVariableObject(x, y, height, type, direction, def.impenetrable, object.getPrivateArea());
        }
    }
}
export static function removeObjectClipping(object: GameObject) {
    const x = object.getLocation().getX();
    const y = object.getLocation().getY();
    const height = object.getLocation().getZ();
    const type = object.getType();
    const direction = object.getFace();

    if (object.getId() === -1) {
        removeClipping(x, y, height, 0x000000, object.getPrivateArea());
        return;
    }

    const def = object.getDefinition();
    if (!def) {
        return;
    }
    let xLength: number;
    let yLength: number;
    if (direction !== 1 && direction !== 3) {
        xLength = def.getSizeX();
        yLength = def.getSizeY();
    } else {
        yLength = def.getSizeX();
        xLength = def.getSizeY();
    }

    if (type === 22) {
        if (def.hasActions() && def.solid) {
            removeClipping(x, y, height, 0x200000, object.getPrivateArea());
        }
    } else if (type >= 9) {
        if (def.solid) {
            removeClippingForSolidObject(x, y, height, xLength, yLength, def.solid, object.getPrivateArea());
        }
    } else if (type >= 0 && type <= 3) {
        if (def.solid) {
            removeClippingForVariableObject(x, y, height, type, direction, def.solid, object.getPrivateArea());
        }
    }
}

export static function addClipping(x: number, y: number, height: number, shift: number, privateArea: PrivateArea) {
    if (privateArea) {
        privateArea.setClip(new Location(x, y, height), shift);
        return;
    }
    const r = getRegion(x, y);
    if (r) {
        r.addClip(x, y, height, shift);
    }
}

export static function removeClipping(x: number, y: number, height: number, shift: number, privateArea: PrivateArea) {
    if (privateArea) {
        privateArea.removeClip(new Location(x, y, height));
        return;
    }
    const r = getRegion(x, y);
    if (r) {
        r.removeClip(x, y, height, shift);
    }
}

export static function getClipping(x: number, y: number, height: number, privateArea: PrivateArea) {
    if (privateArea) {
        const privateClip = privateArea.getClip(new Location(x, y, height));
        if (privateClip !== 0) {
            return privateClip;
        }
    }


    const r = getRegion(x, y);
    if (r) {
        return r.getClip(x, y, height);
    }
    return 0;
}

export static function wallExists(location: Location, area: PrivateArea, type: number) {
    const object = MapObjects.get(location, type, area);
    if (object) {
        const objectDef = object.getDefinition();
        if (!objectDef.name || objectDef.name === "null") {
            return true;
        }
    }
    return false;
}

export static function wallsExist(location: Location, area: PrivateArea) {
    if (wallExists(location, area, 0)) {
        return true;
    }
    if (wallExists(location, area, 1)) {
        return true;
    }
    if (wallExists(location, area, 2)) {
        return true;
    }
    if (wallExists(location, area, 3)) {
        return true;
    }
    if (wallExists(location, area, 9)) {
        return true;
    }
    return false;
}

export static function canMove(pos: Location, direction: number, privateArea: PrivateArea) {
    if (direction === 0) {
        return !blockedNorthWest(pos, privateArea) && !blockedNorth(pos, privateArea) && !blockedWest(pos, privateArea);
    } else if (direction === 1) {
        return !blockedNorth(pos, privateArea);
    } else if (direction === 2) {
        return !blockedNorthEast(pos, privateArea) && !blockedNorth(pos, privateArea) && !blockedEast(pos, privateArea);
    } else if (direction === 3) {
        return !blockedWest(pos, privateArea);
    } else if (direction === 4) {
        return !blockedEast(pos, privateArea);
    } else if (direction === 5) {
        return !blockedSouthWest(pos, privateArea) && !blockedSouth(pos, privateArea) && !blockedWest(pos, privateArea);
    } else if (direction === 6) {
        return !blockedSouth(pos, privateArea);
    } else if (direction === 7) {
        return !blockedSouthEast(pos, privateArea) && !blockedSouth(pos, privateArea) && !blockedEast(pos, privateArea);
    }
    return false;
}

export static function blockedProjectile(position: Location, privateArea: PrivateArea) {
    return (getClipping(position.getX(), position.getY(), position.getZ(), privateArea) & 0x20000) === 0;
}

export static function blocked(pos: Location, privateArea: PrivateArea) {
    return (getClipping(pos.getX(), pos.getY(), pos.getZ(), privateArea) & 0x1280120) !== 0;
}

export static function blockedNorth(pos: Location, privateArea: PrivateArea) {
    return (getClipping(pos.getX(), pos.getY() + 1, pos.getZ(), privateArea) & 0x1280120) !== 0;
}

export static function blockedEast(pos: Location, privateArea: PrivateArea) {
    return (getClipping(pos.getX() + 1, pos.getY(), pos.getZ(), privateArea) & 0x1280180) !== 0;
}

export static function blockedSouth(pos: Location, privateArea: PrivateArea) {
    return (getClipping(pos.getX(), pos.getY() - 1, pos.getZ(), privateArea) & 0x1280102) !== 0;
}

export static function blockedWest(pos: Location, privateArea: PrivateArea): boolean {
    return (getClipping(pos.getX() - 1, pos.getY(), pos.getZ(), privateArea) & 0x1280108) != 0;
}

export static function blockedNorthEast(pos: Location, privateArea: PrivateArea): boolean {
    return (getClipping(pos.getX() + 1, pos.getY() + 1, pos.getZ(), privateArea) & 0x12801e0) != 0;
}

export static function blockedNorthWest(pos: Location, privateArea: PrivateArea): boolean {
    return (getClipping(pos.getX() - 1, pos.getY() + 1, pos.getZ(), privateArea) & 0x1280138) != 0;
}

export static function blockedSouthEast(pos: Location, privateArea: PrivateArea): boolean {
    return (getClipping(pos.getX() + 1, pos.getY() - 1, pos.getZ(), privateArea) & 0x1280183) != 0;
}

export static function blockedSouthWest(pos: Location, privateArea: PrivateArea): boolean {
    return (getClipping(pos.getX() - 1, pos.getY() - 1, pos.getZ(), privateArea) & 0x128010e) != 0;
}
export static function canProjectileAttack(attacker: Mobile, from: Location, to: Location): boolean {
    let a = from;
    let b = to;
    if (a.getX() > b.getX()) {
        a = to;
        b = from;
    }
    return this.canProjectileAttack(a, b, attacker.size, attacker.getPrivateArea());
}
export static function canProjectileAttack(attacker: Mobile, target: Mobile): boolean {
    let a = attacker.getLocation();
    let b = target.getLocation();

    if (attacker.isPlayer() && target.isPlayer()) {
        if (a.getX() > b.getX()) {
            a = target.getLocation();
            b = attacker.getLocation();
        }
    } else if (target.isPlayer()) {
        a = target.getLocation();
        b = attacker.getLocation();
    }
    return canProjectileAttack(a, b, attacker.size(), attacker.getPrivateArea());
}

export static function canProjectileAttack(a: Location, b: Location, size: number, area: PrivateArea): boolean {
    return canProjectileMove(a.getX(), a.getY(), b.getX(), b.getY(), a.getZ(), size, size, area);
}
export function canProjectileMove(startX: number, startY: number, endX: number, endY: number, height: number, xLength: number, yLength: number, privateArea: PrivateArea) {
    let diffX = endX - startX;
    let diffY = endY - startY;
    let max = Math.max(Math.abs(diffX), Math.abs(diffY));
    for (let ii = 0; ii < max; ii++) {
        let currentX = endX - diffX;
        let currentY = endY - diffY;
        for (let i = 0; i < xLength; i++) {
            for (let i2 = 0; i2 < yLength; i2++) {
                if (diffX < 0 && diffY < 0) {
                    if ((getClipping(currentX + i - 1, currentY + i2 - 1, height, privateArea) & (UNLOADED_TILE
                        | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_EAST_BLOCKED
                        | PROJECTILE_NORTH_EAST_BLOCKED | PROJECTILE_NORTH_BLOCKED)) != 0
                        || (getClipping(currentX + i - 1, currentY + i2, height, privateArea)
                            & (UNLOADED_TILE | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED
                                | PROJECTILE_EAST_BLOCKED)) != 0
                        || (getClipping(currentX + i, currentY + i2 - 1, height, privateArea)
                            & (UNLOADED_TILE | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED
                                | PROJECTILE_NORTH_BLOCKED)) != 0) {
                        return false;
                    }
                } else if (diffX < 0 && diffY > 0) {
                    if ((getClipping(currentX + i - 1, currentY + i2 + 1, height, privateArea) & (UNLOADED_TILE | UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_SOUTH_BLOCKED | PROJECTILE_SOUTH_EAST_BLOCKED | PROJECTILE_EAST_BLOCKED)) != 0
                        || (getClipping(currentX + i - 1, currentY + i2, height, privateArea) & (UNLOADED_TILE | UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_EAST_BLOCKED)) != 0
                        || (getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & (UNLOADED_TILE | UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_SOUTH_BLOCKED)) != 0) {
                        return false;
                    }
                } else if (diffX > 0 && diffY < 0) {
                    if ((getClipping(currentX + i + 1, currentY + i2 - 1, height, privateArea) & (UNLOADED_TILE
                        | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_WEST_BLOCKED
                        | PROJECTILE_NORTH_BLOCKED | PROJECTILE_NORTH_WEST_BLOCKED)) != 0
                        || (getClipping(currentX + i + 1, currentY + i2, height, privateArea)
                            & (UNLOADED_TILE | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED
                                | PROJECTILE_WEST_BLOCKED)) != 0
                        || (getClipping(currentX + i, currentY + i2 - 1, height, privateArea)
                            & (UNLOADED_TILE | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED
                                | PROJECTILE_NORTH_BLOCKED)) != 0) {
                        return false;
                    }
                } else if (diffX > 0 && diffY == 0) {
                    if ((getClipping(currentX + i + 1, currentY + i2, height, privateArea)
                        & (UNLOADED_TILE | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED
                            | PROJECTILE_WEST_BLOCKED)) != 0) {
                        return false;
                    }
                } else if (diffX < 0 && diffY == 0) {
                    if ((getClipping(currentX + i - 1, currentY + i2, height, privateArea)
                        & (UNLOADED_TILE | /* BLOCKED_TILE | */UNKNOWN | PROJECTILE_TILE_BLOCKED
                            | PROJECTILE_EAST_BLOCKED)) != 0) {
                        return false;
                    }
                }
                else if (diffX === 0 && diffY > 0) {
                    if ((getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & (UNLOADED_TILE | UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_SOUTH_BLOCKED)) !== 0) {
                        return false;
                    }
                } else if (diffX === 0 && diffY < 0) {
                    if ((getClipping(currentX + i, currentY + i2 - 1, height, privateArea) & (UNLOADED_TILE | UNKNOWN | PROJECTILE_TILE_BLOCKED | PROJECTILE_NORTH_BLOCKED)) !== 0) {
                        return false;
                    }
                }
            }
        }
        if (diffX < 0) {
            diffX++;
        } else if (diffX > 0) {
            diffX--;
        }
        if (diffY < 0) {
            diffY++;
        } else if (diffY > 0) {
            diffY--;
        }
    }
    return true;
}
export static function canMove(startX: number, startY: number, endX: number, endY: number, height: number, xLength: number, yLength: number, privateArea: PrivateArea): boolean {
    let diffX = endX - startX;
    let diffY = endY - startY;
    let max = Math.max(Math.abs(diffX), Math.abs(diffY));
    for (let ii = 0; ii < max; ii++) {
        let currentX = endX - diffX;
        let currentY = endY - diffY;
        for (let i = 0; i < xLength; i++) {
            for (let i2 = 0; i2 < yLength; i2++)
                if (diffX < 0 && diffY < 0) {
                    if ((getClipping((currentX + i) - 1, (currentY + i2) - 1, height, privateArea) & 0x128010e) !== 0
                        || (getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0
                        || (getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                        return false;
                } else if (diffX > 0 && diffY > 0) {
                    if ((getClipping(currentX + i + 1, currentY + i2 + 1, height, privateArea) & 0x12801e0) !== 0
                        || (getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0
                        || (getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                        return false;
                } else if (diffX < 0 && diffY > 0) {
                    if ((getClipping((currentX + i) - 1, currentY + i2 + 1, height, privateArea) & 0x1280138) !== 0
                        || (getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0
                        || (getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                        return false;
                } else if (diffX > 0 && diffY < 0) {
                    if ((getClipping(currentX + i + 1, (currentY + i2) - 1, height, privateArea) & 0x1280183) !== 0
                        || (getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0
                        || (getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                        return false;
                } else if (diffX > 0 && diffY === 0) {
                    if ((getClipping(currentX + i + 1, currentY + i2, height, privateArea) & 0x1280180) !== 0)
                        return false;
                } else if (diffX < 0 && diffY === 0) {
                    if ((getClipping((currentX + i) - 1, currentY + i2, height, privateArea) & 0x1280108) !== 0)
                        return false;
                } else if (diffX === 0 && diffY > 0) {
                    if ((getClipping(currentX + i, currentY + i2 + 1, height, privateArea) & 0x1280120) !== 0)
                        return false;
                } else if (diffX === 0 && diffY < 0
                    && (getClipping(currentX + i, (currentY + i2) - 1, height, privateArea) & 0x1280102) !== 0)
                    return false;

        }

        if (diffX < 0) {
            diffX++;
        }
        else if (diffX > 0) {
            diffX--;
        }
        if (diffY < 0) {
            diffY++;
        }
        else if (diffY > 0)
            diffY--;
    }

    return true;
}
}
