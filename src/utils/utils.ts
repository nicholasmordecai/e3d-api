export function uniqueElements<T>(array1: Array<T>, array2: Array<T>): T[] {
    const unique: T[] = [];

    for (const element of array1) {
        if (!array2.includes(element)) {
            unique.push(element);
        }
    }

    return unique;
}
