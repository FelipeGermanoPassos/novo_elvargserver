import { Equipment } from "../../model/container/impl/Equipment";
import { Item } from "../../model/Item";
import { Player } from "../../entity/impl/player/Player";
import { FightType } from "../combat/FightType"
import { CombatSpecial } from "./CombatSpecial";

export class WeaponInterfaces {

    /**
     * Assigns an interface to the combat sidebar based on the argued weapon.
     *
     * @param player the player that the interface will be assigned for.
     */
    public static assign(player: Player) {
        let equippedWeapon = player.getEquipment().getItems()[Equipment.WEAPON_SLOT];
        let weapon = WeaponInterface.UNARMED;

        //Get the currently equipped weapon's interface
        if (equippedWeapon.getId() > 0) {
            if (equippedWeapon.getDefinition().getWeaponInterface() != null) {
                weapon = equippedWeapon.getDefinition().getWeaponInterface();
            }
        }

        if (weapon == WeaponInterface.UNARMED) {
            player.getPacketSender().sendTabInterface(0, weapon.getInterfaceId());
            player.getPacketSender().sendString(weapon.getNameLineId(), "Unarmed");
            player.setWeapon(WeaponInterface.UNARMED);
        } else if (weapon == WeaponInterface.CROSSBOW) {
            player.getPacketSender().sendString(weapon.getNameLineId() - 1, "Weapon: ");
        } else if (weapon == WeaponInterface.WHIP) {
            player.getPacketSender().sendString(weapon.getNameLineId() - 1, "Weapon: ");
        }

        //player.getPacketSender().sendItemOnInterface(weapon.getInterfaceId() + 1, 200, item);
        //player.getPacketSender().sendItemOnInterface(weapon.getInterfaceId() + 1, item, 0, 1);

        player.getPacketSender().sendTabInterface(0,
            weapon.getInterfaceId());
        player.getPacketSender().sendString(weapon.getNameLineId(),
            (weapon == WeaponInterface.UNARMED ? "Unarmed" : equippedWeapon.getDefinition().getName()));
        player.setWeapon(weapon);
        CombatSpecial.assign(player);
        CombatSpecial.updateBar(player);

        //Search for an attack style matching ours
        /*  for (const type of weapon.getFightType()) {
                if (type.getStyle() == player.getCombat().getFightType().getStyle()) {
                    player.setFightType(type);
                    player.getPacketSender().sendConfig(player.getCombat().getFightType().getParentId(), player.getCombat().getFightType().getChildId());
                    return;
                }
            }*/

        //Set default attack style to aggressive!
        for (const type of weapon.getFightType()) {
            if (type.getStyle() == FightStyle.AGGRESSIVE) {
                player.setFightType(type);
                player.getPacketSender().sendConfig(player.getFightType().getParentId(), player.getFightType().getChildId());
                return;
            }
        }

        //Still no proper attack style.
        //Set it to the first one..
        player.setFightType(player.getWeapon().getFightType()[0]);
        player.getPacketSender().sendConfig(player.getFightType().getParentId(), player.getFightType().getChildId());
    }

