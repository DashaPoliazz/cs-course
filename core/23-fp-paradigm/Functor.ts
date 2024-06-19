interface IFunctor<T> {
  map: <U>(f: (value: T) => U) => IFunctor<U>;
}

export default IFunctor;
