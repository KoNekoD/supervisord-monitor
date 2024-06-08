export const ROUTES = {
  HOME: '/',
  SETTINGS: '/settings',
} as const;

export type RouteValues = (typeof ROUTES)[keyof typeof ROUTES];
