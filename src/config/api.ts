// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    EMPLOYEES: {
      LIST: '/employees',
      CREATE: '/employees',
      UPDATE: (id: number) => `/employees/${id}`,
      DELETE: (id: number) => `/employees/${id}`,
      PROFILE: '/employees/profile',
    },
    PROJECTS: {
      LIST: '/projects',
      CREATE: '/projects',
      UPDATE: (id: number) => `/projects/${id}`,
      DELETE: (id: number) => `/projects/${id}`,
    },
    DASHBOARD: {
      STATS: '/dashboard/stats',
      CHARTS: '/dashboard/charts',
    },
    REPORTS: {
      LIST: '/reports',
      GENERATE: '/reports/generate',
      DOWNLOAD: (id: number) => `/reports/${id}/download`,
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