// Base API Response Type
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// Error Response Type
export interface ApiError {
  code: number;
  message: string;
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

// User/Employee Types
export interface Employee {
  id: number;
  email: string;
  name: string;
  role: string;
  employeeCode: string;
  department?: string;
  position?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  managerId: number;
  teamMembers: number[];
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEmployees: number;
  activeEmployees: number;
  projectCompletionRate: number;
  employeeUtilization: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}