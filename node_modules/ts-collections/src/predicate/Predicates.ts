import {IPredicate} from './IPredicate';

export class Predicates {

    public static not<T>(predicate:IPredicate<T>):IPredicate<T> {
        return {
            check(o:T):boolean {
                return !predicate.check(o);
            }
        };
    }

    public static or<T>(...predicates: IPredicate<T>[]): IPredicate<T> {
        return {
            check(o:T):boolean {
                let result = false;

                predicates.forEach(function (predicate: IPredicate<T>) {
                    result = result || predicate.check(o);
                });
                return result;
            }
        };
    }
}
