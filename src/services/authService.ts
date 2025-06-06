import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/api';

class AuthService {
  // Mock users for development
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
    // Use mock authentication for now
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

    // TODO: Uncomment this when ready to use real backend
    /*
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
    */
  }

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Mock refresh for now
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

    // TODO: Uncomment this when ready to use real backend
    /*
    const response = await apiService.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenRequest
    );

    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response.data;
    */
  }

  async logout(): Promise<void> {
    try {
      // TODO: Uncomment this when ready to use real backend
      // await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
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