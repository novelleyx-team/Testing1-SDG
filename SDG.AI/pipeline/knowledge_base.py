import json
import logging
from typing import List, Dict, Any
from functools import lru_cache
import sys
import os

# Link to Superbase_db
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)
    
from Superbase_db import database as db

logger = logging.getLogger("KnowledgeBase")

class SDGKnowledgeBase:
    """
    Version-controlled SDG Knowledge Base.
    Retrieves strict target guidelines to prevent LLM hallucinations
    during SDG mapping.
    """
    
    @staticmethod
    def seed_data():
        """Seeds the database with foundational SDG knowledge."""
        sdgs = [
            {
                "sdg_number": 3,
                "sdg_name": "Good Health and Well-being",
                "official_description": "Ensure healthy lives and promote well-being for all at all ages.",
                "targets": json.dumps([
                    "3.1 By 2030, reduce the global maternal mortality ratio.",
                    "3.4 By 2030, reduce by one third premature mortality from non-communicable diseases.",
                    "3.8 Achieve universal health coverage, including financial risk protection."
                ]),
                "keywords": "health, mental health, disease, well-being, healthcare, fitness, workshop",
                "inclusion_criteria": "Medical interventions, mental health workshops, measurable health improvements.",
                "exclusion_criteria": "Basic hygiene unless part of a broader health initiative. Generic physical education.",
                "version": "UN_2024"
            },
            {
                "sdg_number": 13,
                "sdg_name": "Climate Action",
                "official_description": "Take urgent action to combat climate change and its impacts.",
                "targets": json.dumps([
                    "13.1 Strengthen resilience and adaptive capacity to climate-related hazards.",
                    "13.2 Integrate climate change measures into national policies.",
                    "13.3 Improve education, awareness-raising and human and institutional capacity on climate change mitigation."
                ]),
                "keywords": "climate, carbon, emissions, global warming, environment, tree plantation",
                "inclusion_criteria": "Measured carbon reduction, climate adaptation strategies, atmospheric improvements.",
                "exclusion_criteria": "Tree plantation without survival or long-term measurement data. Basic recycling (belongs to SDG 12).",
                "version": "UN_2024"
            }
        ]
        
        conn = db.get_db_connection()
        cursor = conn.cursor()
        
        for sdg in sdgs:
            cursor.execute("""
                INSERT OR REPLACE INTO sdg_knowledge_base 
                (sdg_number, sdg_name, official_description, targets, keywords, inclusion_criteria, exclusion_criteria, version)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                sdg["sdg_number"], sdg["sdg_name"], sdg["official_description"], 
                sdg["targets"], sdg["keywords"], sdg["inclusion_criteria"], 
                sdg["exclusion_criteria"], sdg["version"]
            ))
            
        conn.commit()
        logger.info("SDG Knowledge Base seeded successfully.")

    @staticmethod
    def get_relevant_sdgs(keywords: List[str]) -> List[Dict[str, Any]]:
        """Retrieves SDGs that match keywords from extracted facts."""
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Simple exact substring match for now. In production, this would use pgvector or FTS.
        cursor.execute("SELECT * FROM sdg_knowledge_base")
        all_sdgs = cursor.fetchall()
        
        relevant = []
        for sdg in all_sdgs:
            sdg_keywords = [k.strip().lower() for k in sdg["keywords"].split(",")]
            for kw in keywords:
                if kw.lower() in sdg_keywords or kw.lower() in sdg["sdg_name"].lower():
                    if sdg not in relevant:
                        relevant.append(sdg)
                        break
        
        return relevant

    @staticmethod
    @lru_cache(maxsize=1)
    def get_all_sdgs() -> List[Dict[str, Any]]:
        conn = db.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM sdg_knowledge_base")
        # Freeze the dictionaries into tuples of items to make them hashable if we were returning them directly,
        # but since we are caching the function output, caching the list of dicts is fine if we don't mutate them.
        # To be safe from mutation, we'll return a new list/dict structure if mutated, but it's read-only here.
        return cursor.fetchall()
