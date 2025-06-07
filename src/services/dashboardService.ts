import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import {
  DashboardProjectStats,
  DashboardEmployeeStats,
  ProjectStatsResponse
} from '@/types/api';

class DashboardService {
  // Flag to enable/disable mock mode for development
  private useMockMode = false; // Mock mode disabled - using real API

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
    try {
      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD.PROJECT_STATS);
      const backendData = response.data;
      
      // Map backend DashboardProjectStatsResponse to frontend DashboardProjectStats
      return {
        totalProjects: backendData.totalProjects,
        activeProjects: backendData.activeProjects,
        completedProjects: backendData.completedProjects,
        plannedProjects: backendData.pendingProjects, // Backend uses 'pendingProjects'
        cancelledProjects: backendData.canceledProjects, // Backend uses 'canceledProjects'
        onHoldProjects: 0, // Backend doesn't have this, default to 0
        projectCompletionRate: backendData.completedProjects > 0 ?
          (backendData.completedProjects / backendData.totalProjects) * 100 : 0,
        averageProjectDuration: 180 // Default value, backend doesn't provide this
      };
    } catch (error) {
      console.error('Get project stats failed:', error);
      throw error;
    }
  }

  private async mockGetProjectStats(): Promise<DashboardProjectStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.mockProjectStats };
  }

  async getEmployeeStats(): Promise<DashboardEmployeeStats> {
    try {
      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD.EMPLOYEE_STATS);
      const backendData = response.data;
      
      // Map backend DashboardEmployeeStatsResponse to frontend DashboardEmployeeStats
      return {
        totalEmployees: backendData.totalEmployees,
        activeEmployees: backendData.activeEmployees,
        lockedEmployees: backendData.lockedEmployees,
        disabledEmployees: backendData.inactiveEmployees, // Backend uses 'inactiveEmployees'
        employeesByDepartment: backendData.employeesByDepartment || {},
        employeesByLevel: backendData.employeesByLevel || {},
        employeeUtilization: 85.0 // Default value, backend doesn't provide this
      };
    } catch (error) {
      console.error('Get employee stats failed:', error);
      throw error;
    }
  }

  private async mockGetEmployeeStats(): Promise<DashboardEmployeeStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.mockEmployeeStats };
  }

  async getProjectStatsResponse(): Promise<ProjectStatsResponse> {
    try {
      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD.PROJECT_STATS);
      const backendData = response.data;
      
      // Map backend DashboardProjectStatsResponse to frontend ProjectStatsResponse
      return {
        totalProjects: backendData.totalProjects,
        projectsByStatus: backendData.projectsByStatus || {},
        projectsByType: backendData.projectsByType || {},
        averageDuration: 180, // Default value, backend doesn't provide this
        completionRate: backendData.completedProjects > 0 ?
          (backendData.completedProjects / backendData.totalProjects) * 100 : 0
      };
    } catch (error) {
      console.error('Get project stats response failed:', error);
      throw error;
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
    try {
      // Use the backend overview endpoint if available, otherwise fetch individually
      try {
        const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD.OVERVIEW);
        const backendData = response.data;
        
        // Map the overview response to frontend format
        return {
          projectStats: {
            totalProjects: backendData.projectStats?.totalProjects || 0,
            activeProjects: backendData.projectStats?.activeProjects || 0,
            completedProjects: backendData.projectStats?.completedProjects || 0,
            plannedProjects: backendData.projectStats?.pendingProjects || 0,
            cancelledProjects: backendData.projectStats?.canceledProjects || 0,
            onHoldProjects: 0,
            projectCompletionRate: backendData.projectStats?.completedProjects > 0 ?
              (backendData.projectStats.completedProjects / backendData.projectStats.totalProjects) * 100 : 0,
            averageProjectDuration: 180
          },
          employeeStats: {
            totalEmployees: backendData.employeeStats?.totalEmployees || 0,
            activeEmployees: backendData.employeeStats?.activeEmployees || 0,
            lockedEmployees: backendData.employeeStats?.lockedEmployees || 0,
            disabledEmployees: backendData.employeeStats?.inactiveEmployees || 0,
            employeesByDepartment: backendData.employeeStats?.employeesByDepartment || {},
            employeesByLevel: backendData.employeeStats?.employeesByLevel || {},
            employeeUtilization: 85.0
          },
          projectStatsResponse: {
            totalProjects: backendData.projectStats?.totalProjects || 0,
            projectsByStatus: backendData.projectStats?.projectsByStatus || {},
            projectsByType: backendData.projectStats?.projectsByType || {},
            averageDuration: 180,
            completionRate: backendData.projectStats?.completedProjects > 0 ?
              (backendData.projectStats.completedProjects / backendData.projectStats.totalProjects) * 100 : 0
          }
        };
      } catch (overviewError) {
        // Fallback to individual API calls if overview endpoint doesn't exist
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
      }
    } catch (error) {
      console.error('Get dashboard overview failed:', error);
      throw error;
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
    try {
      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
      const backendData = response.data;
      
      // Map backend DashboardActivityResponse to frontend format
      return backendData.map((activity: any) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        timestamp: activity.timestamp, // Backend returns ISO string
        user: activity.user
      }));
    } catch (error) {
      console.error('Get recent activities failed:', error);
      // Return empty array if endpoint doesn't exist yet
      return [];
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
    try {
      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD.SYSTEM_HEALTH);
      const backendData = response.data;
      
      // Map backend DashboardSystemHealthResponse to frontend format
      return {
        status: backendData.status,
        uptime: backendData.uptime,
        memoryUsage: backendData.memoryUsage,
        cpuUsage: backendData.cpuUsage,
        diskUsage: backendData.diskUsage,
        activeConnections: backendData.activeConnections,
        lastUpdated: backendData.lastUpdated // Backend returns ISO string
      };
    } catch (error) {
      console.error('Get system health failed:', error);
      // Return default healthy status if endpoint doesn't exist yet
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