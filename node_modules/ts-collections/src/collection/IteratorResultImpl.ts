export class IteratorResultImpl<T> implements IteratorResult<T> {

    constructor(public done:boolean, public value:T) {
    }
}
