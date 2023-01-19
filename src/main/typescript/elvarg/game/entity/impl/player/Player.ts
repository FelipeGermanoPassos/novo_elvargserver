import * as GameConstants from '../../../GameConstants';
import * as Sound from '../../../Sound';
import * as World from '../../../World';
import * as AllContent from '../../../content';
import * as PrayerData from '../../../content/PrayerHandler';
import * as ClanChat from '../../../content/clan/ClanChat';
import * as ClanChatManager from '../../../content/clan/ClanChatManager';
import * as CombatFactory from '../../../content/combat/CombatFactory';
import * as CombatSpecial from '../../../content/combat/CombatSpecial';
import * as CombatType from '../../../content/combat/CombatType';
import * as FightType from '../../../content/combat/FightStyle';
import * as WeaponInterfaces from '../../../content/combat/WeaponInterfaces';
import * as bountyhunter from '../../../content/combat/bountyhunter';
import * as PendingHit from '../../../content/combat/hit/PendingHit';
import * as Autocasting from '../../../content/combat/magic/Autocasting';
import * as Barrows from '../../../content/minigames/impl/Barrows';
import * as Presetable from '../../../content/presets/Presetable';
import * as Presetables from '../../../content/presets/Presetables';
import * as SkillManager from '../../../content/skill/SkillManager';
import * as Skillable from '../../../content/skill/skillable/Skillable';
import * as Runecrafting from '../../../content/skill/skillable/impl/Runecrafting';
import * as ActiveSlayerTask from '../../../content/skill/slayer/ActiveSlayerTask';
import * as ItemDefinition from '../../../definition/ItemDefinition';
import * as PlayerBotDefinition from '../../../definition/PlayerBotDefinition';
import * as Mobile from '../../../entity/impl/Mobile';
import * as NPC from '../../../entity/impl/npc/NPC';
import * as NpcAggression from '../../../entity/impl/npc/NpcAggression';
import * as PlayerBot from '../../../entity/impl/playerbot/PlayerBot';
import * as Animation from '../../../model/Animation';
import * as Appearance from '../../../model/Appearance';
import * as ChatMessage from '../../../model/ChatMessage';
import * as EffectTimer from '../../../model/EffectTimer';
import * as EnteredAmountAction from '../../../model/EnteredAmountAction';
import * as EnteredSyntaxAction from '../../../model/EnteredSyntaxAction';
import * as Flag from '../../../model/Flag';
import * as ForceMovement from '../../../model/ForceMovement';
import * as God from '../../../model/God';
import * as Item from '../../../model/Item';
import * as Location from '../../../model/Location';
import * as MagicSpellbook from '../../../model/MagicSpell';
import * as PlayerInteractingOption from '../../../model/PlayerInteracting';
import * as PlayerRelations from '../../../model/PlayerRelations';
import * as PlayerStatus from '../../../model/PlayerStatus';
import * as SecondsTimer from '../../../model/SecondsTimer';
import * as Skill from '../../../model/Skill';
import * as SkullType from '../../../model/SkillType';
import * as AreaManager from '../../../model/areas/AreaManager';
import * as Bank from '../../../model/container/impl/Bank';
import * as Equipment from '../../../model/container/impl/Equipment';
import * as Inventory from '../../../model/container/impl/Inventory';
import * as PriceChecker from '../../../model/container/impl/PriceCheck';
import * as Shop from '../../../model/container/shop/Shop';
import * as DialogueManager from '../../../model/dialogues/DialogueManager';
import * as BonusManager from '../../../model/equipment/BonusManager';
import * as CreationMenu from '../../../model/menu/CreationMenu';
import * as MovementQueue from '../../../model/movement/MovementQueue';
import * as DonatorRights from '../../../model/rights/DonatorRights';
import * as PlayerRights from '../../../model/ rights/PlayerRights';
import * as TeleportButton from '../../../model/teleportation/TeleportButton';
import * as TaskManager from '../../../task/TaskManager';
import * as CombatPoisonEffect from '../../../task/impl/CombatPoisonEffect';
import * as PlayerDeathTask from '../../../task/impl/PlayerDeathTask';
import * as RestoreSpecialAttackTask from '../../../task/impl/RestoreSpecialAttackTask';
import * as PlayerSession from '../../../../net/PlayerSession';
import * as ChannelEventHandler from '../../../../net/channel/ChannelEventHandler';
import * as PacketSender from '../../../../net/packet/PacketSender';
import * as FrameUpdater from '../../../../util/FrameUpdater';
import * as Misc from '../../../../util/Misc';
import * as NpcIdentifiers from '../../../../util/NpcIdentifiers';
import * as Stopwatch from '../../../../util/Stopwatch';
import * as TimerKey from '../../../../util/timers/TimerKey';
import * as QuickPrayers from '../../../content/QuickPrayers';




export class Player extends Mobile {
    public increaseStats: SecondsTimer = new SecondsTimer();
    public decreaseStats:  = new SecondsTimer();
    private List<Player> localPlayers = new LinkedList<Player>();
    private List<NPC> localNpcs = new LinkedList<NPC>();
    private packetSender: PacketSender = new PacketSender(this);
    private appearance: Appearance = new Appearance(this);
    private skillManager: SkillManager = new SkillManager(this);
    private relations: PlayerRelations = new PlayerRelations(this);
    private frameUpdater: FrameUpdater = new FrameUpdater();
    private bonusManager: BonusManager = new BonusManager();
    private quickPrayers: QuickPrayers = new QuickPrayers(this);
    private inventory: Inventory = new Inventory(this);
    private equipment: Equipment = new Equipment(this);
    private priceChecker: PriceChecker = new PriceChecker(this);
    private clickDelay: Stopwatch = new Stopwatch();
    private lastItemPickup: Stopwatch = new Stopwatch();
    private yellDelay: SecondsTimer = new SecondsTimer();
    private aggressionTolerance: SecondsTimer = new SecondsTimer();
    // Delay for restoring special attack
    private specialAttackRestore: SecondsTimer = new SecondsTimer();
    /*
     * Fields
     */
    private targetSearchTimer: SecondsTimer = new SecondsTimer();
    private recentKills: List<string> = new ArrayList<String>(); // Contains ip addresses of recent kills
    private Queue<ChatMessage> chatMessageQueue = new ConcurrentLinkedQueue<>();
    private currentChatMessage: ChatMessage;
    // Logout
    private forcedLogoutTimer: SecondsTimer = new SecondsTimer();
    // Trading
    private trading: Trading = new Trading(this);
    private dueling: Dueling = new Dueling(this);
    private dialogueManager: DialogueManager = new DialogueManager(this);
    // Presets
    private currentPreset: Presetable;
    private presets: Presetable[] = new Presetable[Presetables.MAX_PRESETS];
    private openPresetsOnDeath: boolean = true;

