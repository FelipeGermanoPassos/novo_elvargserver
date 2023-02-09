
import { Area } from '../../../../model/areas/Area';
import { Boundary } from '../../../../model/Boundary';
import { Entity } from '../../../entity/Entity';
import { World } from '../../../World'
import { ObjectManager } from '../../../entity/impl/object/ObjectManager';
import { ItemOnGroundManager } from '../../../entity/impl/grounditem/ItemOnGroundManager'
import { GameObject } from '../../../entity/impl/object/GameObject';
import { Mobile } from '../../../../entity/impl/Mobile'

export abstract class PrivateArea extends Area {
    public entities: Entity[];
    private clips: Map<Location, number>;
    private destroyed: boolean;



    
    constructor(boundaries: Boundary[]) {
        super();
        this.entities = [];
        this.clips = new Map();
        this.destroyed = false;
    }
    
    postLeave(mobile: Mobile, logout: boolean) {
    this.remove(mobile);
    if (Area.getPlayers().length === 0) {
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
    
    add(entity: Entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
        entity.setArea(Area.getArea);
    }
    entity.setArea(this);
    }
    
    destroy() {
    if (this.destroyed) {
    return;
    }
    for (let npc of Area.getNpcs()) {
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



    postLeave(mobile: Mobile, logout: boolean) {
        this.remove(mobile);
        if (Area.getPlayers().length === 0) {
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

    add(entity: Entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
        entity.setArea(this);
    }

    destroy() {
        if (this.destroyed) {
            return;
        }
        for (let npc of Area.getNpcs()) {
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
