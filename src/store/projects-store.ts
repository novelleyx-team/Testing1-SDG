import { create } from 'zustand'

export type ProjectStatus = 'Pending' | 'Approved' | 'Revision' | 'Rejected'

export interface Project {
  id: string
  studentId: string
  studentName: string
  studentDepartment: string
  title: string
  abstract: string
  techStack: string
  targetSdg: string
  aiScore: string
  status: ProjectStatus
  date: string
  isSdg?: boolean
  reportUrl?: string
  radarMapUrl?: string
  summary?: string
  sdgScores?: Record<string, number>
  templateType?: string
  plagiarismScore?: number
  isPlagiarized?: boolean
  marksAssigned?: string
}

interface ProjectsState {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'date' | 'status'>) => Promise<void>
  updateProjectStatus: (id: string, status: ProjectStatus) => void
  fetchStudentProjects: (studentId: string) => Promise<void>
  getDepartmentProjects: (department: string) => Project[]
}

export const useProjectsStore = create<ProjectsState>()(
  (set, get) => ({
    projects: [],
      addProject: async (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Pending',
        }

        // Sync with MySQL database
        try {
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: newProject.id,
              studentId: newProject.studentId,
              department: newProject.studentDepartment,
              title: newProject.title,
              abstract: newProject.abstract,
              aiScore: newProject.aiScore
            })
          });
        } catch (e) {
          console.error("Failed to sync project to DB:", e);
        }

        set((state) => ({
          projects: [newProject, ...state.projects]
        }))
      },
      updateProjectStatus: (id, status) => {
        set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, status } : p)
        }))
      },
      fetchStudentProjects: async (studentId) => {
        try {
          const res = await fetch(`/api/projects/${studentId}`);
          if (res.ok) {
            const data = await res.json();
            set({ projects: data.projects });
          }
        } catch (e) {
          console.error("Failed to fetch projects from DB:", e);
        }
      },
      getDepartmentProjects: (department) => {
        return get().projects.filter(p => p.studentDepartment === department)
      }
  })
)
