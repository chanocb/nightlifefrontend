export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface Schedule {
    startTime: string;  // Format: "HH:mm" - Will be converted to LocalTime in backend
    endTime: string;    // Format: "HH:mm" - Will be converted to LocalTime in backend
    dayOfWeek: DayOfWeek;
} 