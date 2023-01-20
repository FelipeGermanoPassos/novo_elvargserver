class PacketConstants {
    const PACKETS: PacketExecutor[] = new Array(257);
    const TELEPORT_OPCODE = 183;
    const SPECIAL_ATTACK_OPCODE = 184;
    const BUTTON_CLICK_OPCODE = 185;
    const INTERFACE_ACTION_CLICK_OPCODE = 186;
    const SPAWN_TAB_ACTION_OPCODE = 187;
    const REGULAR_CHAT_OPCODE = 4;
    const CLAN_CHAT_OPCODE = 104;
    const DROP_ITEM_OPCODE = 87;
    const FINALIZED_MAP_REGION_OPCODE = 121;
    const CHANGE_MAP_REGION_OPCODE = 210;
    const CLOSE_INTERFACE_OPCODE = 130;
    const EXAMINE_ITEM_OPCODE = 2;
    const EXAMINE_NPC_OPCODE = 6;
    const CHANGE_APPEARANCE = 11;
    const DIALOGUE_OPCODE = 40;
    const ENTER_AMOUNT_OPCODE = 208, ENTER_SYNTAX_OPCODE = 60;
    const EQUIP_ITEM_OPCODE = 41;
    const PLAYER_INACTIVE_OPCODE = 202;
    const CHAT_SETTINGS_OPCODE = 95;
    const COMMAND_OPCODE = 103;
    const COMMAND_MOVEMENT_OPCODE = 98;
    const GAME_MOVEMENT_OPCODE = 164;
    const MINIMAP_MOVEMENT_OPCODE = 248;
    const PICKUP_ITEM_OPCODE = 236;
    const SECOND_GROUNDITEM_OPTION_OPCODE = 235;
	const FIRST_ITEM_CONTAINER_ACTION_OPCODE = 145;
	const SECOND_ITEM_CONTAINER_ACTION_OPCODE = 117;
	const THIRD_ITEM_CONTAINER_ACTION_OPCODE = 43;
	const FOURTH_ITEM_CONTAINER_ACTION_OPCODE = 129;
	const FIFTH_ITEM_CONTAINER_ACTION_OPCODE = 135;
	const SIXTH_ITEM_CONTAINER_ACTION_OPCODE = 138;
	const ADD_FRIEND_OPCODE = 188;
	const REMOVE_FRIEND_OPCODE = 215;
	const ADD_IGNORE_OPCODE = 133;
	const REMOVE_IGNORE_OPCODE = 74;
	const SEND_PM_OPCODE = 126;
	const ATTACK_PLAYER_OPCODE = 153;
	const PLAYER_OPTION_1_OPCODE = 128;
	const PLAYER_OPTION_2_OPCODE = 37;
	const PLAYER_OPTION_3_OPCODE = 227;
	const SWITCH_ITEM_SLOT_OPCODE = 214;
	const FOLLOW_PLAYER_OPCODE = 73;
	const MAGIC_ON_PLAYER_OPCODE = 249;
	const MAGIC_ON_ITEM_OPCODE = 237;
	const MAGIC_ON_GROUND_ITEM_OPCODE = 181;
	const BANK_TAB_CREATION_OPCODE = 216;
	const TRADE_REQUEST_OPCODE = 139;
	const DUEL_REQUEST_OPCODE = 128;
	const CREATION_MENU_OPCODE = 166;
	const SEND_GRAND_EXCHANGE_UPDATE = 200;
    const OBJECT_FIRST_CLICK_OPCODE = 132, OBJECT_SECOND_CLICK_OPCODE = 252,
			OBJECT_THIRD_CLICK_OPCODE = 70, OBJECT_FOURTH_CLICK_OPCODE = 234, OBJECT_FIFTH_CLICK_OPCODE = 228;
	const ATTACK_NPC_OPCODE = 72, FIRST_CLICK_NPC_OPCODE = 155, MAGE_NPC_OPCODE = 131,
			SECOND_CLICK_NPC_OPCODE = 17, THIRD_CLICK_NPC_OPCODE = 21, FOURTH_CLICK_NPC_OPCODE = 18;
	const FIRST_ITEM_ACTION_OPCODE = 122, SECOND_ITEM_ACTION_OPCODE = 75,
			THIRD_ITEM_ACTION_OPCODE = 16;
	const ITEM_ON_NPC = 57, ITEM_ON_ITEM = 53, ITEM_ON_OBJECT = 192, ITEM_ON_GROUND_ITEM = 25,
			ITEM_ON_PLAYER = 14;

            const PACKETS: { [key: number]: any } = {};
            PACKETS[TELEPORT_OPCODE] = new TeleportPacketListener();
            PACKETS[SPECIAL_ATTACK_OPCODE] = new SpecialAttackPacketListener();
            PACKETS[BUTTON_CLICK_OPCODE] = new ButtonClickPacketListener();
            PACKETS[INTERFACE_ACTION_CLICK_OPCODE] = new InterfaceActionClickOpcode();
            PACKETS[REGULAR_CHAT_OPCODE] = new ChatPacketListener();
            PACKETS[CLAN_CHAT_OPCODE] = new ChatPacketListener();
            PACKETS[DROP_ITEM_OPCODE] = new DropItemPacketListener();
		PACKETS[FINALIZED_MAP_REGION_OPCODE] = new FinalizedMapRegionChangePacketListener();
		PACKETS[CHANGE_MAP_REGION_OPCODE] = new RegionChangePacketListener();
		PACKETS[CLOSE_INTERFACE_OPCODE] = new CloseInterfacePacketListener();
		PACKETS[EXAMINE_ITEM_OPCODE] = new ExamineItemPacketListener();
		PACKETS[EXAMINE_NPC_OPCODE] = new ExamineNpcPacketListener();
		PACKETS[CHANGE_APPEARANCE] = new ChangeAppearancePacketListener();
		PACKETS[DIALOGUE_OPCODE] = new DialoguePacketListener();
		PACKETS[ENTER_AMOUNT_OPCODE] = new EnterInputPacketListener();
		PACKETS[EQUIP_ITEM_OPCODE] = new EquipPacketListener();
		PACKETS[PLAYER_INACTIVE_OPCODE] = new PlayerInactivePacketListener();
		PACKETS[CHAT_SETTINGS_OPCODE] = new ChatSettingsPacketListener();
		PACKETS[COMMAND_OPCODE] = new CommandPacketListener();
		PACKETS[COMMAND_MOVEMENT_OPCODE] = new MovementPacketListener();
		PACKETS[GAME_MOVEMENT_OPCODE] = new MovementPacketListener();
		PACKETS[MINIMAP_MOVEMENT_OPCODE] = new MovementPacketListener();
		PACKETS[PICKUP_ITEM_OPCODE] = new PickupItemPacketListener();
		PACKETS[SECOND_GROUNDITEM_OPTION_OPCODE] = new SecondGroundItemOptionPacketListener();
		PACKETS[SWITCH_ITEM_SLOT_OPCODE] = new SwitchItemSlotPacketListener();
		PACKETS[FOLLOW_PLAYER_OPCODE] = new FollowPlayerPacketListener();
		PACKETS[MAGIC_ON_PLAYER_OPCODE] = new MagicOnPlayerPacketListener();
		PACKETS[MAGIC_ON_ITEM_OPCODE] = new MagicOnItemPacketListener();
		PACKETS[MAGIC_ON_GROUND_ITEM_OPCODE] = new MagicOnItemPacketListener();
		PACKETS[BANK_TAB_CREATION_OPCODE] = new BankTabCreationPacketListener();
		PACKETS[SPAWN_TAB_ACTION_OPCODE] = new SpawnItemPacketListener();

		PACKETS[FIRST_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		PACKETS[SECOND_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		PACKETS[THIRD_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		PACKETS[FOURTH_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		PACKETS[FIFTH_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();
		PACKETS[SIXTH_ITEM_CONTAINER_ACTION_OPCODE] = new ItemContainerActionPacketListener();

		PACKETS[ATTACK_PLAYER_OPCODE] = new PlayerOptionPacketListener();
		PACKETS[PLAYER_OPTION_1_OPCODE] = new PlayerOptionPacketListener();
		PACKETS[PLAYER_OPTION_2_OPCODE] = new PlayerOptionPacketListener();
		PACKETS[PLAYER_OPTION_3_OPCODE] = new PlayerOptionPacketListener();

		PACKETS[OBJECT_FIRST_CLICK_OPCODE] = new ObjectActionPacketListener();
		PACKETS[OBJECT_SECOND_CLICK_OPCODE] = new ObjectActionPacketListener();
		PACKETS[OBJECT_THIRD_CLICK_OPCODE] = new ObjectActionPacketListener();
		PACKETS[OBJECT_FOURTH_CLICK_OPCODE] = new ObjectActionPacketListener();
		PACKETS[OBJECT_FIFTH_CLICK_OPCODE] = new ObjectActionPacketListener();

		PACKETS[ATTACK_NPC_OPCODE] = new NPCOptionPacketListener();
		PACKETS[FIRST_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();
		PACKETS[MAGE_NPC_OPCODE] = new NPCOptionPacketListener();
		PACKETS[SECOND_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();
		PACKETS[THIRD_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();
		PACKETS[FOURTH_CLICK_NPC_OPCODE] = new NPCOptionPacketListener();

		PACKETS[FIRST_ITEM_ACTION_OPCODE] = new ItemActionPacketListener();
		PACKETS[SECOND_ITEM_ACTION_OPCODE] = new ItemActionPacketListener();
		PACKETS[THIRD_ITEM_ACTION_OPCODE] = new ItemActionPacketListener();

		PACKETS[ITEM_ON_NPC] = new UseItemPacketListener();
		PACKETS[ITEM_ON_ITEM] = new UseItemPacketListener();
		PACKETS[ITEM_ON_OBJECT] = new UseItemPacketListener();
		PACKETS[ITEM_ON_GROUND_ITEM] = new UseItemPacketListener();
		PACKETS[ITEM_ON_PLAYER] = new UseItemPacketListener();

		PACKETS[ADD_FRIEND_OPCODE] = new PlayerRelationPacketListener();
		PACKETS[REMOVE_FRIEND_OPCODE] = new PlayerRelationPacketListener();
		PACKETS[ADD_IGNORE_OPCODE] = new PlayerRelationPacketListener();
		PACKETS[REMOVE_IGNORE_OPCODE] = new PlayerRelationPacketListener();
		PACKETS[SEND_PM_OPCODE] = new PlayerRelationPacketListener();

		PACKETS[ENTER_AMOUNT_OPCODE] = new EnterInputPacketListener();
		PACKETS[ENTER_SYNTAX_OPCODE] = new EnterInputPacketListener();

		PACKETS[TRADE_REQUEST_OPCODE] = new TradeRequestPacketListener();
		PACKETS[CREATION_MENU_OPCODE] = new CreationMenuPacketListener();
}