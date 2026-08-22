export enum Role {
  STUDENT = "STUDENT",
  FACULTY = "FACULTY",
  HOD = "HOD",
  DEAN = "DEAN",
  LEADERSHIP = "LEADERSHIP",
  ADMIN = "ADMIN",
}

export const ROLE_NAMES: Record<Role, string> = {
  [Role.STUDENT]: "Student",
  [Role.FACULTY]: "Faculty Advisor",
  [Role.HOD]: "Head of Department",
  [Role.DEAN]: "Dean",
  [Role.LEADERSHIP]: "Head of Department / Dean",
  [Role.ADMIN]: "Super Admin",
};

/** Roles that map to the /leadership dashboard */
export const LEADERSHIP_ROLES: Role[] = [Role.HOD, Role.DEAN, Role.LEADERSHIP];
