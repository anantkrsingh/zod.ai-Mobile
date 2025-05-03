import { get, post } from '../utils/api';

interface HandleResponse {
  id: string;
  handle: string;
}

class HandleService {
  private static instance: HandleService;

  private constructor() {}

  static getInstance(): HandleService {
    if (!HandleService.instance) {
      HandleService.instance = new HandleService();
    }
    return HandleService.instance;
  }

  async checkAvailability(handle: string): Promise<boolean> {
    try {
      const response = await post<{ available: boolean }>('/api/handles/available', { handle });
      return response.available;
    } catch (error) {
      console.error('Error checking handle availability:', error);
      throw error;
    }
  }

  async createHandle(handle: string): Promise<HandleResponse> {
    try {
      return await post<HandleResponse>('/api/handles', { handle });
    } catch (error) {
      console.error('Error creating handle:', error);
      throw error;
    }
  }
}

export default HandleService.getInstance(); 