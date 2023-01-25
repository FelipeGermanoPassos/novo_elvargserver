import { Direction } from './Direction';
enum FacingDirections {
    NORTH = "NORTH",
    SOUTH = "SOUTH",
    EAST = "EAST",
    WEST = "WEST",
}

class FacingDirection {
    private direction: Direction;
    constructor(direction: Direction) {
        this.direction = direction;
    }
    public getDirection(): Direction {
        return this.direction;
    }
}