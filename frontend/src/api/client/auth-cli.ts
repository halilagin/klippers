import { AuthApiClient } from '@/api/client/AuthApiClient';
import { UserCreate } from '@/api/models/User';
import axios from 'axios';
import AppConfig from '@/AppConfig';
async function handleLogin(client: AuthApiClient, username: string = 'admin@example.com', password: string = 'admin123') {
  const token = await client.login(username, password);
  console.log('Login successful:', token);
}

async function handleRegister(client: AuthApiClient, username: string = 'new_user', email: string = 'new_user@example.com', password: string = 'newpassword123') {
  const newUser: UserCreate = { username, email, password };
  const user = await client.register(newUser);
  console.log('Registration successful:', user);
}

async function handleGetMe(client: AuthApiClient, token_str: string) {
  if (!token_str) {
    throw new Error('Auth token required');
  }
  client['setAuthHeader'](token_str);
  const profile = await client.getMe();
  console.log('User profile:', profile);
}

async function handleLogout(client: AuthApiClient) {
  const logoutResult = await client.logout();
  console.log('Logout result:', logoutResult);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  console.log('command', command);

  const baseUrl = AppConfig.baseApiUrl || 'http://127.0.0.1:8000';
  const client = new AuthApiClient();

  try {
    switch (command) {
      case 'login':
        await handleLogin(client, args[1], args[2]);
        break;

      case 'register':
        await handleRegister(client, args[1], args[2], args[3]);
        break;

      case 'me':
        await handleGetMe(client, args[1]);
        break;

      case 'logout':
        await handleLogout(client);
        break;
      case 'all':
        await handleLogin(client, args[1], args[2]);
        await handleRegister(client, args[1], args[2], args[3]);
        await handleGetMe(client, args[1]);
        await handleLogout(client);
        break;

      default:
        console.log(`
Available commands:
  login <username> <password>
  register <username> <email> <password>
  me <auth_token>
  logout
        `);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.detail || error.message
      });
    } else {
      console.error('Error:', error);
    }
  }
}

main(); 