    private username: string;
    private passwordHashWithSalt: string;
    private hostAddress: string;
    private isDiscordLogin: boolean;
    private cachedDiscordAccessToken: string;
    private longUsername: number;
    private session: PlayerSession;
    private playerInteractingOption: PlayerInteractingOption = PlayerInteractingOption.NONE;
    private status: PlayerStatus = PlayerStatus.NONE;
    private currentClanChat: ClanChat;
    private clanChatName: string;
    private shop: Shop;
    private interfaceId: number = -1, walkableInterfaceId = -1, multiIcon;
    private isRunning: boolean = true;
    private runEnergy: number = 100;
    private lastRunRecovery: Stopwatch = new Stopwatch();
    private isDying: boolean;
    private allowRegionChangePacket: boolean;
    private experienceLocked: boolean;
    private forceMovement: ForceMovement;
    private currentPet: NPC;
    private skillAnimation: number;
    private drainingPrayer: boolean;
    private prayerPointDrain: number;
    private spellbook: MagicSpellbook = MagicSpellbook.NORMAL;
    private Map<TeleportButton, Location> previousTeleports = new HashMap<>();
    private teleportInterfaceOpen: boolean;
    private destroyItem: number = -1;
    private updateInventory: boolean; // Updates inventory on next tick
    private newPlayer: boolean;
    private packetsBlocked: boolean = false;
    private regionHeight: number;

    private questPoints: number;
    private Map<Integer, Integer> questProgress = new HashMap<Integer, Integer>();
    // Skilling
    private Optional<Skillable> skill = Optional.empty();
    private creationMenu: CreationMenu;
    // Entering data
    private enteredAmountAction: EnteredAmountAction;
    private enteredSyntaxAction: EnteredSyntaxAction;

    // Time the account was created
    private creationDate: Timestamp;
    // RC
    private PouchContainer[] pouches = new PouchContainer[][new PouchContainer(Pouch.SMALL_POUCH),
        new PouchContainer(Pouch.MEDIUM_POUCH), new PouchContainer(Pouch.LARGE_POUCH),
        new PouchContainer(Pouch.GIANT_POUCH), ];
    // Slayer
    private slayerTask: ActiveSlayerTask;
    private slayerPoints: number;
    private consecutiveTasks: number;

    // Combat
    private skullType: SkullType = SkullType.WHITE_SKULL;
    private combatSpecial: CombatSpecial;
    private recoilDamage: number;
    private vengeanceTimer: SecondsTimer = new SecondsTimer();
    private wildernessLevel: number;
    private skullTimer: number;
    private points: number;
    private amountDonated: number;
    // Blowpipe
    private blowpipeScales: number;
    // Bounty hunter
    private targetKills: number;
    private normalKills: number;
    private totalKills: number;
    private killstreak: number;
    private highestKillstreak: number;
    private deaths: number;
    private safeTimer: number = 180;
    // Barrows
    private barrowsCrypt: number;
    private barrowsChestsLooted: number;
    private killedBrothers: boolean[] = new boolean[Brother.values().length];
    private currentBrother: NPC;
    private preserveUnlocked: boolean;
    private rigourUnlocked: boolean;
    private auguryUnlocked: boolean;
    private targetTeleportUnlocked: boolean;
    // Banking
    private currentBankTab: number;
    private banks: Bank[] = new Bank[Bank.TOTAL_BANK_TABS]; // last index is for bank searches
    private noteWithdrawal: boolean, insertMode: boolean, searchingBank: boolean;
    private searchSyntax: string = "";
    private placeholders: boolean = true;
    private infiniteHealth: boolean;
    private fightType: FightType = FightType.UNARMED_KICK;
    private weapon: WeaponInterfaces.WeaponInterface;
    private autoRetaliate: boolean = true;

    // GWD
    private godwarsKillcount: number[] = new [God.values().length]: number;

    // Rights
    private  rights: PlayerRights = PlayerRights.NONE;
    private  donatorRights: DonatorRights = DonatorRights.NONE;
    /**
     * The cached player update block for updating.
     */
    private  cachedUpdateBlock: ByteBuf;
    private loyaltyTitle: string = "empty";
    private spawnedBarrows: boolean;
    private  oldPosition: Location;

    /**
     * Creates this player.
     *
     * @param playerIO
     */
    public Player(playerIO: PlayerSession) {
        super(GameConstants.DEFAULT_LOCATION.clone());
        this.session = playerIO;
    }

    /**
     * Creates this player with pre defined spawn location.
     *
     * @param playerIO
     */
    public Player(playerIO: PlayerSession, spawnLocation: Location) {
        super(spawnLocation);
        this.session = playerIO;
    }

    /**
     * Actions that should be done when this character is added to the world.
     */
    @Override
    public onAdd(): void {
        onLogin();
    }

    /**
     * Actions that should be done when this character is removed from the world.
     */
    @Override
    public onRemove(): void {
        onLogout();
    }

    @Override
    public appendDeath(): void {
        if (!isDying) {
            TaskManager.submit(new PlayerDeathTask(this));
            isDying = true;
        }
    }

    @Override
    public getHitpoints(): number {
        return getSkillManager().getCurrentLevel(Skill.HITPOINTS);
    }

    @Override
    public getAttackAnim(): number {
        return getFightType().getAnimation();
    }

    @Override
    public Sound getAttackSound() {
        return getFightType().getAttackSound();
    }

    @Override
    public getBlockAnim(): number {
		Item shield = getEquipment().getItems()[Equipment.SHIELD_SLOT];
		Item weapon = getEquipment().getItems()[Equipment.WEAPON_SLOT];
        definition = shield.getId() > 0 ? shield.getDefinition() : weapon.getDefinition();
        return definition.getBlockAnim();
    }

    @Override
    public Mobile setHitpoints(hitpoints: number) {
        if (isDying) {
            return this;
        }

        if (infiniteHealth) {
            if (skillManager.getCurrentLevel(Skill.HITPOINTS) > hitpoints) {
                return this;
            }
        }

        skillManager.setCurrentLevel(Skill.HITPOINTS, hitpoints);
        packetSender.sendSkill(Skill.HITPOINTS);
        if (getHitpoints() <= 0 && !isDying) {
            appendDeath();
            return this;
        }
    }

