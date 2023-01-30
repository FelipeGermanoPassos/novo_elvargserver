import {IPredicate} from "./IPredicate";

export class AlwaysTruePredicate<T> implements IPredicate<T> {

    public check(o:T):boolean {
        return true;
    }
}
