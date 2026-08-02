export type NotificationCategory =
    | "weather"
    | "prediction"
    | "soil"
    | "system";

export interface Notification {
    id: number;
    title: string;
    message: string;
    category: NotificationCategory | string;
    is_read: boolean;
    created_at: string;
}
