import { analyzeProject, ProjectData } from "../ai/analyzer";
import { uploadReportToStorage, updateReportStatus } from "./storage";

export async function processReportGeneration(
  projectId: string, 
  reportId: string, 
  projectData: ProjectData,
  reportVersion: string = "1.0"
) {
  try {
    // 1. Update status to 'processing' (LLM Analysis)
    await updateReportStatus(reportId, 'processing');
    
    // 2. Run AI Analysis Engine
    const reportJson = await analyzeProject(projectData);
    reportJson.report_version = reportVersion;
    
    // 3. Complete Process
    // Instead of generating the PDF now, we just save the AI report data.
    // The PDF will be generated asynchronously when the user clicks "Download PDF".
    await updateReportStatus(reportId, 'completed', undefined, reportJson.scores);

    console.log(`Report generation completed for ${reportId}. Data saved.`);
  } catch (error: unknown) {
    console.error(`Report generation failed for ${reportId}:`, error);
    await updateReportStatus(reportId, 'failed');
  }
}
