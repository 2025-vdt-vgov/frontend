import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/api';

class AuthService {
  // Flag to enable/disable mock mode for development
  private useMockMode = false; // Mock mode disabled - using real API

  // Mock users for development (kept for fallback)
  private mockUsers = [
    {
      email: 'admin@viettel.com',
      password: 'admin123',
      response: {
        accessToken: 'mock_admin_token',
        refreshToken: 'mock_admin_refresh',
        tokenType: 'Bearer',
        employeeId: 1,
        email: 'admin@viettel.com',
        name: 'System Administrator',
        role: 'ADMIN'
      }
    },
    {
      email: 'pm@viettel.com',
      password: 'admin123',
      response: {
        accessToken: 'mock_pm_token',
        refreshToken: 'mock_pm_refresh',
        tokenType: 'Bearer',
        employeeId: 2,
        email: 'pm@viettel.com',
        name: 'Project Manager',
        role: 'PROJECT_MANAGER'
      }
    },
    {
      email: 'employee@viettel.com',
      password: 'admin123',
      response: {
        accessToken: 'mock_employee_token',
        refreshToken: 'mock_employee_refresh',
        tokenType: 'Bearer',
        employeeId: 3,
        email: 'employee@viettel.com',
        name: 'Employee User',
        role: 'EMPLOYEE'
      }
    }
  ];

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (this.useMockMode) {
      return this.mockLogin(credentials);
    }

    try {
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
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  private async mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
    const mockUser = this.mockUsers.find(
      user => user.email === credentials.email && user.password === credentials.password
    );

    if (!mockUser) {
      throw {
        code: 401,
        message: 'Email hoặc mật khẩu không đúng'
      };
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = mockUser.response;

    // Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      id: response.employeeId.toString(),
      email: response.email,
      fullName: response.name,
      role: this.mapBackendRoleToFrontend(response.role),
    }));

    return response;
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (this.useMockMode) {
      return this.mockRefreshToken(refreshToken);
    }

    try {
      const response = await apiService.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken } as RefreshTokenRequest
      );

      if (response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        // Update user info if provided
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            // Update any user info from refresh response if needed
          }));
        }
      }

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  private async mockRefreshToken(refreshToken: string): Promise<LoginResponse> {
    const mockUser = this.mockUsers.find(user =>
      user.response.refreshToken === refreshToken
    );

    if (!mockUser) {
      throw new Error('Invalid refresh token');
    }

    const response = mockUser.response;
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  }

  async logout(): Promise<void> {
    try {
      if (!this.useMockMode) {
        await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async logoutAll(email: string): Promise<void> {
    try {
      if (!this.useMockMode) {
        await apiService.post(`${API_CONFIG.ENDPOINTS.AUTH.LOGOUT_ALL}?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error('Logout all error:', error);
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

  getCurrentUser(): { id: string; email: string; fullName: string; role: 'admin' | 'pm' | 'employee' } | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  private mapBackendRoleToFrontend(backendRole: string): 'admin' | 'pm' | 'employee' {
    switch (backendRole.toUpperCase()) {
      case 'ADMIN':
        return 'admin';
      case 'PROJECT_MANAGER':
        return 'pm';
      case 'EMPLOYEE':
        return 'employee';
      default:
        return 'employee';
    }
  }
}

export const authService = new AuthService();