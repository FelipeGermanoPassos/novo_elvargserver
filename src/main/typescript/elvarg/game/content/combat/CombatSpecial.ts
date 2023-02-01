interface CombatSpecialInterface {
    identifiers: number[];
    drainAmount: number;
    strengthMultiplier: number;
    accuracyMultiplier: number;
    combatMethod: any;
    weaponType: any;
}



export class CombatSpecial {
    ABYSSAL_WHIP = {
        weaponIds: [4151, 21371, 15441, 15442, 15443, 15444],
        specialEnergy: 50,
        accuracyMultiplier: 1,
        maxHitMultiplier: 1,
        combatMethod: new AbyssalWhipCombatMethod(),
        weaponInterface: WeaponInterface.WHIP
    }
    ABYSSAL_TENTACLE = {
        weaponIds: [12006],
        specialEnergy: 50,
        accuracyMultiplier: 1,
        maxHitMultiplier: 1,
        combatMethod: new AbyssalTentacleCombatMethod(),
        weaponInterface: WeaponInterface.WHIP
    }
    BARRELSCHEST_ANCHOR = {
        weaponIds: [10887],
        specialEnergy: 50,
        accuracyMultiplier: 1.22,
        maxHitMultiplier: 1.10,
        combatMethod: new BarrelchestAnchorCombatMethod(),
        weaponInterface: WeaponInterface.WARHAMMER
    }
    DRAGON_SCIMITAR = {
        weaponIds: [4587],
        specialEnergy: 55,
        accuracyMultiplier: 1.00,
        maxHitMultiplier: 1.25,
        combatMethod: new DragonScimitarCombatMethod(),
        weaponInterface: WeaponInterface.SCIMITAR
    }
    DRAGON_LONGSWORD = {
        weaponIds: [1305],
        specialEnergy: 25,
        accuracyMultiplier: 1.15,
        maxHitMultiplier: 1.25,
        combatMethod: new DragonLongswordCombatMethod(),
        weaponInterface: WeaponInterface.LONGSWORD
    }
    DRAGON_MACE = {
        weaponIds: [1434],
        specialEnergy: 25,
        accuracyMultiplier: 1.5,
        maxHitMultiplier: 1.25,
        combatMethod: new DragonMaceCombatMethod(),
        weaponInterface: WeaponInterface.MACE
    }
    DRAGON_WARHAMMER = {
        weaponIds: [13576],
        specialEnergy: 50,
        accuracyMultiplier: 1.5,
        maxHitMultiplier: 1.00,
        combatMethod: new DragonWarhammerCombatMethod(),
        weaponInterface: WeaponInterface.WARHAMMER
    }
    SARADOMIN_SWORD = {
        weaponIds: [11838],
        specialEnergy: 100,
        accuracyMultiplier: 1.0,
        maxHitMultiplier: 1.0,
        combatMethod: new SaradominSwordCombatMethod(),
        weaponInterface: WeaponInterface.SARADOMIN_SWORD
    }
    ARMADYL_GODSWORD = {
        weaponIds: [11802],
        specialEnergy: 50,
        accuracyMultiplier: 1.375,
        maxHitMultiplier: 2,
        combatMethod: new ArmadylGodswordCombatMethod(),
        weaponInterface: WeaponInterface.GODSWORD
    }
    SARADOMIN_GODSWORD = {
        weaponIds: [11806],
        specialEnergy: 50,
        accuracyMultiplier: 1.1,
        maxHitMultiplier: 1.5,
        combatMethod: new SaradominGodswordCombatMethod(),
        weaponInterface: WeaponInterface.GODSWORD
    }
    BANDOS_GODSWORD = {
        weaponIds: [11804],
        specialEnergy: 100,
        accuracyMultiplier: 1.21,
        maxHitMultiplier: 1.5,
        combatMethod: new BandosGodswordCombatMethod(),
        weaponInterface: WeaponInterface.GODSWORD
    }
    ZAMORAK_GODSWORD = {
        weaponIds: [11808],
        specialEnergy: 50,
        accuracyMultiplier: 1.1,
        maxHitMultiplier: 1.5,
        combatMethod: new ZamorakGodswordCombatMethod(),
        weaponInterface: WeaponInterface.GODSWORD
    }
    ABYSSAL_BLUDGEON = {
        weaponIds: [13263],
        specialEnergy: 50,
        accuracyMultiplier: 1.20,
        maxHitMultiplier: 1.0,
        combatMethod: new AbyssalBludgeonCombatMethod(),
        weaponInterface: WeaponInterface.ABYSSAL_BLUDGEON
    }
    DRAGON_HALBERD = {
        weaponIds: [3204],
        specialEnergy: 30,
        accuracyMultiplier: 1.1,
        maxHitMultiplier: 1.35,
        combatMethod: new DragonHalberdCombatMethod(),
        weaponInterface: WeaponInterface.HALBERD
    }
    DRAGON_DAGGER = {
        weaponIds: [1215, 1231, 5680, 5698],
        specialEnergy: 25,
        accuracyMultiplier: 1.15,
        maxHitMultiplier: 1.20,
        combatMethod: new DragonDaggerCombatMethod(),
        weaponInterface: WeaponInterface.DRAGON_DAGGER
    }
    ABYSSAL_DAGGER = {
        weaponIds: [13271],
        specialEnergy: 50,
        accuracyMultiplier: 0.85,
        maxHitMultiplier: 1.25,
        combatMethod: new AbyssalDaggerCombatMethod(),
        weaponInterface: WeaponInterface.ABYSSAL_DAGGER
    }
    GRANITE_MAUL = {
        weaponIds: [4153, 12848],
        specialEnergy: 50,
        accuracyMultiplier: 1,
        maxHitMultiplier: 1,
        combatMethod: new GraniteMaulCombatMethod(),
        weaponInterface: WeaponInterface.GRANITE_MAUL
    }
    DRAGON_CLAWS = {
        weaponIds: [13652],
        specialEnergy: 50,
        accuracyMultiplier: 1,
        maxHitMultiplier: 1.35,
        combatMethod: new DragonClawCombatMethod(),
        weaponInterface: WeaponInterface.CLAWS
    }
    MAGIC_SHORTBOW = {
        weaponIds: [861],
        specialEnergy: 55,
        accuracyMultiplier: 1,
        maxHitMultiplier: 1,
        combatMethod: new MagicShortbowCombatMethod(),
        weaponInterface: WeaponInterface.SHORTBOW
    }
    public static DARK_BOW = {
        weaponIds: [11235],
        specialEnergy: 55,
        accuracyMultiplier: 1.5,
        maxHitMultiplier: 1.35,
        combatMethod: new DarkBowCombatMethod(),
        weaponInterface: WeaponInterface.DARK_BOW
    }
    ARMADYL_CROSSBOW = {
        weaponIds: [11785],
        specialEnergy: 40,
        accuracyMultiplier: 1,
        maxHitMultiplier: 2.0,
        combatMethod: new ArmadylCrossbowCombatMethod(),
        weaponInterface: WeaponInterface.CROSSBOW
    }
    BALLISTA = {
        weaponIds: [19481],
        specialEnergy: 65,
        accuracyMultiplier: 1.25,
        maxHitMultiplier: 1.45,
        combatMethod: new BallistaCombatMethod(),
        weaponInterface: WeaponInterface.BALLISTA
    }

