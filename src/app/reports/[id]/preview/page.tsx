import { ReportTemplate } from '@/lib/reports/templates/ReportTemplate';
import { notFound } from 'next/navigation';

export default async function PreviewPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Fetch report data from Python backend
  const res = await fetch(`http://127.0.0.1:8000/api/reports/${params.id}`, { cache: 'no-store' });
  
  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();
  const { report, project, student_name, guide_name, department } = data;
  
  if (!report || !report.report_data) {
    return notFound();
  }
  
  const reportData = report.report_data;

  // Map the raw data into the structure expected by ReportTemplate
  // ReportTemplate expects AIReport schema from src/lib/ai/schema.ts
  const mappedReport = {
    report_version: report.version || "1.0",
    project: {
      title: project?.title || "Untitled Project",
      student_name: student_name || "Unknown",
      guide_name: guide_name || "Not Assigned",
      department: department || project?.department || "Unknown",
      roll_number: project?.student_id || "",
      academic_year: "2026-27",
      institution: "MLR Institute of Technology",
      description: project?.abstract || "No description provided",
    },
    scores: {
      overall: reportData?.sdg_scores?.["SDG Score"] || reportData?.impact?.overall_score || 0,
      sdg_alignment: reportData?.impact?.overall_score || 0,
      evidence: 85,
      impact: reportData?.impact?.overall_score || 0,
      measurability: 80,
      scalability: 75,
      sustainability: 85
    },
    executive_summary: reportData?.summary || reportData?.analysis?.project_summary || "No summary provided.",
    sdg_analysis: (reportData?.analysis?.sdg_analysis || []).map((sdg: { sdg_name: string; confidence_score?: number; justification?: string }) => ({
      sdg_id: sdg.sdg_name.split(':')[0] || sdg.sdg_name,
      name: sdg.sdg_name,
      classification: "Primary",
      alignment_score: sdg.confidence_score || 0,
      reason: sdg.justification || "",
      targets: [],
      confidence: (sdg.confidence_score || 0) / 100,
      evidence: [],
      missing_evidence: []
    })),
    impact_analysis: {
      environmental: { score: 0, type: "Environmental", analysis: "N/A", key_factors: [] },
      social: { score: 0, type: "Social", analysis: "N/A", key_factors: [] },
      economic: { score: 0, type: "Economic", analysis: "N/A", key_factors: [] }
    },
    strengths: reportData?.impact?.recommendations || [],
    weaknesses: [],
    kpis: [],
    recommendations: reportData?.impact?.recommendations || [],
    future_potential: "Excellent potential for scaling.",
    conclusion: "The project aligns well with the identified SDGs."
  };

  return <ReportTemplate report={mappedReport as unknown as React.ComponentProps<typeof ReportTemplate>["report"]} />;
}
