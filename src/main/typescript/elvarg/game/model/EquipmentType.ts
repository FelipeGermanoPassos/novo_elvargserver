enum EquipmentTypes {
    HOODED_CAPE = "HOODED_CAPE",
    CAPE = "CAPE",
    SHIELD = "SHIELD",
    GLOVES = "GLOVES",
    BOOTS = "BOOTS",
    AMULET = "AMULET",
    RING = "RING",
    ARROWS = "ARROWS",
    COIF = "COIF",
    HAT = "HAT",
    MASK = "MASK",
    MED_HELMET = "MED_HELMET",
    FULL_HELMET = "FULL_HELMET",
    BODY = "BODY",
    PLATEBODY = "PLATEBODY",
    LEGS = "LEGS",
    WEAPON = "WEAPON",
    NONE = "NONE",
}

enum Equipment {
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
class EquipmentType {
    const slot: number;

    private EquipmentType(slot: number) {
        this.slot = slot;
    }

    public getSlot() {
        return this.slot;
    }
}
