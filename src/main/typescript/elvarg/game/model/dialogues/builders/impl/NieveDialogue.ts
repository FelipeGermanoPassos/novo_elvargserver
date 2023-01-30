class NieveDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        add(new NpcDialogue(0, 6797, "'Ello, and what are you after then?"));
        add(new OptionDialogue(1, (option: number) => {
            switch (option) {
            case FIRST_OPTION:
                player.getDialogueManager().start(2);
                break;
            case SECOND_OPTION:
                player.getDialogueManager().start(8);
                break;
            case THIRD_OPTION:
                player.getDialogueManager().start(11);
                break;
            default:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            }
        }, "I need another assignment.", "Have you any rewards for me, or anything to trade?",
                "Tell me about your skillcape, please.", "Er.... Nothing..."));

        add(new ActionDialogue(2, () => {
            if (player.getSlayerTask() == null) {
                if (Slayer.assign(player)) {
                    add(new NpcDialogue(3, 6797, "You've been assigned to hunt " + player.getSlayerTask().getRemaining()
                            + " " + player.getSlayerTask().getTask().toString() + ", come back when you're done."));
                    add(new PlayerDialogue(4, "Okay, thanks."));
                    add(new EndDialogue(5));
                    player.getDialogueManager().start(this, 3);
                }
            } else {
                add(new NpcDialogue(3, 6797, "You're still hunting " + player.getSlayerTask().getTask().toString() + ". You need to kill " + player.getSlayerTask().getRemaining() + " more, come back when you're done."));
                add(new PlayerDialogue(4, "Got any tips for me?"));
                add(new NpcDialogue(5, 6797, "You should be able to find your task " + player.getSlayerTask().getTask().getHint() + ".")); // TODO: Hints
                add(new PlayerDialogue(6, "Thanks!"));
                add(new EndDialogue(7));
                player.getDialogueManager().start(this, 3);
            }
        }));

        add(new PlayerDialogue(8, "Have you any rewards for me, or anything to trade?"), new NpcDialogue(9, 6797,
                "I have quite a few rewards you can earn, and a wide variety of Slayer equipment for sale."));
        add(new OptionDialogue(10, (option: number) => {
            switch (option) {
            case FIRST_OPTION:
                // TODO: Rewards
                break;
            case SECOND_OPTION:
                // TODO: Trade
                break;
            default:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            }
        }, "Look at rewards.", "Look at shop.", "Cancel."));

        // Skill cape
        if (player.getSkillManager().getMaxLevel(Skill.SLAYER) == SkillManager.getMaxAchievingLevel(Skill.SLAYER)) {
            add(new NpcDialogue(11, 6797, ""));
        } else {
            add(new NpcDialogue(11, 6797, ""));
        }
    }
}
    
