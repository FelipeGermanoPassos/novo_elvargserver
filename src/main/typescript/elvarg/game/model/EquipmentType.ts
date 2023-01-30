import { Equipment } from "../model/container/impl/Equipment";

const EquipmentTypes = {
    HOODED_CAPE: Equipment.CAPE_SLOT,
    CAPE: Equipment.CAPE_SLOT,
    SHIELD: Equipment.SHIELD_SLOT,
    GLOVES: Equipment.HANDS_SLOT,
    BOOTS: Equipment.FEET_SLOT,
    AMULET: Equipment.AMULET_SLOT,
    RING: Equipment.RING_SLOT,
    ARROWS: Equipment.AMMUNITION_SLOT,
    COIF: Equipment.HEAD_SLOT,
    HAT: Equipment.HEAD_SLOT,
    MASK: Equipment.HEAD_SLOT,
    MED_HELMET: Equipment.HEAD_SLOT,
    FULL_HELMET: Equipment.HEAD_SLOT,
    BODY: Equipment.BODY_SLOT,
    PLATEBODY: Equipment.BODY_SLOT,
    LEGS: Equipment.LEG_SLOT,
    WEAPON: Equipment.WEAPON_SLOT,
    NONE: -1,
}
export class EquipmentType {
    private slot: number;

    private EquipmentType(slot: number) {
        this.slot = slot;
    }

    public getSlot() {
        return this.slot;
    }
}
