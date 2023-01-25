class TeleportTablets {
    public static init(player: Player, itemId: number): boolean {
        let tab = TeleportTablet.getTab(itemId);

        // Checks if the tab isn't present, if not perform nothing
        if (!tab) {
            return false;
        }

        //Handle present tab..
        if (player.getInventory().contains(tab.tabId)) {
            if (TeleportHandler.checkReqs(player, tab.position)) {
                TeleportHandler.teleport(player, tab.position, TeleportType.TELE_TAB, false);
                player.getInventory().delete(tab.tabId, 1);
            }
        }

        return true;
    }
    // Teleport Tablet data storage.
    enum TeleportTablet {
    HOME = { tabId: 1, position: new Location(3222, 3222, 0) },
    LUMBRIDGE = { tabId: 8008, position: new Location(3222, 3218, 0) },
    FALADOR = { tabId: 8009, position: new Location(2965, 3379, 0) },
    CAMELOT = { tabId: 8010, position: new Location(2757, 3477, 0) },
    ARDY = { tabId: 8011, position: new Location(2661, 3305, 0) },
    WATCH = { tabId: 8012, position: new Location(2549, 3112, 0) },
    VARROCK = { tabId: 8007, position: new Location(3213, 3424, 0) },
}

private tabId: number;
        private position: Location;

// TabData constructor
constructor(tabId: number, position: Location) {
    this.tabId = tabId;
    this.position = position;
}
public getTab(): number {
    return this.tabId;
}

public getPosition(): Location {
    return this.position;
}

const tab_set: TeleportTablet[] = [
    new TeleportTablet(1, new Location(3222, 3222, 0)),
    new TeleportTablet(8008, new Location(3222, 3218, 0)),
    new TeleportTablet(8009, new Location(2965, 3379, 0)),
    new TeleportTablet(8010, new Location(2757, 3477, 0)),
    new TeleportTablet(8011, new Location(2661, 3305, 0)),
    new TeleportTablet(8012, new Location(2549, 3112, 0)),
    new TeleportTablet(8007, new Location(3213, 3424, 0))
];

public static getTab(tabId: number): TeleportTablet | undefined {
    return tab_set.find(tab => tab.getTab() === tabId);
}
}

