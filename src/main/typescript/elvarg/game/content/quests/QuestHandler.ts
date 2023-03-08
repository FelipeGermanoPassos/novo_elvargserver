
import { Player } from "../../entity/impl/player/Player"
import { NPC } from "../../entity/impl/npc/NPC"
import { Quest } from "./Quest";

export class QuestHandler {
    public static NOT_STARTED = 0;

    public static updateQuestTab(player: Player) {
        player.getPacketSender().sendString("QP: " + player + " ", 3985);

        for (const questRecord of Object.values(Quests)) {
            const quest = questRecord.get();

            player.getPacketSender().sendString(quest.questTabStringId(), questRecord.getProgressColor(player) + questRecord.getName());
        }
    }

    public static firstClickNpc(player: Player, npc: NPC) {
        for (const questRecord of Object.values(Quests)) {
            if (questRecord.quest.firstClickNpc(player, npc)) {
                return true;
            }
        }

        // Return false if no Quest handled this NPC click
        return false;
    }

    private name: string;
    private quest: Quest;

    constructor(name: string, quest: Quest) {
        this.name = name;
        this.quest = quest;
    }

    public getName(): string {
        return this.name;
    }

    public getQuest(): Quest {
        return this.quest;
    }

    public getProgress(player: Player) {
        if (!player.getQuestProgress().has(Quests[this.toString()])) {
            return 0;
        }

        return player.getQuestProgress().get(Quests[this.toString()]);
    }

    public setProgress(player: Player, progress: number) {
        player.getQuestProgress().set(Quests[this.toString()], progress);
        QuestHandler.updateQuestTab(player);
    }

    public getProgressColor(player: Player): string {
        let questProgress = this.getProgress(player);
        if (questProgress === 0) {
            return "@red@";
        }

        let completeProgress = this.get().completeStatus();
        if (questProgress < completeProgress) {
            return "@yel@";
        }

        return "@gre@";
    }

    static forButton(button: number): Quests | null {
        for (const q of Object.values(Quests)) {
            if (q.get().questTabButtonId() === button) {
                return q;
            }
        }
        return null;
    }

    static getOrdinal(quest: Quest): number {
        for (const q of Object.values(Quests)) {
            if (q.get() === quest) {
                return q.ordinal;
            }
        }
        return -1;
    }

    public showRewardInterface(player: Player, lines: string[], itemID: number) {
        let questName = this.getName();

        player.getPacketSender().sendString(`You have completed ${questName}!`, 12144);
        player.getPacketSender().sendString(`${this.get().questPointsReward()}`, 12147);

        for (let i = 0; i < 5; i++) {
            player.getPacketSender().sendString(lines[i], 12150 + i);
        }

        if (itemID > 0) {
            player.getPacketSender().sendInterfaceModel(12145, itemID, 250);
        }

        player.getPacketSender().sendInterface(12140);
    }

    static handleQuestButtonClick(player: Player, buttonId: number): boolean {
        let quest = QuestHandler.forButton(buttonId);
        if (!quest) {
            return false;
        }

        let status: number = player.getQuestProgress().get(quest);
        quest.get().showQuestLog(player, status);
        return true;
    }

    static clearQuestLogInterface(player: Player) {
        for (let i = 8144; i < 8195; i++) {
            player.getPacketSender().sendString("", i);
        }
    }
}

export class Quests {

    public static readonly COOKS_ASSISTANT = new Quests("Cook's Assistant", new Quest());


    constructor(name: string, quest: Quest) {
        this.name = name;
        this.quest = quest;
    }

    getName(): string {
        return this.name;
    }

    get(): Quest {
        return this.quest;
    }

    getProgress(player: Player): number {
        if (!player.getQuestProgress().has(this.ordinal())) {
            return 0;
        }
        return player.getQuestProgress().get(this.ordinal());
    }

    public setProgress(player: Player, progress: number): void {
        player.getQuestProgress().set(this.ordinal(), progress);
        QuestHandler.updateQuestTab(player);
    }

    /**
    
    Gets the progress colour for the Quest tab for the given quest.
    
    @param player The player to check status for
    
    @return progressColor The status colour prefix, e.g. "@red@"
    */
    public getProgressColor(player: Player): string {
        const questProgress = this.getProgress(player);
        if (questProgress == 0) {
            return "@red@";
        }

        const completeProgress = this.get().completeStatus();
        if (questProgress < completeProgress) {
            return "@yel@";
        }

        return "@gre@";
    }

    public static forButton(button: number): Quests | null {
        for (const q of Object.values(Quests)) {
            if (q.get().questTabButtonId() === button) {
                return q;
            }
        }
        return null;
    }

    public static getOrdinal(quest: Quest): number {
        for (const q of Object.values(Quests)) {
            if (q.get() === quest) {
                return q.ordinal();
            }
        }
        return -1;
    }

    public showRewardInterface(player: Player, lines: string[], itemID: number): void {
        const questName: string = this.getName();

        player.getPacketSender().sendString(`You have completed + ${ questName } !`, 12144);
        player.getPacketSender().sendString(`${ this.get().questPointsReward() } `, 12147);

        for (let i = 0; i < 5; i++) {
            player.getPacketSender().sendString(lines[i], 12150 + i);
        }

        if (itemID > 0) {
            player.getPacketSender().sendInterfaceModel(12145, itemID, 250);
        }

        player.getPacketSender().sendInterface(12140);
    }

    public handleQuestButtonClick(player: Player, buttonId: number): boolean {
        const quest = Quests.forButton(buttonId);
        if (quest == null) {
            // There is no quest for this button ID
            return false;
        }

        const status = player.getQuestProgress().get(quest.get());
        quest.get().showQuestLog(player, status);
        return true;
    }

    /**
     
    This function blanks out all lines on the Quest log interface.
    @param player
    */
    public clearQuestLogInterface(player: Player): void {
        for (let i = 8144; i < 8195; i++) {
            player.getPacketSender().sendString("", i);
        }
    }
}



