export const ROUTES = {
  HOME: '/',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const;

export type RouteValues = (typeof ROUTES)[keyof typeof ROUTES];
