import {HashMap} from 'hashmap';

class Frame126 {
    id: number;
    currentState: string;

    constructor(s: string, id: number) {
        this.currentState = s;
        this.id = id;
    }
}

class FrameUpdater {
    private interfaceTextMap = new HashMap<number, Frame126>();
    shouldUpdate(text: string, id: number): boolean {
        if (!this.interfaceTextMap.has(id)) {
            this.interfaceTextMap.set(id, new Frame126(text, id));
        } else {
            let t = this.interfaceTextMap.get(id);
            if (text === t.currentState) {
                return false;
            }
            t.currentState = text;
        }
        return true;
    }
}