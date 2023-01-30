import {IComparator} from './IComparator';

export class Comparators {

    public static invert<T>(comparator:IComparator<T>):IComparator<T> {
        return {
            compare(o1:T, o2:T):number {
                return -1 * comparator.compare(o1, o2);
            }
        };
    }
}
