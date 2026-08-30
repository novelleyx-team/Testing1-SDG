import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { aiReportSchema, AIReport } from "./schema";
import { getAllSdgsContext } from "../knowledge/sdg_database";

export interface ProjectData {
  title: string;
  studentName: string;
  institution: string;
  description: string;
  problemStatement?: string;
  objectives?: string;
  solution?: string;
  technologies?: string;
  targetUsers?: string;
  location?: string;
  expectedOutcomes?: string;
  environmentalImpact?: string;
  socialImpact?: string;
  economicImpact?: string;
  metrics?: string;
}

export async function analyzeProject(projectData: ProjectData): Promise<AIReport> {
  const sdgContext = getAllSdgsContext();
  
  const prompt = `
You are a senior AI/ML engineer, backend architect, document-generation engineer, and SDG domain expert.
Your task is to analyze the following student project and generate a comprehensive SDG impact report.

Use the provided SDG knowledge base to map the project's impact to specific SDGs and their targets. 
Evaluate the environmental, social, and economic impact.
Do not invent measurements or evidence. Be extremely critical and rigorous in your evaluation.

### SDG Knowledge Base
${sdgContext}

### Student Project Details
Title: ${projectData.title}
Student Name: ${projectData.studentName}
Institution: ${projectData.institution}
Description: ${projectData.description}
Problem Statement: ${projectData.problemStatement || 'N/A'}
Objectives: ${projectData.objectives || 'N/A'}
Proposed Solution: ${projectData.solution || 'N/A'}
Technologies: ${projectData.technologies || 'N/A'}
Target Users: ${projectData.targetUsers || 'N/A'}
Location Context: ${projectData.location || 'N/A'}
Expected Outcomes: ${projectData.expectedOutcomes || 'N/A'}
Environmental Impact Details: ${projectData.environmentalImpact || 'N/A'}
Social Impact Details: ${projectData.socialImpact || 'N/A'}
Economic Impact Details: ${projectData.economicImpact || 'N/A'}
Metrics/KPIs provided: ${projectData.metrics || 'N/A'}

Provide a structured, rigorous SDG analysis report adhering strictly to the JSON schema.
`;

  const { object } = await generateObject({
    model: openai("gpt-4o-2024-08-06"),
    schema: aiReportSchema,
    prompt: prompt,
    temperature: 0.2, // Low temperature for more analytical and deterministic output
  });

  return object;
}
