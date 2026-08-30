import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ProjectStatus = "Pending" | "Approved" | "Rejected" | "Draft" | "Reviewed" | "Revision"

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusStyles: Record<ProjectStatus, string> = {
    Pending: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
    Approved: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    Reviewed: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    Rejected: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    Draft: "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20",
    Revision: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  }

  return (
    <Badge
      variant="outline"
      className={cn("border-transparent font-semibold shadow-none", statusStyles[status], className)}
    >
      {status}
    </Badge>
  )
}