    public static changeCombatSettings(player: Player, button: number): boolean {
        switch (button) {
            case 1772: // shortbow & longbow
                if (player.getWeapon() == WeaponInterface.SHORTBOW) {
                    player.setFightType(FightType.SHORTBOW_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.LONGBOW
                    || player.getWeapon() == WeaponInterface.DARK_BOW) {
                    player.setFightType(FightType.LONGBOW_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.CROSSBOW) {
                    player.setFightType(FightType.CROSSBOW_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.KARILS_CROSSBOW) {
                    player.setFightType(FightType.KARILS_CROSSBOW_ACCURATE);
                }
                return true;
            case 1771:
                if (player.getWeapon() == WeaponInterface.SHORTBOW) {
                    player.setFightType(FightType.SHORTBOW_RAPID);
                } else if (player.getWeapon() == WeaponInterface.LONGBOW
                    || player.getWeapon() == WeaponInterface.DARK_BOW) {
                    player.setFightType(FightType.LONGBOW_RAPID);
                } else if (player.getWeapon() == WeaponInterface.CROSSBOW) {
                    player.setFightType(FightType.CROSSBOW_RAPID);
                } else if (player.getWeapon() == WeaponInterface.KARILS_CROSSBOW) {
                    player.setFightType(FightType.KARILS_CROSSBOW_RAPID);
                }
                return true;
            case 1770:
                if (player.getWeapon() == WeaponInterface.SHORTBOW) {
                    player.setFightType(FightType.SHORTBOW_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.LONGBOW
                    || player.getWeapon() == WeaponInterface.DARK_BOW) {
                    player.setFightType(FightType.LONGBOW_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.CROSSBOW) {
                    player.setFightType(FightType.CROSSBOW_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.KARILS_CROSSBOW) {
                    player.setFightType(FightType.KARILS_CROSSBOW_LONGRANGE);
                }
                return true;
            case 2282: // dagger & sword
                if (player.getWeapon() == WeaponInterface.DAGGER) {
                    player.setFightType(FightType.DAGGER_STAB);
                } else if (player.getWeapon() == WeaponInterface.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_STAB);
                } else if (player.getWeapon() == WeaponInterface.SWORD) {
                    player.setFightType(FightType.SWORD_STAB);
                } else if (player.getWeapon() == WeaponInterface.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_STAB);
                }
                return true;
            case 2285:
                if (player.getWeapon() == WeaponInterface.DAGGER) {
                    player.setFightType(FightType.DAGGER_LUNGE);
                } else if (player.getWeapon() == WeaponInterface.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_LUNGE);
                } else if (player.getWeapon() == WeaponInterface.SWORD) {
                    player.setFightType(FightType.SWORD_LUNGE);
                } else if (player.getWeapon() == WeaponInterface.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_LUNGE);
                }
                return true;
            case 2284:
                if (player.getWeapon() == WeaponInterface.DAGGER) {
                    player.setFightType(FightType.DAGGER_SLASH);
                } else if (player.getWeapon() == WeaponInterface.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_SLASH);
                } else if (player.getWeapon() == WeaponInterface.SWORD) {
                    player.setFightType(FightType.SWORD_SLASH);
                } else if (player.getWeapon() == WeaponInterface.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_SLASH);
                }
                return true;
            case 2283:
                if (player.getWeapon() == WeaponInterface.DAGGER) {
                    player.setFightType(FightType.DAGGER_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.DRAGON_DAGGER) {
                    player.setFightType(FightType.DRAGON_DAGGER_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.SWORD) {
                    player.setFightType(FightType.SWORD_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.GHRAZI_RAPIER) {
                    player.setFightType(FightType.GHRAZI_RAPIER_BLOCK);
                }
                return true;
            case 2429: // scimitar & longsword
                if (player.getWeapon() == WeaponInterface.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_CHOP);
                } else if (player.getWeapon() == WeaponInterface.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_CHOP);
                }
                return true;
            case 2432:
                if (player.getWeapon() == WeaponInterface.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_SLASH);
                } else if (player.getWeapon() == WeaponInterface.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_SLASH);
                }
                return true;
            case 2431:
                if (player.getWeapon() == WeaponInterface.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_LUNGE);
                } else if (player.getWeapon() == WeaponInterface.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_LUNGE);
                }
                return true;
            case 2430:
                if (player.getWeapon() == WeaponInterface.SCIMITAR) {
                    player.setFightType(FightType.SCIMITAR_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.LONGSWORD) {
                    player.setFightType(FightType.LONGSWORD_BLOCK);
                }
                return true;
            case 3802: // mace
                if (player.getWeapon() == WeaponInterface.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_POUND);
                } else {
                    player.setFightType(FightType.MACE_POUND);
                }
                return true;
            case 3805:
                if (player.getWeapon() == WeaponInterface.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_PUMMEL);
                } else {
                    player.setFightType(FightType.MACE_PUMMEL);
                }
                return true;
            case 3804:
                if (player.getWeapon() == WeaponInterface.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_SPIKE);
                } else {
                    player.setFightType(FightType.MACE_SPIKE);
                }
                return true;
            case 3803:
                if (player.getWeapon() == WeaponInterface.VERACS_FLAIL) {
                    player.setFightType(FightType.VERACS_FLAIL_BLOCK);
                } else {
                    player.setFightType(FightType.MACE_BLOCK);
                }
                return true;
            case 4454: // knife, thrownaxe, dart & javelin
                if (player.getWeapon() == WeaponInterface.KNIFE) {
                    player.setFightType(FightType.KNIFE_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.OBBY_RINGS) {
                    player.setFightType(FightType.OBBY_RING_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.THROWNAXE) {
                    player.setFightType(FightType.THROWNAXE_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.DART) {
                    player.setFightType(FightType.DART_ACCURATE);
                } else if (player.getWeapon() == WeaponInterface.JAVELIN) {
                    player.setFightType(FightType.JAVELIN_ACCURATE);
                }
                return true;
            case 4453:
                if (player.getWeapon() == WeaponInterface.KNIFE) {
                    player.setFightType(FightType.KNIFE_RAPID);
                } else if (player.getWeapon() == WeaponInterface.OBBY_RINGS) {
                    player.setFightType(FightType.OBBY_RING_RAPID);
                } else if (player.getWeapon() == WeaponInterface.THROWNAXE) {
                    player.setFightType(FightType.THROWNAXE_RAPID);
                } else if (player.getWeapon() == WeaponInterface.DART) {
                    player.setFightType(FightType.DART_RAPID);
                } else if (player.getWeapon() == WeaponInterface.JAVELIN) {
                    player.setFightType(FightType.JAVELIN_RAPID);
                }
                return true;
            case 4452:
                if (player.getWeapon() == WeaponInterface.KNIFE) {
                    player.setFightType(FightType.KNIFE_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.OBBY_RINGS) {
                    player.setFightType(FightType.OBBY_RING_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.THROWNAXE) {
                    player.setFightType(FightType.THROWNAXE_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.DART) {
                    player.setFightType(FightType.DART_LONGRANGE);
                } else if (player.getWeapon() == WeaponInterface.JAVELIN) {
                    player.setFightType(FightType.JAVELIN_LONGRANGE);
                }
                return true;
            case 4685: // spear
                player.setFightType(FightType.SPEAR_LUNGE);
                return true;
            case 4688:
                player.setFightType(FightType.SPEAR_SWIPE);
                return true;
            case 4687:
                player.setFightType(FightType.SPEAR_POUND);
                return true;
            case 4686:
                player.setFightType(FightType.SPEAR_BLOCK);
                return true;
            case 4711: // 2h sword
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_CHOP : FightType.TWOHANDEDSWORD_CHOP);
                return true;
            case 4714:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_SLASH : FightType.TWOHANDEDSWORD_SLASH);
                return true;
            case 4713:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_SMASH : FightType.TWOHANDEDSWORD_SMASH);
                return true;
            case 4712:
                player.setFightType(player.getEquipment().hasGodsword() ? FightType.GODSWORD_BLOCK : FightType.TWOHANDEDSWORD_BLOCK);
                return true;
            case 5576: // pickaxe
                player.setFightType(FightType.PICKAXE_SPIKE);
                return true;
            case 5579:
                player.setFightType(FightType.PICKAXE_IMPALE);
                return true;
            case 5578:
                player.setFightType(FightType.PICKAXE_SMASH);
                return true;
            case 5577:
                player.setFightType(FightType.PICKAXE_BLOCK);
                return true;
            case 7768: // claws
                player.setFightType(FightType.CLAWS_CHOP);
                return true;
            case 7771:
                player.setFightType(FightType.CLAWS_SLASH);
                return true;
            case 7770:
                player.setFightType(FightType.CLAWS_LUNGE);
                return true;
            case 7769:
                player.setFightType(FightType.CLAWS_BLOCK);
                return true;
            case 8466: // halberd
                player.setFightType(FightType.HALBERD_JAB);
                return true;
            case 8468:
                player.setFightType(FightType.HALBERD_SWIPE);
                return true;
            case 8467:
                player.setFightType(FightType.HALBERD_FEND);
                return true;
            case 5861: // unarmed
                player.setFightType(FightType.UNARMED_BLOCK);
                return true;
            case 5862:
                player.setFightType(FightType.UNARMED_KICK);
                return true;
            case 5860:
                player.setFightType(FightType.UNARMED_PUNCH);
                return true;
            case 12298: // whip
                player.setFightType(FightType.WHIP_FLICK);
                return true;
            case 12297:
                player.setFightType(FightType.WHIP_LASH);
                return true;
            case 12296:
                player.setFightType(FightType.WHIP_DEFLECT);
                return true;
            case 336: // staff
                player.setFightType(FightType.STAFF_BASH);
                return true;
            case 335:
                player.setFightType(FightType.STAFF_POUND);
                return true;
            case 334:
                player.setFightType(FightType.STAFF_FOCUS);
                return true;
            case 433: // warhammer
                if (player.getWeapon() == WeaponInterface.GRANITE_MAUL) {
                    player.setFightType(FightType.GRANITE_MAUL_POUND);
                } else if (player.getWeapon() == WeaponInterface.MAUL) {
                    player.setFightType(FightType.MAUL_POUND);
                } else if (player.getWeapon() == WeaponInterface.WARHAMMER) {
                    player.setFightType(FightType.WARHAMMER_POUND);
                } else if (player.getWeapon() == WeaponInterface.ELDER_MAUL) {
                    player.setFightType(FightType.ELDER_MAUL_POUND);
                }
                return true;
            case 432:
                if (player.getWeapon() == WeaponInterface.GRANITE_MAUL) {
                    player.setFightType(FightType.GRANITE_MAUL_PUMMEL);
                } else if (player.getWeapon() == WeaponInterface.MAUL) {
                    player.setFightType(FightType.MAUL_PUMMEL);
                } else if (player.getWeapon() == WeaponInterface.WARHAMMER) {
                    player.setFightType(FightType.WARHAMMER_PUMMEL);
                } else if (player.getWeapon() == WeaponInterface.ELDER_MAUL) {
                    player.setFightType(FightType.ELDER_MAUL_PUMMEL);
                }
                return true;
            case 431:
                if (player.getWeapon() == WeaponInterface.GRANITE_MAUL) {
                    player.setFightType(FightType.GRANITE_MAUL_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.MAUL) {
                    player.setFightType(FightType.MAUL_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.WARHAMMER) {
                    player.setFightType(FightType.WARHAMMER_BLOCK);
                } else if (player.getWeapon() == WeaponInterface.ELDER_MAUL) {
                    player.setFightType(FightType.ELDER_MAUL_BLOCK);
                }
                return true;
            case 782: // scythe
                player.setFightType(FightType.SCYTHE_REAP);
                return true;
            case 784:
                player.setFightType(FightType.SCYTHE_CHOP);
                return true;
            case 785:
                player.setFightType(FightType.SCYTHE_JAB);
                return true;
            case 783:
                player.setFightType(FightType.SCYTHE_BLOCK);
                return true;
            case 1704: // battle axe
                if (player.getWeapon() == WeaponInterface.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_CHOP);
                } else {
                    player.setFightType(FightType.BATTLEAXE_CHOP);
                }
                return true;
            case 1707:
                if (player.getWeapon() == WeaponInterface.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_HACK);
                } else {
                    player.setFightType(FightType.BATTLEAXE_HACK);
                }
                return true;
            case 1706:
                if (player.getWeapon() == WeaponInterface.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_SMASH);
                } else {
                    player.setFightType(FightType.BATTLEAXE_SMASH);
                }
                return true;
            case 1705:
                if (player.getWeapon() == WeaponInterface.GREATAXE) {
                    player.setFightType(FightType.GREATAXE_BLOCK);
                } else {
                    player.setFightType(FightType.BATTLEAXE_BLOCK);
                }
                return true;
            case 29138:
            case 29038:
            case 29063:
            case 29113:
            case 29163:
            case 29188:
            case 29213:
            case 29238:
            case 30007:
            case 48023:
            case 33033:
            case 30108:
            case 7473:
            case 7562:
            case 7487:
            case 7788:
            case 8481:
            case 7612:
            case 7587:
            case 7662:
            case 7462:
            case 7548:
            case 7687:
            case 7537:
            case 7623:
            case 12322:
            case 7637:
            case 12311:
            case 155:
                CombatSpecial.activate(player);
                return true;
        }
        return false;
    }

    STAFF = {
        interfaceId: 328,
        nameLineId: 355,
        speed: 5,
        fightType: [FightType.STAFF_BASH, FightType.STAFF_POUND, FightType.STAFF_FOCUS]
    }
    WARHAMMER = {
        interfaceId: 425,
        nameLineId: 428,
        speed: 6,
        fightType: [FightType.WARHAMMER_POUND,
        FightType.WARHAMMER_PUMMEL, FightType.WARHAMMER_BLOCK],
        parentId: 7474,
        specialMeter: 7486
    }
    MAUL = {
        interfaceId: 425,
        nameLineId: 428,
        speed: 7,
        fightType: [FightType.MAUL_POUND,
        FightType.MAUL_PUMMEL, FightType.MAUL_BLOCK],
        parentId: 7474,
        specialMeter: 7486
    }
    GRANITE_MAUL = {
        interfaceId: 425,
        nameLineId: 428,
        speed: 7,
        fightType: [FightType.GRANITE_MAUL_POUND,
        FightType.GRANITE_MAUL_PUMMEL, FightType.GRANITE_MAUL_BLOCK],
        parentId: 7474,
        specialMeter: 7486
    }
    VERACS_FLAIL = {
        interfaceId: 3796,
        nameLineId: 3799,
        speed: 5,
        fightType: [FightType.VERACS_FLAIL_POUND,
        FightType.VERACS_FLAIL_PUMMEL, FightType.VERACS_FLAIL_SPIKE,
        FightType.VERACS_FLAIL_BLOCK],
        parentId: 7624,
        specialMeter: 7636
    }
    SCYTHE = {
        interfaceId: 776,
        nameLineId: 779,
        speed: 4,
        fightType: [FightType.SCYTHE_REAP,
        FightType.SCYTHE_CHOP, FightType.SCYTHE_JAB,
        FightType.SCYTHE_BLOCK]
    }
    BATTLEAXE = {
        interfaceId: 1698,
        nameLineId: 1701,
        speed: 5,
        fightType: [FightType.BATTLEAXE_CHOP,
        FightType.BATTLEAXE_HACK, FightType.BATTLEAXE_SMASH,
        FightType.BATTLEAXE_BLOCK],
        specialBar: 7499,
        specialMeter: 7511
    }
    GREATAXE = {
        interfaceId: 1698,
        nameLineId: 1701,
        speed: 7,
        fightType: [FightType.GREATAXE_CHOP,
        FightType.GREATAXE_HACK, FightType.GREATAXE_SMASH,
        FightType.GREATAXE_BLOCK],
        specialBar: 7499,
        specialMeter: 7511
    }
    public static CROSSBOW = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 6,
        fightType: [FightType.CROSSBOW_ACCURATE,
        FightType.CROSSBOW_RAPID, FightType.CROSSBOW_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }
    BALLISTA = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 7,
        fightType: [FightType.BALLISTA_ACCURATE,
        FightType.BALLISTA_RAPID, FightType.BALLISTA_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }
    BLOWPIPE = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 3,
        fightType: [FightType.BLOWPIPE_ACCURATE,
        FightType.BLOWPIPE_RAPID, FightType.BLOWPIPE_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }
    KARILS_CROSSBOW = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 4,
        fightType: [FightType.KARILS_CROSSBOW_ACCURATE,
        FightType.KARILS_CROSSBOW_RAPID, FightType.KARILS_CROSSBOW_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }
    SHORTBOW = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 4,
        fightType: [FightType.SHORTBOW_ACCURATE,
        FightType.SHORTBOW_RAPID, FightType.SHORTBOW_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }
    LONGBOW = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 6,
        fightType: [FightType.LONGBOW_ACCURATE,
        FightType.LONGBOW_RAPID, FightType.LONGBOW_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }
    DRAGON_DAGGER = {
        interfaceId: 2276,
        nameLineId: 2279,
        speed: 4,
        fightType: [FightType.DRAGON_DAGGER_STAB,
        FightType.DRAGON_DAGGER_LUNGE, FightType.DRAGON_DAGGER_SLASH,
        FightType.DRAGON_DAGGER_BLOCK],
        specialBar: 7574,
        specialMeter: 7586
    }
    ABYSSAL_DAGGER = {
        interfaceId: 2276,
        nameLineId: 2279,
        speed: 4,
        fightType: [FightType.DRAGON_DAGGER_STAB,
        FightType.DRAGON_DAGGER_LUNGE, FightType.DRAGON_DAGGER_SLASH,
        FightType.DRAGON_DAGGER_BLOCK],
        specialBar: 7574,
        specialMeter: 7586
    }

    DAGGER = {
        interfaceId: 2276,
        nameLineId: 2279,
        speed: 4,
        fightType: [FightType.DAGGER_STAB,
        FightType.DAGGER_LUNGE, FightType.DAGGER_SLASH,
        FightType.DAGGER_BLOCK],
        specialBar: 7574,
        specialMeter: 7586
    }

    SWORD = {
        interfaceId: 2276,
        nameLineId: 2279,
        speed: 5,
        fightType: [FightType.SWORD_STAB,
        FightType.SWORD_LUNGE, FightType.SWORD_SLASH,
        FightType.SWORD_BLOCK],
        specialBar: 7574,
        specialMeter: 7586
    }

    SCIMITAR = {
        interfaceId: 2423,
        nameLineId: 2426,
        speed: 4,
        fightType: [FightType.SCIMITAR_CHOP,
        FightType.SCIMITAR_SLASH, FightType.SCIMITAR_LUNGE,
        FightType.SCIMITAR_BLOCK],
        specialBar: 7599,
        specialMeter: 7611
    }

    LONGSWORD = {
        interfaceId: 2423,
        nameLineId: 2426,
        speed: 5,
        fightType: [FightType.LONGSWORD_CHOP,
        FightType.LONGSWORD_SLASH, FightType.LONGSWORD_LUNGE,
        FightType.LONGSWORD_BLOCK],
        specialBar: 7599,
        specialMeter: 7611
    }

    MACE = {
        interfaceId: 3796,
        nameLineId: 3799,
        speed: 5,
        fightType: [FightType.MACE_POUND,
        FightType.MACE_PUMMEL, FightType.MACE_SPIKE,
        FightType.MACE_BLOCK],
        specialBar: 7624,
        specialMeter: 7636
    }

    KNIFE = {
        interfaceId: 4446,
        nameLineId: 4449,
        speed: 3,
        fightType: [FightType.KNIFE_ACCURATE,
        FightType.KNIFE_RAPID, FightType.KNIFE_LONGRANGE],
        specialBar: 7649,
        specialMeter: 7661
    }

    OBBY_RINGS = {
        interfaceId: 4446,
        nameLineId: 4449,
        speed: 4,
        fightType: [FightType.OBBY_RING_ACCURATE,
        FightType.OBBY_RING_RAPID, FightType.OBBY_RING_LONGRANGE],
        specialBar: 7649,
        specialMeter: 7661
    }

    SPEAR = {
        interfaceId: 4679,
        nameLineId: 4682,
        speed: 5,
        fightType: [FightType.SPEAR_LUNGE,
        FightType.SPEAR_SWIPE, FightType.SPEAR_POUND,
        FightType.SPEAR_BLOCK],
        specialBar: 7674,
        specialMeter: 7686
    }

    TWO_HANDED_SWORD = {
        interfaceId: 4705,
        nameLineId: 4708,
        speed: 7,
        fightType: [FightType.TWOHANDEDSWORD_CHOP, FightType.TWOHANDEDSWORD_SLASH,
        FightType.TWOHANDEDSWORD_SMASH, FightType.TWOHANDEDSWORD_BLOCK],
        specialBar: 7699,
        specialMeter: 7711
    }

    PICKAXE = {
        interfaceId: 5570,
        nameLineId: 5573,
        speed: 5,
        fightType: [FightType.PICKAXE_SPIKE,
        FightType.PICKAXE_IMPALE, FightType.PICKAXE_SMASH,
        FightType.PICKAXE_BLOCK]
    }

    CLAWS = {
        interfaceId: 7762,
        nameLineId: 7765,
        speed: 4,
        fightType: [FightType.CLAWS_CHOP,
        FightType.CLAWS_SLASH, FightType.CLAWS_LUNGE,
        FightType.CLAWS_BLOCK],
        specialBar: 7800,
        specialMeter: 7812
    }

    HALBERD = {
        interfaceId: 8460,
        nameLineId: 8463,
        speed: 7,
        fightType: [FightType.HALBERD_JAB,
        FightType.HALBERD_SWIPE, FightType.HALBERD_FEND],
        specialBar: 8493,
        specialMeter: 8505
    }

    UNARMED = {
        interfaceId: 5855,
        nameLineId: 5857,
        speed: 4,
        fightType: [FightType.UNARMED_PUNCH,
        FightType.UNARMED_KICK, FightType.UNARMED_BLOCK]
    }

    WHIP = {
        interfaceId: 12290,
        nameLineId: 12293,
        speed: 4,
        fightType: [FightType.WHIP_FLICK,
        FightType.WHIP_LASH, FightType.WHIP_DEFLECT],
        specialBar: 12323,
        specialMeter: 12335
    }

    THROWNAXE = {
        interfaceId: 4446,
        nameLineId: 4449,
        speed: 4,
        fightType: [FightType.THROWNAXE_ACCURATE, FightType.THROWNAXE_RAPID,
        FightType.THROWNAXE_LONGRANGE],
        specialBar: 7649,
        specialMeter: 7661
    }

    DART = {
        interfaceId: 4446,
        nameLineId: 4449,
        speed: 3,
        fightType: [FightType.DART_ACCURATE,
        FightType.DART_RAPID, FightType.DART_LONGRANGE],
        specialBar: 7649,
        specialMeter: 7661
    }

    JAVELIN = {
        interfaceId: 4446,
        nameLineId: 4449,
        speed: 3,
        fightType: [FightType.JAVELIN_ACCURATE,
        FightType.JAVELIN_RAPID, FightType.JAVELIN_LONGRANGE],
        specialBar: 7649,
        specialMeter: 7661
    }

    ANCIENT_STAFF = {
        interfaceId: 328,
        nameLineId: 355,
        speed: 4,
        fightType: [FightType.STAFF_BASH, FightType.STAFF_POUND, FightType.STAFF_FOCUS]
    }

    DARK_BOW = {
        interfaceId: 1764,
        nameLineId: 1767,
        speed: 8,
        fightType: [FightType.LONGBOW_ACCURATE,
        FightType.LONGBOW_RAPID, FightType.LONGBOW_LONGRANGE],
        specialBar: 7549,
        specialMeter: 7561
    }

    GODSWORD = {
        interfaceId: 4705,
        nameLineId: 4708,
        speed: 6,
        fightType: [FightType.GODSWORD_CHOP, FightType.GODSWORD_SLASH,
        FightType.GODSWORD_SMASH, FightType.GODSWORD_BLOCK],
        specialBar: 7699,
        specialMeter: 7711
    }

    ABYSSAL_BLUDGEON = {
        interfaceId: 4705,
        nameLineId: 4708,
        speed: 4,
        fightType: [FightType.ABYSSAL_BLUDGEON_CHOP, FightType.ABYSSAL_BLUDGEON_SLASH,
        FightType.ABYSSAL_BLUDGEON_SMASH, FightType.ABYSSAL_BLUDGEON_BLOCK],
        specialBar: 7699,
        specialMeter: 7711
    }

    SARADOMIN_SWORD = {
        interfaceId: 4705,
        nameLineId: 4708,
        speed: 4,
        fightType: [FightType.TWOHANDEDSWORD_CHOP, FightType.TWOHANDEDSWORD_SLASH,
        FightType.TWOHANDEDSWORD_SMASH, FightType.TWOHANDEDSWORD_BLOCK],
        specialBar: 7699,
        specialMeter: 7711
    }

    ELDER_MAUL = {
        interfaceId: 425,
        nameLineId: 428,
        speed: 6,
        fightType: [FightType.ELDER_MAUL_POUND,
        FightType.ELDER_MAUL_PUMMEL, FightType.ELDER_MAUL_BLOCK],
        specialBar: 7474,
        specialMeter: 7486
    }

    GHRAZI_RAPIER = {
        interfaceId: 2276,
        nameLineId: 2279,
        speed: 4,
        fightType: [FightType.GHRAZI_RAPIER_STAB,
        FightType.GHRAZI_RAPIER_LUNGE, FightType.GHRAZI_RAPIER_SLASH,
        FightType.GHRAZI_RAPIER_BLOCK],
        specialBar: 7574,
        specialMeter: 7586
    }

    private interfaceId: number;
    private nameLineId: number;
    private speed: number;
    private fightType: FightType[];
    private specialBar: number;
    private specialMeter: number;

    private WeaponInterfaceMeter(interfaceId: number, nameLineId: number, speed: number,
        fightType: FightType[], specialBar: number, specialMeter: number) {
        this.interfaceId = interfaceId;
        this.nameLineId = nameLineId;
        this.speed = speed;
        this.fightType = fightType;
        this.specialBar = specialBar;
        this.specialMeter = specialMeter;
    }

    private WeaponInterface(interfaceId: number, nameLineId: number, speed: number,
        fightType: FightType[]) {
        this.WeaponInterfaceMeter(interfaceId, nameLineId, speed, fightType, -1, -1);
    }

    public getInterfaceId(): number {
        return this.interfaceId;
    }

    public getNameLineId(): number {
        return this.nameLineId;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getFightType(): FightType[] {
        return this.fightType;
    }

    public getSpecialBar(): number {
        return this.specialBar;
    }

    public getSpecialMeter(): number {
        return this.specialMeter;
    }
}