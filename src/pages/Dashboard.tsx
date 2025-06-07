import React, { useState, useEffect } from 'react';
import DashboardStats from '../components/DashboardStats';
import ProjectChart from '../components/ProjectChart';
import { projectService, employeeService } from '@/services';
import { Project, Employee, ProjectStatus } from '@/types/api';

const Dashboard = () => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch recent projects and active employees
        const [projectsResponse, employeesResponse] = await Promise.all([
          projectService.getProjects({ page: 0, size: 4, sortBy: 'createdDate', sortDir: 'desc' }),
          employeeService.getEmployees({ page: 0, size: 4, search: '' })
        ]);
        
        setRecentProjects(projectsResponse.content);
        setActiveEmployees(employeesResponse.content);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.IN_PROGRESS: return 'Đang thực hiện';
      case ProjectStatus.COMPLETED: return 'Hoàn thành';
      case ProjectStatus.PLANNING: return 'Kế hoạch';
      case ProjectStatus.ON_HOLD: return 'Tạm dừng';
      case ProjectStatus.CANCELLED: return 'Hủy bỏ';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ProjectStatus.PLANNING: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ProjectStatus.ON_HOLD: return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateProgress = (project: Project) => {
    // Simple progress calculation based on status
    switch (project.projectStatus) {
      case ProjectStatus.COMPLETED: return 100;
      case ProjectStatus.IN_PROGRESS: return Math.floor(Math.random() * 40) + 40; // 40-80%
      case ProjectStatus.PLANNING: return Math.floor(Math.random() * 20) + 5; // 5-25%
      case ProjectStatus.ON_HOLD: return Math.floor(Math.random() * 30) + 20; // 20-50%
      case ProjectStatus.CANCELLED: return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <DashboardStats />

      <ProjectChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg shadow border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-card-foreground mb-4">Dự án gần đây</h3>
            <div className="flow-root">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="animate-pulse py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-2 bg-gray-300 rounded w-full"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
                <ul className="-my-5 divide-y divide-border">
                  {recentProjects.map((project, index) => {
                    const progress = calculateProgress(project);
                    return (
                      <li key={project.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.pmEmail}</p>
                            <div className="mt-2">
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {progress}%
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.projectStatus)}`}>
                            {getStatusText(project.projectStatus)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-card-foreground mb-4">Nhân sự hoạt động</h3>
            <div className="space-y-4">
              {loading ? (
                [...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                ))
              ) : error ? (
                <div className="text-center py-4 text-red-600">Failed to load employees</div>
              ) : (
                activeEmployees.map((employee, index) => (
                  <div key={employee.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">
                          {employee.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.position || 'N/A'}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      index % 3 === 0 ? 'bg-green-400' :
                      index % 3 === 1 ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
