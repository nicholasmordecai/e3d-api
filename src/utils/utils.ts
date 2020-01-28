export function uniqueElements<T>(a: Array<T>, b: Array<T>): T[] {
    const unique: T[] = [];

    for(let a1 of a) {
        if(!b.includes(a1)) {
            unique.push(a1);
        }
    }

    return unique;
}