    const SPECIAL_ATTACK_WEAPON_IDS = new Set(CombatSpecial.values().flatMap((cs) => cs.identifiers));

    private identifiers: number[];
    private drainAmount: number;
    private strengthMultiplier: number;
    private accuracyMultiplier: number;
    private combatMethod: any;
    private weaponType: any;

    public static checkSpecial(player: Player, special: CombatSpecial): boolean {
        return (player.getCombatSpecial() != null && player.getCombatSpecial() == special && player.isSpecialActivated() && player.getSpecialPercentage() >= special.getDrainAmount());
    }

    public static drain(character: Mobile, amount: number) {
        character.decrementSpecialPercentage(amount);

        if (!character.isRecoveringSpecialAttack()) {
            TaskManager.submit(new RestoreSpecialAttackTask(character));
        }

        if (character.isPlayer()) {
            let p = character.getAsPlayer();
            CombatSpecial.updateBar(p);
        }
    }

    public static updateBar(player: Player) {
        if (player.getWeapon().getSpecialBar() == -1 || player.getWeapon().getSpecialMeter() == -1) {
            return;
        }
        let specialCheck = 10;
        let specialBar = player.getWeapon().getSpecialMeter();
        let specialAmount = player.getSpecialPercentage() / 10;

        for (let i = 0; i < 10; i++) {
            player.getPacketSender().sendInterfaceComponentMoval(specialAmount >= specialCheck ? 500 : 0, 0, --specialBar);
            specialCheck--;
        }
        player.getPacketSender().updateSpecialAttackOrb().sendString(player.getWeapon().getSpecialMeter(),
            player.isSpecialActivated() ? ("@yel@ Special Attack (" + player.getSpecialPercentage() + "%)") : ("@bla@ Special Attack (" + player.getSpecialPercentage() + "%)"));
        player.getPacketSender().sendSpecialAttackState(player.isSpecialActivated());
    }