    @Override
    public heal(int amount): void {
        level: number = skillManager.getMaxLevel(Skill.HITPOINTS);
        if ((skillManager.getCurrentLevel(Skill.HITPOINTS) + amount) >= level) {
            setHitpoints(level);
        } else {
            setHitpoints(skillManager.getCurrentLevel(Skill.HITPOINTS) + amount);
        }
    }

    @Override
    public getBaseAttack(type: CombatType): number {
        if (type == CombatType.RANGED) {
            return skillManager.getCurrentLevel(Skill.RANGED);
        }
        else if (type == CombatType.MAGIC) {
            return skillManager.getCurrentLevel(Skill.MAGIC);
        }
        return skillManager.getCurrentLevel(Skill.ATTACK);
    }

    @Override
    public getBaseDefence(type: CombatType): number {
        if (type == CombatType.MAGIC) {
            return skillManager.getCurrentLevel(Skill.MAGIC);
        }
        return skillManager.getCurrentLevel(Skill.DEFENCE);
    }

    @Override
    public getBaseAttackSpeed(): number {

        // Gets attack speed for player's weapon
        // If player is using magic, attack speed is
        // Calculated in the MagicCombatMethod class.

        speed: number = getWeapon().getSpeed();

        if (getFightType().toString().toLowerCase().contains("rapid")) {
            speed--;
        }

        return speed;
    }

    @Override
    public isPlayer(): boolean {
        return true;
    }

    @Override
    public equals(Object o): boolean {
        if (!(o instanceof Player)) {
            return false;
        }
		Player p = (Player) o;
        return p.getUsername().equals(username);
    }

    @Override
    public size(): number {
        return 1;
    }

    public process(): void {
        // Timers
        getTimers().process();

		// Process incoming packets...
		PlayerSession session = getSession();
        if (session != null) {
            session.processPackets();
        }

        // Process walking queue..
        getMovementQueue().process();

        // Process combat
        getCombat().process();

        // Process aggression
        NpcAggression.process(this);

        // Process areas..
        AreaManager.process(this);

        // Process Bounty Hunter
        BountyHunter.process(this);

        // Updates inventory if an update
        // has been requested
        if (isUpdateInventory()) {
            getInventory().refreshItems();
            setUpdateInventory(false);
        }

        // Updates appearance if an update
        // has been requested
        // or if skull timer hits 0.
        if (isSkulled() && getAndDecrementSkullTimer() == 0) {
            getUpdateFlag().flag(Flag.APPEARANCE);
        }

        // Send queued chat messages
        if (!getChatMessageQueue().isEmpty()) {
            setCurrentChatMessage(getChatMessageQueue().poll());
            getUpdateFlag().flag(Flag.CHAT);
        } else {
            setCurrentChatMessage(null);
        }

        // Increase run energy
        if (runEnergy < 100 && (!getMovementQueue().isMoving() || !isRunning)) {
            if (lastRunRecovery.elapsed(MovementQueue.runEnergyRestoreDelay(this))) {
                runEnergy++;
                getPacketSender().sendRunEnergy();
                lastRunRecovery.reset();
            }
        }

        if (this instanceof PlayerBot) {
            ((PlayerBot) this).getMovementInteraction().process();
        }

        /**
         * Decrease boosted stats Increase lowered stats
         */
        if (getHitpoints() > 0) {
            if (increaseStats.finished() || decreaseStats
                .secondsElapsed() >= (PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60)) {
                for (Skill skill : Skill.values()) {
                    current: number = getSkillManager().getCurrentLevel(skill);
                    max: number = getSkillManager().getMaxLevel(skill);

                    // Should lowered stats be increased?
                    if (current < max) {
                        if (increaseStats.finished()) {
                            restoreRate: number = 1;

                            // Rapid restore effect - 2x restore rate for all stats except hp/prayer
                            // Rapid heal - 2x restore rate for hitpoints
                            if (skill != Skill.HITPOINTS && skill != Skill.PRAYER) {
                                if (PrayerHandler.isActivated(this, PrayerHandler.RAPID_RESTORE)) {
                                    restoreRate = 2;
                                }
                            } else if (skill == Skill.HITPOINTS) {
                                if (PrayerHandler.isActivated(this, PrayerHandler.RAPID_HEAL)) {
                                    restoreRate = 2;
                                }
                            }

                            getSkillManager().increaseCurrentLevel(skill, restoreRate, max);
                        }
                    } else if (current > max) {

                        // Should boosted stats be decreased?
                        if (decreaseStats
                            .secondsElapsed() >= (PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72
                                : 60)) {

                            // Never decrease Hitpoints / Prayer
                            if (skill != Skill.HITPOINTS && skill != Skill.PRAYER) {
                                getSkillManager().decreaseCurrentLevel(skill, 1, 1);
                            }

                        }
                    }
                }

                // Reset timers
                if (increaseStats.finished()) {
                    increaseStats.start(60);
                }
                if (decreaseStats
                    .secondsElapsed() >= (PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60)) {
                    decreaseStats.start((PrayerHandler.isActivated(this, PrayerHandler.PRESERVE) ? 72 : 60));
                }
            }
        }
    }

    // Construction
    /*
     * public boolean loadingHouse; public int portalSelected; public boolean
     * inBuildingMode; public int[] toConsCoords; public int buildFurnitureId,
     * buildFurnitureX, buildFurnitureY; public Room[][][] houseRooms = new
     * Room[5][13][13]; public ArrayList<PlayerFurniture> playerFurniture = new
     * ArrayList<PlayerFurniture>(); public ArrayList<Portal> portals = new
     * ArrayList<>();
     */

    /**
     * Can the player logout?
     *
     * @return Yes if they can logout, false otherwise.
     */
    public canLogout(): boolean {
        if (CombatFactory.isBeingAttacked(this)) {
            getPacketSender().sendMessage("You must wait a few seconds after being out of combat before doing this.");
            return false;
        }
        if (busy()) {
            getPacketSender().sendMessage("You cannot log out at the moment.");
            return false;
        }
        return true;
    }

    /**
     * Requests a logout by sending the logout packet to the client. This leads to
     * the connection being closed. The {@link ChannelEventHandler} will then add
     * the player to the remove characters queue.
     */
    public requestLogout(): void {
        getPacketSender().sendLogout();
    }

