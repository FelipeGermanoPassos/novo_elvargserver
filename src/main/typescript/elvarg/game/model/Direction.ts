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

    public static direction valueOf(id: number) {
        switch (id) {
            case 0: return Direction.NORTH_WEST;
            case 1: return Direction.NORTH;
            case 2: return Direction.NORTH_EAST;
            case 3: return Direction.WEST;
            case 4: return Direction.EAST;
            case 5: return Direction.SOUTH_WEST;
            case 6: return Direction.SOUTH;
            case 7: return Direction.SOUTH_EAST;
            default: return Direction.NONE;
        }
    }

    public static random(): Direction {
        return Direction.valueOf(Math.floor(Math.random() * 8));
    }
    
    fromDeltas(dx: number, dy: number): Direction {
        if(dx < 0) {
            if(dy < 0) {
                return Direction.SOUTH_WEST;
            } else if(dy > 0) {
                return Direction.NORTH_WEST;
            } else {
                return Direction.WEST;
            }
        } else if(dx > 0) {
            if(dy < 0) {
                return Direction.SOUTH_EAST;
            } else if(dy > 0) {
                return Direction.NORTH_EAST;
            } else {
                return Direction.EAST;
            }
        } else {
            if(dy < 0) {
                return Direction.SOUTH;
            } else if(dy > 0) {
				return NORTH;
			} else {
				return NONE;
			}
		}
    }

}
