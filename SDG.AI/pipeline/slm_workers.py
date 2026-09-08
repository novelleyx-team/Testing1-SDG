import json
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

# We will assume a generic AIProvider interface is available that has `generate_structured(prompt, PydanticModel)`
# For this implementation, we will define a dummy AIProvider class that could be swapped out for actual LLM/SLM logic.

class BaseAIProvider:
    def generate_structured(self, prompt: str, schema_class: type[BaseModel]) -> BaseModel:
        # In a real implementation, this would call the SLM or LLM API with structured output enforcement (e.g. JSON mode).
        # We raise NotImplementedError to enforce that it must be injected.
        raise NotImplementedError("AIProvider must be injected")

logger = logging.getLogger("SLM_Workers")

class DataCleanerWorker:
    def __init__(self, slm: BaseAIProvider):
        self.slm = slm

    def clean(self, raw_input: Dict[str, Any], schema_class: type[BaseModel]) -> BaseModel:
        """Stage 2 & 3: Cleans data and extracts it into the structured schema without changing meaning."""
        prompt = f"""
        TASK: Clean and normalize the following student submission into a structured JSON format.
        CRITICAL RULE: DO NOT change the semantic meaning. DO NOT invent missing information.
        If a field is missing, use null.
        
        Raw Input:
        {json.dumps(raw_input, indent=2)}
        """
        return self.slm.generate_structured(prompt, schema_class)


class FactExtractorWorker:
    def __init__(self, slm: BaseAIProvider):
        self.slm = slm

    def extract_facts(self, structured_data: BaseModel, fact_schema_class: type[BaseModel]) -> BaseModel:
        """Stage 4: Extract strictly verifiable facts from the input."""
        prompt = f"""
        TASK: Extract ONLY verifiable facts from the provided structured data.
        CATEGORIES ALLOWED: STUDENT_PROVIDED, CALCULATED.
        Do not convert approximate information into exact information (e.g. 'around 40' remains approximate).
        
        Structured Data:
        {structured_data.model_dump_json(indent=2)}
        """
        return self.slm.generate_structured(prompt, fact_schema_class)


class ContradictionDetectorWorker:
    def __init__(self, slm: BaseAIProvider):
        self.slm = slm

    def detect_contradictions(self, facts: List[BaseModel], output_schema: type[BaseModel]) -> BaseModel:
        """Stage 9: Detect logical contradictions among extracted facts."""
        facts_list = [f.dict() for f in facts]
        prompt = f"""
        TASK: Analyze the following list of facts and identify any logical contradictions or inconsistencies.
        If none are found, return an empty list.
        
        Facts:
        {json.dumps(facts_list, indent=2)}
        """
        return self.slm.generate_structured(prompt, output_schema)


class HallucinationGuardWorker:
    def __init__(self, slm: BaseAIProvider):
        self.slm = slm

    def validate_claims(self, generated_claims: List[str], facts: List[BaseModel], output_schema: type[BaseModel]) -> BaseModel:
        """Stage 10 & Final Validation: Ensure no claim is generated without supporting facts."""
        facts_list = [f.dict() for f in facts]
        prompt = f"""
        TASK: Analyze each generated claim against the extracted facts.
        CRITICAL RULE: If a claim is NOT directly supported by the facts, NOT mathematically calculated, NOT a verified external fact, and NOT clearly labeled as an AI interpretation, it MUST be marked as verified=false.
        
        Facts:
        {json.dumps(facts_list, indent=2)}
        
        Generated Claims:
        {json.dumps(generated_claims, indent=2)}
        """
        return self.slm.generate_structured(prompt, output_schema)

class DataGapDetectorWorker:
    def __init__(self, slm: BaseAIProvider):
        self.slm = slm
        
    def detect_gaps(self, structured_data: BaseModel, output_schema: type[BaseModel]) -> BaseModel:
        """Stage 5: Identify missing information"""
        prompt = f"""
        TASK: Identify missing information in the student's submission that is critical for SDG analysis.
        Clearly distinguish between what we know and what we do not know.
        
        Structured Data:
        {structured_data.model_dump_json(indent=2)}
        """
        return self.slm.generate_structured(prompt, output_schema)
