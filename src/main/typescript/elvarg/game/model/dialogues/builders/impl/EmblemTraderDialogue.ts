class EmblemTraderDialogue extends DynamicDialogueBuilder {

    public build(player: Player) {
        add(new OptionDialogue(0, (option) => {
            switch (option) {
                case FIRST_OPTION:
                    ShopManager.open(player, ShopIdentifiers.PVP_SHOP);
                    break;
                case SECOND_OPTION:
                    player.getDialogueManager().start(2);
                    break;
                case THIRD_OPTION:
                    player.getDialogueManager().start(5);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }, "I Would like to see your goods", "Could I sell my emblems please?", "Give me a skull!", "Eh.. Nothing..."));

        add(new ActionDialogue(2, () => {
            let value = BountyHunter.getValueForEmblems(player, true);
            if (value == 0) {
                add(new NpcDialogue(3, NpcIdentifiers.EMBLEM_TRADER, "Don't come to me with no emblems.. Go and fight!!", DialogueExpression.ANGRY_1));
                add(new EndDialogue(4));
                player.getDialogueManager().start(this, 3);
            } else {
                add(new NpcDialogue(3, NpcIdentifiers.EMBLEM_TRADER, "Nice! You earned yourself " + value + " blood money!"));
                add(new EndDialogue(4));
                player.getDialogueManager().start(this, 3);
            }
        }));

        add(new OptionDialogue(5, (option: number) => {
            switch (option) {
                case FIRST_OPTION:
                    CombatFactory.skull(player, SkullType.WHITE_SKULL, 300);
                    add(new NpcDialogue(6, NpcIdentifiers.EMBLEM_TRADER, "Here you go! Now have some fun!", DialogueExpression.LAUGHING));
                    player.getDialogueManager().start(this, 6);
                    break;
                case SECOND_OPTION:
                    CombatFactory.skull(player, SkullType.RED_SKULL, 300);
                    add(new NpcDialogue(6, NpcIdentifiers.EMBLEM_TRADER, "Here you go! Don't cry if you die!!", DialogueExpression.LAUGHING));
                    player.getDialogueManager().start(this, 6);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }, "Give me white skull!", "Give me red skull! (No item protect)", "Nothing..."));
    }
}