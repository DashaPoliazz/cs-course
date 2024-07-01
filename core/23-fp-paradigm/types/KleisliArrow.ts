import IMonad from "../Monad";
import { MapFn } from "./MapFn";

export type KleisliArrow<T> = <U>(f: MapFn<T>) => IMonad<U>;
