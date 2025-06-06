import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (response.data) {
      // Store tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.employeeId.toString(),
        email: response.data.email,
        fullName: response.data.name,
        role: this.mapBackendRoleToFrontend(response.data.role),
      }));
    }
    
    return response.data;
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenRequest
    );

    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private mapBackendRoleToFrontend(backendRole: string): 'admin' | 'pm' | 'employee' {
    switch (backendRole.toLowerCase()) {
      case 'admin':
        return 'admin';
      case 'project_manager':
      case 'pm':
        return 'pm';
      default:
        return 'employee';
    }
  }
}

export const authService = new AuthService();