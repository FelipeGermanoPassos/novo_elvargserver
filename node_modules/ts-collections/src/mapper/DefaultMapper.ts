import {IMapper} from './IMapper';

export class DefaultMapper<TItem> implements IMapper<TItem, TItem> {

    /**
     * @override
     */
    public map(item:TItem):TItem {
        return item;
    }
}
