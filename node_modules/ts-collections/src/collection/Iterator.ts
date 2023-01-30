import {IteratorResultImpl} from './IteratorResultImpl';

export interface List<TItem> {
    getSize():number;
    getItem(index:number):TItem;
}

export abstract class AbstractIterator<TItem, TValueItem> implements Iterator<TValueItem> {

    private index:number = 0;

    constructor(protected rawList:List<TItem>) {
    }

    /**
     * @override
     */
    public next():IteratorResult<TValueItem> {
        const currentIndex:number = this.index,
            done:boolean = ++this.index > this.rawList.getSize();

        return new IteratorResultImpl<TValueItem>(done, this.getItem(this.rawList.getItem(currentIndex)));
    }

    protected abstract getItem(currentValue:TItem):TValueItem;
}

export class DefaultIterator<TItem> extends AbstractIterator<TItem, TItem> {

    constructor(protected list:List<TItem>) {
        super(list);
    }

    /**
     * @override
     */
    protected getItem<TResult>(currentValue:TItem):TItem {
        return currentValue;
    }
}

export class ArrayIterator<TItem> extends DefaultIterator<TItem> {

    constructor(protected array:Array<TItem>) {
        super({
            getSize: ():number => this.array.length,
            getItem: (index:number):TItem =>this.array[index]
        });
    }
}
