// Base API Response Type (matches backend BaseResponse)
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  error?: string;
}

// Error Response Type
export interface ApiError {
  code: number;
  message: string;
  error?: string;
  errors?: string[];
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  employeeId: number;
  email: string;
  name: string;
  role: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Employee Types (matching backend EmployeeResponse)
export interface Employee {
  id: number;
  code: string;
  name: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  department?: string;
  position?: string;
  level?: string;
  phone?: string;
  address?: string;
  lastLogin?: string;
  createdDate?: string;
  isEnabled: boolean;
  isLocked: boolean;
  role?: EmployeeRole;
  projectNames?: string[];
}

export interface EmployeeRole {
  id: number;
  name: string;
  description?: string;
}

// Employee Request Types
export interface CreateEmployeeRequest {
  code: string;
  name: string;
  email: string;
  password: string;
  roleId: number;
  gender?: string;
  department?: string;
  position?: string;
  level?: string;
  phone?: string;
  address?: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  email: string;
  roleId?: number;
  gender?: string;
  dateOfBirth?: string; // Will be converted to LocalDate by backend
  department?: string;
  position?: string;
  level?: string;
  phone?: string;
  address?: string;
  isEnabled?: boolean;
  isLocked?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Project Types (matching backend ProjectResponse)
export interface Project {
  id: number;
  projectCode: string;
  name: string;
  pmEmail: string;
  startDate: string;
  endDate?: string;
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  description?: string;
  createdDate?: string;
  employees?: ProjectEmployee[];
}

export interface ProjectEmployee {
  id: number;
  code: string;
  name: string;
  email: string;
  position?: string;
  level?: string;
}

export enum ProjectType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  RESEARCH = 'RESEARCH',
  MAINTENANCE = 'MAINTENANCE'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

// Project Request Types
export interface CreateProjectRequest {
  projectCode: string;
  name: string;
  pmEmail: string;
  description?: string;
  startDate: string; // Will be converted to LocalDate by backend
  endDate?: string; // Will be converted to LocalDate by backend
  projectType: ProjectType;
  projectStatus: ProjectStatus;
  budget?: number;
}

export interface UpdateProjectRequest {
  projectCode?: string;
  name?: string;
  pmEmail?: string;
  startDate?: string;
  endDate?: string;
  projectType?: ProjectType;
  projectStatus?: ProjectStatus;
  description?: string;
  budget?: number;
}

// Dashboard Types (matching backend responses)
export interface DashboardProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  plannedProjects: number;
  cancelledProjects: number;
  onHoldProjects: number;
  projectCompletionRate: number;
  averageProjectDuration: number;
}

export interface DashboardEmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  lockedEmployees: number;
  disabledEmployees: number;
  employeesByDepartment: Record<string, number>;
  employeesByLevel: Record<string, number>;
  employeeUtilization: number;
}

export interface ProjectStatsResponse {
  totalProjects: number;
  projectsByStatus: Record<string, number>;
  projectsByType: Record<string, number>;
  averageDuration: number;
  completionRate: number;
}

// Pagination Types (matching backend PagedResponse)
export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// Search Parameters
export interface EmployeeSearchParams extends PaginationParams {
  name?: string;
  email?: string;
  department?: string;
  level?: string;
  role?: string;
  projectId?: number;
}

export interface ProjectSearchParams extends PaginationParams {
  projectType?: ProjectType;
  projectStatus?: ProjectStatus;
  startDateFrom?: string;
  startDateTo?: string;
  pmEmail?: string;
}