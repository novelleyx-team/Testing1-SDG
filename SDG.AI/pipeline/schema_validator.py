import logging
import json
from typing import Type, TypeVar, Any
from pydantic import BaseModel, ValidationError

logger = logging.getLogger("SchemaValidator")

T = TypeVar('T', bound=BaseModel)

class AIResponseValidator:
    """
    Enforces strict schema validation on AI responses.
    If the response does not match the schema, it rejects it and attempts recovery.
    Never silently accepts malformed AI responses.
    """
    
    @staticmethod
    def validate_and_parse(response_text: str, schema_class: Type[T]) -> T:
        """
        Validates the raw text response against the provided Pydantic schema.
        Raises ValueError if parsing fails.
        """
        try:
            # Extract JSON if wrapped in markdown
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].strip()
                
            data = json.loads(response_text)
            
            # Pydantic validation
            validated_obj = schema_class.model_validate(data)
            return validated_obj
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error in AI response: {e}")
            raise ValueError(f"AI response is not valid JSON: {e}")
            
        except ValidationError as e:
            logger.error(f"Schema Validation Error in AI response: {e.errors()}")
            raise ValueError(f"AI response failed schema validation: {e.errors()}")

    @staticmethod
    def execute_with_retries(generation_func, schema_class: Type[T], max_retries: int = 3) -> T:
        """
        Executes an AI generation function with controlled recovery logic.
        """
        last_error = None
        for attempt in range(1, max_retries + 1):
            try:
                response_text = generation_func()
                return AIResponseValidator.validate_and_parse(response_text, schema_class)
            except ValueError as e:
                logger.warning(f"Validation attempt {attempt} failed: {e}")
                last_error = e
                # Depending on the AI provider, you might inject the error back into the prompt
                # for the retry attempt to help it correct itself.
        
        logger.error(f"Failed to generate valid response after {max_retries} attempts.")
        raise last_error
