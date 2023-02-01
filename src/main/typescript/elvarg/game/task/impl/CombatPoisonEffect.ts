export export enum PoisonType {
    VERY_WEAK = 2,
    WEAK = 3,
    MILD = 4,
    EXTRA = 5,
    SUPER = 6,
    VENOM = 12
    }

export class CombatPoisonEffect extends Task {
    private entity: Mobile;
    private tick: number;
    
    Copy code
    constructor(entity: Mobile) {
        super(30, entity, false);
        this.entity = entity;
        this.tick = 0;
    }
    
    public execute() {
        this.tick++;
    
        // Stop the task if the entity is unregistered.
        if (!this.entity.isRegistered()) {
            this.stop();
            return;
        }
    
        // Stop the task if entity is no longer poisoned.
        if (!this.entity.isPoisoned()) {
            this.stop();
            return;
        }
    
        // Stop the task if entity is immune to poison..
        if (!this.entity.getCombat().getPoisonImmunityTimer().finished()) {
            this.stop();
            return;
        }
    
        // Deal the damage, then try and decrement the damage count.
        let poisonDamage = (this.tick % 5 == 0) ? this.entity.getPoisonDamage() - 1 : this.entity.getPoisonDamage();
        this.entity.setPoisonDamage(poisonDamage);
        this.entity.getCombat().getHitQueue().addPendingDamage(new HitDamage(poisonDamage, HitMask.GREEN));
    
        if (poisonDamage <= 1) {
            this.stop();
            return;
        }
    }

    public stop() {
        this.entity.setPoisonDamage(0);
        
        Copy code
        // Reset client's poison type..
        if (this.entity.isPlayer()) {
            this.entity.getAsPlayer().getPacketSender().sendPoisonType(0);
        }
        
        super.stop();
    }
                
    class CombatPoisonData {
        private static CombatPoisonData.types = new Map<number, PoisonType>();
        
        private constructor() {}
        
        public getDamage(id: number): number {
            return this.CombatPoisonData.types.get(id).damage;
        }
    }

    static init() {
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_KNIFE_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.POISONED_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_DART_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_SPEAR_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_DART_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_DART_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_KNIFE_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_KNIFE_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.POISON_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.POISON_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_SPEAR_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.BLACK_SPEAR_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.WHITE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.WHITE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.WHITE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BONE_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BONE_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.BONE_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BLURITE_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNITE_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.SILVER_BOLTS_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BLURITE_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.RUNITE_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.SILVER_BOLTS_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.BLURITE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNITE_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.SILVER_BOLTS_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.KERIS_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.KERIS_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.KERIS_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_ARROW_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_DART_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_DART_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_DART_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.BRONZE_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.IRON_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.STEEL_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.MITHRIL_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.ADAMANT_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_HASTA_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_HASTA_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.RUNE_HASTA_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.ABYSSAL_DAGGER_P_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.ABYSSAL_DAGGER_P_PLUS_, PoisonType.EXTRA);
        CombatPoisonData.types.set(ItemIdentifiers.ABYSSAL_DAGGER_P_PLUS_PLUS_, PoisonType.SUPER);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.DRAGON_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.AMETHYST_JAVELIN_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.AMETHYST_JAVELIN_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.AMETHYST_JAVELIN_P_PLUS_PLUS_, PoisonType.MILD);
        CombatPoisonData.types.set(ItemIdentifiers.AMETHYST_ARROW_P_, PoisonType.VERY_WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.AMETHYST_ARROW_P_PLUS_, PoisonType.WEAK);
        CombatPoisonData.types.set(ItemIdentifiers.AMETHYST_ARROW_P_PLUS_PLUS_, PoisonType.MILD);

        CombatPoisonData.types.set(ItemIdentifiers.TOXIC_BLOWPIPE, PoisonType.VENOM);
        CombatPoisonData.types.set(ItemIdentifiers.ABYSSAL_TENTACLE, PoisonType.VENOM);
    }

    export class Poison {
        public static getPoisonType(item: Item): PoisonType | undefined {
        if (!item || item.getId() < 1 || item.getAmount() < 1) {
        return undefined;
        }
        return types.get(item.getId());
        }
    }
}
    
        
        
        
        
        