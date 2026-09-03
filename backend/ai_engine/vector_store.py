import os
import faiss
import pickle
import numpy as np
import logging
from sentence_transformers import SentenceTransformer

logger = logging.getLogger("SDG_VectorStore")

class LocalVectorStore:
    def __init__(self, index_path="knowledge_faiss.index", metadata_path="knowledge_meta.pkl"):
        self.index_path = os.path.join(os.path.dirname(__file__), index_path)
        self.metadata_path = os.path.join(os.path.dirname(__file__), metadata_path)
        self.dimension = 384  # Dimension for all-MiniLM-L6-v2
        
        # Load or create FAISS index
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.metadata_path, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.metadata = []
            
        # Lazy load model to save RAM
        self._model = None

    @property
    def model(self):
        if self._model is None:
            logger.info("Loading local embedding model (SentenceTransformer)...")
            self._model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')
        return self._model

    def add_documents(self, documents: list[dict]):
        """
        documents: list of dicts with 'id', 'text', 'source_type', etc.
        """
        if not documents:
            return
            
        texts = [doc['text'] for doc in documents]
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        
        # Normalize for cosine similarity if using L2 flat
        faiss.normalize_L2(embeddings)
        
        self.index.add(embeddings)
        self.metadata.extend(documents)
        
        # Save to disk
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.metadata, f)
            
        logger.info(f"Added {len(documents)} documents to local vector store.")

    def search(self, query: str, top_k: int = 5, filters: dict = None) -> list[dict]:
        """
        Search and optionally filter by metadata (e.g. {'source_type': 'official'})
        """
        if self.index.ntotal == 0:
            return []
            
        query_emb = self.model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_emb)
        
        # Fetch more to allow for metadata filtering
        search_k = top_k * 5 if filters else top_k
        distances, indices = self.index.search(query_emb, min(search_k, self.index.ntotal))
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1: continue
            
            meta = self.metadata[idx]
            
            # Apply filters
            if filters:
                match = True
                for k, v in filters.items():
                    if meta.get(k) != v:
                        match = False
                        break
                if not match: continue
                
            res = meta.copy()
            res['score'] = float(dist)
            results.append(res)
            
            if len(results) >= top_k:
                break
                
        return results

# Singleton instance
vector_store = LocalVectorStore()
