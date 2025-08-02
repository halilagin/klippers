import axios, { AxiosInstance } from 'axios';
import { 
  User, 
  UserCreate, 

} from '../models/User';
import AppConfig from '@/AppConfig';
import { MessageResponse, Token, TokenFromJSON } from '@/api/models';

export class AuthApiClient {
  private client: AxiosInstance;
  private baseUrl: string;
  
  
  constructor() {
    // this.baseUrl = baseUrl;
    this.baseUrl = AppConfig.baseApiUrl || 'http://127.0.0.1:8000';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  private setAuthHeader(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(username: string, password: string): Promise<Token> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await this.client.post('/api/v1/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const token = TokenFromJSON(response.data) // as Token;
    this.setAuthHeader(token.accessToken);
    return token;
  }

  async register(userData: UserCreate): Promise<User> {
    const response = await this.client.post('/api/v1/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<MessageResponse> {
    const response = await this.client.post('/api/v1/auth/logout');
    return response.data;
  }

  async getMe(): Promise<User> {
    const response = await this.client.get('/api/v1/auth/me');
    return response.data;
  }

  async deleteUser(username: string): Promise<MessageResponse> {
    const response = await this.client.post('/api/v1/users/delete', { username });
    return response.data;
  }
} 