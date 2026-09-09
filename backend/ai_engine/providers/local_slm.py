import os
import json
import logging
from pydantic import BaseModel
from typing import Type, TypeVar

logger = logging.getLogger("SDG_Local_SLM")

T = TypeVar('T', bound=BaseModel)

class LocalSLMProvider:
    def __init__(self):
        self.model_name = os.getenv("LOCAL_SLM_MODEL", "TinyLlama/TinyLlama-1.1B-Chat-v1.0")
        self._pipeline = None
        
    def _load_model(self):
        if self._pipeline is None:
            logger.info(f"Loading local SLM model: {self.model_name}")
            try:
                from transformers import pipeline
                import torch
                # Load with bfloat16 or float16 if possible to save RAM
                dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float32
                self._pipeline = pipeline("text-generation", model=self.model_name, torch_dtype=dtype, device_map="auto")
            except Exception as e:
                logger.error(f"Failed to load local SLM: {e}")
                self._pipeline = "MOCK" # Fallback for environments unable to run transformers
                
    def generate_structured(self, prompt: str, schema: Type[T]) -> T:
        """
        Generates structured JSON adhering to the Pydantic schema using the local SLM.
        """
        self._load_model()
        
        system_msg = f"You are an AI that ONLY outputs valid JSON matching this schema: {schema.schema_json()}"
        full_prompt = f"<|system|>\n{system_msg}</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n"
        
        if self._pipeline == "MOCK":
            logger.error("SLM is in MOCK mode due to loading failure. Failing explicitly to avoid fake data.")
            raise RuntimeError("Local SLM model could not be loaded. Aborting generation.")
            
        try:
            # Note: Tiny models struggle with strict JSON generation without grammar constraints (like llama.cpp provides).
            # In production, we would use Outlines or Guidance or llama.cpp JSON schema enforcement.
            # Here we prompt heavily and attempt to parse.
            outputs = self._pipeline(full_prompt, max_new_tokens=1024, temperature=0.1, do_sample=True)
            result_text = outputs[0]["generated_text"].split("<|assistant|>\n")[-1].strip()
            
            # Simple JSON extraction heuristic
            if "{" in result_text and "}" in result_text:
                json_str = result_text[result_text.find("{"):result_text.rfind("}")+1]
                return schema.parse_raw(json_str)
            else:
                raise ValueError("Model did not return JSON.")
                
        except Exception as e:
            logger.error(f"SLM Generation failed: {e}")
            raise RuntimeError(f"SLM Generation failed: {e}")
            


local_slm = LocalSLMProvider()
