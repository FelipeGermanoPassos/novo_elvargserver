import { NPC } from "../NPC";
import { VetionCombatMethod } from "../../content/combat/method/impl/npcs/VetionCombatMethod";
import { Location } from "../../model/Location";
import { VETION, VETION_REBORN, VETION_HELLHOUND, GREATER_VETION_HELLHOUND } from "../../../util/NpcIdentifiers";
import { VetionHellhound } from "./VetionHellhound";

class Vetion extends NPC {
    private static readonly COMBAT_METHOD = new VetionCombatMethod();
    private spawnedHellhounds = false;
    private rebornTimer = 0;
    private hellhounds: VetionHellhound[] = [];

    constructor(id: number, position: Location) {
        super(id, position);
        this.hellhounds = new ArrayList<>();
        this.setNpcTransformationId(VETION);
    }

    public getCombatMethod(): VetionCombatMethod {
        return Vetion.COMBAT_METHOD;
    }

    public process(): void {
        super.process();

        const target = this.getCombat().getTarget();
        if (target != null && this.getHitpoints() <= 125) {
            if (!this.spawnedHellhounds) {
                this.spawnHellhounds(target);
                this.spawnedHellhounds = true;
            }
        }

        if (this.getNpcTransformationId() == VETION_REBORN) {
            if (this.rebornTimer == 500) {
                this.spawnedHellhounds = true;
                this.setNpcTransformationId(VETION);
                this.rebornTimer = 0;
            }
            this.rebornTimer++;
        }
    }

    private spawnHellhounds(target: Mobile) {
        for (let i = 0; i < 2; i++) {
            let hellhoundId = VETION_HELLHOUND;
            if (this.getNpcTransformationId() == VETION_REBORN) {
                hellhoundId = GREATER_VETION_HELLHOUND;
            }
            const hellhound = NPC.create(hellhoundId, this.getLocation()) as VetionHellhound;
            hellhound.setVetion(this);
            this.hellhounds.push(hellhound);
            World.getAddNPCQueue().add(hellhound);
        }
    }

    public despawnHellhound(hellhound: VetionHellhound) {
        this.hellhounds.splice(this.hellhounds.indexOf(hellhound), 1);
    }
    public appendDeath() {
        for (const npc of this.hellhounds) {
            World.getRemoveNPCQueue().add(npc);
        }
        this.hellhounds = [];
        this.spawnedHellhounds = false;

        if (this.getNpcTransformationId() != VETION_REBORN) {
            this.setHitpoints(this.getDefinition().getHitpoints());
            this.setNpcTransformationId(VETION_REBORN);
            this.forceChat("Do it again!");
            return;
        }

        super.appendDeath();
    }

    public manipulateHit(hit: PendingHit): PendingHit {
        if (this.spawnedHellhounds && this.hellhounds.length > 0) {
            hit.setTotalDamage(0);
        }
        return hit;
    }
}
