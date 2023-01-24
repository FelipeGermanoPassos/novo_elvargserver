class FrameUpdater {
    interfaceTextMap: Map<number, Frame126> = new Map<number, Frame126>();
    
    Copy code
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
    
    class Frame126 {
        id: number;
        currentState: string;
    
        constructor(s: string, id: number) {
            this.currentState = s;
            this.id = id;
        }
    }
}