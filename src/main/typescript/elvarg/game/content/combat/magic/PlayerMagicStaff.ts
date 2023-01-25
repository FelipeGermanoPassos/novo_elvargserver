enum PlayerMagicStaff {
    AIR = 'AIR',
    WATER = 'WATER',
    EARTH = 'EARTH',
    FIRE = 'FIRE',
    MUD = 'MUD',
    LAVA = 'LAVA',
}

interface PlayerMagicStaffType {
    staves: number[];
    runes: number[];
}

const playerMagicStaff: { [key in PlayerMagicStaff]: PlayerMagicStaffType } = {
    [PlayerMagicStaff.AIR]: { staves: [1381, 1397, 1405], runes: [556] },
    [PlayerMagicStaff.WATER]: { staves: [1383, 1395, 1403], runes: [555] },
    [PlayerMagicStaff.EARTH]: { staves: [1385, 1399, 1407], runes: [557] },
    [PlayerMagicStaff.FIRE]: { staves: [1387, 1393, 1401], runes: [554] },
    [PlayerMagicStaff.MUD]: { staves: [6562, 6563], runes: [555, 557] },
    [PlayerMagicStaff.LAVA]: { staves: [3053, 3054], runes: [554, 557] },
}

function suppressRunes(player: Player, runesRequired: Item[]) {
    if (player.weapon === WeaponInterface.STAFF) {
        for (const magicStaff of Object.values(PlayerMagicStaff)) {
            if (player.equipment.containsAny(playerMagicStaff[magicStaff].staves)) {
                for (const runeId of playerMagicStaff[magicStaff].runes) {
                    for (let i = 0; i < runesRequired.length; i++) {
                        if (runesRequired[i] && runesRequired[i].id === runeId) {
                            runesRequired[i] = null;
                        }
                    }
                }
            }
        }
        return runesRequired;
    }
    return runesRequired;
}
