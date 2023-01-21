public class LockExperience implements Command {

    @Override
    public void execute(Player player, String command, String[] parts) {
        player.setExperienceLocked(!player.experienceLocked());
        player.getPacketSender().sendMessage("Lock: " + player.experienceLocked());
    }

    @Override
    public boolean canUse(Player player) {
        return true;
    }

}