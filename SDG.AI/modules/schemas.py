from pydantic import BaseModel, Field
from typing import List, Dict, Optional

# ---------------------------------------------------------
# Request Schemas
# ---------------------------------------------------------

class ProjectDetails(BaseModel):
    title: str = Field(..., description="The title of the project")
    problem: str = Field(default="", description="The problem statement")
    description: str = Field(default="", description="The overall description of the project")
    solution: str = Field(default="", description="The proposed solution")
    technologies: List[str] = Field(default_factory=list, description="Technologies used")
    keywords: List[str] = Field(default_factory=list, description="Relevant keywords")
    outcomes: str = Field(default="", description="Expected outcomes")

# ---------------------------------------------------------
# Nested AI Response Schemas
# ---------------------------------------------------------

class TargetMapping(BaseModel):
    target: str = Field(..., description="The specific SDG target (e.g., '12.2')")
    relevance: float = Field(..., description="Relevance score from 0.0 to 1.0")
    reason: str = Field(..., description="Explanation of why this target is relevant")

class SDGMapping(BaseModel):
    sdg_id: int = Field(..., description="SDG Number (1-17)")
    sdg_name: str = Field(..., description="Name of the SDG")
    classification: str = Field(..., description="Must be 'primary', 'secondary', 'weak', or 'non-relevant'")
    confidence: float = Field(..., description="Confidence score from 0.0 to 1.0")
    reasoning: str = Field(..., description="Explanation of why this project aligns with the SDG")
    targets: List[TargetMapping] = Field(default_factory=list)
    evidence_required: List[str] = Field(default_factory=list, description="Missing evidence to strengthen the claim")

class ImpactDimension(BaseModel):
    summary: str = Field(..., description="Summary of impact in this dimension")
    score: int = Field(..., description="Score out of 100")
    reasoning: str = Field(..., description="Why this score was given")

class ImpactScores(BaseModel):
    relevance: int = Field(..., description="Score 0-100")
    evidence: int = Field(..., description="Score 0-100")
    impact: int = Field(..., description="Score 0-100")
    measurability: int = Field(..., description="Score 0-100")
    scalability: int = Field(..., description="Score 0-100")
    sustainability: int = Field(..., description="Score 0-100")

class RecommendationCategory(BaseModel):
    category: str = Field(..., description="e.g., 'Project Improvements', 'Measurement Improvements'")
    suggestions: List[str] = Field(..., description="List of actionable recommendations")

class KPIMetric(BaseModel):
    name: str = Field(..., description="Name of the metric (e.g., 'Energy saved')")
    value: str = Field(..., description="Current value if provided, else 'Not provided'")
    recommended_measurement: str = Field(..., description="How the student should measure this")

# ---------------------------------------------------------
# Top-level AI Response Schemas (Outputs)
# ---------------------------------------------------------

class AIAnalysisResult(BaseModel):
    project_summary: str = Field(..., description="A concise AI-generated summary of the project")
    sdg_analysis: List[SDGMapping] = Field(..., description="List of mapped SDGs")
    overall_confidence: float = Field(..., description="Overall confidence in the analysis")

class AIImpactResult(BaseModel):
    environmental: ImpactDimension
    social: ImpactDimension
    economic: ImpactDimension
    detailed_scores: ImpactScores
    overall_score: int = Field(..., description="Overall impact score 0-100")

class AIRecommendationResult(BaseModel):
    recommendations: List[RecommendationCategory]
    kpis: List[KPIMetric]

class AIReportResult(BaseModel):
    executive_summary: str
    problem_statement: str
    proposed_solution: str
    sdg_mapping_summary: str
    impact_analysis: str
    current_progress: str
    improvement_recommendations: str
    future_potential: str
    conclusion: str
