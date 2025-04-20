import AsyncStorage from '@react-native-async-storage/async-storage';
import { post } from '../utils/api';

const AUTH_TOKEN_KEY = '@auth_token';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() { }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private handleError(error: any): never {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw new Error('Network error');
  }

  async googleLogin(authToken: string): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>('/api/auth/google-login', { authToken });
      await this.setToken(response.token);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>('/api/auth/login', credentials);
      await this.setToken(response.token);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>('/api/auth/signup', credentials);
      await this.setToken(response.token);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      this.token = null;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }

    try {
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      this.token = storedToken;
      return storedToken;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      this.token = token;
    } catch (error) {
      this.handleError(error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export default AuthService.getInstance(); 