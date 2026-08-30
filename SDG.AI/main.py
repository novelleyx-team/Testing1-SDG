from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import json

from modules.extractor import extract_text_from_document
from modules.nlp_engine import extract_knowledge
from modules.vector_store import vector_store
from modules.generator import generator

from modules.schemas import ProjectDetails
from modules.sdg_reasoning import (
    analyze_and_map_sdgs,
    generate_impact_score,
    generate_recommendations,
    generate_full_report
)

app = FastAPI(title="SDG.AI Engine", description="Internal Knowledge Intelligence Engine for NOVELLEYX")

class DocumentProcessRequest(BaseModel):
    project_id: str
    file_path: str
    
def process_document_pipeline(project_id: str, file_path: str):
    print(f"[SDG.AI] Starting pipeline for {project_id}")
    
    # 1. Extraction
    print(f"[SDG.AI] Extracting text from {file_path}")
    text = extract_text_from_document(file_path)
    
    # 2. NLP Knowledge Extraction
    print(f"[SDG.AI] Running NLP extraction...")
    knowledge = extract_knowledge(text)
    
    # 3. Vector Embeddings
    print(f"[SDG.AI] Generating embeddings & saving to FAISS...")
    success = vector_store.add_document(
        project_id=project_id,
        text=text,
        entities=knowledge["entities"],
        keywords=knowledge["keywords"]
    )
    
    if success:
        print(f"[SDG.AI] Pipeline completed for {project_id}. Data embedded and stored.")
    else:
        print(f"[SDG.AI] Pipeline finished for {project_id} without vectors (models not loaded).")
        
    # Save a local metadata manifest for the project
    manifest_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "SDG_Local_Sandbox", "sdg_ai_manifests")
    os.makedirs(manifest_dir, exist_ok=True)
    manifest_path = os.path.join(manifest_dir, f"{project_id}_manifest.json")
    
    manifest = {
        "project_id": project_id,
        "file_path": file_path,
        "knowledge": knowledge,
        "vectorized": success
    }
    
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=4)

@app.post("/api/ai/process")
async def process_document(request: DocumentProcessRequest, background_tasks: BackgroundTasks):
    if not os.path.exists(request.file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    # Run the massive AI pipeline in the background so we don't block the frontend
    background_tasks.add_task(process_document_pipeline, request.project_id, request.file_path)
    
    return {"message": "Document accepted for SDG.AI processing.", "status": "processing"}

@app.get("/api/ai/health")
async def health_check():
    return {
        "status": "online",
        "engine": "SDG.AI",
        "vector_store_active": vector_store.model is not None
    }

class AskRequest(BaseModel):
    query: str
    top_k: int = 3

@app.post("/api/ai/ask")
async def ask_ai(request: AskRequest):
    # 1. Search local FAISS database for exact context
    print(f"[SDG.AI] Searching vector store for query: {request.query}")
    context = vector_store.search(request.query, top_k=request.top_k)
    
    # 2. Feed context to Local Generative Model
    print(f"[SDG.AI] Generating response locally via RAG...")
    answer = generator.generate_answer(request.query, context)
    
    return {
        "query": request.query,
        "answer": answer,
        "sources": [c["project_id"] for c in context]
    }

# --- NEW SDG REASONING API ENDPOINTS ---

@app.post("/api/sdg/analyze")
async def sdg_analyze(project: ProjectDetails):
    """Parses project details and returns initial summary and mapped SDGs."""
    try:
        result = analyze_and_map_sdgs(project)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sdg/score")
async def sdg_score(project: ProjectDetails):
    """Evaluates the project across multiple dimensions and returns a structured score."""
    try:
        analysis = analyze_and_map_sdgs(project)
        impact = generate_impact_score(project, analysis)
        return impact
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sdg/recommend")
async def sdg_recommend(project: ProjectDetails):
    """Generates actionable improvements and KPIs."""
    try:
        analysis = analyze_and_map_sdgs(project)
        recs = generate_recommendations(project, analysis)
        return recs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sdg/report")
async def sdg_report(project: ProjectDetails):
    """Aggregates all analyses into a comprehensive structured JSON report."""
    try:
        analysis = analyze_and_map_sdgs(project)
        impact = generate_impact_score(project, analysis)
        recs = generate_recommendations(project, analysis)
        report = generate_full_report(project, analysis, impact, recs)
        
        return {
            "analysis": analysis,
            "impact": impact,
            "recommendations": recs,
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
