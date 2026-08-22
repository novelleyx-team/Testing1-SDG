import { Role } from "./roles";

export type NavItem = {
  title: string;
  href: string;
  icon?: string;
};

export const NAVIGATION: Record<Role, NavItem[]> = {
  [Role.STUDENT]: [
    { title: "Dashboard", href: "/student", icon: "LayoutDashboard" },
    { title: "Projects", href: "/student/projects", icon: "Folder" },
    { title: "AI Analysis", href: "/student/ai-analysis", icon: "Brain" },
    { title: "Reports", href: "/student/reports", icon: "FileText" },
    { title: "Templates", href: "/student/templates", icon: "Files" },
    { title: "Achievements", href: "/student/achievements", icon: "Award" },
    { title: "Profile", href: "/student/profile", icon: "UserCircle" },
    { title: "Settings", href: "/student/settings", icon: "Settings" },
  ],
  [Role.FACULTY]: [
    { title: "Dashboard", href: "/faculty", icon: "LayoutDashboard" },
    { title: "Students", href: "/faculty/students", icon: "Users" },
    { title: "Pending Reviews", href: "/faculty/reviews", icon: "Clock" },
    { title: "All Projects", href: "/faculty/projects", icon: "Folder" },
    { title: "SDG Tracking", href: "/faculty/sdg-tracking", icon: "Globe" },
    { title: "Analytics", href: "/faculty/analytics", icon: "BarChart3" },
    { title: "AI Assistant", href: "/faculty/ai-assistant", icon: "Brain" },
    { title: "Reports", href: "/faculty/reports", icon: "FileText" },
    { title: "Settings", href: "/faculty/settings", icon: "Settings" },
  ],
  [Role.HOD]: [
    { title: "Dashboard", href: "/leadership", icon: "LayoutDashboard" },
    { title: "Departments", href: "/leadership/departments", icon: "Building2" },
    { title: "Faculty", href: "/leadership/faculty", icon: "Users" },
    { title: "Students", href: "/leadership/students", icon: "GraduationCap" },
    { title: "Projects", href: "/leadership/projects", icon: "Folder" },
    { title: "Approvals", href: "/leadership/approvals", icon: "CheckCircle" },
    { title: "SDG Tracking", href: "/leadership/sdg-tracking", icon: "Target" },
    { title: "Analytics", href: "/leadership/analytics", icon: "BarChart3" },
    { title: "Profile", href: "/leadership/profile", icon: "UserCircle" },
    { title: "Settings", href: "/leadership/settings", icon: "Settings" },
  ],
  [Role.DEAN]: [
    { title: "Dashboard", href: "/leadership", icon: "LayoutDashboard" },
    { title: "Departments", href: "/leadership/departments", icon: "Building2" },
    { title: "Faculty", href: "/leadership/faculty", icon: "Users" },
    { title: "Students", href: "/leadership/students", icon: "GraduationCap" },
    { title: "Projects", href: "/leadership/projects", icon: "Folder" },
    { title: "Approvals", href: "/leadership/approvals", icon: "CheckCircle" },
    { title: "SDG Tracking", href: "/leadership/sdg-tracking", icon: "Target" },
    { title: "Analytics", href: "/leadership/analytics", icon: "BarChart3" },
    { title: "Profile", href: "/leadership/profile", icon: "UserCircle" },
    { title: "Settings", href: "/leadership/settings", icon: "Settings" },
  ],
  [Role.LEADERSHIP]: [
    { title: "Dashboard", href: "/leadership", icon: "LayoutDashboard" },
    { title: "Departments", href: "/leadership/departments", icon: "Building2" },
    { title: "Faculty", href: "/leadership/faculty", icon: "Users" },
    { title: "Students", href: "/leadership/students", icon: "GraduationCap" },
    { title: "Projects", href: "/leadership/projects", icon: "Folder" },
    { title: "Approvals", href: "/leadership/approvals", icon: "CheckCircle" },
    { title: "SDG Tracking", href: "/leadership/sdg-tracking", icon: "Target" },
    { title: "Analytics", href: "/leadership/analytics", icon: "BarChart3" },
    { title: "Profile", href: "/leadership/profile", icon: "UserCircle" },
    { title: "Settings", href: "/leadership/settings", icon: "Settings" },
  ],
  [Role.ADMIN]: [
    { title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { title: "Institutions", href: "/admin/institutions", icon: "Building" },
    { title: "Users", href: "/admin/users", icon: "Users" },
    { title: "Projects", href: "/admin/projects", icon: "Folder" },
    { title: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { title: "AI Engine", href: "/admin/ai-engine", icon: "Brain" },
    { title: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
};
