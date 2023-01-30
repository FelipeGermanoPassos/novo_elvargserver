import {ICollection} from './ICollection';
import {Collection} from './Collection';
import {IComparator} from '../comparator/IComparator';
import {ArrayIterator} from './Iterator';

export class ArrayList<T> extends Collection<T> {

    constructor(private data:Array<T> = []) {
        super();
    }
    
    /**
     * @override
     */
    public get(index:number):T {
        return this.data[index];
    }

    /**
     * @override
     */
    public addAll(items:ICollection<T>):ICollection<T> {
        this.addArray(items.toArray());
        return this;
    }

    /**
     * @override
     */
    public add(item:T):ICollection<T> {
        this.insert(this.length, item);
        return this;
    }

    /**
     * @override
     */
    public addArray(items:Array<T>):ICollection<T> {
        this.data = this.data.concat(items);
        this.checkAndGrowUp();
        return this;
    }

    /**
     * @override
     */
    public insert(position:number, item:T):ICollection<T> {
        this.data.splice(position, 0, item);
        return super.insert(position, item);
    }

    /**
     * @override
     */
    public sort(comparator:IComparator<T>):ICollection<T> {
        this.data.sort((o1:T, o2:T) => comparator.compare(o1, o2));
        return this;
    }

    /**
     * @override
     */
    public removeAll():ICollection<T> {
        this.data.length = 0;
        return this;
    }

    /**
     * @override
     */
    public remove(item:T):boolean {
        const previousLength:number = this.length;
        this.data = this.data.filter((cur:T) => item !== cur);
        return previousLength !== this.length;
    }

    /**
     * @override
     */
    public getIteratorInstance():Iterator<T> {
        return new ArrayIterator<T>(this.data);
    }

    /**
     * @override
     */
    public toArray():Array<T> {
        return this.data;
    }

    /**
     * @override
     */
    public getSize():number {
        return this.data.length;
    }
}
