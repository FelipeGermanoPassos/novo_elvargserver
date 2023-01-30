export interface IItemDecorator<TItem, TDecoratedItem> {

    decorate(item:TItem):TDecoratedItem;
}
