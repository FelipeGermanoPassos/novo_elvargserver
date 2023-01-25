export abstract class PrivateArea extends Area {
    public entities: Entity[];
    private clips: Map<Location, number>;
    private destroyed: boolean;

    constructor(boundaries: Boundary[]) {
        super(boundaries);
        this.entities = [];
        this.clips = new Map();
        this.destroyed = false;
    }

    postLeave(mobile: Mobile, logout: boolean) {
        this.remove(mobile);
        if (this.getPlayers().length === 0) {
            this.destroy();
        }
    }

    postEnter(mobile: Mobile) {
        this.add(mobile);
    }

    remove(entity: Entity) {
        this.entities = this.entities.filter((e) => e !== entity);
        entity.setArea(null);
    }

    add(entity: Entities) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
        entity.setArea(this);
    }

    destroy() {
        if (this.destroyed) {
            return;
        }
        for (let npc of this.getNpcs()) {
            if (npc.isRegistered()) {
                World.getRemoveNPCQueue().add(npc);
            }
        }
        for (let object of this.getObjects()) {
            ObjectManager.deregister(object, false);
        }
        for (let item of World.getItems()) {
            if (item.getPrivateArea() === this) {
                ItemOnGroundManager.deregister(item);
            }
        }
        this.entities = [];
        this.clips.clear();
        this.destroyed = true;
    }

    getObjects() {
        return this.entities.filter((e) => e instanceof GameObject) as GameObject[];
    }

    setClip(location: Location, mask: number) {
        this.clips.set(location, mask);
    }

    removeClip(location: Location) {
        this.clips.delete(location);
    }

    getClip(location: Location) {
        return this.clips.get(location) || 0;
    }

    isDestroyed() {
        return this.destroyed;
    }
}
