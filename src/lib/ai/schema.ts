import { z } from "zod";

export const sdgAnalysisSchema = z.object({
  sdg_id: z.number().describe("The official 1-17 number of the SDG"),
  name: z.string().describe("The official name of the SDG"),
  classification: z.enum(["primary", "secondary", "potential", "not sufficiently supported"]),
  alignment_score: z.number().min(0).max(100).describe("Alignment score from 0-100"),
  confidence: z.number().min(0).max(1).describe("Confidence score from 0.0 to 1.0"),
  reason: z.string().describe("Detailed reasoning for this classification and score"),
  targets: z.array(z.string()).describe("List of relevant SDG target IDs (e.g. '1.1', '6.4')"),
  evidence: z.array(z.string()).describe("Specific evidence from the project supporting this SDG"),
  missing_evidence: z.array(z.string()).describe("Evidence that would strengthen the alignment"),
  recommended_kpis: z.array(z.string()).describe("Actionable KPIs to measure progress towards this SDG")
});

export const impactAnalysisSchema = z.object({
  environmental: z.object({
    score: z.number().min(0).max(100),
    analysis: z.string(),
    key_factors: z.array(z.string()),
    type: z.enum(["Measured", "Estimated", "Projected", "Not provided"])
  }),
  social: z.object({
    score: z.number().min(0).max(100),
    analysis: z.string(),
    key_factors: z.array(z.string()),
    type: z.enum(["Measured", "Estimated", "Projected", "Not provided"])
  }),
  economic: z.object({
    score: z.number().min(0).max(100),
    analysis: z.string(),
    key_factors: z.array(z.string()),
    type: z.enum(["Measured", "Estimated", "Projected", "Not provided"])
  })
});

export const reportScoresSchema = z.object({
  overall: z.number().min(0).max(100),
  sdg_alignment: z.number().min(0).max(100),
  evidence: z.number().min(0).max(100),
  impact: z.number().min(0).max(100),
  measurability: z.number().min(0).max(100),
  scalability: z.number().min(0).max(100),
  sustainability: z.number().min(0).max(100)
});

export const aiReportSchema = z.object({
  report_version: z.string(),
  project: z.object({
    title: z.string(),
    student_name: z.string(),
    institution: z.string(),
    description: z.string()
  }),
  executive_summary: z.string(),
  sdg_analysis: z.array(sdgAnalysisSchema),
  impact_analysis: impactAnalysisSchema,
  scores: reportScoresSchema,
  kpis: z.array(z.object({
    name: z.string(),
    description: z.string(),
    unit: z.string()
  })),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  future_potential: z.string(),
  conclusion: z.string()
});

export type AIReport = z.infer<typeof aiReportSchema>;
export type SDGAnalysis = z.infer<typeof sdgAnalysisSchema>;
export type ImpactAnalysis = z.infer<typeof impactAnalysisSchema>;
