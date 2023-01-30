export interface IMapper<TItem, TResult> {
    map(item:TItem):TResult;
}
