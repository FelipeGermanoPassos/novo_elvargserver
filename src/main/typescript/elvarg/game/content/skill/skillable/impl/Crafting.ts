class Crafting extends ItemIdentifiers {
    public static craftGem(player: Player, itemUsed: number, itemUsedWith: number): boolean {
        if (itemUsed == CHISEL || itemUsedWith == CHISEL) {
            let gem = CraftableGem.map.get(itemUsed == CHISEL ? itemUsedWith : itemUsed);
            if (gem) {
                player.getPacketSender().sendCreationMenu(new CreationMenu("How many would you like to cut?", [gem.getCut().getId()], (itemId, amount) => {
                    player.getSkillManager().startSkillable(new ItemCreationSkillable([new RequiredItem(new Item(CHISEL), false), new RequiredItem(gem.getUncut(), true)], gem.getCut(), amount, Optional.of(gem.getAnimationLoop()), gem.getLevel(), gem.getExp(), Skill.CRAFTING));
                }));
                return true;
            }
        }
        return false;
    }
    
    enum CraftableGem {
    G1 = new Item(OPAL), new Item(UNCUT_OPAL), 1, 15, new AnimationLoop(new Animation(890), 3)),
G2 = new Item(JADE), new Item(UNCUT_JADE), 13, 20, new AnimationLoop(new Animation(891), 3)),
G3 = new Item(RED_TOPAZ), new Item(UNCUT_RED_TOPAZ), 16, 25, new AnimationLoop(new Animation(892), 3)),
G4 = new Item(SAPPHIRE), new Item(UNCUT_SAPPHIRE), 20, 50, new AnimationLoop(new Animation(888), 3)),
G5 = new Item(EMERALD), new Item(UNCUT_EMERALD), 27, 68, new AnimationLoop(new Animation(889), 3)),
G6 = new Item(RUBY), new Item(UNCUT_RUBY), 34, 85, new AnimationLoop(new Animation(887), 3)),
G7 = new Item(DIAMOND), new Item(UNCUT_DIAMOND), 43, 108, new AnimationLoop(new Animation(886), 3)),
G8 = new Item(DRAGONSTONE), new Item(UNCUT_DRAGONSTONE), 55, 138, new AnimationLoop(new Animation(885), 3)),
G9 = new Item(ONYX), new Item(UNCUT_ONYX), 67, 168, new AnimationLoop(new Animation(885), 3)),
G10 = new Item(ZENYTE), new Item(UNCUT_ZENYTE), 89, 200, new AnimationLoop(new Animation(885), 3)), ;
    
        static map = new Map<number, CraftableGem>();
    
        static {
    for (let c of Object.values(CraftableGem)) {
        map.set(c.getUncut().getId(), c);
    }
}

class CraftableGem {
    constructor(private cut: Item, private uncut: Item, private level: number, private exp: number, private animLoop: AnimationLoop) { }


    getCut(): Item {
        return this.cut;
    }

    getUncut(): Item {
        return this.uncut;
    }

    getLevel(): number {
        return this.level;
    }

    getExp(): number {
        return this.exp;
    }

    getAnimationLoop(): AnimationLoop {
        return this.animLoop;
    }
}
 
