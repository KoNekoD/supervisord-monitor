export const API_ENDPOINTS = {
  SUPERVISORS: () => '/supervisors',
  MANAGE_SUPERVISORS: () => `/supervisors/manage`,
  ME: () => `/users/me`,
  LOGIN: () => `/auth/login`,
  LOGOUT: () => `/auth/logout`,
} as const;
