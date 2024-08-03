import { start } from "repl";

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
export interface LastDaysReturn {
    startDateTime?: string,
    endDateTime?: string,
    startDate?: string,
    endDate?: string
}
export const getLastDaysRange = (days: number = 30): LastDaysReturn => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - days);

    const startDateTime = formatDateTime(pastDate);
    const endDateTime = formatDateTime(currentDate);

    const startDate = formatDate(pastDate);
    const endDate = formatDate(currentDate);

    return { startDateTime: startDateTime, endDateTime: endDateTime, startDate: startDate, endDate: endDate };
};