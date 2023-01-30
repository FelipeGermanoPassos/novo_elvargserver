import {IPredicate, IPredicateFunction} from "../predicate/IPredicate";
import {IMapper} from '../mapper/IMapper';
import {IComparator} from '../comparator/IComparator';
import {IIteratorFactory} from './IIteratorFactory';

/**
 * Lodash compatibility
 */
export interface IList<TItem> {
    length:number;
    [index:number]:TItem;
}

export interface IEachFunction<TItem> {
    (o:TItem, index:number);
}

export interface IArray<TItem> {

    /**
     * Compatible with an array
     * @param predicate Predicate or function
     */
    filter(predicate:IPredicate<TItem>|IPredicateFunction<TItem>):ICollection<TItem>;

    /**
     * Compatible with an array
     * @param predicate Predicate or function
     */
    find(predicate:IPredicate<TItem>|IPredicateFunction<TItem>):TItem;

    /**
     * Compatible with an array
     * @param callback Callback
     */
    forEach(callback:IEachFunction<TItem>);
}

export interface ICollection<TItem> extends IList<TItem>, IArray<TItem>, Iterable<TItem>, IIteratorFactory<TItem> {

    get(index:number):TItem;

    add(item:TItem):ICollection<TItem>;

    addAll(items:ICollection<TItem>):ICollection<TItem>;

    insert(position:number, item:TItem):ICollection<TItem>;

    removeAll():ICollection<TItem>;

    remove(item:TItem):boolean;

    sort(comparator:IComparator<TItem>):ICollection<TItem>;

    iterate(callback:(item:TItem, index:number) => void, predicate?:IPredicate<TItem>);

    map<E>(mapper:IMapper<TItem, E>):Array<E>;

    getSize():number;

    toArray():Array<TItem>;

    addArray(items:Array<TItem>):ICollection<TItem>;

    isEmpty():boolean;
}
