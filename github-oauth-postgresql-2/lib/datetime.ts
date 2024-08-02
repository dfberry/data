export enum DateTimeReturnType {
    String,
    Object,
    All
}
const formatDateTime = (date: Date): string => {
    return date.toISOString();
};
const formatDate = (date: Date): string => {
    // Formats the date as 'YYYY-MM-DD'
    // Example: If the date is January 5, 2023, the formatted string will be '2023-01-05'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
export const getLastDaysRange = (returnType: DateTimeReturnType = DateTimeReturnType.All, days: number = 30): string | Object => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - days);

    const startDate = returnType === DateTimeReturnType.Object ? formatDateTime(pastDate) : formatDate(pastDate);
    const endDate = returnType === DateTimeReturnType.Object ? formatDateTime(currentDate) : formatDate(currentDate);

    switch (returnType) {
        case DateTimeReturnType.Object:
            return { start: startDate, end: endDate };
        case DateTimeReturnType.String:
            return `${startDate}..${endDate}`;
        default:
            return { start: startDate, end: endDate, string: `${startDate}..${endDate}` };
    }
};