import os
from google import genai
from google.genai import types
from .schemas import (
    ProjectDetails, 
    AIAnalysisResult, 
    AIImpactResult, 
    AIRecommendationResult, 
    AIReportResult
)
from .sdg_knowledge import get_sdg_metadata_context

# Initialize Gemini Client
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
try:
    client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
except Exception as e:
    print(f"Warning: Failed to initialize Gemini Client: {e}")
    client = None

def _get_llm_response(prompt: str, schema_class) -> dict:
    if not client:
        raise ValueError("Gemini API Client is not initialized.")
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema_class,
                temperature=0.1 # Low temperature for analytical consistency
            ),
        )
        return response.parsed
    except Exception as e:
        raise Exception(f"Failed to generate structured LLM response: {e}")

def analyze_and_map_sdgs(project: ProjectDetails) -> AIAnalysisResult:
    """Uses LLM to map a project to SDGs strictly based on evidence."""
    sdg_context = get_sdg_metadata_context()
    
    prompt = f"""
    You are an expert UN SDG project evaluator. Analyze the following project:
    Title: {project.title}
    Problem: {project.problem}
    Description: {project.description}
    Solution: {project.solution}
    Technologies: {', '.join(project.technologies)}
    Expected Outcomes: {project.outcomes}
    
    {sdg_context}
    
    RULES:
    1. Distinguish between Claim, Evidence, and Inference.
    2. Only assign an SDG if there is clear evidence in the project description.
    3. Classify each relevant SDG as 'primary' (direct contribution), 'secondary' (indirect), 'weak' (possible but lacks evidence), or 'non-relevant'.
    4. Never hallucinate statistics or targets. 
    5. Return missing evidence required to strengthen the claim.
    """
    
    # In a real implementation, we would also run RAG here to fetch similar past projects or exact targets.
    return _get_llm_response(prompt, AIAnalysisResult)

def generate_impact_score(project: ProjectDetails, analysis: AIAnalysisResult) -> AIImpactResult:
    """Generates an explainable impact score across multiple dimensions."""
    prompt = f"""
    You are an expert SDG impact analyst.
    Evaluate the project: "{project.title}"
    Description: {project.description}
    Outcomes: {project.outcomes}
    
    Mapped SDGs: {[sdg.sdg_name for sdg in analysis.sdg_analysis]}
    
    RULES:
    1. Evaluate Environmental, Social, and Economic dimensions independently out of 100.
    2. Evaluate Relevance, Evidence, Impact, Measurability, Scalability, and Sustainability out of 100.
    3. Calculate an overall score out of 100 based on the evidence provided. 
    4. If evidence is weak, scores must be strictly lowered.
    """
    return _get_llm_response(prompt, AIImpactResult)

def generate_recommendations(project: ProjectDetails, analysis: AIAnalysisResult) -> AIRecommendationResult:
    """Generates actionable recommendations and KPIs."""
    prompt = f"""
    You are an expert SDG mentor.
    Project: "{project.title}"
    Description: {project.description}
    Current SDG Alignment Confidence: {analysis.overall_confidence}
    
    Generate actionable recommendations to improve:
    - Project Implementation
    - Measurement (KPIs)
    - SDG Alignment
    - Evidence Collection
    
    For each KPI, list the metric name, the current value (if provided, else "Not provided"), and how to measure it.
    """
    return _get_llm_response(prompt, AIRecommendationResult)

def generate_full_report(project: ProjectDetails, analysis: AIAnalysisResult, impact: AIImpactResult, recs: AIRecommendationResult) -> AIReportResult:
    """Aggregates all analysis into a comprehensive report."""
    prompt = f"""
    You are a professional report writer. Generate an executive SDG Impact Report for the project.
    
    Project Title: {project.title}
    AI Summary: {analysis.project_summary}
    Overall Score: {impact.overall_score}
    
    Write detailed, professional sections for the report based on the above analysis. Do not invent new data.
    """
    return _get_llm_response(prompt, AIReportResult)