    /**
     * Handles the actual logging out from the game.
     */
    public onLogout(): void {
        // Notify us
        console.log(
            "[World] Deregistering player - [username, host] : [" + getUsername() + ", " + getHostAddress() + "]");

        getPacketSender().sendInterfaceRemoval();

        // Leave area
        if (getArea() != null) {
            getArea().leave(this, true);
        }

        // Do stuff...
        Barrows.brotherDespawn(this);
        PetHandler.pickup(this, getCurrentPet());
        getRelations().updateLists(false);
        BountyHunter.unassign(this);
        ClanChatManager.leave(this, false);
        TaskManager.cancelTasks(this);
        PLAYER_PERSISTENCE.save(this);

        if (getSession() != null && getSession().getChannel().isOpen()) {
            getSession().getChannel().close();
        }
    }

    /**
     * Called by the world's login queue!
     */
    public onLogin(): void {
        // Attempt to register the player..
        console.log(
            "[World] Registering player - [username, host] : [" + getUsername() + ", " + getHostAddress() + "]");

        setNeedsPlacement(true);
        getPacketSender().sendMapRegion().sendDetails(); // Map region, player index and player rights
        getPacketSender().sendTabs(); // Client sideicons
        getPacketSender().sendMessage("Welcome to @red@" + GameConstants.NAME + ".");
        if (this.isDiscordLogin()) {
            getPacketSender().sendMessage(":discordtoken:" + this.getCachedDiscordAccessToken());
        }

        totalExp: number = 0;
        for (Skill skill : Skill.values()) {
            getSkillManager().updateSkill(skill);
            totalExp += getSkillManager().getExperience(skill);
        }
        getPacketSender().sendTotalExp(totalExp);

        // Send friends and ignored players lists...
        getRelations().setPrivateMessageId(1).onLogin(this).updateLists(true);

        // Reset prayer configs...
        PrayerHandler.resetAll(this);
        getPacketSender().sendConfig(709, PrayerHandler.canUse(this, PrayerData.PRESERVE, false) ? 1 : 0);
        getPacketSender().sendConfig(711, PrayerHandler.canUse(this, PrayerData.RIGOUR, false) ? 1 : 0);
        getPacketSender().sendConfig(713, PrayerHandler.canUse(this, PrayerData.AUGURY, false) ? 1 : 0);

        // Refresh item containers..
        getInventory().refreshItems();
        getEquipment().refreshItems();

        // Interaction options on right click...
        getPacketSender().sendInteractionOption("Follow", 3, false);
        getPacketSender().sendInteractionOption("Trade With", 4, false);

        // Sending run energy attributes...
        getPacketSender().sendRunStatus();
        getPacketSender().sendRunEnergy();

        // Sending player's rights..
        getPacketSender().sendRights();

        // Close all interfaces, just in case...
        getPacketSender().sendInterfaceRemoval();

        // Update weapon data and interfaces..
        WeaponInterfaces.assign(this);
        // Update weapon interface configs
        getPacketSender().sendConfig(getFightType().getParentId(), getFightType().getChildId())
            .sendConfig(172, autoRetaliate() ? 1 : 0).updateSpecialAttackOrb();

        // Reset autocasting
        Autocasting.setAutocast(this, null);

        // Send pvp stats..
        getPacketSender().sendString(52029, "@or1@Killstreak: " + getKillstreak())
            .sendString(52030, "@or1@Kills: " + getTotalKills()).sendString(52031, "@or1@Deaths: " + getDeaths())
            .sendString(52033, "@or1@K/D Ratio: " + getKillDeathRatio())
            .sendString(52034, "@or1@Donated: " + getAmountDonated());

        // Join clanchat
        ClanChatManager.onLogin(this);

        // Handle timers and run tasks
        if (isPoisoned()) {
            getPacketSender().sendPoisonType(1);
            TaskManager.submit(new CombatPoisonEffect(this));
        }
        if (getSpecialPercentage() < 100) {
            TaskManager.submit(new RestoreSpecialAttackTask(this));
        }

        if (!getVengeanceTimer().finished()) {
            getPacketSender().sendEffectTimer(getVengeanceTimer().secondsRemaining(), EffectTimer.VENGEANCE);
        }
        if (!getCombat().getFireImmunityTimer().finished()) {
            getPacketSender().sendEffectTimer(getCombat().getFireImmunityTimer().secondsRemaining(),
                EffectTimer.ANTIFIRE);
        }
        if (!getCombat().getTeleBlockTimer().finished()) {
            getPacketSender().sendEffectTimer(getCombat().getTeleBlockTimer().secondsRemaining(),
                EffectTimer.TELE_BLOCK);
        }

        decreaseStats.start(60);
        increaseStats.start(60);

        getUpdateFlag().flag(Flag.APPEARANCE);

        if (this.newPlayer) {
			int presetIndex = Misc.randomInclusive(0, Presetables.GLOBAL_PRESETS.length - 1);
            Presetables.load(this, Presetables.GLOBAL_PRESETS[presetIndex]);
        }

        if (!(this instanceof PlayerBot)) {
            // Spawn player bots when a real player logs in
            for (PlayerBotDefinition definition : GameConstants.PLAYER_BOTS) {
                if (World.getPlayerBots().containsKey(definition.getUsername())) {
                    continue;
                }

				PlayerBot playerBot = new PlayerBot(definition);

                World.getPlayerBots().put(definition.getUsername(), playerBot);
            }

            console.log(GameConstants.PLAYER_BOTS.length + " player bots now online.");
        }
    }

