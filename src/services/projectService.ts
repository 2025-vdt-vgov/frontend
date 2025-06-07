import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  PagedResponse,
  ProjectSearchParams,
  ProjectType,
  ProjectStatus,
  ProjectEmployee
} from '@/types/api';

class ProjectService {
  // Flag to enable/disable mock mode for development
  private useMockMode = false; // Set to true to use mock data during development

  // Mock data for development (kept for fallback)
  private mockProjects: Project[] = [
    {
      id: 1,
      projectCode: 'PROJ001',
      name: 'Project Alpha',
      pmEmail: 'pm@viettel.com',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      projectType: ProjectType.INTERNAL,
      projectStatus: ProjectStatus.IN_PROGRESS,
      description: 'Internal project for system development',
      createdDate: '2023-01-01',
      employees: [
        {
          id: 1,
          code: 'EMP001',
          name: 'System Administrator',
          email: 'admin@viettel.com',
          position: 'Administrator',
          level: 'Senior'
        },
        {
          id: 2,
          code: 'EMP002',
          name: 'Project Manager',
          email: 'pm@viettel.com',
          position: 'Project Manager',
          level: 'Senior'
        }
      ]
    },
    {
      id: 2,
      projectCode: 'PROJ002',
      name: 'Project Beta',
      pmEmail: 'pm@viettel.com',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      projectType: ProjectType.EXTERNAL,
      projectStatus: ProjectStatus.PLANNING,
      description: 'External client project',
      createdDate: '2023-05-15',
      employees: [
        {
          id: 3,
          code: 'EMP003',
          name: 'Employee User',
          email: 'employee@viettel.com',
          position: 'Developer',
          level: 'Junior'
        }
      ]
    }
  ];

