export function getDate(dateString: string) {
    return new Date(Number(dateString)).toLocaleString("en-IN");
}
