export const toArray = <T>(value: T | T[] | undefined | null): T[] => {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value]
}