    /**
 * Called by the world's login queue!
 */
    public void onLogin() {
        // Attempt to register the player..
        System.out.println(
            "[World] Registering player - [username, host] : [" + getUsername() + ", " + getHostAddress() + "]");

        setNeedsPlacement(true);
        getPacketSender().sendMapRegion().sendDetails(); // Map region, player index and player rights
        getPacketSender().sendTabs(); // Client sideicons
        getPacketSender().sendMessage("Welcome to @red@" + GameConstants.NAME + ".");
        if (this.isDiscordLogin()) {
            getPacketSender().sendMessage(":discordtoken:" + this.getCachedDiscordAccessToken());
        }

		long totalExp = 0;
        for (Skill skill : Skill.values()) {
            getSkillManager().updateSkill(skill);
            totalExp += getSkillManager().getExperience(skill);
        }
        getPacketSender().sendTotalExp(totalExp);

        // Send friends and ignored players lists...
        getRelations().setPrivateMessageId(1).onLogin(this).updateLists(true);

        // Reset prayer configs...
        PrayerHandler.resetAll(this);
        getPacketSender().sendConfig(709, PrayerHandler.canUse(this, PrayerData.PRESERVE, false) ? 1 : 0);
        getPacketSender().sendConfig(711, PrayerHandler.canUse(this, PrayerData.RIGOUR, false) ? 1 : 0);
        getPacketSender().sendConfig(713, PrayerHandler.canUse(this, PrayerData.AUGURY, false) ? 1 : 0);

        // Refresh item containers..
        getInventory().refreshItems();
        getEquipment().refreshItems();

        // Interaction options on right click...
        getPacketSender().sendInteractionOption("Follow", 3, false);
        getPacketSender().sendInteractionOption("Trade With", 4, false);

        // Sending run energy attributes...
        getPacketSender().sendRunStatus();
        getPacketSender().sendRunEnergy();

        // Sending player's rights..
        getPacketSender().sendRights();

        // Close all interfaces, just in case...
        getPacketSender().sendInterfaceRemoval();

        // Update weapon data and interfaces..
        WeaponInterfaces.assign(this);
        // Update weapon interface configs
        getPacketSender().sendConfig(getFightType().getParentId(), getFightType().getChildId())
            .sendConfig(172, autoRetaliate() ? 1 : 0).updateSpecialAttackOrb();

        // Reset autocasting
        Autocasting.setAutocast(this, null);

        // Send pvp stats..
        getPacketSender().sendString(52029, "@or1@Killstreak: " + getKillstreak())
            .sendString(52030, "@or1@Kills: " + getTotalKills()).sendString(52031, "@or1@Deaths: " + getDeaths())
            .sendString(52033, "@or1@K/D Ratio: " + getKillDeathRatio())
            .sendString(52034, "@or1@Donated: " + getAmountDonated());

        // Join clanchat
        ClanChatManager.onLogin(this);

        // Handle timers and run tasks
        if (isPoisoned()) {
            getPacketSender().sendPoisonType(1);
            TaskManager.submit(new CombatPoisonEffect(this));
        }
        if (getSpecialPercentage() < 100) {
            TaskManager.submit(new RestoreSpecialAttackTask(this));
        }

        if (!getVengeanceTimer().finished()) {
            getPacketSender().sendEffectTimer(getVengeanceTimer().secondsRemaining(), EffectTimer.VENGEANCE);
        }
        if (!getCombat().getFireImmunityTimer().finished()) {
            getPacketSender().sendEffectTimer(getCombat().getFireImmunityTimer().secondsRemaining(),
                EffectTimer.ANTIFIRE);
        }
        if (!getCombat().getTeleBlockTimer().finished()) {
            getPacketSender().sendEffectTimer(getCombat().getTeleBlockTimer().secondsRemaining(),
                EffectTimer.TELE_BLOCK);
        }

        decreaseStats.start(60);
        increaseStats.start(60);

        getUpdateFlag().flag(Flag.APPEARANCE);

        if (this.newPlayer) {
			int presetIndex = Misc.randomInclusive(0, Presetables.GLOBAL_PRESETS.length - 1);
            Presetables.load(this, Presetables.GLOBAL_PRESETS[presetIndex]);
        }

        if (!(this instanceof PlayerBot)) {
            // Spawn player bots when a real player logs in
            for (PlayerBotDefinition definition : GameConstants.PLAYER_BOTS) {
                if (World.getPlayerBots().containsKey(definition.getUsername())) {
                    continue;
                }

				PlayerBot playerBot = new PlayerBot(definition);

                World.getPlayerBots().put(definition.getUsername(), playerBot);
            }

            System.out.println(GameConstants.PLAYER_BOTS.length + " player bots now online.");
        }
    }

    /**
     * Resets the player's attributes to default.
     */
    public resetAttributes(): void {
        performAnimation(new Animation(65535));
        setSpecialActivated(false);
        CombatSpecial.updateBar(this);
        setHasVengeance(false);
        getCombat().getFireImmunityTimer().stop();
        getCombat().getPoisonImmunityTimer().stop();
        getCombat().getTeleBlockTimer().stop();
        getTimers().cancel(TimerKey.FREEZE);
        getCombat().getPrayerBlockTimer().stop();
        setPoisonDamage(0);
        setWildernessLevel(0);
        setRecoilDamage(0);
        setSkullTimer(0);
        setSkullType(SkullType.WHITE_SKULL);
        WeaponInterfaces.assign(this);
        BonusManager.update(this);
        PrayerHandler.deactivatePrayers(this);
        getEquipment().refreshItems();
        getInventory().refreshItems();
        for (Skill skill : Skill.values())
        getSkillManager().setCurrentLevel(skill, getSkillManager().getMaxLevel(skill));
        setRunEnergy(100);
        getPacketSender().sendRunEnergy();
        getMovementQueue().setBlockMovement(false).reset();
        getPacketSender().sendEffectTimer(0, EffectTimer.ANTIFIRE).sendEffectTimer(0, EffectTimer.FREEZE)
            .sendEffectTimer(0, EffectTimer.VENGEANCE).sendEffectTimer(0, EffectTimer.TELE_BLOCK);
        getPacketSender().sendPoisonType(0);
        getPacketSender().sendSpecialAttackState(false);
        setUntargetable(false);
        isDying = false;

        getUpdateFlag().flag(Flag.APPEARANCE);
    }

    /**
     * Checks if a player is busy.
     *
     * @return
     */
    public busy(): boolean {
        if (interfaceId > 0) {
            return true;
        }
        if (getHitpoints() <= 0) {
            return true;
        }
        if (isNeedsPlacement() || isTeleporting()) {
            return true;
        }
        if (status != PlayerStatus.NONE) {
            return true;
        }
        if (forceMovement != null) {
            return true;
        }
        return false;
    }

    public isStaff(): boolean {
        return (rights != PlayerRights.NONE);
    }

    public isDonator(): boolean {
        return (donatorRights != DonatorRights.NONE);
    }

    public isPacketsBlocked(): boolean {
        return packetsBlocked;
    }

    public setPacketsBlocked(blocked: boolean): void {
        this.packetsBlocked = blocked;
    }

    /*
     * Getters/Setters
     */

    public Timestamp getCreationDate() {
        return creationDate;
    }

    public setCreationDate(timestamp: Timestamp): void {
        creationDate = timestamp;
    }

    public PlayerSession getSession() {
        return session;
    }

    public getUsername(): string {
        return username;
    }

    public Player setUsername(username: string) {
        this.username = username;
        return this;
    }

    public getLongUsername(): number {
        return longUsername;
    }

    public Player setLongUsername(longUsername: number) {
        this.longUsername = longUsername;
        return this;
    }

    public getPasswordHashWithSalt(): string {
        return passwordHashWithSalt;
    }

    public Player setPasswordHashWithSalt(passwordHashWithSalt: string) {
        this.passwordHashWithSalt = passwordHashWithSalt;
        return this;
    }

