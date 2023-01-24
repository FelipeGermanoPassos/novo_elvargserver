class UpdateServer implements Command {
    execute(player: Player, command: string, parts: string[]) {
    let time = parseInt(parts[1]);
    if (time > 0) {
    Server.setUpdating(true);
    for (let players of World.getPlayers()) {
    if (!players) {
    continue;
    }
    players.getPacketSender().sendSystemUpdate(time);
    }
    TaskManager.submit(new Task(time) {
    execute() {
    for (let player of World.getPlayers()) {
    if (player) {
    player.requestLogout();
    }
    }
    ClanChatManager.save();
    Server.getLogger().info("Update task finished!");
    this.stop();
    }
    });
    }
    }
}