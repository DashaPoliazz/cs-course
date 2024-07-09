interface Functor<T> {
  map<U>(value: T): Functor<U>;
}
