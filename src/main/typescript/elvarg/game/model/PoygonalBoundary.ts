import {Boundary} from './Boundary';

class PolygonalBoundary extends Boundary {
    private polygon: Polygon;
    constructor(points: number[][]) {
        super(0, 0, 0, 0, 0);

        let xCoords: number[] = new Array(points.length);
        let yCoords: number[] = new Array(points.length);

        for (let i = 0; i < points.length; i++) {
            xCoords[i] = points[i][0];
            yCoords[i] = points[i][1];
        }

        this.polygon = new Polygon(xCoords, yCoords, points.length);
    }

    inside(p: Location): boolean {
        return this.polygon.contains(p.getX(), p.getY());
    }
}