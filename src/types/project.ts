export type ProjectStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface TeamMember {
  name: string;
  rollNumber: string;
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  objectives: string[];
  techStack: string[];
  status: ProjectStatus;
  team: TeamMember[];
  facultyId?: string;
  departmentId: string;
  collegeId: string;
  createdAt: string;
  updatedAt: string;
  sdgMatchScore?: number;
  matchedSdgs?: string[];
}
