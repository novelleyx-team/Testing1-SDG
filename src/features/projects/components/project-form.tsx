"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, ChevronRight, ChevronLeft, Save } from "lucide-react"
import { useProjectsStore } from "@/store/projects-store"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"

type ProjectFormData = {
  title: string
  abstract: string
  techStack: string
}

const steps = [
  { id: 'step1', title: 'Basic Info', description: 'Name and scope of the project' },
  { id: 'step2', title: 'Abstract', description: 'Detailed project description' },
  { id: 'step3', title: 'Technology', description: 'Tech stack and tools' }
]

export function ProjectForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<ProjectFormData>({
    mode: 'onTouched'
  })
  const { user } = useAuthStore()
  const addProject = useProjectsStore(state => state.addProject)
  const router = useRouter()

  const onSubmit = (data: ProjectFormData) => {
    if (!user) return

    addProject({
      studentId: user.id,
      studentName: user.name,
      studentDepartment: user.department || 'General',
      title: data.title,
      abstract: data.abstract,
      techStack: data.techStack
    })
    
    // Redirect back to projects list
    router.push('/student/projects')
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProjectFormData)[] = []
    if (currentStep === 0) fieldsToValidate = ['title']
    else if (currentStep === 1) fieldsToValidate = ['abstract']
    
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setCurrentStep(s => Math.min(steps.length - 1, s + 1))
    }
  }
  
  const prevStep = () => setCurrentStep(s => Math.max(0, s - 1))

  return (
    <Card className="rounded-[12px] shadow-sm border-neutral-200/60 bg-white max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 pb-8 pt-8">
        <CardTitle className="text-2xl font-semibold tracking-tight text-neutral-900">Submit New Project</CardTitle>
        <CardDescription className="text-neutral-500 mt-1">Provide the details of your SDG-focused project below.</CardDescription>
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mt-10 relative px-4">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-100 -z-10" />
          <div 
            className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-900 transition-all duration-0 ease-in-out -z-10" 
            style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 2rem)` }} 
          />
          
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            
            return (
              <div key={step.id} className="flex flex-col items-center bg-transparent">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-[2px] transition-all duration-0
                  ${isCompleted ? 'bg-neutral-900 border-neutral-900 text-white scale-110 shadow-sm' : 
                    isCurrent ? 'bg-white border-neutral-900 text-neutral-900 scale-110 shadow-sm' : 
                    'bg-white border-neutral-200 text-neutral-400'}`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-[11px] uppercase tracking-wider font-semibold mt-3 absolute -bottom-7 transition-colors duration-0
                  ${isCurrent ? 'text-neutral-900' : isCompleted ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="pt-12 pb-8 min-h-[300px] px-8">
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-0 fill-mode-both">
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-sm font-semibold text-neutral-700">Project Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Solar Powered Smart Irrigation System" 
                  className="rounded-[8px] shadow-sm h-11 border-neutral-200/80 focus-visible:ring-neutral-900 transition-shadow"
                  {...register("title", { required: "Project title is required" })}
                />
                {errors.title && <span className="text-[13px] font-medium text-red-500">{errors.title.message}</span>}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-0 fill-mode-both">
              <div className="space-y-2.5">
                <Label htmlFor="abstract" className="text-sm font-semibold text-neutral-700">Project Abstract</Label>
                <Textarea 
                  id="abstract" 
                  placeholder="Provide a comprehensive summary of your project's goals, methodology, and expected outcomes..." 
                  className="rounded-[8px] shadow-sm min-h-[180px] resize-none border-neutral-200/80 focus-visible:ring-neutral-900 transition-shadow text-base/relaxed p-4"
                  {...register("abstract", { required: "Abstract is required", minLength: { value: 50, message: "Abstract must be at least 50 characters" } })}
                />
                {errors.abstract && <span className="text-[13px] font-medium text-red-500">{errors.abstract.message}</span>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-0 fill-mode-both">
              <div className="space-y-2.5">
                <Label htmlFor="techStack" className="text-sm font-semibold text-neutral-700">Technology Stack</Label>
                <Input 
                  id="techStack" 
                  placeholder="e.g., React, Node.js, Python, Arduino" 
                  className="rounded-[8px] shadow-sm h-11 border-neutral-200/80 focus-visible:ring-neutral-900 transition-shadow"
                  {...register("techStack", { required: "Tech stack is required" })}
                />
                <p className="text-[13px] text-neutral-500 mt-1.5 font-medium">Separate technologies with commas.</p>
                {errors.techStack && <span className="text-[13px] font-medium text-red-500">{errors.techStack.message}</span>}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-neutral-100 pt-6 pb-6 px-8 bg-neutral-50/30">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-[8px] shadow-sm font-medium h-10 px-5 transition-colors hover:bg-neutral-100"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5 opacity-70" />
            Back
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="rounded-[8px] shadow-sm h-10 px-6 font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-1.5 opacity-70" />
            </Button>
          ) : (
            <Button 
              type="submit"
              className="rounded-[8px] shadow-sm h-10 px-6 font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4 mr-2 opacity-70" />
              Submit Project
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
