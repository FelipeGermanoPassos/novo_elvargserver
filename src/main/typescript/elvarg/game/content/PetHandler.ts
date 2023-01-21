
class PetHandler {
    private static INTERACTION_ANIM = new Animation(827);

    public static onSkill(player: Player, skill: Skill) {
        for (let pet of Pet.SKILLING_PETS) {
            if (pet.getSkill() && pet.getSkill() === skill) {
                if (Math.floor(Math.random() * pet.getChance()) === 1) {
                    World.sendMessage(`@dre@${player.getUsername()} just found a stray ${pet.getName()} while ${skill.toString().toLowerCase()}!`);
                    PetHandler.drop(player, pet.getItemId(), true);
                    return;
                }
            }
        }
    }

    public static drop(player: Player, itemId: number, announce: boolean) {
        if (player.getInventory().getFreeSlots() < 1) {
            player.getPacketSender().sendMessage("Your inventory is full.");
            return;
        }
        player.getInventory().add(itemId, 1);
        player.getPacketSender().sendMessage("You have found a pet.");
    }

    public static drop(player: Player, id: number, reward: boolean) {
        let pet = Pet.getPetForItem(id);
        if (pet) {

            // Check if we already have a pet..
            if (!player.getCurrentPet()) {

                // Spawn the pet..
                let tiles: Location[] = [];
                for (let tile of player.outterTiles()) {
                    if (RegionManager.blocked(tile, player.getPrivateArea())) {
                        continue;
                    }
                    tiles.push(tile);
                }
                let location = tiles.length == 0 ? player.getLocation().clone() : tiles[Misc.getRandom(tiles.length - 1)];
                let npc = NPC.create(pet.get().getId(), location);
                npc.setPet(true);
                npc.setOwner(player);
                npc.setFollowing(player);
                npc.setMobileInteraction(player);
                npc.setArea(player.getArea());
                World.getAddNPCQueue().add(npc);

                // Set the player's current pet to this one.
                player.setCurrentPet(npc);

                // If this is a reward, congratulate them.
                // Otherwise simply drop it on the ground.
                if (reward) {
                    player.getPacketSender().sendMessage("You have a funny feeling like you're being followed.");
                } else {
                    player.getInventory().delete(pet.get().getItemId(), 1);
                    player.getPacketSender().sendMessage("You drop your pet..");
                    player.performAnimation(INTERACTION_ANIM);
                    player.setPositionToFace(npc.getLocation());
                }
            } else {
                // We might have to add to bank if inventory is full!
                if (reward) {
                    if (!player.getInventory().isFull()) {
                        player.getInventory().add(pet.get().getItemId(), 1);
                    } else {
                        ItemOnGroundManager.registerNonGlobal(player, new Item(pet.get().getItemId()));
                    }
                    player.getPacketSender().sendMessage("@dre@You've received a pet!");
                } else {
                    player.getPacketSender().sendMessage("You already have a pet following you.");
                }
            }
            return true;
        }
        return false;
    }

    public static pickup(player: Player, npc: NPC): boolean {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }
        // Make sure npc is a pet..
        let pet = Pet.getPet(npc.getId());
        if (!pet) {
            return false;
        }

        // Make sure we're picking up our pet!
        if (player.getCurrentPet() === npc) {

            player.getMovementQueue().reset();

            // Perform animation..
            player.performAnimation(INTERACTION_ANIM);

            // Remove the npc from the world
            World.getRemoveNPCQueue().add(player.getCurrentPet());

            // Add pet to inventory or bank
            if (!player.getInventory().isFull()) {
                player.getInventory().add(pet.getItemId(), 1);
            } else {
                player.getBank(Bank.getTabForItem(player, pet.getItemId())).add(pet.getItemId(), 1);
            }

            // Send message
            player.getPacketSender().sendMessage("You pick up your pet..");

            // Reset pet
            player.setCurrentPet(null);
            return true;
        }
        return false;
    }

    static morph(player: Player, npc: NPC): boolean {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }

        // Make sure npc is a pet..
        let pet = Pet.getPet(npc.getId());
        if (!pet.isPresent()) {
            return false;
        }

        // Make sure we're picking up our own pet!
        if (player.getCurrentPet() === npc) {

            // If this pet can morph..
            if (pet.get().canMorph()) {
                npc.setNpcTransformationId(pet.get().getMorphId());
                player.getPacketSender().sendMessage("Your pet endures metamorphosis and transforms.");
            }
            return true;
        }
        return false;
    }

    /**
     * Attempts to interact with the given pet.
     *
     * @param player
     * @param npc
     * @return
     */
    static interact(player: Player, npc: NPC): boolean {
        if (npc == null || player.getCurrentPet() == null) {
            return false;
        }

        // Make sure npc is a pet..
        let pet = Pet.getPet(npc.getId());
        if (!pet.isPresent() || pet.get().getDialogue(player) == -1) {
            return false;
        }

        // Make sure we're interacting with our own pet!
        if (player.getCurrentPet() === npc) {
            if (player.getCurrentPet().getId() == Pet.OLMLET.getId()) {
                /* DialogueManager.start(player, 298);
                player.setDialogueOptions(new DialogueOptions() {
                    @Override
                    public void handleOption(Player player, int option) {
                        switch (option) {
                            case 1:
                                DialogueManager.start(player, 300);
                                break;
                            case 2:
                                DialogueManager.start(player, 303);
                                break;
                            case 3:
                                DialogueManager.start(player, 308);
                                break;
                            case 4:
                                player.getPacketSender().sendInterfaceRemoval();
                                break;
                        }
                    }
                });*/
            } else {
                //  DialogueManager.start(player, pet.get().getDialogue(player));
            }
            return true;
        }
        return false;
    }
}

