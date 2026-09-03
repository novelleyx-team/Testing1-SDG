import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    // 1. Fetch the report data from our python backend
    const reportRes = await fetch(`http://127.0.0.1:8000/api/reports/${projectId}`);
    
    if (!reportRes.ok) {
        return NextResponse.json({ error: "Report not found or failed to fetch" }, { status: 404 });
    }
    
    const data = await reportRes.json();
    const { report, project, student_name } = data;
    const reportData = report.report_data || {};
    
    // Create an elegant HTML template for the PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SDG Impact Report</title>
        <style>
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #10b981;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #047857;
                font-size: 32px;
                margin: 0 0 10px 0;
            }
            .header p {
                font-size: 18px;
                color: #6b7280;
                margin: 5px 0;
            }
            .section {
                margin-bottom: 30px;
                page-break-inside: avoid;
            }
            .section h2 {
                color: #065f46;
                font-size: 22px;
                border-bottom: 1px solid #d1d5db;
                padding-bottom: 8px;
                margin-bottom: 15px;
            }
            .card {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }
            .score-badge {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 18px;
            }
            .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 12px;
                color: #9ca3af;
                border-top: 1px solid #e5e7eb;
                padding-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            th, td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
            }
            th {
                background-color: #f3f4f6;
                color: #374151;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>SDG Impact Assessment Report</h1>
            <p><strong>Project:</strong> ${project?.title || 'Untitled Project'}</p>
            <p><strong>Author:</strong> ${student_name}</p>
            <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <div class="card">
                <p>${reportData?.summary || reportData?.analysis?.project_summary || 'No summary available.'}</p>
            </div>
        </div>

        <div class="section">
            <h2>Impact Score</h2>
            <div class="card" style="text-align: center;">
                <p>Overall alignment with Sustainable Development Goals</p>
                <div class="score-badge">
                    ${reportData?.sdg_scores?.["SDG Score"] || reportData?.impact?.overall_score || 0} / 100
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Detailed SDG Analysis</h2>
            <table>
                <thead>
                    <tr>
                        <th>Goal</th>
                        <th>Confidence</th>
                        <th>Relevance Justification</th>
                    </tr>
                </thead>
                <tbody>
                    ${(reportData?.analysis?.sdg_analysis || []).map((sdg: { sdg_name: string, confidence_score: number, justification: string }) => `
                        <tr>
                            <td><strong>${sdg.sdg_name}</strong></td>
                            <td>${sdg.confidence_score}%</td>
                            <td>${sdg.justification}</td>
                        </tr>
                    `).join('')}
                    ${!(reportData?.analysis?.sdg_analysis) ? `<tr><td colspan="3">No detailed analysis available.</td></tr>` : ''}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>Strategic Recommendations</h2>
            <div class="card">
                <ul>
                    ${(reportData?.impact?.recommendations || []).map((rec: string) => `<li>${rec}</li>`).join('')}
                    ${!(reportData?.impact?.recommendations) ? `<li>No recommendations available.</li>` : ''}
                </ul>
            </div>
        </div>

        <div class="footer">
            Generated by Novelleyx SDG Assessment Platform &copy; ${new Date().getFullYear()}<br>
            Official Academic Record - Do Not Alter
        </div>
    </body>
    </html>
    `;

    // 2. Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });
    
    await browser.close();

    // 3. Return the PDF buffer directly to the user
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="SDG_Report_${projectId}.pdf"`
      }
    });

  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}
