import { Mobile } from './Mobile';

export class MobileList<E extends Mobile> implements Iterable<E> {
    private slotQueue: Queue<number> = new ArrayDeque<number>();
    private capacity: number;
    private characters: E[];
    private size: number;

    constructor(capacity: number) {
        this.capacity = ++capacity;
        this.characters = new Array(capacity);
        this.size = 0;
        for (let i = 1; i <= (capacity - 1); i++) {
            this.slotQueue.add(i);
        }
    }

    public add(e: E): boolean {
        if (e === null) {
            return false;
        }

        if (this.isFull()) {
            return false;
        }

        if (!e.isRegistered()) {
            let slot = this.slotQueue.remove();
            e.setRegistered(true);
            e.setIndex(slot);
            this.characters[slot] = e;
            e.onAdd();
            this.size++;
            return true;
        }
        return false;
    }

    public remove(e: E): boolean {
        if (e === null) {
            return false;
        }

        if (e.isRegistered() && this.characters[e.getIndex()] != null) {
            e.setRegistered(false);
            this.characters[e.getIndex()] = null;
            this.slotQueue.add(e.getIndex());
            e.onRemove();
            this.size--;
            return true;
        }
        return false;
    }

    public contains(e: E): boolean {
        if (e === null) {
            return false;
        }
        return this.characters[e.getIndex()] != null;
    }

    public forEach(action: Consumer<E>): void {
        for (let e of this.characters) {
            if (e === null) {
                continue;
            }
            action.accept(e);
        }
    }

    public search(filter: Predicate<E>): Optional<E> {
        for (let e of this.characters) {
            if (e === null)
                continue;
            if (filter.test(e))
                return Optional.of(e);
        }
        return Optional.empty();
    }

    public iterator(): Iterator<E> {
        return new CharacterListIterator<E>(this);
    }

    public get(slot: number): E {
        return this.characters[slot];
    }

    public sizeReturn(): number {
        return this.size;
    }

    public capacityReturn(): number {
        return this.capacity
    }

    public spaceLeft(): number {
        return this.capacity - this.size;
    }

    public isFull(): boolean {
        return this.size + 1 >= this.capacity;
    }

    public stream(): Array<E> {
        return this.characters;
    }

    public clear(): void {
        this.characters.forEach(this.remove);
        this.characters = [] as E[];
        this.size = 0;
    }

    private remove(item: E): void {
        // implementation of remove method
    }
}

export class CharacterListIterator<E extends Mobile> implements Iterator<E> {
    private list: MobileList<E>;
    private index: number;
    private lastIndex: number = -1;

    constructor(list: MobileList<E>) {
        this.list = list;
    }

    public hasNext(): boolean {
        return !(this.index + 1 > this.list.capacity);
    }

    public next(): E {
        if (this.index >= this.list.capacity) {
            throw new ArrayIndexOutOfBoundsException("There are no " + "elements left to iterate over!");
        }
        this.lastIndex = this.index;
        this.index++;
        return this.list.characters[this.lastIndex];
    }

    public remove(): void {
        if (this.lastIndex == -1) {
            throw new Error("This method can only be " + "called once after \"next\".");
        }
        this.list.remove(this.list.characters[this.lastIndex]);
        this.lastIndex = -1;
    }
} 