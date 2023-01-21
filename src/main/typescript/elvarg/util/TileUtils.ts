class TileUtils {
    public static getDistance(source: Location, dest: Location): number {
    return TileUtils.getDistance(source.getX(), source.getY(), dest.getX(), dest.getY());
    }
    
    Copy code
    public static getDistance(source: Location, destX: number, destY: number): number {
        return TileUtils.getDistance(source.getX(), source.getY(), destX, destY);
    }
    
    public static getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
}