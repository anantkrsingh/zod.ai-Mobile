import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { post } from '../utils/api';

class NotificationService {
  private static instance: NotificationService;
  private token: string | null = null;

  private constructor() {
    this.configureNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private configureNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  async registerForPushNotifications() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: '7bae9fe7-6887-411d-b00b-862c01695f7a',
      })).data;

      this.token = token;
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  async savePushToken(token: string) {
    try {
      await post('/api/auth/save-push-token', { token });
      console.log('Push token saved successfully');
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  async setupPushNotifications() {
    const token = await this.registerForPushNotifications();
    if (token) {
      await this.savePushToken(token);
    }
  }

  getToken() {
    return this.token;
  }
}

export default NotificationService.getInstance(); 