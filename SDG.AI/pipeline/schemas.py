from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

# =====================================================================
# STAGE 1: INPUT
# =====================================================================
class StudentInput(BaseModel):
    """Raw input provided by the student"""
    project_name: Optional[str] = None
    student_name: Optional[str] = None
    institution: Optional[str] = None
    project_description: Optional[str] = None
    activities: Optional[str] = None
    location: Optional[str] = None
    duration: Optional[str] = None
    participants: Optional[str] = None
    beneficiaries: Optional[str] = None
    resources_used: Optional[str] = None
    measurable_results: Optional[str] = None
    evidence: Optional[str] = None
    challenges: Optional[str] = None
    future_plans: Optional[str] = None

# =====================================================================
# STAGE 2: CLEANED & NORMALIZED DATA
# =====================================================================
class NormalizedData(StudentInput):
    """Data that has been formatting-corrected without changing semantic meaning"""
    pass

# =====================================================================
# STAGE 4: FACT EXTRACTION
# =====================================================================
class ExtractedFact(BaseModel):
    category: Literal["STUDENT_FACT", "CALCULATED_FACT", "VERIFIED_EXTERNAL_FACT", "AI_INTERPRETATION", "DATA_GAP"]
    fact: str
    source: str
    confidence: Literal["HIGH", "MEDIUM", "LOW"]
    is_approximate: bool = False

class FactExtractionResult(BaseModel):
    facts: List[ExtractedFact] = Field(default_factory=list)

# =====================================================================
# STAGE 5: DATA GAP DETECTION
# =====================================================================
class DataGap(BaseModel):
    field_name: str
    missing_information: str
    impact_on_analysis: Literal["HIGH", "MEDIUM", "LOW"]

class DataGapResult(BaseModel):
    gaps: List[DataGap] = Field(default_factory=list)
    completeness_score: float = 0.0

# =====================================================================
# STAGE 7: SDG RELEVANCE & SCORING
# =====================================================================
class SDGScoreDetails(BaseModel):
    activity_alignment: float # 0-30
    objective_alignment: float # 0-25
    evidence_strength: float # 0-20
    outcome_alignment: float # 0-15
    target_alignment: float # 0-10
    total_score: float # 0-100

class SDGRelevance(BaseModel):
    sdg_number: int
    sdg_name: str
    relevance_category: Literal["DIRECT", "STRONG", "POSSIBLE", "WEAK", "NOT_RELEVANT"]
    score_details: SDGScoreDetails
    reasoning: str
    evidence_used: List[str]
    confidence: Literal["HIGH", "MEDIUM", "LOW", "INSUFFICIENT_DATA"]
    relevant_targets: List[str] = Field(default_factory=list)

# =====================================================================
# STAGE 10: HALLUCINATION PREVENTION
# =====================================================================
class ValidatedClaim(BaseModel):
    claim: str
    type: Literal["STUDENT_FACT", "CALCULATED_FACT", "VERIFIED_EXTERNAL_FACT", "AI_INTERPRETATION", "DATA_GAP"]
    evidence: List[str]
    source: str
    confidence: Literal["HIGH", "MEDIUM", "LOW"]
    verified: bool

# =====================================================================
# STAGE 13 & 14: RECOMMENDATIONS & IMPACT
# =====================================================================
class Recommendation(BaseModel):
    type: Literal["DATA_IMPROVEMENT", "PROJECT_IMPROVEMENT", "IMPACT_MEASUREMENT", "SDG_ALIGNMENT"]
    text: str
    based_on: str

class ImpactLevel(BaseModel):
    level: Literal["ACTIVITY", "OUTPUT", "OUTCOME", "IMPACT"]
    description: str
    evidence_available: bool

# =====================================================================
# FINAL REPORT SCHEMA
# =====================================================================
class FinalReport(BaseModel):
    project_overview: List[str]
    data_quality_assessment: str
    key_activities: List[str]
    primary_sdgs: List[SDGRelevance]
    secondary_sdgs: List[SDGRelevance]
    evidence_analysis: str
    output_analysis: List[ImpactLevel]
    outcome_analysis: List[ImpactLevel]
    potential_impact: str
    data_gaps: List[str]
    challenges: List[str]
    recommendations: List[Recommendation]
    confidence_and_limitations: str
    audit_trail: Dict[str, Any]
