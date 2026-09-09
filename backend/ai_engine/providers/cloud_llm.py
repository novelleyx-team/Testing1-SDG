import os
import json
import logging
from pydantic import BaseModel
from typing import Type, TypeVar
from google import genai
from google.genai import types

logger = logging.getLogger("CloudLLMProvider")

T = TypeVar('T', bound=BaseModel)

class CloudLLMProvider:
    def __init__(self, default_model: str = "gemini-2.5-flash"):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set. API calls will fail.")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None
        self.default_model = default_model
        
    def generate_structured(self, prompt: str, schema: Type[T], model: str = None) -> T:
        """
        Generates structured JSON adhering to the Pydantic schema using Gemini.
        """
        target_model = model or self.default_model
        
        if not self.client:
            raise RuntimeError("Cloud LLM Provider cannot execute because GEMINI_API_KEY is missing in the environment.")
            
        logger.info(f"Generating structured response using {target_model}")
        
        try:
            response = self.client.models.generate_content(
                model=target_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=schema,
                    temperature=0.1
                ),
            )
            
            # The response text should be a valid JSON string matching the schema
            json_str = response.text.strip()
            # If the model wrapped it in markdown code blocks, strip them
            if json_str.startswith("```json"):
                json_str = json_str[7:]
            if json_str.endswith("```"):
                json_str = json_str[:-3]
                
            return schema.model_validate_json(json_str)
            
        except Exception as e:
            logger.error(f"Cloud LLM Generation failed: {e}")
            raise RuntimeError(f"Cloud LLM Generation failed: {e}")

cloud_llm = CloudLLMProvider()
