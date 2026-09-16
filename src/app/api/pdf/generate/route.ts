/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NextRequest, NextResponse } from "next/server";
import { generatePdfFromHtml } from "@/lib/reports/pdf_renderer";
import { ReportTemplate } from "@/lib/reports/templates/ReportTemplate";
import { GoogleGenAI, Type, Schema } from "@google/genai";
const { renderToStaticMarkup } = require("react-dom/server");

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
    
    // We expect the backend to return an AIReport structured object. 
    // If it returns a legacy structure, we need to map it to our AIReport schema.
    const rawReport = data.report?.report_data || data.report || {};
    
    // Attempt to map to AIReport structure if it isn't perfectly matched
    const aiReportData = {
      report_version: "1.0",
      project: {
        title: data.project?.title || 'Untitled Project',
        student_name: data.student_name || 'Student Name',
        roll_number: data.project?.roll_number || '',
        guide_name: data.project?.guide_name || '',
        department: data.project?.department || '',
        academic_year: data.project?.academic_year || '2026-2027',
        institution: data.project?.institution || 'Institution Name',
        description: data.project?.description || rawReport.summary || rawReport.analysis?.project_summary || ''
      },
      executive_summary: rawReport.executive_summary || rawReport.summary || rawReport.analysis?.project_summary || '',
      sdg_analysis: rawReport.sdg_analysis || rawReport.analysis?.sdg_analysis?.map((s: any) => ({
        sdg_id: parseInt(s.sdg_name.match(/\d+/)?.[0] || '0'),
        name: s.sdg_name,
        classification: 'primary',
        alignment_score: s.confidence_score || 85,
        confidence: (s.confidence_score || 85) / 100,
        reason: s.justification || '',
        targets: [],
        evidence: [],
        missing_evidence: [],
        recommended_kpis: []
      })) || [],
      impact_analysis: rawReport.impact_analysis || {
        environmental: { score: 85, analysis: 'Environmental impact analysis details.', key_factors: [], type: 'Estimated' },
        social: { score: 80, analysis: 'Social impact analysis details.', key_factors: [], type: 'Estimated' },
        economic: { score: 75, analysis: 'Economic impact analysis details.', key_factors: [], type: 'Estimated' }
      },
      scores: rawReport.scores || {
        overall: rawReport.sdg_scores?.["SDG Score"] || rawReport.impact?.overall_score || 85,
        sdg_alignment: 85,
        evidence: 80,
        impact: 85,
        measurability: 75,
        scalability: 80,
        sustainability: 90
      },
      kpis: rawReport.kpis || [],
      strengths: rawReport.strengths || [],
      weaknesses: rawReport.weaknesses || [],
      recommendations: rawReport.recommendations || rawReport.impact?.recommendations || [],
      future_potential: rawReport.future_potential || '',
      conclusion: rawReport.conclusion || ''
    };

    // 2. Render React Component to Static HTML String
    const htmlContent = renderToStaticMarkup(ReportTemplate({ report: aiReportData as any }));

    // 3. Generate PDF using our high-fidelity renderer
    const pdfBuffer = await generatePdfFromHtml(htmlContent);

    // 4. Return the PDF buffer directly to the user
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="NOVELLEYX_SDG_Report_${aiReportData.project.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    let aiReportData: any = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `Analyze the following student project for its alignment with the UN Sustainable Development Goals (SDGs) and its potential impact. 
Project Title: ${data.title}
Department: ${data.studentDepartment}
Abstract: ${data.abstract}

Provide a detailed, rigorous, and highly critical analysis. Be specific and identify at least one primary SDG. Rate the impact realistically.`;

        const responseSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            executive_summary: { type: Type.STRING },
            sdg_analysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sdg_id: { type: Type.INTEGER },
                  name: { type: Type.STRING },
                  classification: { type: Type.STRING },
                  alignment_score: { type: Type.INTEGER },
                  confidence: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  targets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missing_evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommended_kpis: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["sdg_id", "name", "classification", "alignment_score", "confidence", "reason", "targets", "evidence", "missing_evidence", "recommended_kpis"]
              }
            },
            impact_analysis: {
              type: Type.OBJECT,
              properties: {
                environmental: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING }, key_factors: { type: Type.ARRAY, items: { type: Type.STRING } }, type: { type: Type.STRING } },
                  required: ["score", "analysis", "key_factors", "type"]
                },
                social: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING }, key_factors: { type: Type.ARRAY, items: { type: Type.STRING } }, type: { type: Type.STRING } },
                  required: ["score", "analysis", "key_factors", "type"]
                },
                economic: {
                  type: Type.OBJECT,
                  properties: { score: { type: Type.INTEGER }, analysis: { type: Type.STRING }, key_factors: { type: Type.ARRAY, items: { type: Type.STRING } }, type: { type: Type.STRING } },
                  required: ["score", "analysis", "key_factors", "type"]
                }
              },
              required: ["environmental", "social", "economic"]
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.INTEGER },
                sdg_alignment: { type: Type.INTEGER },
                evidence: { type: Type.INTEGER },
                impact: { type: Type.INTEGER },
                measurability: { type: Type.INTEGER },
                scalability: { type: Type.INTEGER },
                sustainability: { type: Type.INTEGER }
              },
              required: ["overall", "sdg_alignment", "evidence", "impact", "measurability", "scalability", "sustainability"]
            },
            kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            future_potential: { type: Type.STRING },
            conclusion: { type: Type.STRING }
          },
          required: ["executive_summary", "sdg_analysis", "impact_analysis", "scores", "kpis", "strengths", "weaknesses", "recommendations", "future_potential", "conclusion"]
        };

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        });
        
        const generatedData = JSON.parse(response.text || "{}");
        aiReportData = {
          report_version: "1.0",
          project: {
            title: data.title || 'Untitled Project',
            student_name: data.studentName || 'Student Name',
            roll_number: data.studentId || '',
            guide_name: data.guideName || '',
            department: data.studentDepartment || '',
            academic_year: '2026-2027',
            institution: 'Institution Name',
            description: data.abstract || ''
          },
          ...generatedData
        };
      } catch (aiError) {
        console.error("Gemini AI Analysis Error:", aiError);
        // Fallback below
      }
    }

    if (!aiReportData) {
      throw new Error("Gemini AI Analysis Failed. Please ensure your GEMINI_API_KEY is properly configured in .env.local and that your quota is valid. Fake/mocked data generation has been disabled per request.");
    }

    // 2. Render React Component to Static HTML String
    const htmlContent = renderToStaticMarkup(ReportTemplate({ report: aiReportData as any }));

    // 3. Generate PDF using our high-fidelity renderer
    const pdfBuffer = await generatePdfFromHtml(htmlContent);

    // 4. Return the PDF buffer directly to the user
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="NOVELLEYX_SDG_Report_${aiReportData.project.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });

  } catch (error) {
    console.error("PDF Generation Error (POST):", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report" },
      { status: 500 }
    );
  }
}
