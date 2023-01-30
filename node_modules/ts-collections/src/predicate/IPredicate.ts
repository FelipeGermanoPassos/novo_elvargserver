export interface IPredicate<TItem> {

    check(o:TItem):boolean;
}

export interface IPredicateFunction<TItem> {
    (o:TItem):boolean;
}
