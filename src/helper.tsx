export function GetColumnNames<T>() {
    return function<K extends keyof T>(prop: K): string {
        return prop.toString();
    }
}
