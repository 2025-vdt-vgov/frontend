// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      LOGOUT_ALL: '/auth/logout-all',
    },
    EMPLOYEES: {
      LIST: '/employees',
      CREATE: '/employees',
      UPDATE: (id: number) => `/employees/${id}`,
      DELETE: (id: number) => `/employees/${id}`,
      PROFILE: '/employees/profile',
      BY_ID: (id: number) => `/employees/${id}`,
      SEARCH: '/employees/search',
      BY_PROJECT: (projectId: number) => `/employees/by-project/${projectId}`,
      ASSIGN_PROJECT: (employeeId: number, projectId: number) => `/employees/${employeeId}/assign-project/${projectId}`,
      UNASSIGN_PROJECT: (employeeId: number, projectId: number) => `/employees/${employeeId}/unassign-project/${projectId}`,
      PROJECTS: (employeeId: number) => `/employees/${employeeId}/projects`,
      CHANGE_PASSWORD: (id: number) => `/employees/${id}/change-password`,
      RESET_PASSWORD: (id: number) => `/employees/${id}/reset-password`,
      LOCK: (id: number) => `/employees/${id}/lock`,
      UNLOCK: (id: number) => `/employees/${id}/unlock`,
      ENABLE: (id: number) => `/employees/${id}/enable`,
      DISABLE: (id: number) => `/employees/${id}/disable`,
    },
    PROJECTS: {
      LIST: '/projects',
      CREATE: '/projects',
      UPDATE: (id: number) => `/projects/${id}`,
      DELETE: (id: number) => `/projects/${id}`,
      BY_ID: (id: number) => `/projects/${id}`,
      SEARCH: '/projects/search',
      STATS: '/projects/stats',
      ASSIGN_EMPLOYEE: (projectId: number, employeeId: number) => `/projects/${projectId}/employees/${employeeId}`,
      REMOVE_EMPLOYEE: (projectId: number, employeeId: number) => `/projects/${projectId}/employees/${employeeId}`,
    },
    DASHBOARD: {
      PROJECT_STATS: '/dashboard/projects/stats',
      EMPLOYEE_STATS: '/dashboard/employees/stats',
      OVERVIEW: '/dashboard/overview',
      RECENT_ACTIVITIES: '/dashboard/activities',
      SYSTEM_HEALTH: '/dashboard/system/health',
    },
  },
  TIMEOUT: 30000,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;