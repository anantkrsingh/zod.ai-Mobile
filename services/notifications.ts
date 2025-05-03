import { get, patch } from '../utils/api';

export interface Notification {
    id: string;
    title: string;
    message: string;
    icon: string;
    isRead: boolean;
    dismissed: boolean;
    createdAt: string;
    userId: string;
}

export interface NotificationsResponse {
    currentPage: number;
    notifications: Notification[];
    totalNotifications: number;
    totalPages: number;
}

export const fetchNotifications = async (
    page: number = 1,
): Promise<NotificationsResponse> => {
    return get<NotificationsResponse>(`/api/notifications?page=${page}`);
};

export const updateNotification = async (
    notificationId: string,
    data: { isRead: boolean; dismissed: boolean }
): Promise<Notification> => {
    return patch<Notification>(`/api/notifications/${notificationId}`, data);
}; 