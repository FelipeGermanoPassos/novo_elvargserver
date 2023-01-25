class ParduDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        let allBrokenItemCost = BrokenItem.getRepairCost(player);
        if (allBrokenItemCost == 0) {
            add(new NpcDialogue(0, NpcIdentifiers.PERDU, "Hello! Seems like you have no broken items."));
            return;
        }
        add(new NpcDialogue(0, NpcIdentifiers.PERDU, "Hello would you like that I fix all your broken item for " +allBrokenItemCost+" blood money?"));

        add(new OptionDialogue(1, (option: number) => {
            switch (option) {
            case FIRST_OPTION:
                player.getDialogueManager().start(2);
                break;
            default:
                player.getPacketSender().sendInterfaceRemoval();
                break;
            }
        }, "Yes Please", "No, thanks..."));

        add(new ActionDialogue(2, () => {
            let isSuccess = BrokenItem.repair(player);
            if (isSuccess) {
                add(new NpcDialogue(3, NpcIdentifiers.PERDU, "All items repaired!"));
                player.getDialogueManager().start(this, 3);
            } else {
                add(new NpcDialogue(3, NpcIdentifiers.PERDU, "You dont have enough blood money for me to fix your items..."));
                player.getDialogueManager().start(this, 3);
            }
        }));
    }
}