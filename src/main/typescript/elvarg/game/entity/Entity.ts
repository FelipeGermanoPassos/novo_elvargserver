import * as GameConstants from '../../game/GameConstants';
import * as Animation from '../../game/model/Animation';
import * as Graphic from '../../game/model/Graphic';
import * as Location from '../../game/model/Location';
import * as Area from '../../game/model/areas/Area';
import * as PrivateArea from '../../game/model/areas/impl/PrivateArea';

abstract class Entities {
    /**
     * Represents the {@link Location} of this {@link Entities}.
     */
    private location: Location = GameConstants.DEFAULT_LOCATION.clone();
    private area: Area;

    /**
     * The Entities constructor.
     *
     * @param position The position the entity is currently in.
     */
    constructor(position: Location) {
        this.location = position;
    }

    /**
     * Performs an {@link Animation}.
     * @param animation
     */
    abstract performAnimation(animation: Animation): void;

    /**
     * Performs a {@link Graphic}.
     * @param animation
     */
    abstract performGraphic(graphic: Graphic): void;

    /**
     * Returns the size of this {@link Entities}.
     */
    abstract getSize(): void;

    /**
     * Gets the entity position.
     *
     * @return the entity's world position
     */
    getPosition(): Location {
        return this.location;
    }

    /**
     * Sets the entity position
     *
     * @param location the world position
     */
    setLocation(location: Location): Entities {
        this.location = location;
        return this;
    }
    public setArea(area: Area): void {
        this.area = area;
    }

    public getArea(): Area {
        return this.area;
    }

    public getPrivateArea(): PrivateArea | null {
        return (this.area instanceof PrivateArea ? (this.area as PrivateArea) : null);
    }
}