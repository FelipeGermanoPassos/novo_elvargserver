export class Sound {

    // crafting sounds

    public static CUTTING = { id: 375, volume: 1, delay: 0, loopType: 0 }

    // cooking sounds

    public static COOKING_COOK = { id: 1039, volume: 1, delay: 10, loopType: 0 }

    public static COOKING_BURN = { id: 240, volume: 1, delay: 0, loopType: 0 }

    // runecrafting sounds

    public static CRAFT_RUNES = { id: 207, volume: 0, delay: 0, loopType: 0 }

    // mining sounds

    public static MINING_MINE = { id: 432, volume: 1, delay: 15, loopType: 0 }

    public static MINING_ROCK_GONE = { id: 431, volume: 1, delay: 0, loopType: 0 }

    public static MINING_ROCK_RESTORE = { id: 463, volume: 1, delay: 0, loopType: 0 }

    public static MINING_ROCK_EXPLODE = { id: 1021, volume: 1, delay: 0, loopType: 0 }

    // fishing sounds

    public static FISHING_FISH = { id: 379, volume: 1, delay: 10, loopType: 0 }

    // woodcutting sounds

    public static WOODCUTTING_CHOP = { id: 472, volume: 1, delay: 10, loopType: 0 }

    public static WOODCUTTING_TREE_DOWN = { id: 473, volume: 1, delay: 0, loopType: 0 }

    // Getting hit
    public static FEMALE_GETTING_HIT = { id: 818, volume: 1, delay: 25, loopType: 0 }

    // weapon sounds

    public static IMP_ATTACKING = { id: 10, volume: 1, delay: 25, loopType: 0 }

    public static SHOOT_ARROW = { id: 370, volume: 1, delay: 0, loopType: 0 }

    public static WEAPON = { id: 398, volume: 1, delay: 25, loopType: 0 } // default/other

    public static WEAPON_GODSWORD = { id: 390, volume: 1, delay: 25, loopType: 0 }

    public static WEAPON_STAFF = { id: 394, volume: 1, delay: 25, loopType: 0 }

    public static WEAPON_BOW = { id: 370, volume: 1, delay: 25, loopType: 0 }

    public static WEAPON_BATTLE_AXE = { id: 399, volume: 1, delay: 25, loopType: 0 }

    public static WEAPON_TWO_HANDER = { id: 400, volume: 1, delay: 25, loopType: 0 }

    public static WEAPON_SCIMITAR = { id: 396, volume: 1, delay: 25, loopType: 0 }

    public static WEAPON_WHIP = { id: 1080, volume: 1, delay: 25, loopType: 0 }

    // Special attack
    public static DRAGON_DAGGER_SPECIAL = { id: 385, volume: 1, delay: 25, loopType: 0 }

    // Spell sounds

    public static SPELL_FAIL_SPLASH = { id: 193, volume: 1, delay: 0, loopType: 0 }
    public static TELEPORT = { id: 202, volume: 1, delay: 0, loopType: 0 }

    public static ICA_BARRAGE_IMPACT = { id: 1125, volume: 1, delay: 0, loopType: 0 }

    public static DROP_ITEM = { id: 376, volume: 1, delay: 0, loopType: 0 }
    public static PICK_UP_ITEM = { id: 358, volume: 1, delay: 0, loopType: 0 }

    public static SET_UP_BARRICADE = { id: 358, volume: 1, delay: 0, loopType: 0 }

    public static FIRE_LIGHT = { id: 375, volume: 1, delay: 0, loopType: 0 }
    public static FIRE_SUCCESSFUL = { id: 608, volume: 1, delay: 0, loopType: 0 }
    public static FIRE_FIRST_ATTEMPT = { id: 2584, volume: 1, delay: 0, loopType: 0 }
    public static SLASH_WEB = { id: 237, volume: 1, delay: 0, loopType: 0 }
    public static FAIL_SLASH_WEB = { id: 2548, volume: 1, delay: 0, loopType: 0 }
    public static FOOD_EAT = { id: 317, volume: 1, delay: 0, loopType: 0 }
    public static DRINK = { id: 334, volume: 1, delay: 0, loopType: 0 }

    private static id: number;
    private static volume: number;
    private static delay: number;

    private static loopType: number;

    public static Sound(id: number, volume: number, delay: number, loopType: number) {
        this.id = id;
        this.volume = volume;
        this.delay = delay;
        this.loopType = loopType;
    }

    public getId(): number {
        return Sound.id;
    }

    public getVolume(): number {
        return Sound.volume;
    }

    public getDelay(): number {
        return Sound.delay;
    }

    public getLoopType(): number { return Sound.loopType; }

}


