class OpenThread implements Command {
    execute(player: Player, command: string, parts: string[]) {
    if (parts.length > 2 || parts.length < 2) {
    player.getPacketSender().sendMessage("Please enter a valid command.");
    return;
    }
    let ID = parseInt(parts[1]);
    try {
    let url = new URL(https://www.deadlypkers.net/server_data/fetch_thread_link.php?ID=${ID});
    let con = await fetch(url);
    let data = await con.text();
    if (data) {
    player.getPacketSender().sendURL(data);
    }
    } catch (error) {
    console.log(error);
    }
    }
    canUse(player: Player) {
    return true;
    }
}