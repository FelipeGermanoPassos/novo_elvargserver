enum DonatorRights {
    NONE = { spriteId: -1, yellDelay: -1, yellTag: "" },
    REGULAR_DONATOR = { spriteId: 622, yellDelay: 40, yellTag: "[Donator]" },
    SUPER_DONATOR = { spriteId: 623, yellDelay: 25, yellTag: "[Super Donator]" },
    UBER_DONATOR = { spriteId: 624, yellDelay: 10, yellTag: "[Uber Donator]" },

    getSpriteId() {
        return this.spriteId
    },
        getYellDelay() {
    return this.yellDelay
},
getYellTag() {
    return this.yellTag
}
    }