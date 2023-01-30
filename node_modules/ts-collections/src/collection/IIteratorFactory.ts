export interface IIteratorFactory<T> {

    getIteratorInstance(): Iterator<T>;
}
