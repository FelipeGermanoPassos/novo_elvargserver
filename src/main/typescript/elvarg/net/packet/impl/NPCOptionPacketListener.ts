class NPCOptionPacketListener {
    execute(player: Player, packet: Packet) {
        if (player.busy()) {
            return;
        }

        let index = packet.readLEShortA();

        if (index < 0 || index > World.getNpcs().capacity()) {
            return;
        }

        const npc = World.getNpcs().get(index);

        if (!npc) {
            return;
        }

        if (!player.getLocation().isWithinDistance(npc.getLocation(), 24)) {
            return;
        }

        if (player.getRights() == PlayerRights.DEVELOPER) {
            player.getPacketSender().sendMessage("InteractionInfo Id=" + npc.getId()+" "+npc.getLocation().toString());
        }

        player.setPositionToFace(npc.getLocation());

        if (packet.getOpcode() === PacketConstants.ATTACK_NPC_OPCODE || packet.getOpcode() === PacketConstants.MAGE_NPC_OPCODE) {
            if (!npc.getCurrentDefinition().isAttackable()) {
                return;
            }
            if (npc.getHitpoints() <= 0) {
                player.getMovementQueue().reset();
                return;
            }

            if (packet.getOpcode() === PacketConstants.MAGE_NPC_OPCODE) {

                let spellId = packet.readShortA();

                let spell = CombatSpells.getCombatSpell(spellId);

                if (!spell) {
                    player.getMovementQueue().reset();
                    return;
                }

                player.setPositionToFace(npc.getLocation());

                player.getCombat().setCastSpell(spell);
            }

            player.getCombat().attack(npc);
            return;
        }

        player.getMovementQueue().walkToEntity(npc, () => handleInteraction(player, npc, packet));
    }

    private handleInteraction(player: Player, npc: NPC, packet: Packet) {
        const opcode = packet.getOpcode();
        npc.setMobileInteraction(player);

npc.setPositionToFace(player.getLocation());

if (opcode === PacketConstants.FIRST_CLICK_NPC_OPCODE) {
    if (PetHandler.interact(player, npc)) {
        return;
    }

    if (QuestHandler.firstClickNpc(player, npc)) {
        return;
    }

    if (NPCInteractionSystem.handleFirstOption(player, npc)) {
        return;
    }

    switch (npc.getId()) {
        case SHOP_KEEPER_4:
            ShopManager.open(player, ShopIdentifiers.GENERAL_STORE);
            break;
        case CHARLIE_THE_COOK:
            ShopManager.open(player, ShopIdentifiers.FOOD_SHOP);
            break;
        case RICK:
            ShopManager.open(player, ShopIdentifiers.PURE_SHOP);
            break;
        case AJJAT:
            ShopManager.open(player, ShopIdentifiers.ARMOR_SHOP);
            break;
        case MAGIC_INSTRUCTOR:
            ShopManager.open(player, ShopIdentifiers.MAGE_ARMOR_SHOP);
            break;
        case ARMOUR_SALESMAN:
            ShopManager.open(player, ShopIdentifiers.RANGE_SHOP);
            break;
        case BANKER_2:
        case TZHAAR_KET_ZUH:
            player.getBank(player.getCurrentBankTab()).open();
            break;
        case MAKE_OVER_MAGE:
            player.getPacketSender().sendInterfaceRemoval().sendInterface(3559);
            player.getAppearance().setCanChangeAppearance(true);
            break;
        case SECURITY_GUARD:
            //DialogueManager.start(player, 2500);
            break;
        case EMBLEM_TRADER:
        case EMBLEM_TRADER_2:
        case EMBLEM_TRADER_3:
            player.getDialogueManager().start(new EmblemTraderDialogue());
            break;

        case PERDU:
            player.getDialogueManager().start(new ParduDialogue());
            break;

        case FINANCIAL_ADVISOR:
            //DialogueManager.start(player, 15);
            // Removed
            break;
        case NIEVE:
            player.getDialogueManager().start(new NieveDialogue());
            break;
    }
    return;
}
if (opcode == PacketConstants.SECOND_CLICK_NPC_OPCODE) {
    if (PetHandler.pickup(player, npc)) {
        // Player is picking up their pet
        return;
    }

    if (Pickpocketing.init(player, npc)) {
        // Player is trying to thieve from an NPC
        return;
    }

    if (NPCInteractionSystem.handleSecondOption(player, npc)) {
        // Player is interacting with a defined NPC
        return;
    }

    switch (npc.getId()) {
        case NIEVE:
            player.getDialogueManager().start(new NieveDialogue(), 2);
            break;
        case BANKER:
        case BANKER_2:
        case BANKER_3:
        case BANKER_4:
        case BANKER_5:
        case BANKER_6:
        case BANKER_7:
        case TZHAAR_KET_ZUH:
            player.getBank(player.getCurrentBankTab()).open();
            break;
        case 1497: // Net and bait
        case 1498: // Net and bait
            player.getSkillManager().startSkillable(new Fishing(npc, FishingTool.FISHING_ROD));
            break;
        case RICHARD_2:
            ShopManager.open(player, ShopIdentifiers.TEAMCAPE_SHOP);
            break;
        case EMBLEM_TRADER:
        case EMBLEM_TRADER_2:
        case EMBLEM_TRADER_3:
            ShopManager.open(player, ShopIdentifiers.PVP_SHOP);
            break;
        case MAGIC_INSTRUCTOR:
            ShopManager.open(player, ShopIdentifiers.MAGE_ARMOR_SHOP);
            break;

    }
    return;
}

if (opcode == PacketConstants.THIRD_CLICK_NPC_OPCODE) {
    if (PetHandler.morph(player, npc)) {
        // Player is morphing their pet
        return;
    }

    if (NPCInteractionSystem.handleThirdOption(player, npc)) {
        // Player is interacting with a defined NPC
        return;
    }

    switch (npc.getId()) {

        case EMBLEM_TRADER:
            player.getDialogueManager().start(new EmblemTraderDialogue(), 2);
            break;
        case MAGIC_INSTRUCTOR:
            ShopManager.open(player, ShopIdentifiers.MAGE_RUNES_SHOP);
            break;
    }
    return;
}

if (opcode == PacketConstants.FOURTH_CLICK_NPC_OPCODE) {
    if (NPCInteractionSystem.handleForthOption(player, npc)) {
        // Player is interacting with a defined NPC
        return;
    }

    switch (npc.getId()) {
        case EMBLEM_TRADER:
            player.getDialogueManager().start(new EmblemTraderDialogue(), 5);
            break;
    }
    return;
}
}
}
