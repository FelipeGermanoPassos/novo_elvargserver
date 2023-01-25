import { Misc } from "../../util/Misc";

enum Directions {
    NORTH = 1,
    NORTH_EAST = 2,
    EAST = 4,
    SOUTH_EAST = 7,
    SOUTH = 6,
    SOUTH_WEST = 5,
    WEST = 3,
    NORTH_WEST = 0,
    NONE = -1,
}

export class Direction {
    public id: number;
    public x: number;
    public y: number;
    public opposite: number;
    public diagonal: boolean;

    constructor(id: number, x: number, y: number, opposite: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.opposite = opposite;
        this.diagonal = Object.keys(Direction)[id].includes('_');
    }

    public getId() {
        return this.id;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getOpposite() {
        return this.opposite;
    }

    public isDiagonal() {
        return this.diagonal;
    }

    public static valueOf(id: number) {
        switch (id) {
            case 0: return Directions.NORTH_WEST;
            case 1: return Directions.NORTH;
            case 2: return Directions.NORTH_EAST;
            case 3: return Directions.WEST;
            case 4: return Directions.EAST;
            case 5: return Directions.SOUTH_WEST;
            case 6: return Directions.SOUTH;
            case 7: return Directions.SOUTH_EAST;
            default: return Directions.NONE;
        }
    }

    public static random(): Direction {
        return this.valueOf(Misc.inclusive(0, 7));
    }

    fromDeltas(dx: number, dy: number): Directions {
        if (dx < 0) {
            if (dy < 0) {
                return Directions.SOUTH_WEST;
            } else if (dy > 0) {
                return Directions.NORTH_WEST;
            } else {
                return Directions.WEST;
            }
        } else if (dx > 0) {
            if (dy < 0) {
                return Directions.SOUTH_EAST;
            } else if (dy > 0) {
                return Directions.NORTH_EAST;
            } else {
                return Directions.EAST;
            }
        } else {
            if (dy < 0) {
                return Directions.SOUTH;
            } else if (dy > 0) {
                return Directions.NORTH;
            } else {
                return Directions.NONE;
            }
        }
    }

}
