import { World } from './world';
import { ObjectDefinition } from './definition/object';
import { Entity } from './entities';
import { Player } from './player';
import { Animation } from './animation';
import { Graphic } from './graphic';
import { PrivateArea } from './areas/private';

export class GameObject extends Entities {
    private id: number;
    private type: number;
    private face: number;
    private privateArea: PrivateArea;

    constructor(id: number, position: Location, type: number, face: number, privateArea: PrivateArea) {
        super(position);
        this.id = id;
        this.type = type;
        this.face = face;
        if (privateArea != null) {
            privateArea.add(this);
        }
        this.privateArea = privateArea;
    }

    public getId(): number {
        return this.id;
    }

    public getType(): number {
        return this.type;
    }

    public setType(type: number): void {
        this.type = type;
    }

    public getFace(): number {
        return this.face;
    }

    public setFace(face: number): void {
        this.face = face;
    }

    public getDefinition(): ObjectDefinition {
        return ObjectDefinition.forId(this.id);
    }

    public performAnimation(animation: Animation): void {
        for (const player of World.getPlayers()) {
            if (player == null) {
                continue;
            }
            if (player.getPrivateArea() !== this.getPrivateArea()) {
                continue;
            }
            if (!player.getLocation().isViewableFrom(this.getLocation())) {
                continue;
            }
            player.getPacketSender().sendObjectAnimation(this, animation);
        }
    }

    public performGraphic(graphic: Graphic): void {
        for (const player of World.getPlayers()) {
            if (player == null) {
                continue;
            }
            if (player.getPrivateArea() !== this.getPrivateArea()) {
                continue;
            }
            if (!player.getLocation().isViewableFrom(this.getLocation())) {
                continue;
            }
            player.getPacketSender().sendGraphic(graphic, this.getLocation());
        }
    }

    public size(): number {
        const definition = this.getDefinition();
        if (definition == null) {
            return 1;
        }
        return (definition.getSizeX() + definition.getSizeY()) - 1;
    }
    override equals(o: any): boolean {
        if (!(o instanceof GameObject))
            return false;
        let object = o as GameObject;
        return object.getLocation().equals(this.getLocation()) && object.getId() === this.getId() && object.getFace() === this.getFace()
            && object.getType() === this.getType() && object.getPrivateArea() === this.getPrivateArea();
    }

    clone(): GameObject {
        return new GameObject(this.getId(), this.getLocation(), this.getType(), this.getFace(), this.getPrivateArea());
    }
}