  async getProjects(params?: ProjectSearchParams): Promise<PagedResponse<Project>> {
    if (this.useMockMode) {
      return this.mockGetProjects(params);
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.projectType) queryParams.append('projectType', params.projectType);
      if (params?.projectStatus) queryParams.append('projectStatus', params.projectStatus);
      if (params?.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom);
      if (params?.startDateTo) queryParams.append('startDateTo', params.startDateTo);
      if (params?.pmEmail) queryParams.append('pmEmail', params.pmEmail);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

      const url = `${API_CONFIG.ENDPOINTS.PROJECTS.LIST}?${queryParams.toString()}`;
      const response = await apiService.get<PagedResponse<Project>>(url);
      
      return response.data;
    } catch (error) {
      console.error('Get projects failed, falling back to mock mode:', error);
      return this.mockGetProjects(params);
    }
  }

  private async mockGetProjects(params?: ProjectSearchParams): Promise<PagedResponse<Project>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredProjects = [...this.mockProjects];

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredProjects = filteredProjects.filter(proj =>
        proj.name.toLowerCase().includes(searchLower) ||
        proj.projectCode.toLowerCase().includes(searchLower) ||
        proj.pmEmail.toLowerCase().includes(searchLower) ||
        (proj.description && proj.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply project type filter
    if (params?.projectType) {
      filteredProjects = filteredProjects.filter(proj => proj.projectType === params.projectType);
    }

    // Apply project status filter
    if (params?.projectStatus) {
      filteredProjects = filteredProjects.filter(proj => proj.projectStatus === params.projectStatus);
    }

    // Apply PM email filter
    if (params?.pmEmail) {
      filteredProjects = filteredProjects.filter(proj => proj.pmEmail === params.pmEmail);
    }

    // Apply date range filters
    if (params?.startDateFrom) {
      filteredProjects = filteredProjects.filter(proj => proj.startDate >= params.startDateFrom!);
    }
    if (params?.startDateTo) {
      filteredProjects = filteredProjects.filter(proj => proj.startDate <= params.startDateTo!);
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredProjects.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Project];
        const bValue = b[params.sortBy as keyof Project];
        
        if (params.sortDir === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Apply pagination
    const page = params?.page || 0;
    const size = params?.size || 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    return {
      content: paginatedProjects,
      page: page,
      size: size,
      totalElements: filteredProjects.length,
      totalPages: Math.ceil(filteredProjects.length / size),
      hasNext: page < Math.ceil(filteredProjects.length / size) - 1,
      hasPrevious: page > 0,
      isFirst: page === 0,
      isLast: page >= Math.ceil(filteredProjects.length / size) - 1
    };
  }

  async getProjectById(id: number): Promise<Project> {
    if (this.useMockMode) {
      return this.mockGetProjectById(id);
    }

    try {
      const response = await apiService.get<Project>(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Get project ${id} failed, falling back to mock mode:`, error);
      return this.mockGetProjectById(id);
    }
  }

  private async mockGetProjectById(id: number): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const project = this.mockProjects.find(proj => proj.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    return project;
  }

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    if (this.useMockMode) {
      return this.mockCreateProject(projectData);
    }

    try {
      const response = await apiService.post<Project>(API_CONFIG.ENDPOINTS.PROJECTS.CREATE, projectData);
      return response.data;
    } catch (error) {
      console.error('Create project failed, falling back to mock mode:', error);
      return this.mockCreateProject(projectData);
    }
  }

  private async mockCreateProject(projectData: CreateProjectRequest): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject: Project = {
      id: Math.max(...this.mockProjects.map(p => p.id)) + 1,
      projectCode: projectData.projectCode,
      name: projectData.name,
      pmEmail: projectData.pmEmail,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      projectType: projectData.projectType,
      projectStatus: ProjectStatus.PLANNING,
      description: projectData.description,
      createdDate: new Date().toISOString().split('T')[0],
      employees: []
    };
    
    this.mockProjects.push(newProject);
    return newProject;
  }

  async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
    if (this.useMockMode) {
      return this.mockUpdateProject(id, projectData);
    }

    try {
      const response = await apiService.put<Project>(API_CONFIG.ENDPOINTS.PROJECTS.UPDATE(id), projectData);
      return response.data;
    } catch (error) {
      console.error(`Update project ${id} failed, falling back to mock mode:`, error);
      return this.mockUpdateProject(id, projectData);
    }
  }

  private async mockUpdateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const projectIndex = this.mockProjects.findIndex(proj => proj.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    this.mockProjects[projectIndex] = {
      ...this.mockProjects[projectIndex],
      ...projectData
    };
    
    return this.mockProjects[projectIndex];
  }

  async deleteProject(id: number): Promise<void> {
    if (this.useMockMode) {
      return this.mockDeleteProject(id);
    }

    try {
      await apiService.delete(API_CONFIG.ENDPOINTS.PROJECTS.DELETE(id));
    } catch (error) {
      console.error(`Delete project ${id} failed, falling back to mock mode:`, error);
      return this.mockDeleteProject(id);
    }
  }

  private async mockDeleteProject(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const projectIndex = this.mockProjects.findIndex(proj => proj.id === id);
    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    this.mockProjects.splice(projectIndex, 1);
  }

  async assignEmployeeToProject(projectId: number, employeeId: number): Promise<void> {
    if (this.useMockMode) {
      return this.mockAssignEmployeeToProject(projectId, employeeId);
    }

    try {
      await apiService.post(API_CONFIG.ENDPOINTS.PROJECTS.ASSIGN_EMPLOYEE(projectId, employeeId));
    } catch (error) {
      console.error(`Assign employee ${employeeId} to project ${projectId} failed, falling back to mock mode:`, error);
      return this.mockAssignEmployeeToProject(projectId, employeeId);
    }
  }

  private async mockAssignEmployeeToProject(projectId: number, employeeId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const project = this.mockProjects.find(proj => proj.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    
    // Check if employee is already assigned
    const isAlreadyAssigned = project.employees?.some(emp => emp.id === employeeId);
    if (!isAlreadyAssigned) {
      // Mock employee data - in real implementation, this would fetch from employee service
      const mockEmployee: ProjectEmployee = {
        id: employeeId,
        code: `EMP${String(employeeId).padStart(3, '0')}`,
        name: `Employee ${employeeId}`,
        email: `employee${employeeId}@viettel.com`,
        position: 'Developer',
        level: 'Junior'
      };
      
      project.employees = project.employees || [];
      project.employees.push(mockEmployee);
    }
  }

  async removeEmployeeFromProject(projectId: number, employeeId: number): Promise<void> {
    if (this.useMockMode) {
      return this.mockRemoveEmployeeFromProject(projectId, employeeId);
    }

    try {
      await apiService.delete(API_CONFIG.ENDPOINTS.PROJECTS.REMOVE_EMPLOYEE(projectId, employeeId));
    } catch (error) {
      console.error(`Remove employee ${employeeId} from project ${projectId} failed, falling back to mock mode:`, error);
      return this.mockRemoveEmployeeFromProject(projectId, employeeId);
    }
  }

  private async mockRemoveEmployeeFromProject(projectId: number, employeeId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const project = this.mockProjects.find(proj => proj.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    
    if (project.employees) {
      project.employees = project.employees.filter(emp => emp.id !== employeeId);
    }
  }

  async searchProjects(searchTerm: string): Promise<Project[]> {
    if (this.useMockMode) {
      return this.mockSearchProjects(searchTerm);
    }

    try {
      const response = await apiService.get<Project[]>(`${API_CONFIG.ENDPOINTS.PROJECTS.SEARCH}?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Search projects failed, falling back to mock mode:', error);
      return this.mockSearchProjects(searchTerm);
    }
  }

  private async mockSearchProjects(searchTerm: string): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const searchLower = searchTerm.toLowerCase();
    return this.mockProjects.filter(proj =>
      proj.name.toLowerCase().includes(searchLower) ||
      proj.projectCode.toLowerCase().includes(searchLower) ||
      proj.pmEmail.toLowerCase().includes(searchLower)
    );
  }

  // Utility method to enable/disable mock mode
  setMockMode(enabled: boolean): void {
    this.useMockMode = enabled;
  }
}

export const projectService = new ProjectService();