    public getHostAddress(): string {
        return hostAddress;
    }

    public Player setHostAddress(hostAddress: string) {
        this.hostAddress = hostAddress;
        return this;
    }

    public PlayerRights getRights() {
        return rights;
    }

    public Player setRights(rights: PlayerRights) {
        this.rights = rights;
        return this;
    }

    public PacketSender getPacketSender() {
        return packetSender;
    }

    public SkillManager getSkillManager() {
        return skillManager;
    }

    public Appearance getAppearance() {
        return appearance;
    }

    public SecondsTimer getForcedLogoutTimer() {
        return forcedLogoutTimer;
    }

    public isDying(): boolean {
        return isDying;
    }

    public List<Player> getLocalPlayers() {
        return localPlayers;
    }

    public List<NPC> getLocalNpcs() {
        return localNpcs;
    }

    public getInterfaceId(): number {
        return interfaceId;
    }

    public Player setInterfaceId(interfaceId: number) {
        this.interfaceId = interfaceId;
        return this;
    }

    public experienceLocked(): boolean {
        return experienceLocked;
    }

    public setExperienceLocked(experienceLocked: boolean): void {
        this.experienceLocked = experienceLocked;
    }

    public PlayerRelations getRelations() {
        return relations;
    }

    public isAllowRegionChangePacket(): boolean {
        return allowRegionChangePacket;
    }

    public setAllowRegionChangePacket(allowRegionChangePacket: boolean): void {
        this.allowRegionChangePacket = allowRegionChangePacket;
    }

    public getWalkableInterfaceId(): number {
        return walkableInterfaceId;
    }

    public setWalkableInterfaceId(interfaceId2: number): void {
        this.walkableInterfaceId = interfaceId2;
    }

    public isRunning(): boolean {
        return isRunning;
    }

    public Player setRunning(isRunning: boolean) {
        this.isRunning = isRunning;
        return this;
    }

    public PlayerInteractingOption getPlayerInteractingOption() {
        return playerInteractingOption;
    }

    public Player setPlayerInteractingOption(playerInteractingOption: PlayerInteractingOption) {
        this.playerInteractingOption = playerInteractingOption;
        return this;
    }

    public FrameUpdater getFrameUpdater() {
        return frameUpdater;
    }


    public BonusManager getBonusManager() {
        return bonusManager;
    }

    public getMultiIcon(): number {
        return multiIcon;
    }

