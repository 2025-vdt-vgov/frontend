import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import {
  DashboardProjectStats,
  DashboardEmployeeStats,
  ProjectStatsResponse
} from '@/types/api';

class DashboardService {
  // Flag to enable/disable mock mode for development
  private useMockMode = false; // Set to true to use mock data during development

  // Mock data for development (kept for fallback)
  private mockProjectStats: DashboardProjectStats = {
    totalProjects: 15,
    activeProjects: 8,
    completedProjects: 5,
    plannedProjects: 2,
    cancelledProjects: 0,
    onHoldProjects: 0,
    projectCompletionRate: 75.5,
    averageProjectDuration: 180
  };

  private mockEmployeeStats: DashboardEmployeeStats = {
    totalEmployees: 25,
    activeEmployees: 23,
    lockedEmployees: 1,
    disabledEmployees: 1,
    employeesByDepartment: {
      'IT': 12,
      'Development': 8,
      'QA': 3,
      'Design': 2
    },
    employeesByLevel: {
      'Senior': 8,
      'Mid': 10,
      'Junior': 7
    },
    employeeUtilization: 85.2
  };

  private mockProjectStatsResponse: ProjectStatsResponse = {
    totalProjects: 15,
    projectsByStatus: {
      'IN_PROGRESS': 8,
      'COMPLETED': 5,
      'PLANNING': 2,
      'CANCELLED': 0,
      'ON_HOLD': 0
    },
    projectsByType: {
      'INTERNAL': 9,
      'EXTERNAL': 4,
      'RESEARCH': 1,
      'MAINTENANCE': 1
    },
    averageDuration: 180,
    completionRate: 75.5
  };

  async getProjectStats(): Promise<DashboardProjectStats> {
    if (this.useMockMode) {
      return this.mockGetProjectStats();
    }

    try {
      const response = await apiService.get<DashboardProjectStats>(API_CONFIG.ENDPOINTS.DASHBOARD.PROJECT_STATS);
      return response.data;
    } catch (error) {
      console.error('Get project stats failed, falling back to mock mode:', error);
      return this.mockGetProjectStats();
    }
  }

  private async mockGetProjectStats(): Promise<DashboardProjectStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.mockProjectStats };
  }

  async getEmployeeStats(): Promise<DashboardEmployeeStats> {
    if (this.useMockMode) {
      return this.mockGetEmployeeStats();
    }

    try {
      const response = await apiService.get<DashboardEmployeeStats>(API_CONFIG.ENDPOINTS.DASHBOARD.EMPLOYEE_STATS);
      return response.data;
    } catch (error) {
      console.error('Get employee stats failed, falling back to mock mode:', error);
      return this.mockGetEmployeeStats();
    }
  }

  private async mockGetEmployeeStats(): Promise<DashboardEmployeeStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.mockEmployeeStats };
  }

  async getProjectStatsResponse(): Promise<ProjectStatsResponse> {
    if (this.useMockMode) {
      return this.mockGetProjectStatsResponse();
    }

    try {
      const response = await apiService.get<ProjectStatsResponse>(API_CONFIG.ENDPOINTS.PROJECTS.STATS);
      return response.data;
    } catch (error) {
      console.error('Get project stats response failed, falling back to mock mode:', error);
      return this.mockGetProjectStatsResponse();
    }
  }

  private async mockGetProjectStatsResponse(): Promise<ProjectStatsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.mockProjectStatsResponse };
  }

  async getDashboardOverview(): Promise<{
    projectStats: DashboardProjectStats;
    employeeStats: DashboardEmployeeStats;
    projectStatsResponse: ProjectStatsResponse;
  }> {
    if (this.useMockMode) {
      return this.mockGetDashboardOverview();
    }

    try {
      // Fetch all dashboard data in parallel
      const [projectStats, employeeStats, projectStatsResponse] = await Promise.all([
        this.getProjectStats(),
        this.getEmployeeStats(),
        this.getProjectStatsResponse()
      ]);

      return {
        projectStats,
        employeeStats,
        projectStatsResponse
      };
    } catch (error) {
      console.error('Get dashboard overview failed, falling back to mock mode:', error);
      return this.mockGetDashboardOverview();
    }
  }

  private async mockGetDashboardOverview(): Promise<{
    projectStats: DashboardProjectStats;
    employeeStats: DashboardEmployeeStats;
    projectStatsResponse: ProjectStatsResponse;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      projectStats: { ...this.mockProjectStats },
      employeeStats: { ...this.mockEmployeeStats },
      projectStatsResponse: { ...this.mockProjectStatsResponse }
    };
  }

  async getRecentActivities(): Promise<Array<{
    id: number;
    type: 'project' | 'employee' | 'system';
    title: string;
    description: string;
    timestamp: string;
    user?: string;
  }>> {
    if (this.useMockMode) {
      return this.mockGetRecentActivities();
    }

    try {
      const response = await apiService.get<Array<{
        id: number;
        type: 'project' | 'employee' | 'system';
        title: string;
        description: string;
        timestamp: string;
        user?: string;
      }>>(API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
      return response.data;
    } catch (error) {
      console.error('Get recent activities failed, falling back to mock mode:', error);
      return this.mockGetRecentActivities();
    }
  }

  private async mockGetRecentActivities(): Promise<Array<{
    id: number;
    type: 'project' | 'employee' | 'system';
    title: string;
    description: string;
    timestamp: string;
    user?: string;
  }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const now = new Date();
    return [
      {
        id: 1,
        type: 'project',
        title: 'Project Alpha Updated',
        description: 'Project status changed to In Progress',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        user: 'pm@viettel.com'
      },
      {
        id: 2,
        type: 'employee',
        title: 'New Employee Added',
        description: 'John Doe joined the Development team',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        user: 'admin@viettel.com'
      },
      {
        id: 3,
        type: 'project',
        title: 'Project Beta Completed',
        description: 'Project Beta has been marked as completed',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        user: 'pm@viettel.com'
      },
      {
        id: 4,
        type: 'system',
        title: 'System Maintenance',
        description: 'Scheduled maintenance completed successfully',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        user: 'admin@viettel.com'
      },
      {
        id: 5,
        type: 'employee',
        title: 'Employee Role Updated',
        description: 'Jane Smith promoted to Senior Developer',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        user: 'admin@viettel.com'
      }
    ];
  }

  async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
    activeConnections: number;
    lastUpdated: string;
  }> {
    if (this.useMockMode) {
      return this.mockGetSystemHealth();
    }

    try {
      const response = await apiService.get<{
        status: 'healthy' | 'warning' | 'critical';
        uptime: number;
        memoryUsage: number;
        cpuUsage: number;
        diskUsage: number;
        activeConnections: number;
        lastUpdated: string;
      }>(API_CONFIG.ENDPOINTS.DASHBOARD.SYSTEM_HEALTH);
      return response.data;
    } catch (error) {
      console.error('Get system health failed, falling back to mock mode:', error);
      return this.mockGetSystemHealth();
    }
  }

  private async mockGetSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
    activeConnections: number;
    lastUpdated: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      status: 'healthy',
      uptime: 99.8,
      memoryUsage: 65.2,
      cpuUsage: 23.5,
      diskUsage: 45.8,
      activeConnections: 127,
      lastUpdated: new Date().toISOString()
    };
  }

  // Utility method to enable/disable mock mode
  setMockMode(enabled: boolean): void {
    this.useMockMode = enabled;
  }
}

export const dashboardService = new DashboardService();