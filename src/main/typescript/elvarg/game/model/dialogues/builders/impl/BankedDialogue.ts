class BankerDialogue extends DynamicDialogueBuilder {

    build(player: Player) {
        this.add(new NpcDialogue(0, NpcIdentifiers.BANKER, "Hello would you like to open the bank?"));

        this.add(new OptionDialogue(1, (option) => {
            switch (option) {
                case FIRST_OPTION:
                    player.getBank(player.getCurrentBankTab()).open();
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }, "Yes Please", "No, thanks..."));
    }
}