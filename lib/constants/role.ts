export const ROLE = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

// 관리자 화면 접근 가능한 role들
export const ADMIN_ACCESS_ROLES: Role[] = [ROLE.ADMIN, ROLE.MANAGER];

export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return ADMIN_ACCESS_ROLES.includes(role.toLowerCase().trim() as Role);
}