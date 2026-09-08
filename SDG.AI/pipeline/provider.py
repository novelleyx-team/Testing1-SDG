import json
import logging
from pydantic import BaseModel
from typing import TypeVar, Type, Any

from backend.ai_engine.providers.local_slm import local_slm
# Assuming there is a stronger LLM available
# from backend.ai_engine.providers.openai_llm import openai_llm 

from .slm_workers import BaseAIProvider
from .schema_validator import AIResponseValidator
from Superbase_db import database as db

T = TypeVar('T', bound=BaseModel)
logger = logging.getLogger("IntelligentRouter")

class IntelligentRouter(BaseAIProvider):
    """
    Intelligent Model Routing.
    Routes low-complexity tasks to an affordable SLM.
    Routes high-complexity tasks to an expensive Main LLM.
    Logs token usage and cost for Observability.
    """
    
    def __init__(self, analysis_id: str = "UNKNOWN"):
        self.analysis_id = analysis_id
    
    def _estimate_cost(self, provider: str, tokens: int) -> float:
        if provider == "SLM":
            return tokens * 0.0001
        return tokens * 0.002

    def _log_cost(self, model_name: str, model_provider: str, complexity: str, input_tokens: int, output_tokens: int):
        cost = self._estimate_cost(model_provider, input_tokens + output_tokens)
        conn = db.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO ai_cost_logs (analysis_id, model_name, model_provider, task_complexity, input_tokens, output_tokens, estimated_cost)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (self.analysis_id, model_name, model_provider, complexity, input_tokens, output_tokens, cost))
        conn.commit()

    def generate_structured(self, prompt: str, schema_class: Type[T]) -> T:
        schema_name = schema_class.__name__
        logger.info(f"Routing request for schema: {schema_name}")
        
        # 1. Complexity Assessment
        low_complexity_tasks = [
            "CleanedStudentInput", 
            "ExtractedFacts", 
            "DataGaps", 
            "ContradictionReport", 
            "HallucinationCheck"
        ]
        
        complexity = "LOW" if schema_name in low_complexity_tasks else "HIGH"
        
        # 2. Model Selection
        if complexity == "LOW":
            provider_name = "SLM"
            model_name = "local_llama_3_8b"
            # generator_func = lambda: local_slm.generate_raw(prompt) 
            # (Assuming local_slm has a raw text generation method, we mock it here)
            generator_func = lambda: local_slm.generate_structured(prompt, schema_class).model_dump_json()
        else:
            provider_name = "MAIN_LLM"
            model_name = "gpt-4o-mini"
            # In production, this points to the expensive model
            # generator_func = lambda: openai_llm.generate_raw(prompt)
            generator_func = lambda: local_slm.generate_structured(prompt, schema_class).model_dump_json()
            
        # 3. Execution with Strict Validation and Recovery
        logger.info(f"Task Complexity: {complexity}. Routing to {provider_name} ({model_name}).")
        
        try:
            # We use the validator to enforce schema adherence and retries
            result = AIResponseValidator.execute_with_retries(generator_func, schema_class, max_retries=3)
            
            # 4. Observability and Cost Tracking
            # Mock token counting
            in_tokens = len(prompt.split())
            out_tokens = len(result.model_dump_json().split())
            self._log_cost(model_name, provider_name, complexity, in_tokens, out_tokens)
            
            return result
            
        except Exception as e:
            logger.error(f"IntelligentRouter failed to secure a valid response for {schema_name}: {e}")
            raise Exception(f"AI Generation Failed for {schema_name}: {e}")
