import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Target, ArrowRight } from "lucide-react"

interface ProjectCardProps {
  title: string
  status: "draft" | "submitted" | "approved" | "rejected"
  description: string
  sdgs: string[]
  teamSize: number
  date: string
}

export function ProjectCard({ title, status, description, sdgs, teamSize, date }: ProjectCardProps) {
  const getStatusBadge = (status: ProjectCardProps['status']) => {
    switch(status) {
      case 'approved': return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 shadow-none">Approved</Badge>
      case 'rejected': return <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20 shadow-none">Rejected</Badge>
      case 'submitted': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 shadow-none">Under Review</Badge>
      default: return <Badge variant="outline" className="text-muted-foreground shadow-none">Draft</Badge>
    }
  }

  return (
    <Card className="rounded-[12px] shadow-sm hover:shadow-md transition-all duration-0 border-neutral-200/60 bg-white flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-semibold tracking-tight text-neutral-900 line-clamp-1">{title}</CardTitle>
          {getStatusBadge(status)}
        </div>
        <CardDescription className="line-clamp-2 text-sm text-neutral-500 mt-2 min-h-[40px]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {sdgs.map((sdg) => (
            <Badge key={sdg} variant="secondary" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-2.5 py-0.5 text-[11px] rounded-md transition-colors">
              <Target className="w-3 h-3 mr-1.5 opacity-70" />
              {sdg}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[13px] text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 opacity-70" />
            <span>{teamSize} Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 opacity-70" />
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        <Button variant="outline" className="w-full rounded-[8px] shadow-sm font-medium hover:bg-neutral-50 transition-colors" size="sm">
          View Details
          <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
        </Button>
      </CardFooter>
    </Card>
  )
}
