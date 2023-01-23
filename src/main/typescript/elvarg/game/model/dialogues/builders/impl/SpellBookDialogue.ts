class SpellBookDialogue extends DynamicDialogueBuilder {
    public build(player: Player) {
        add(new OptionDialogue(0, (option: number) => {
            switch (option) {
                case FIRST_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook.changeSpellbook(player, MagicSpellbook.NORMAL);
                    break;
                case SECOND_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook.changeSpellbook(player, MagicSpellbook.ANCIENT);
                    break;
                case THIRD_OPTION:
                    player.getPacketSender().sendInterfaceRemoval();
                    MagicSpellbook.changeSpellbook(player, MagicSpellbook.LUNAR);
                    break;
                default:
                    player.getPacketSender().sendInterfaceRemoval();
                    break;
            }
        }, "Normal", "Ancient", "Lunar"));

    }
}