import { apiService } from './api';
import { API_CONFIG } from '@/config/api';
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  PagedResponse,
  EmployeeSearchParams,
  EmployeeRole,
  ChangePasswordRequest
} from '@/types/api';

class EmployeeService {
  // Flag to enable/disable mock mode for development
  private useMockMode = false; // Mock mode disabled - using real API

  // Mock data for development (kept for fallback)
  private mockEmployees: Employee[] = [
    {
      id: 1,
      code: 'EMP001',
      name: 'System Administrator',
      email: 'admin@viettel.com',
      phone: '0123456789',
      department: 'IT',
      position: 'Administrator',
      isEnabled: true,
      isLocked: false,
      role: { id: 1, name: 'ADMIN', description: 'Administrator' },
      createdDate: '2023-01-01',
      projectNames: ['Project Alpha', 'Project Beta']
    },
    {
      id: 2,
      code: 'EMP002',
      name: 'Project Manager',
      email: 'pm@viettel.com',
      phone: '0123456790',
      department: 'IT',
      position: 'Project Manager',
      isEnabled: true,
      isLocked: false,
      role: { id: 2, name: 'PROJECT_MANAGER', description: 'Project Manager' },
      createdDate: '2023-02-01',
      projectNames: ['Project Alpha']
    },
    {
      id: 3,
      code: 'EMP003',
      name: 'Employee User',
      email: 'employee@viettel.com',
      phone: '0123456791',
      department: 'Development',
      position: 'Developer',
      isEnabled: true,
      isLocked: false,
      role: { id: 3, name: 'EMPLOYEE', description: 'Employee' },
      createdDate: '2023-03-01',
      projectNames: ['Project Alpha', 'Project Beta']
    }
  ];

