import * as GameConstants from '../../game/GameConstants';
import * as Animation from '../../game/model/Animation';
import * as Graphic from '../../game/model/Graphic';
import * as Location from '../../game/model/Location';
import * as Area from '../../game/model/areas/Area';
import * as PrivateArea from '../../game/model/areas/impl/PrivateArea';


abstract class Entity {
    /**
 * Represents the {@link Location} of this {@link Entity}.
 */
    private Location: location = GameConstants.DEFAULT_LOCATION.clone();

    /**
 * Represents the {@link Area} this {@link Entity} is currently in.
 */
    private area: Area;

    /**
 * The Entity constructor.
 *
 * @param position The position the entity is currently in.
 */
    public Entity(position: Location) {
        this.Location = position;
    }

    /**
 * Performs an {@link Animation}.
 * @param animation
 */
    public abstract performAnimation(animation: Animation): void;

    /**
 * Performs a {@link Graphic}.
 * @param animation
 */
    public abstract performGraphic(graphic: Graphic): void;

    /**
 * Returns the size of this {@link Entity}.
 */
    public abstract getSize();

    /**
 * Gets the entity position.
 *
 * @return the entity's world position
 */
    public Location getPosition(): Location {
        return location
    }

    /**
     * Sets the entity position
     *
     * @param location the world position
     */
    public Entity setLocation(location: Location) {
        this.Location = location;
        return this;
    }

    public setArea(area: Area): void {
        this.area = area;
    }

    public getArea(): Area {
        return this.area;
    }

    public getPrivateArea(): PrivateArea {
        return (this.area instanceof PrivateArea ? ((PrivateArea) this.area) : null);
    }

}