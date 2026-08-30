import os
import json
import numpy as np

# Try importing ML libraries, gracefully degrade if unavailable
try:
    from sentence_transformers import SentenceTransformer
    import faiss
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False

VECTOR_STORE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "SDG_Local_Sandbox", "sdg_ai_vectors")
os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

class VectorStore:
    def __init__(self):
        self.model = None
        self.index = None
        self.metadata = []
        self.dimension = 384  # Default for all-MiniLM-L6-v2
        
        if MODEL_AVAILABLE:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                self._load_index()
            except Exception as e:
                print(f"Failed to load sentence-transformer: {e}")
                self.model = None

    def _load_index(self):
        index_path = os.path.join(VECTOR_STORE_DIR, "faiss_index.bin")
        meta_path = os.path.join(VECTOR_STORE_DIR, "metadata.json")
        
        if os.path.exists(index_path) and os.path.exists(meta_path):
            self.index = faiss.read_index(index_path)
            with open(meta_path, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = []

    def _save_index(self):
        index_path = os.path.join(VECTOR_STORE_DIR, "faiss_index.bin")
        meta_path = os.path.join(VECTOR_STORE_DIR, "metadata.json")
        
        if self.index:
            faiss.write_index(self.index, index_path)
        with open(meta_path, 'w') as f:
            json.dump(self.metadata, f)

    def add_document(self, project_id: str, text: str, entities: list, keywords: list):
        if not self.model or not self.index:
            print("Vector store not available (missing dependencies). Skipping embedding.")
            return False
            
        # Chunk the text to avoid sequence length limits
        chunk_size = 1000
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        
        # Only take first 5 chunks to save processing time
        for i, chunk in enumerate(chunks[:5]):
            embedding = self.model.encode([chunk])[0]
            
            # Add to FAISS
            self.index.add(np.array([embedding]).astype('float32'))
            
            # Add metadata
            self.metadata.append({
                "project_id": project_id,
                "chunk_index": i,
                "content_preview": chunk[:200],
                "content_full": chunk,
                "entities": entities,
                "keywords": keywords
            })
            
        self._save_index()
        return True

    def search(self, query: str, top_k: int = 3):
        if not self.model or not self.index or self.index.ntotal == 0:
            return []
            
        # Encode the query
        query_embedding = self.model.encode([query])[0]
        
        # Search FAISS
        distances, indices = self.index.search(np.array([query_embedding]).astype('float32'), top_k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                meta = self.metadata[idx]
                results.append({
                    "score": float(distances[0][i]),
                    "project_id": meta.get("project_id"),
                    "content": meta.get("content_full", meta.get("content_preview")),
                    "entities": meta.get("entities", [])
                })
        return results

# Singleton instance
vector_store = VectorStore()