  async getEmployees(params?: EmployeeSearchParams): Promise<PagedResponse<Employee>> {
    if (this.useMockMode) {
      return this.mockGetEmployees(params);
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.email) queryParams.append('email', params.email);
      if (params?.department) queryParams.append('department', params.department);
      if (params?.level) queryParams.append('level', params.level);
      if (params?.role) queryParams.append('role', params.role);
      if (params?.projectId) queryParams.append('projectId', params.projectId.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortDir) queryParams.append('sortDir', params.sortDir);

      const url = `${API_CONFIG.ENDPOINTS.EMPLOYEES.LIST}?${queryParams.toString()}`;
      const response = await apiService.get<PagedResponse<Employee>>(url);
      
      return response.data;
    } catch (error) {
      console.error('Get employees failed:', error);
      throw error;
    }
  }

  private async mockGetEmployees(params?: EmployeeSearchParams): Promise<PagedResponse<Employee>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredEmployees = [...this.mockEmployees];

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        (emp.department && emp.department.toLowerCase().includes(searchLower)) ||
        (emp.position && emp.position.toLowerCase().includes(searchLower))
      );
    }

    // Apply name filter
    if (params?.name) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }

    // Apply email filter
    if (params?.email) {
      filteredEmployees = filteredEmployees.filter(emp =>
        emp.email.toLowerCase().includes(params.email!.toLowerCase())
      );
    }

    // Apply department filter
    if (params?.department) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === params.department);
    }

    // Apply level filter
    if (params?.level) {
      filteredEmployees = filteredEmployees.filter(emp => emp.level === params.level);
    }

    // Apply role filter
    if (params?.role) {
      filteredEmployees = filteredEmployees.filter(emp => emp.role?.name === params.role);
    }

    // Apply sorting
    if (params?.sortBy) {
      filteredEmployees.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Employee];
        const bValue = b[params.sortBy as keyof Employee];
        
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
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

    return {
      content: paginatedEmployees,
      page: page,
      size: size,
      totalElements: filteredEmployees.length,
      totalPages: Math.ceil(filteredEmployees.length / size),
      hasNext: page < Math.ceil(filteredEmployees.length / size) - 1,
      hasPrevious: page > 0,
      isFirst: page === 0,
      isLast: page >= Math.ceil(filteredEmployees.length / size) - 1
    };
  }

  async getEmployeeById(id: number): Promise<Employee> {
    if (this.useMockMode) {
      return this.mockGetEmployeeById(id);
    }

    try {
      const response = await apiService.get<Employee>(API_CONFIG.ENDPOINTS.EMPLOYEES.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Get employee ${id} failed:`, error);
      throw error;
    }
  }

  private async mockGetEmployeeById(id: number): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const employee = this.mockEmployees.find(emp => emp.id === id);
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }
    
    return employee;
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    if (this.useMockMode) {
      return this.mockCreateEmployee(employeeData);
    }

    try {
      const response = await apiService.post<Employee>(API_CONFIG.ENDPOINTS.EMPLOYEES.CREATE, employeeData);
      return response.data;
    } catch (error) {
      console.error('Create employee failed:', error);
      throw error;
    }
  }

  private async mockCreateEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEmployee: Employee = {
      id: Math.max(...this.mockEmployees.map(e => e.id)) + 1,
      code: `EMP${String(Math.max(...this.mockEmployees.map(e => e.id)) + 1).padStart(3, '0')}`,
      name: employeeData.name,
      email: employeeData.email,
      gender: employeeData.gender,
      dateOfBirth: employeeData.dateOfBirth,
      department: employeeData.department,
      position: employeeData.position,
      level: employeeData.level,
      phone: employeeData.phone,
      address: employeeData.address,
      isEnabled: true,
      isLocked: false,
      role: { id: employeeData.roleId, name: 'EMPLOYEE', description: 'Employee' },
      createdDate: new Date().toISOString().split('T')[0],
      projectNames: []
    };
    
    this.mockEmployees.push(newEmployee);
    return newEmployee;
  }

  async updateEmployee(id: number, employeeData: UpdateEmployeeRequest): Promise<Employee> {
    if (this.useMockMode) {
      return this.mockUpdateEmployee(id, employeeData);
    }

    try {
      const response = await apiService.put<Employee>(`${API_CONFIG.ENDPOINTS.EMPLOYEES.UPDATE}/${id}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Update employee ${id} failed:`, error);
      throw error;
    }
  }

  private async mockUpdateEmployee(id: number, employeeData: UpdateEmployeeRequest): Promise<Employee> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const employeeIndex = this.mockEmployees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
      throw new Error(`Employee with id ${id} not found`);
    }
    
    this.mockEmployees[employeeIndex] = {
      ...this.mockEmployees[employeeIndex],
      ...employeeData
    };
    
    return this.mockEmployees[employeeIndex];
  }

  async deleteEmployee(id: number): Promise<void> {
    if (this.useMockMode) {
      return this.mockDeleteEmployee(id);
    }

    try {
      await apiService.delete(`${API_CONFIG.ENDPOINTS.EMPLOYEES.DELETE}/${id}`);
    } catch (error) {
      console.error(`Delete employee ${id} failed:`, error);
      throw error;
    }
  }

  private async mockDeleteEmployee(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const employeeIndex = this.mockEmployees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
      throw new Error(`Employee with id ${id} not found`);
    }
    
    this.mockEmployees.splice(employeeIndex, 1);
  }

  async assignProjectToEmployee(employeeId: number, projectId: number): Promise<void> {
    if (this.useMockMode) {
      return this.mockAssignProjectToEmployee(employeeId, projectId);
    }

    try {
      await apiService.post(API_CONFIG.ENDPOINTS.EMPLOYEES.ASSIGN_PROJECT(employeeId, projectId));
    } catch (error) {
      console.error(`Assign project ${projectId} to employee ${employeeId} failed:`, error);
      throw error;
    }
  }

  private async mockAssignProjectToEmployee(employeeId: number, projectId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const employee = this.mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }
    
    // Add project name to projectNames array if not already present
    const projectName = `Project ${projectId}`;
    if (!employee.projectNames?.includes(projectName)) {
      employee.projectNames = employee.projectNames || [];
      employee.projectNames.push(projectName);
    }
  }

  async unassignProjectFromEmployee(employeeId: number, projectId: number): Promise<void> {
    if (this.useMockMode) {
      return this.mockUnassignProjectFromEmployee(employeeId, projectId);
    }

    try {
      await apiService.delete(API_CONFIG.ENDPOINTS.EMPLOYEES.UNASSIGN_PROJECT(employeeId, projectId));
    } catch (error) {
      console.error(`Unassign project ${projectId} from employee ${employeeId} failed:`, error);
      throw error;
    }
  }

  private async mockUnassignProjectFromEmployee(employeeId: number, projectId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const employee = this.mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }
    
    // Remove project name from projectNames array
    const projectName = `Project ${projectId}`;
    if (employee.projectNames) {
      employee.projectNames = employee.projectNames.filter(name => name !== projectName);
    }
  }

  async getEmployeeProjects(employeeId: number): Promise<string[]> {
    if (this.useMockMode) {
      return this.mockGetEmployeeProjects(employeeId);
    }

    try {
      const response = await apiService.get<string[]>(API_CONFIG.ENDPOINTS.EMPLOYEES.PROJECTS(employeeId));
      return response.data;
    } catch (error) {
      console.error(`Get employee ${employeeId} projects failed:`, error);
      throw error;
    }
  }

  private async mockGetEmployeeProjects(employeeId: number): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const employee = this.mockEmployees.find(emp => emp.id === employeeId);
    if (!employee) {
      throw new Error(`Employee with id ${employeeId} not found`);
    }
    
    return employee.projectNames || [];
  }

  async changePassword(id: number, passwordData: ChangePasswordRequest): Promise<void> {
    if (this.useMockMode) {
      return this.mockChangePassword(id, passwordData);
    }

    try {
      await apiService.post(API_CONFIG.ENDPOINTS.EMPLOYEES.CHANGE_PASSWORD(id), passwordData);
    } catch (error) {
      console.error(`Change password for employee ${id} failed:`, error);
      throw error;
    }
  }

  private async mockChangePassword(id: number, passwordData: ChangePasswordRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employee = this.mockEmployees.find(emp => emp.id === id);
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`);
    }
    
    // In a real implementation, you would validate the current password
    // For mock mode, we'll just simulate success
    console.log(`Mock: Password changed for employee ${id}`);
  }

  // Utility method to enable/disable mock mode
  setMockMode(enabled: boolean): void {
    this.useMockMode = enabled;
  }
}

export const employeeService = new EmployeeService();