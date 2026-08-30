import { analyzeProject, ProjectData } from "../ai/analyzer";
import { ReportTemplate } from "./templates/ReportTemplate";
import { generatePdfFromHtml } from "./pdf_renderer";
import { uploadReportToStorage, updateReportStatus } from "./storage";
import { renderToStaticMarkup } from "react-dom/server";
import React from 'react';

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
    
    // 3. Update status to 'generating_pdf'
    await updateReportStatus(reportId, 'generating_pdf', undefined, reportJson.scores);

    // 4. Render React Template to HTML
    const htmlString = renderToStaticMarkup(React.createElement(ReportTemplate, { report: reportJson }));

    // 5. Generate PDF
    const pdfBuffer = await generatePdfFromHtml(htmlString);

    // 6. Upload PDF to Storage
    const pdfUrl = await uploadReportToStorage(projectId, reportId, pdfBuffer);

    // 7. Complete Process
    await updateReportStatus(reportId, 'completed', pdfUrl);

    console.log(`Report generation completed for ${reportId}. URL: ${pdfUrl}`);
  } catch (error: any) {
    console.error(`Report generation failed for ${reportId}:`, error);
    await updateReportStatus(reportId, 'failed');
  }
}
