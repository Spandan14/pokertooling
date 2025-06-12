declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B }
export type Branded<T, B> = T & Brand<B>;

export function brand<T, B extends string>(value: T): Branded<T, B> {
    return value as Branded<T, B>;
}