enum Pet {
    DARK_CORE = { id: 318, secondId: 0, item: 12816, dialogue: 123 },
    VENENATIS_SPIDERLING = { id: 495, secondId: 0, item: 13177, dialogue: 126 },
    CALLISTO_CUB = { id: 497, secondId: 0, item: 13178, dialogue: 130 },
    HELLPUPPY = {
        id: 964, secondId: 0, item: 13247, dialogue: 138, getDialogue: (player: Player) => {
            const dialogueIds = [138, 143, 145, 150, 154];
            return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
        }
    },
    CHAOS_ELEMENTAL_JR = { id: 2055, secondId: 0, item: 11995, dialogue: 158 },
    SNAKELING = { id: 2130, secondId: 2131, item: 12921, dialogue: 162 },
    MAGMA_SNAKELING = { id: 2131, secondId: 2132, item: 12921, dialogue: 169 },
    TANZANITE_SNAKELING = { id: 2132, secondId: 2130, item: 12921, dialogue: 176 },
    VETION_JR = { id: 5536, secondId: 5537, item: 13179, dialogue: 183 },
    VETION_JR_REBORN = { id: 5537, secondId: 5536, item: 13179, dialogue: 189 },
    SCORPIAS_OFFSPRING = { id: 5561, secondId: 0, item: 13181, dialogue: 195 },
    ABYSSAL_ORPHAN = {
        id: 5884, secondId: 0, item: 13262, dialogue: 202, getDialogue: (player: Player) => {
            if (!player.getAppearance().isMale()) {
                return 206;
            } else {
                const dialogueIds = [202, 209];
                return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
            }
        }
    },
    TZREK_JAD = {
        id: 5892, secondId: 0, item: 13225, dialogue: 212, getDialogue: (player: Player) => {
            const dialogueIds = [212, 217];
            return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
        }
    },
    SUPREME_HATCHLING = { id: 6628, secondId: 0, item: 12643, dialogue: 220 },
    PRIME_HATCHLING = { id: 6629, secondId: 0, item: 12644, dialogue: 223 },
    REX_HATCHLING = { id: 6630, secondId: 0, item: 12645, dialogue: 231 },
    CHICK_ARRA = { id: 6631, secondId: 0, item: 12649, dialogue: 239 },
    GENERAL_AWWDOR = { id: 6632, secondId: 0, item: 12650, dialogue: 247 },
    COMMANDER_MINIANA = {
        id: 6633, secondId: 0, item: 12651, dialogue: 250, getDialogue: (player: Player) => {
            if (player.getEquipment().contains(11806)) {
                return 252;
            } else {
                return 250;
            }
        }
    },
    KRIL_TINYROTH = { id: 6634, secondId: 0, item: 12652, dialogue: 254 },
    BABY_MOLE = { id: 6635, secondId: 0, item: 12646, dialogue: 261 },
    PRINCE_BLACK_DRAGON = { id: 6636, secondId: 0, item: 12653, dialogue: 267 },
    KALPHITE_PRINCESS = { id: 6637, secondId: 6638, item: 12654, dialogue: 271 },
    MORPHED_KALPHITE_PRINCESS = { id: 6638, secondId: 6637, item: 12654, dialogue: 279 },
    SMOKE_DEVIL = { id: 6639, secondId: 0, item: 12648, dialogue: 288 },
    KRAKEN = { id: 6640, secondId: 0, item: 12655, dialogue: 291 },
    PENANCE_PRINCESS = { id: 6642, secondId: 0, item: 12703, dialogue: 296 },
    OLMLET = { id: 7520, secondId: 0, item: 20851, dialogue: 298 },
    Skotos = { id: 425, secondId: 0, item: 21273, dialogue: 298 },
    HERON = { id: 6715, secondId: 0, item: 13320, dialogue: -1, skill: Skill.FISHING, level: 5000 },
    BEAVER = { id: 6717, secondId: 0, item: 13322, dialogue: -1, skill: Skill.WOODCUTTING, level: 5000 },
    GREY_CHINCHOMPA = { id: 6719, secondId: 6720, item: 13324, dialogue: -1, skill: Skill.HUNTER, level: 3000 },
    RED_CHINCHOMPA = { id: 6718, secondId: 6719, item: 13323, dialogue: -1, skill: Skill.HUNTER, level: 4000 },
    BLACK_CHINCHOMPA = { id: 6720, secondId: 6718, item: 13325, dialogue: -1, skill: Skill.HUNTER, level: 5000 },
    ROCK_GOLEM = { id: 6723, secondId: 0, item: 13321, dialogue: -1, skill: Skill.MINING, level: 5000 },
    GIANT_SQUIRREL = { id: 7334, secondId: 0, item: 20659, dialogue: -1, skill: Skill.AGILITY, level: 5000 },
    TANGLEROOT = { id: 7335, secondId: 0, item: 0, dialogue: -1, skill: Skill.FARMING, level: 5000 },
    ROCKY = { id: 7336, secondId: 0, item: 0, dialogue: -1, skill: Skill.THIEVING, level: 5000 },
    FIRE_RIFT_GAURDIAN = { id: 7337, secondId: 7338, item: 20665, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    AIR_RIFT_GUARDIAN = { id: 7338, secondId: 7339, item: 20667, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    MIND_RIFT_GUARDIAN = { id: 7339, secondId: 7340, item: 20669, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    WATER_RIFT_GUARDIAN = { id: 7340, secondId: 7341, item: 20671, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    EARTH_RIFT_GUARDIAN = { id: 7341, secondId: 7342, item: 20673, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    BODY_RIFT_GUARDIAN = { id: 7342, secondId: 7343, item: 20675, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    COSMIC_RIFT_GUARDIAN = { id: 7343, secondId: 7344, item: 20677, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    CHAOS_RIFT_GUARDIAN = { id: 7344, secondId: 7345, item: 20679, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    NATURE_RIFT_GUARDIAN = { id: 7345, secondId: 7346, item: 20681, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    LAW_RIFT_GUARDIAN = { id: 7346, secondId: 7347, item: 20683, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    DEATH_RIFT_GUARDIAN = { id: 7347, secondId: 7348, item: 20685, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    SOUL_RIFT_GUARDIAN = { id: 7348, secondId: 7349, item: 20687, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    ASTRAL_RIFT_GUARDIAN = { id: 7349, secondId: 7350, item: 20689, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
    BLOOD_RIFT_GUARDIAN = { id: 7350, secondId: 7337, item: 20691, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 },
}

const SKILLING_PETS = new Set<Pet>([HERON, BEAVER, GREY_CHINCHOMPA, RED_CHINCHOMPA, BLACK_CHINCHOMPA, ROCK_GOLEM, GIANT_SQUIRREL, TANGLEROOT, ROCKY]);

class Pet {
    private petId: number;
    private morphId: number;
    private itemId: number;
    private dialogue: number;
    public skill: Optional<Skill> = Optional.empty();
    private chance: number;

    constructor(petNpcId: number, morphId: number, itemId: number, dialogue: number) {
        this.petId = petNpcId;
        this.morphId = morphId;
        this.itemId = itemId;
        this.dialogue = dialogue;
    }

    constructor(petNpcId: number, morphId: number, itemId: number, dialogue: number, skill: Skill, chance: number) {
        this(petNpcId, morphId, itemId, dialogue);
        this.skill = Optional.of(skill);
        this.chance = chance;
    }

    public static getPet(identifier: number): Optional<Pet> {
        return values().filter(s => s.petId == identifier).find(x => x);
    }

    public static getPetForItem(identifier: number): Optional<Pet> {
        return values().filter(s => s.itemId == identifier).find(x => x);
    }

    public getId(): number {
        return this.petId;
    }

    public getMorphId(): number {
        return this.morphId;
    }

    public canMorph(): boolean {
        return (this.morphId != 0);
    }

    public getItemId(): number {
        return this.itemId;
    }

    public getDialogue(player: Player): number {
        return this.dialogue;
    }

    public getSkill(): Optional<Skill> {
        return this.skill;
    }

    public getChance(): number {
        return this.chance;
    }

    public getName(): string {
        let name = this.name().toLowerCase().replaceAll("_", " ");
        return Misc.capitalizeWords(name);
    }
}


interface Pet {
    id: number,
    secondId: number,
    item: number,
    dialogue: number,
    getDialogue?: (player: Player) => number
}

interface Player {
    getAppearance(): {
        isMale(): boolean
    }
}

declare function Misc {
    getRandom(max: number): number
}
