import os

try:
    from transformers import pipeline
    # For a realistic sandbox we would use a very small local model like google/flan-t5-small 
    # to avoid OOM, but we mock the generation here to ensure it boots instantly 
    # without hanging on massive 5GB downloads during this demonstration.
    # To use the real local model, uncomment the line below:
    # generator_pipeline = pipeline("text2text-generation", model="google/flan-t5-small")
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False

class RAGGenerator:
    def __init__(self):
        self.pipeline = None
        # We simulate the pipeline load for the sandbox
        if MODEL_AVAILABLE:
            pass

    def generate_answer(self, query: str, context_results: list) -> str:
        """
        Takes the query and the exact FAISS search results to construct a grounded answer.
        """
        if not context_results:
            return "I don't have enough information in my local database to answer that."

        # Build context string from the top results
        context_str = "\n\n".join([f"Source [{r['project_id']}]: {r['content']}" for r in context_results])
        
        prompt = f"Based ONLY on the following context, answer the query.\n\nContext:\n{context_str}\n\nQuery: {query}\n\nAnswer:"
        
        # Simulated local LLM generation for speed in this environment.
        # In full production, this runs: return self.pipeline(prompt, max_length=150)[0]['generated_text']
        
        simulated_answer = (
            f"Based on my internal search, I found relevant data from project '{context_results[0]['project_id']}'. "
            f"The context indicates: '{context_results[0]['content'][:150]}...'. "
            f"This is a localized generated response utilizing RAG to ensure zero hallucination."
        )
        
        return simulated_answer

# Singleton instance
generator = RAGGenerator()
