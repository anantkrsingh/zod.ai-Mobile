import { get, post } from '../utils/api';

export interface UserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    handle?: string;
    profileUrl?: string;
    createdAt: string;
    tokens: number;
    premiumTokens: number;
  };
  creations: {
    id: string;
    displayImage: string;
    createdAt: string;
    image: {
      id: string;
      url: string;
      isPremium: boolean;
      prompt: string;
    };
  }[];
}

class ProfileService {
  async getProfile(): Promise<UserProfile> {
    return get<UserProfile>('/api/auth/profile');
  }

  async updateProfile(data: { name: string; handle?: string; profileUrl?: string }): Promise<void> {
    await post('/api/auth/update-profile', data);
  }
}

export default new ProfileService(); 