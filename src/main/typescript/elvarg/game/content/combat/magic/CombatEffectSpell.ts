const CombatEffectSpell = (() => {
    class CombatEffectSpell extends CombatSpell {
        public maximumHit(): number {
            return -1;
        }
        public equipmentRequired(player: Player): Optional<Item[]> {
            return Optional.empty();
        }
        public finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void {
            if (accurate) {
                this.spellEffect(cast, castOn);
            }
        }
        public abstract spellEffect(cast: Mobile, castOn: Mobile): void;
    }
    return CombatEffectSpell;
})();

const CombatAncientSpell = (() => {
    class CombatAncientSpell extends CombatSpell {
        public getSpellbook(): MagicSpellbook {
            return MagicSpellbook.ANCIENT;
        }
        public finishCast(cast: Mobile, castOn: Mobile, accurate: boolean, damage: number): void {
            if (!accurate || damage <= 0) {
                return;
            }
            this.spellEffect(cast, castOn, damage);
        }
        public equipmentRequired(player: Player): Optional<Item[]> {
            return Optional.empty();
        }
        public spellEffect(cast: Mobile, castOn: Mobile, damage: number): void { }
        public abstract spellRadius(): number;
    }
    return CombatAncientSpell;
})();