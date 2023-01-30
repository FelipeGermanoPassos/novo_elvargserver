import {ArrayList} from './ArrayList';
import {ICollection} from './ICollection';
import {IItemDecorator} from './IItemDecorator';
import {DecoratedCollection} from './DecoratedCollection';

export class Collections {

    public static makeDecoratedList<TItem, TDecoratedItem>(list:ICollection<TItem>, itemDecorator:IItemDecorator<TItem, TDecoratedItem>):ICollection<TItem|TDecoratedItem> {
        return new DecoratedCollection<TItem, TDecoratedItem>(list, itemDecorator);
    }

    public static makeList<TItem>(value:TItem):ICollection<TItem> {
        return new ArrayList<TItem>().add(value);
    }

    public static emptyList<TItem>():ICollection<TItem> {
        return new ArrayList<TItem>();
    }
}
