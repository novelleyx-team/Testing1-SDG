import os
import json
import logging
from pydantic import BaseModel, Field
from typing import List, Optional
from backend.ai_engine.providers.local_slm import local_slm

logger = logging.getLogger("SDG_AI_Analyzer")

class SDGMapping(BaseModel):
    sdg_number: int
    sdg_name: str
    classification: str # "PRIMARY", "SECONDARY", "INDIRECT", "WEAK", "NOT_SUPPORTED"
    target: str
    indicator: str
    reasoning: str
    evidence: str
    evidence_strength: str # "High", "Medium", "Low"
    confidence: float # 0.0 to 100.0

class ClaimVerification(BaseModel):
    claim: str
    source: str
    evidence: str
    verification_status: str # "verified", "supported", "partially_supported", "unverified", "insufficient_evidence", "contradicted"

class Contradiction(BaseModel):
    student_claim: str
    documented_result: str
    measured_result: str
    verification_status: str
    explanation: str

class KPI(BaseModel):
    kpi_name: str
    original_value: str
    original_unit: str
    normalized_value: float
    normalized_unit: str
    evidence: str

class GovernmentAlignment(BaseModel):
    government_body: str
    framework_name: str
    indicator: str
    alignment_strength: str
    evidence: str

class SourceRegistry(BaseModel):
    source_title: str
    organization: str
    url: str
    publication_date: str
    source_type: str
    authority_level: str
    relevant_claim: str

class ProjectExtraction(BaseModel):
    project_summary: str
    measurable_claims: List[ClaimVerification]
    keywords: List[str]
    technical_concepts: List[str]

class AnalysisResult(BaseModel):
    overall_sdg_assessment: str
    environmental_impact: str
    social_impact: str
    economic_impact: str
    overall_confidence: float
    sdgs: List[SDGMapping]
    recommendations: List[str]
    contradictions: List[Contradiction] = Field(default_factory=list)
    kpis: List[KPI] = Field(default_factory=list)
    government_alignment: List[GovernmentAlignment] = Field(default_factory=list)
    external_sources: List[SourceRegistry] = Field(default_factory=list)

SYSTEM_PROMPT = """
You are the NOVELLEYX SDG Intelligence Engine.
Your primary responsibility is to analyze student project submissions and determine their genuine relationship with the United Nations Sustainable Development Goals (UN SDGs).
You are an evidence-based SDG analysis, research, classification, validation, reasoning, and recommendation engine.

# ADVANCED ANALYSIS RULES

1. ABSOLUTE ANALYSIS PRIORITY
1. Student's actual submission -> 2. Student's supporting evidence -> 3. Project implementation/code -> 4. Official SDG framework -> 5. Government SDG frameworks (e.g. MoSPI, NITI Aayog for India) -> 6. Official government datasets -> 7. Official scientific/technical sources -> 8. Peer-reviewed research.

2. SDG KNOWLEDGE FRAMEWORK
Use 17 SDGs, targets, and indicators. For India-specific analysis, use the Government of India's National Indicator Framework (MoSPI) and NITI Aayog SDG India Index. 

3. RESEARCH FRESHNESS & AUTHORITATIVE SOURCES
When a project makes measurable claims, use Local Retrieval Grounding to verify the context using current authoritative data.

4. CONTRADICTION ENGINE
If the student claims 30% improvement, but the documented result says 18% and the code says 15%, do NOT choose one silently. Report the contradiction in the contradictions array.

5. UNIT NORMALIZATION & KPIS
Identify project-specific KPIs (e.g., energy consumed, water treated). Normalize measurements (e.g., litres -> L, kilograms -> kg, kilowatt-hours -> kWh) without altering the original value. Determine baselines if possible. 

6. ANTI-HALLUCINATION & DECISION RULE
Does the project meaningfully address the goal? YES -> investigate targets. NO -> do not force alignment. Determine if the evidence is available, if impact is demonstrated, and if confidence is sufficient. Do not pretend an SDG indicator was measured if the project does not actually measure it. NEVER convert a student claim into a verified result without evidence.

Always perform analysis as:
UNDERSTAND -> EXTRACT -> EXPAND -> RESEARCH -> VERIFY -> MAP -> MEASURE -> SCORE -> EXPLAIN -> RECOMMEND -> SYNCHRONIZE.
"""

def extract_facts(metadata: dict, document_text: str) -> dict:
    """PASS 1: Fact Extraction"""
    prompt = f"""
    PASS 1: FACT EXTRACTION
    Analyze the project and extract verifiable facts, claims, and technical keywords.
    
    --- METADATA ---
    Title: {metadata.get('title')}
    Abstract: {metadata.get('abstract')}
    
    --- EVIDENCE ---
    {document_text[:8000]}
    """
    result_obj = local_slm.generate_structured(prompt, ProjectExtraction)
    return result_obj.dict()

def reason_sdgs(extraction: dict, retrieved_knowledge: str) -> dict:
    """PASS 2: SDG Reasoning"""
    prompt = f"""
    PASS 2: SDG REASONING
    Based on the extracted facts and retrieved knowledge, map the project to SDGs.
    
    --- EXTRACTED FACTS ---
    {json.dumps(extraction, indent=2)}
    
    --- RETRIEVED KNOWLEDGE & GOVERNMENT FRAMEWORKS ---
    {retrieved_knowledge}
    
    RULES:
    {SYSTEM_PROMPT}
    """
    result_obj = local_slm.generate_structured(prompt, AnalysisResult)
    return result_obj.dict()
