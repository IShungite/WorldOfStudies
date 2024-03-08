export const role = {
  ADMIN: 'admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const
export type Role = (typeof role)[keyof typeof role]
