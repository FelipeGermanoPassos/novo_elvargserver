class CreationDate implements Command {
    execute(player: Player, command: string, parts: string[]) {
        let calendar = Calendar.getInstance();
        calendar.setTimeInMillis(player.getCreationDate().getTime());

        let dateSuffix;

        switch (calendar.get(Calendar.DATE) % 10) {
            case 1:
                dateSuffix = "st";
                break;
            case 2:
                dateSuffix = "nd";
                break;
            case 3:
                dateSuffix = "rd";
                break;
            default:
                dateSuffix = "th";
                break;
        }

        player.forceChat("I started playing on the " + calendar.get(Calendar.DATE) + dateSuffix + " of "
                + new DateFormatSymbols().getMonths()[calendar.get(Calendar.MONTH)] + ", "
                + calendar.get(Calendar.YEAR) + "!");
    }

    canUse(player: Player) {
        return true;
    }

}