    public Player setMultiIcon(multiIcon: number) {
        this.multiIcon = multiIcon;
        return this;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public ForceMovement getForceMovement() {
        return forceMovement;
    }

    public Player setForceMovement(forceMovement: ForceMovement) {
        this.forceMovement = forceMovement;
        if (this.forceMovement != null) {
            getUpdateFlag().flag(Flag.FORCED_MOVEMENT);
        }
        return this;
    }

    public getSkillAnimation(): number {
        return skillAnimation;
    }

    public Player setSkillAnimation(animation: number) {
        this.skillAnimation = animation;
        return this;
    }

    public getRunEnergy(): number {
        return runEnergy;
    }

    public setRunEnergy(runEnergy: number): void {
        this.runEnergy = runEnergy;
    }

    public isDrainingPrayer(): boolean {
        return drainingPrayer;
    }

    public setDrainingPrayer(drainingPrayer: boolean): void {
        this.drainingPrayer = drainingPrayer;
    }

    public getPrayerPointDrain(): number {
        return prayerPointDrain;
    }

    public setPrayerPointDrain(prayerPointDrain: number): void {
        this.prayerPointDrain = prayerPointDrain;
    }

    public Stopwatch getLastItemPickup() {
        return lastItemPickup;
    }

    public CombatSpecial getCombatSpecial() {
        return combatSpecial;
    }

    public setCombatSpecial(combatSpecial: CombatSpecial): void {
        this.combatSpecial = combatSpecial;
    }

    public getRecoilDamage(): number {
        return recoilDamage;
    }

    public setRecoilDamage(recoilDamage: number): void {
        this.recoilDamage = recoilDamage;
    }

    public MagicSpellbook getSpellbook() {
        return spellbook;
    }

    public setSpellbook(spellbook: MagicSpellbook): void {
        this.spellbook = spellbook;
    }

    public SecondsTimer getVengeanceTimer() {
        return vengeanceTimer;
    }

    public getWildernessLevel(): number {
        return wildernessLevel;
    }

    public setWildernessLevel(wildernessLevel: int): void {
        this.wildernessLevel = wildernessLevel;
    }

    public isSpawnedBarrows(): boolean {
        return spawnedBarrows;
    }

    public setSpawnedBarrows(spawnedBarrows: boolean): void {
        this.spawnedBarrows = spawnedBarrows;
    }

    public getDestroyItem(): number {
        return destroyItem;
    }

    public setDestroyItem(destroyItem: int): void {
        this.destroyItem = destroyItem;
    }

    public isSkulled(): boolean {
        return skullTimer > 0;
    }

    public getAndDecrementSkullTimer(): number {
        return this.skullTimer--;
    }

    public getSkullTimer(): number {
        return this.skullTimer;
    }

    public setSkullTimer(skullTimer: int): void {
        this.skullTimer = skullTimer;
    }

    public getPoints(): number {
        return points;
    }

    public setPoints(points: int): void {
        this.points = points;
    }

    public incrementPoints(points: int): void {
        this.points += points;
    }

    public isUpdateInventory(): boolean {
        return updateInventory;
    }

    public setUpdateInventory(updateInventory: boolean): void {
        this.updateInventory = updateInventory;
    }

    public Stopwatch getClickDelay() {
        return clickDelay;
    }

    public Shop getShop() {
        return shop;
    }

    public Player setShop(shop: Shop) {
        this.shop = shop;
        return this;
    }

    public PlayerStatus getStatus() {
        return status;
    }

    public Player setStatus(status: PlayerStatus) {
        this.status = status;
        return this;
    }

    public getCurrentBankTab(): number {
        return currentBankTab;
    }

    public Player setCurrentBankTab(tab: number) {
        this.currentBankTab = tab;
        return this;
    }

    public setNoteWithdrawal(noteWithdrawal: boolean): void {
        this.noteWithdrawal = noteWithdrawal;
    }

    public withdrawAsNote(): boolean {
        return noteWithdrawal;
    }

    public setInsertMode(insertMode: boolean): void {
        this.insertMode = insertMode;
    }

    public insertMode(): boolean {
        return insertMode;
    }

    public Bank[] getBanks(): Bank[] {
        return banks;
    }

    public Bank getBank(index: int) {
        if (banks[index] == null) {
            banks[index] = new Bank(this);
        }
        return banks[index];
    }

    public Player setBank(index: int, bank: Bank) {
        this.banks[index] = bank;
        return this;
    }

    public isNewPlayer(): boolean {
        return newPlayer;
    }

    public setNewPlayer(newPlayer: boolean): void {
        this.newPlayer = newPlayer;
    }

    public isSearchingBank(): boolean {
        return searchingBank;
    }

    public setSearchingBank(searchingBank: boolean): void {
        this.searchingBank = searchingBank;
    }

    public getSearchSyntax(): string {
        return searchSyntax;
    }

    public setSearchSyntax(searchSyntax: string): void {
        this.searchSyntax = searchSyntax;
    }

    public isPreserveUnlocked(): boolean {
        return preserveUnlocked;
    }

    public setPreserveUnlocked(preserveUnlocked: boolean): void {
        this.preserveUnlocked = preserveUnlocked;
    }

    public isRigourUnlocked(): boolean {
        return rigourUnlocked;
    }

    public setRigourUnlocked(rigourUnlocked: boolean): void {
        this.rigourUnlocked = rigourUnlocked;
    }

    public isAuguryUnlocked(): boolean {
        return auguryUnlocked;
    }

    public setAuguryUnlocked(auguryUnlocked: boolean): void {
        this.auguryUnlocked = auguryUnlocked;
    }

    public PriceChecker getPriceChecker() {
        return priceChecker;
    }

    public ClanChat getCurrentClanChat() {
        return currentClanChat;
    }

    public setCurrentClanChat(currentClanChat: ClanChat): void {
        this.currentClanChat = currentClanChat;
    }

    public getClanChatName(): string {
        return clanChatName;
    }

    public setClanChatName(clanChatName: string): void {
        this.clanChatName = clanChatName;
    }

    public Trading getTrading() {
        return trading;
    }

    public QuickPrayers getQuickPrayers() {
        return quickPrayers;
    }

    public isTargetTeleportUnlocked(): boolean {
        return targetTeleportUnlocked;
    }

    public setTargetTeleportUnlocked(targetTeleportUnlocked: boolean): void {
        this.targetTeleportUnlocked = targetTeleportUnlocked;
    }

    public SecondsTimer getYellDelay() {
        return yellDelay;
    }

    public getAmountDonated(): number {
        return amountDonated;
    }

    public setAmountDonated(amountDonated: number): void {
        this.amountDonated = amountDonated;
    }

    public incrementAmountDonated(amountDonated: number): void {
        this.amountDonated += amountDonated;
    }

    public incrementTargetKills(): void {
        targetKills++;
    }

    public getTargetKills(): number {
        return targetKills;
    }

    public setTargetKills(targetKills: number): void {
        this.targetKills = targetKills;
    }

    public incrementKills(): void {
        normalKills++;
    }

    public getNormalKills(): number {
        return normalKills;
    }

    public setNormalKills(normalKills: number): void {
        this.normalKills = normalKills;
    }

    public getTotalKills(): number {
        return totalKills;
    }

    public setTotalKills(totalKills: number): void {
        this.totalKills = totalKills;
    }

    public incrementTotalKills(): void {
        this.totalKills++;
    }

    public incrementDeaths(): void {
        deaths++;
    }

    public getDeaths(): number {
        return deaths;
    }

    public setDeaths(deaths: number): void {
        this.deaths = deaths;
    }

    public resetSafingTimer(): void {
        this.setSafeTimer(180);
    }

    public getHighestKillstreak(): number {
        return highestKillstreak;
    }

    public setHighestKillstreak(highestKillstreak: number): void {
        this.highestKillstreak = highestKillstreak;
    }

    public getKillstreak(): number {
        return killstreak;
    }

    public setKillstreak(killstreak: number): void {
        this.killstreak = killstreak;
    }

    public incrementKillstreak(): void {
        this.killstreak++;
    }

    public getKillDeathRatio(): string {
        kc: number = 0;
        if (deaths == 0) {
            kc = totalKills / 1;
        } else {
            kc = ((double) totalKills / deaths);
        }
        return Misc.FORMATTER.format(kc);
    }

    public List<String> getRecentKills() {
        return recentKills;
    }

    public getSafeTimer(): number {
        return safeTimer;
    }

    public setSafeTimer(safeTimer: number): void {
        this.safeTimer = safeTimer;
    }

    public decrementAndGetSafeTimer(): number {
        return this.safeTimer--;
    }

    public SecondsTimer getTargetSearchTimer() {
        return targetSearchTimer;
    }

    public SecondsTimer getSpecialAttackRestore() {
        return specialAttackRestore;
    }

    public SkullType getSkullType() {
        return skullType;
    }

    public setSkullType(skullType: SkullType): void {
        this.skullType = skullType;
    }

    public Dueling getDueling() {
        return dueling;
    }

    public getBlowpipeScales(): number {
        return blowpipeScales;
    }

    public setBlowpipeScales(blowpipeScales: number): void {
        this.blowpipeScales = blowpipeScales;
    }

    public incrementBlowpipeScales(blowpipeScales: number): void {
        this.blowpipeScales += blowpipeScales;
    }

    public decrementAndGetBlowpipeScales(): number {
        return this.blowpipeScales--;
    }

    public NPC getCurrentPet() {
        return currentPet;
    }

    public setCurrentPet(currentPet: NPC): void {
        this.currentPet = currentPet;
    }

    public SecondsTimer getAggressionTolerance() {
        return aggressionTolerance;
    }

    public ByteBuf getCachedUpdateBlock() {
        return cachedUpdateBlock;
    }

    public setCachedUpdateBlock(cachedUpdateBlock: ByteBuf): void {
        this.cachedUpdateBlock = cachedUpdateBlock;
    }

    public getRegionHeight(): number {
        return regionHeight;
    }

    public setRegionHeight(regionHeight: number): void {
        this.regionHeight = regionHeight;
    }

    public Optional<Skillable> getSkill() {
        return skill;
    }

    public setSkill(skill: Optional<Skillable>): void {
        this.skill = skill;
    }

    public CreationMenu getCreationMenu() {
        return creationMenu;
    }

    public setCreationMenu(creationMenu: CreationMenu): void {
        this.creationMenu = creationMenu;
    }

    public PouchContainer[] getPouches() {
        return pouches;
    }

    public setPouches(pouches: PouchContainer[]): void {
        this.pouches = pouches;
    }

    public getLoyaltyTitle(): string {
        return loyaltyTitle;
    }

    public setLoyaltyTitle(loyaltyTitle: string): void {
        this.loyaltyTitle = loyaltyTitle;
        this.getUpdateFlag().flag(Flag.APPEARANCE);
    }

    public hasInfiniteHealth(): boolean {
        return infiniteHealth;
    }

    public setInfiniteHealth(infiniteHealth: boolean): void {
        this.infiniteHealth = infiniteHealth;
    }

    public DonatorRights getDonatorRights() {
        return donatorRights;
    }

    public setDonatorRights(donatorPrivilege: DonatorRights): void {
        this.donatorRights = donatorPrivilege;
    }

    public NPC getCurrentBrother() {
        return currentBrother;
    }

    public setCurrentBrother(brother: NPC): void {
        this.currentBrother = brother;
    }

    public getBarrowsCrypt(): number {
        return barrowsCrypt;
    }

    public setBarrowsCrypt(crypt: number): void {
        this.barrowsCrypt = crypt;
    }

    public getKilledBrothers(): boolean[] {
        return killedBrothers;
    }

    public setKilledBrothers(killedBrothers: boolean[]): void {
        this.killedBrothers = killedBrothers;
    }

    public setKilledBrother(index: number, state: boolean): void {
        this.killedBrothers[index] = state;
    }

    public getBarrowsChestsLooted(): number {
        return barrowsChestsLooted;
    }

    public setBarrowsChestsLooted(chestsLooted: number): void {
        this.barrowsChestsLooted = chestsLooted;
    }

    public isPlaceholders(): boolean {
        return placeholders;
    }

    public setPlaceholders(placeholders: boolean): void {
        this.placeholders = placeholders;
    }

    public getPresets(): Presetable[] {
        return presets;
    }

    public setPresets(sets: Presetable[]): void {
        this.presets = sets;
    }

    public isOpenPresetsOnDeath(): boolean {
        return openPresetsOnDeath;
    }

    public setOpenPresetsOnDeath(openPresetsOnDeath: boolean): void {
        this.openPresetsOnDeath = openPresetsOnDeath;
    }

    public Presetable getCurrentPreset() {
        return currentPreset;
    }

    public setCurrentPreset(currentPreset: Presetable): void {
        this.currentPreset = currentPreset;
    }

    public Queue<ChatMessage> getChatMessageQueue() {
        return chatMessageQueue;
    }

    public ChatMessage getCurrentChatMessage() {
        return currentChatMessage;
    }

    public setCurrentChatMessage(currentChatMessage: ChatMessage): void {
        this.currentChatMessage = currentChatMessage;
    }

    public Map<TeleportButton, Location> getPreviousTeleports() {
        return previousTeleports;
    }

    public isTeleportInterfaceOpen(): boolean {
        return teleportInterfaceOpen;
    }

    public setTeleportInterfaceOpen(teleportInterfaceOpen: boolean): void {
        this.teleportInterfaceOpen = teleportInterfaceOpen;
    }

    @Override
    public PendingHit manipulateHit(hit: PendingHit) {
		Mobile attacker = hit.getAttacker();

        if (attacker.isNpc()) {
			NPC npc = attacker.getAsNpc();
            if (npc.getId() == NpcIdentifiers.TZTOK_JAD) {
                if (PrayerHandler.isActivated(this, PrayerHandler.getProtectingPrayer(hit.getCombatType()))) {
                    hit.setTotalDamage(0);
                }
            }
        }

        return hit;
    }

    public Location getOldPosition() {
        return oldPosition;
    }

    public setOldPosition(oldPosition: Location): void {
        this.oldPosition = oldPosition;
    }

    public getGodwarsKillcount(): number[] {
        return godwarsKillcount;
    }

    public setGodwarsKillcount(godwarsKillcount: number[]): void {
        this.godwarsKillcount = godwarsKillcount;
    }

    public setGodwarsKillcount(index: number, value: number): void {
        this.godwarsKillcount[index] = value;
    }

    public EnteredAmountAction getEnteredAmountAction() {
        return enteredAmountAction;
    }

    public setEnteredAmountAction(enteredAmountAction: EnteredAmountAction): void {
        this.enteredAmountAction = enteredAmountAction;
    }

    public EnteredSyntaxAction getEnteredSyntaxAction() {
        return enteredSyntaxAction;
    }

    public setEnteredSyntaxAction(enteredSyntaxAction: EnteredSyntaxAction): void {
        this.enteredSyntaxAction = enteredSyntaxAction;
    }

    public ActiveSlayerTask getSlayerTask() {
        return slayerTask;
    }

    public setSlayerTask(slayerTask: ActiveSlayerTask): void {
        this.slayerTask = slayerTask;
    }

    public getConsecutiveTasks(): number {
        return consecutiveTasks;
    }

    public setConsecutiveTasks(consecutiveTasks: number): void {
        this.consecutiveTasks = consecutiveTasks;
    }

    public getSlayerPoints(): number {
        return slayerPoints;
    }

    public setSlayerPoints(slayerPoints: number): void {
        this.slayerPoints = slayerPoints;
    }

    public DialogueManager getDialogueManager() {
        return dialogueManager;
    }

    public WeaponInterface getWeapon() {
        return weapon;
    }

    public setWeapon(weapon: WeaponInterface): void {
        this.weapon = weapon;
    }

    public FightType getFightType() {
        return fightType;
    }

    public setFightType(fightType: FightType): void {
        this.fightType = fightType;
    }

    public autoRetaliate(): boolean {
        return autoRetaliate;
    }

    public setAutoRetaliate(autoRetaliate: boolean): void {
        this.autoRetaliate = autoRetaliate;
    }

    public isDiscordLogin(): boolean {
        return isDiscordLogin;
    }

    public setDiscordLogin(discordLogin: boolean): void {
        isDiscordLogin = discordLogin;
    }

    public getCachedDiscordAccessToken(): string {
        return cachedDiscordAccessToken;
    }

    public setCachedDiscordAccessToken(cachedDiscordAccessToken: string): void {
        this.cachedDiscordAccessToken = cachedDiscordAccessToken;
    }

    public Map<Integer, Integer> getQuestProgress() {
        return this.questProgress;
    }

    public getQuestPoints(): number {
        return this.questPoints;
    }

    public setQuestPoints(questPoints: number): void {
        this.questPoints = questPoints;
    }

    public setQuestProgress(Map: <Integer>, questProgress: <Integer> ): void {
        if (questProgress == null) {
            return;
        }
        this.questProgress = questProgress;
    }
}