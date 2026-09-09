import json
import logging
from typing import List, Dict, Any
from pydantic import BaseModel

from .slm_workers import BaseAIProvider

logger = logging.getLogger("LLM_Reasoning")

class SDGRelevanceEngine:
    def __init__(self, llm: BaseAIProvider):
        self.llm = llm

    def map_sdgs(self, facts: List[BaseModel], knowledge_context: List[Dict[str, Any]], output_schema: type[BaseModel]) -> BaseModel:
        """Stage 7 & 8: Contextual Mapping and Logical Reasoning."""
        facts_list = [f.dict() for f in facts]
        prompt = f"""
        TASK: Map the project to SDGs based ONLY on the provided verifiable facts.
        CRITICAL RULES:
        1. DO NOT assign an SDG based ONLY on keywords (e.g. "Water" does not automatically mean SDG 6). Analyze the context.
        2. Differentiate between PRIMARY, SECONDARY, and POSSIBLE SDGs.
        3. Explain WHY each SDG is selected. Provide evidence from the facts.
        4. Every conclusion must have a deterministic evidence chain.
        5. ONLY map to the SDGs provided in the "SDG Knowledge Base" below. Use the inclusion/exclusion criteria to make your decision.
        
        SDG Knowledge Base (STRICT GUIDELINES):
        {json.dumps(knowledge_context, indent=2)}
        
        Verifiable Facts:
        {json.dumps(facts_list, indent=2)}
        """
        return self.llm.generate_structured(prompt, output_schema)

class ImpactAnalyzer:
    def __init__(self, llm: BaseAIProvider):
        self.llm = llm

    def analyze_impact(self, facts: List[BaseModel], output_schema: type[BaseModel]) -> BaseModel:
        """Stage 14: Distinguish between Activity, Output, Outcome, and Impact."""
        facts_list = [f.dict() for f in facts]
        prompt = f"""
        TASK: Analyze the project's impact based on the facts.
        CRITICAL RULES:
        Distinguish between:
        - ACTIVITY (What was done)
        - OUTPUT (Direct measurable result, e.g. number of trees)
        - OUTCOME (Short-term effect)
        - IMPACT (Long-term effect)
        
        DO NOT claim IMPACT when only ACTIVITY or OUTPUT is known. Label long-term effects as "Potential Impact".
        
        Verifiable Facts:
        {json.dumps(facts_list, indent=2)}
        """
        return self.llm.generate_structured(prompt, output_schema)

class RecommendationEngine:
    def __init__(self, llm: BaseAIProvider):
        self.llm = llm

    def generate_recommendations(self, facts: List[BaseModel], data_gaps: BaseModel, sdg_mapping: BaseModel, output_schema: type[BaseModel]) -> BaseModel:
        """Stage 13: Evidence-based recommendations."""
        prompt = f"""
        TASK: Generate recommendations based on the actual project, its data gaps, and its SDG relevance.
        CRITICAL RULES:
        1. DO NOT generate generic recommendations (e.g. "Increase awareness").
        2. Categorize recommendations as DATA_IMPROVEMENT, PROJECT_IMPROVEMENT, IMPACT_MEASUREMENT, or SDG_ALIGNMENT.
        
        Data Gaps:
        {data_gaps.model_dump_json(indent=2)}
        
        Verifiable Facts:
        {json.dumps([f.dict() for f in facts], indent=2)}
        
        SDG Mappings:
        {sdg_mapping.model_dump_json(indent=2)}
        """
        return self.llm.generate_structured(prompt, output_schema)
