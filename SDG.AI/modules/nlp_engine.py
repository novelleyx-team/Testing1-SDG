# Load spaCy model gracefully
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        nlp = None
except Exception:
    nlp = None

def extract_knowledge(text: str):
    """
    Knowledge Extraction (Module 3): Extract entities, keywords, etc.
    """
    if not nlp:
        return {"entities": [], "keywords": []}
        
    doc = nlp(text[:100000]) # Process up to 100k chars to save memory
    
    entities = []
    for ent in doc.ents:
        if ent.label_ in ['ORG', 'PERSON', 'GPE', 'LOC', 'PRODUCT', 'EVENT']:
            entities.append({
                "text": ent.text,
                "label": ent.label_
            })
            
    # Simple keyword extraction based on noun chunks
    keywords = list(set([chunk.text.lower() for chunk in doc.noun_chunks if len(chunk.text.split()) < 4]))
    
    # Deduplicate entities
    unique_entities = {v['text']: v for v in entities}.values()
    
    return {
        "entities": list(unique_entities),
        "keywords": keywords[:20] # Top 20
    }
