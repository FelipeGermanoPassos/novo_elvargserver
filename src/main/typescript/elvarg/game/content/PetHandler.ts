import { World } from "../Worlds";
import { RegionManager } from "../collision/RegionManager";
import { ItemOnGroundManager } from "../entity/impl/grounditem/ItemOnGroundManager";
import { NPC } from "../entity/impl/npc/NPC";
import { Player } from "../entity/impl/player/Player";
import { Animation } from "../model/Animation";
import { Item } from "../model/Item";
import { Location } from "../model/Location";
import { Skill } from "../model/Skill";
import { Bank } from "../model/container/impl/Bank";
import { Misc } from "../../util/Misc";

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
            player.performAnimation(PetHandler.INTERACTION_ANIM);

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

export class Pet {
    public static DARK_CORE = { id: 318, secondId: 0, item: 12816, dialogue: 123 }
    public static VENENATIS_SPIDERLING = { id: 495, secondId: 0, item: 13177, dialogue: 126 }
    public static CALLISTO_CUB = { id: 497, secondId: 0, item: 13178, dialogue: 130 }
    public static HELLPUPPY = {
        id: 964, secondId: 0, item: 13247, dialogue: 138, getDialogue: (player: Player) => {
            const dialogueIds = [138, 143, 145, 150, 154];
            return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
        }
    }
    public static CHAOS_ELEMENTAL_JR = { id: 2055, secondId: 0, item: 11995, dialogue: 158 }
    public static SNAKELING = { id: 2130, secondId: 2131, item: 12921, dialogue: 162 }
    public static MAGMA_SNAKELING = { id: 2131, secondId: 2132, item: 12921, dialogue: 169 }
    public static TANZANITE_SNAKELING = { id: 2132, secondId: 2130, item: 12921, dialogue: 176 }
    public static VETION_JR = { id: 5536, secondId: 5537, item: 13179, dialogue: 183 }
    public static VETION_JR_REBORN = { id: 5537, secondId: 5536, item: 13179, dialogue: 189 }
    public static SCORPIAS_OFFSPRING = { id: 5561, secondId: 0, item: 13181, dialogue: 195 }
    public static ABYSSAL_ORPHAN = {
        id: 5884, secondId: 0, item: 13262, dialogue: 202, getDialogue: (player: Player) => {
            if (!player.getAppearance().isMale()) {
                return 206;
            } else {
                const dialogueIds = [202, 209];
                return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
            }
        }
    }
    public static TZREK_JAD = {
        id: 5892, secondId: 0, item: 13225, dialogue: 212, getDialogue: (player: Player) => {
            const dialogueIds = [212, 217];
            return dialogueIds[Misc.getRandom(dialogueIds.length - 1)];
        }
    }
    public static SUPREME_HATCHLING = { id: 6628, secondId: 0, item: 12643, dialogue: 220 }
    public static PRIME_HATCHLING = { id: 6629, secondId: 0, item: 12644, dialogue: 223 }
    public static REX_HATCHLING = { id: 6630, secondId: 0, item: 12645, dialogue: 231 }
    public static CHICK_ARRA = { id: 6631, secondId: 0, item: 12649, dialogue: 239 }
    public static GENERAL_AWWDOR = { id: 6632, secondId: 0, item: 12650, dialogue: 247 }
    public static COMMANDER_MINIANA = {
        id: 6633, secondId: 0, item: 12651, dialogue: 250, getDialogue: (player: Player) => {
            if (player.getEquipment().contains(11806)) {
                return 252;
            } else {
                return 250;
            }
        }
    }
    public static KRIL_TINYROTH = { id: 6634, secondId: 0, item: 12652, dialogue: 254 }
    public static BABY_MOLE = { id: 6635, secondId: 0, item: 12646, dialogue: 261 }
    public static PRINCE_BLACK_DRAGON = { id: 6636, secondId: 0, item: 12653, dialogue: 267 }
    public static KALPHITE_PRINCESS = { id: 6637, secondId: 6638, item: 12654, dialogue: 271 }
    public static MORPHED_KALPHITE_PRINCESS = { id: 6638, secondId: 6637, item: 12654, dialogue: 279 }
    public static SMOKE_DEVIL = { id: 6639, secondId: 0, item: 12648, dialogue: 288 }
    public static KRAKEN = { id: 6640, secondId: 0, item: 12655, dialogue: 291 }
    public static PENANCE_PRINCESS = { id: 6642, secondId: 0, item: 12703, dialogue: 296 }
    public static OLMLET = { id: 7520, secondId: 0, item: 20851, dialogue: 298 }
    public static Skotos = { id: 425, secondId: 0, item: 21273, dialogue: 298 }
    public static HERON = { id: 6715, secondId: 0, item: 13320, dialogue: -1, skill: Skill.FISHING, level: 5000 }
    public static BEAVER = { id: 6717, secondId: 0, item: 13322, dialogue: -1, skill: Skill.WOODCUTTING, level: 5000 }
    public static GREY_CHINCHOMPA = { id: 6719, secondId: 6720, item: 13324, dialogue: -1, skill: Skill.HUNTER, level: 3000 }
    public static RED_CHINCHOMPA = { id: 6718, secondId: 6719, item: 13323, dialogue: -1, skill: Skill.HUNTER, level: 4000 }
    public static BLACK_CHINCHOMPA = { id: 6720, secondId: 6718, item: 13325, dialogue: -1, skill: Skill.HUNTER, level: 5000 }
    public static ROCK_GOLEM = { id: 6723, secondId: 0, item: 13321, dialogue: -1, skill: Skill.MINING, level: 5000 }
    public static GIANT_SQUIRREL = { id: 7334, secondId: 0, item: 20659, dialogue: -1, skill: Skill.AGILITY, level: 5000 }
    public static TANGLEROOT = { id: 7335, secondId: 0, item: 0, dialogue: -1, skill: Skill.FARMING, level: 5000 }
    public static ROCKY = { id: 7336, secondId: 0, item: 0, dialogue: -1, skill: Skill.THIEVING, level: 5000 }
    public static FIRE_RIFT_GAURDIAN = { id: 7337, secondId: 7338, item: 20665, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static AIR_RIFT_GUARDIAN = { id: 7338, secondId: 7339, item: 20667, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static MIND_RIFT_GUARDIAN = { id: 7339, secondId: 7340, item: 20669, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static WATER_RIFT_GUARDIAN = { id: 7340, secondId: 7341, item: 20671, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static EARTH_RIFT_GUARDIAN = { id: 7341, secondId: 7342, item: 20673, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static BODY_RIFT_GUARDIAN = { id: 7342, secondId: 7343, item: 20675, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static COSMIC_RIFT_GUARDIAN = { id: 7343, secondId: 7344, item: 20677, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static CHAOS_RIFT_GUARDIAN = { id: 7344, secondId: 7345, item: 20679, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static NATURE_RIFT_GUARDIAN = { id: 7345, secondId: 7346, item: 20681, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static LAW_RIFT_GUARDIAN = { id: 7346, secondId: 7347, item: 20683, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static DEATH_RIFT_GUARDIAN = { id: 7347, secondId: 7348, item: 20685, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static SOUL_RIFT_GUARDIAN = { id: 7348, secondId: 7349, item: 20687, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static ASTRAL_RIFT_GUARDIAN = { id: 7349, secondId: 7350, item: 20689, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }
    public static BLOOD_RIFT_GUARDIAN = { id: 7350, secondId: 7337, item: 20691, dialogue: -1, skill: Skill.RUNECRAFTING, level: 8000 }

    public static SKILLING_PETS = new Set<Pet>([Pet.HERON, Pet.BEAVER, Pet.GREY_CHINCHOMPA, Pet.RED_CHINCHOMPA, Pet.BLACK_CHINCHOMPA, Pet.ROCK_GOLEM, Pet.GIANT_SQUIRREL, Pet.TANGLEROOT, Pet.ROCKY])

    private petId: number;
    private morphId: number;
    private itemId: number;
    private dialogue: number;
    public skill: Skill;
    private chance: number;



    constructor(petNpcId: number, morphId: number, itemId: number, dialogue: number, skill?: Skill, chance?: number) {
        if (skill != null || chance != null) {
            this(petNpcId, morphId, itemId, dialogue);
            this.skill = skill;
            this.chance = chance;
        } else {
            this.petId = petNpcId;
            this.morphId = morphId;
            this.itemId = itemId;
            this.dialogue = dialogue;
        }
    }

    public static getPet(identifier: number): Pet {
        return Array.prototype.map(values().filter(s => s.petId == identifier).find(x => x));
    }

    public static getPetForItem(identifier: number): Pet {
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

    public getSkill(): Skill {
        return this.skill;
    }

    public getChance(): number {
        return this.chance;
    }

    public getName(): string {
        let name: string = name().toLowerCase().replaceAll("_", " ");
        return Misc.capitalizeWords(name);
    }
}