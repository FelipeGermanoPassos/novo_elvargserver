export class PendingHit {
    private attacker: Mobile;
    private target: Mobile;
    private method: CombatMethod;
    private combatType: CombatType;
    private hits: HitDamage[];
    private totalDamage: number;
    private delay: number;
    private accurate: boolean;
    private handleAfterHitEffects: boolean;
    constructor(attacker: Mobile, target: Mobile, method: CombatMethod) {
        this(attacker, target, method, true, 0);
    }

    constructor(attacker: Mobile, target: Mobile, method: CombatMethod, delay: number) {
        this(attacker, target, method, true, delay);
    }

    constructor(attacker: Mobile, target: Mobile, method: CombatMethod, rollAccuracy: boolean, delay: number) {
        this(attacker, target, method, rollAccuracy, 1, delay);
    }

    constructor(attacker: Mobile, target: Mobile, method: CombatMethod, rollAccuracy: boolean, hitAmount: number, delay: number) {
        this.attacker = attacker;
        this.target = target;
        this.method = method;
        this.combatType = method.type();
        this.hits = this.prepareHits(hitAmount, rollAccuracy);
        this.delay = delay;
        this.handleAfterHitEffects = true;
    }

    public getAttacker(): Mobile {
        return this.attacker;
    }

    public getTarget(): Mobile {
        return this.target;
    }

    public getAttacker(): Mobile {
        return this.attacker;
    }

    public getTarget(): Mobile {
        return this.target;
    }

    public getCombatMethod(): CombatMethod {
        return this.method;
    }

    public getHits(): HitDamage[] {
        return this.hits;
    }

    public getAndDecrementDelay(): number {
        return this.delay--;
    }

    public getExecutedInTicks(): number {
        return this.delay;
    }

    public getTotalDamage(): number {
        return this.totalDamage;
    }

    public isAccurate(): boolean {
        return this.accurate;
    }

    public setTotalDamage(damage: number): void {
        for (let hit of this.hits) {
            hit.setDamage(damage);
        }
        this.updateTotalDamage();
    }

    public setHandleAfterHitEffects(handleAfterHitEffects: boolean): PendingHit {
        this.handleAfterHitEffects = handleAfterHitEffects;
        return this;
    }

    public handleAfterHitEffects(): boolean {
        return this.handleAfterHitEffects;
    }

    private prepareHits(hitAmount: number, rollAccuracy: boolean): HitDamage[] {
        // Check the hit amounts.
        if (hitAmount > 4) {
            throw new Error(
                "Illegal number of hits! The maximum number of hits per turn is 4.");
        } else if (hitAmount < 0) {
            throw new Error(
                "Illegal number of hits! The minimum number of hits per turn is 0.");
        }

        if (attacker == null || target == null) {
            return null;
        }

        let hits: HitDamage[] = new Array(hitAmount);
        for (let i = 0; i < hits.length; i++) {
            this.accurate = !rollAccuracy || AccuracyFormulasDpsCalc.rollAccuracy(this.attacker, this.target, this.combatType);
            let damage: HitDamage = this.accurate ? CombatFactory.getHitDamage(this.attacker, this.target, this.combatType) : new HitDamage(0, HitMask.BLUE);
            this.totalDamage += damage.getDamage();
            hits[i] = damage;
        }
        return hits;
    }

    public updateTotalDamage() {
        this.totalDamage = 0;
        for (let i = 0; i < this.hits.length; i++) {
            this.totalDamage += this.hits[i].getDamage();
        }
    }

    public getSkills(): number[] {
        if (this.attacker.isNpc()) {
            return new Array();
        }
        return ((this.attacker as Player).getFightType().getStyle().skill(this.combatType));
    }

    public getCombatType(): CombatType {
        return this.combatType;
    }
}    