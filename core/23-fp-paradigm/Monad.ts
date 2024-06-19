import IFunctor from "./Functor";

export type MapFn<T> = <U>(value: T) => U;
type KleisliArrow<T> = <U>(f: MapFn<T>) => IMonad<U>;

interface IMonad<T> extends IFunctor<T> {
  flatMap: KleisliArrow<T>;
}

export default IMonad;