    public static assign(player: Player) {
        if (player.getWeapon().getSpecialBar() == -1) {
            player.setSpecialActivated(false);
            player.setCombatSpecial(null);
            CombatSpecial.updateBar(player);
            return;
        }

        for (let c of CombatSpecial.values()) {
            if (player.getWeapon() == c.getWeaponType()) {
                if (c.identifiers.some(id => player.getEquipment().get(Equipment.WEAPON_SLOT).getId() == id)) {
                    player.getPacketSender().sendInterfaceDisplayState(player.getWeapon().getSpecialBar(), false);
                    player.setCombatSpecial(c);
                    return;
                }
            }
        }

        player.getPacketSender().sendInterfaceDisplayState(player.getWeapon().getSpecialBar(), true);
        player.setCombatSpecial(null);
        player.setSpecialActivated(false);
        player.getPacketSender().sendSpecialAttackState(false);
    }

    public static activate(player: Player) {
        if (player.getCombatSpecial() == null) {
            return;
        }

        if (player.getDueling().inDuel() && player.getDueling().getRules()[DuelRule.NO_SPECIAL_ATTACKS.ordinal()]) {
            return;
        }

        if (player.isSpecialActivated()) {
            player.setSpecialActivated(false);
            CombatSpecial.updateBar(player);
        } else {
            const spec = player.getCombatSpecial();
            player.setSpecialActivated(true);
            CombatSpecial.updateBar(player);

            if (spec == CombatSpecial.GRANITE_MAUL) {
                if (player.getSpecialPercentage() < player.getCombatSpecial().getDrainAmount()) {
                    player.getPacketSender().sendMessage("You do not have enough special attack energy left!");
                    player.setSpecialActivated(false);
                    CombatSpecial.updateBar(player);
                    return;
                }

                const target = player.getCombat().getTarget();
                if (target != null && CombatFactory.getMethod(player).type() == CombatType.MELEE) {
                    player.getCombat().performNewAttack(true);
                    return;
                } else {
                    // Uninformed player using gmaul without being in combat..
                    // Teach them a lesson!
                    player.getPacketSender()
                        .sendMessage("Although not required, the Granite maul special attack should be used during")
                        .sendMessage("combat for maximum effect.");
                }
            }
        }

        if (player.getInterfaceId() == BonusManager.INTERFACE_ID) {
            BonusManager.update(player);
        }
    }

    public getIdentifiers(): number[] {
        return this.identifiers;
    }

    public getDrainAmount(): number {
        return this.drainAmount;
    }

    public getStrengthMultiplier(): number {
        return this.strengthMultiplier;
    }

    public getAccuracyMultiplier(): number {
        return this.accuracyMultiplier;
    }

    public getCombatMethod(): CombatMethod {
        return this.combatMethod;
    }

    public getWeaponType(): WeaponInterface {
        return this.weaponType;
    }

}

