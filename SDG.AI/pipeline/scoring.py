def calculate_sdg_relevance(
    activity_alignment: float,
    objective_alignment: float,
    evidence_strength: float,
    outcome_alignment: float,
    target_alignment: float
) -> float:
    """
    Deterministically calculates the SDG relevance score.
    Weights:
    Activity Alignment: 0-30
    Objective Alignment: 0-25
    Evidence Strength: 0-20
    Outcome Alignment: 0-15
    Target Alignment: 0-10
    """
    total = sum([
        max(0.0, min(30.0, activity_alignment)),
        max(0.0, min(25.0, objective_alignment)),
        max(0.0, min(20.0, evidence_strength)),
        max(0.0, min(15.0, outcome_alignment)),
        max(0.0, min(10.0, target_alignment))
    ])
    return round(total, 2)

def categorize_relevance(score: float) -> str:
    if score >= 81: return "DIRECT"
    if score >= 61: return "STRONG"
    if score >= 41: return "POSSIBLE"
    if score >= 21: return "WEAK"
    return "NOT_RELEVANT"

def calculate_completeness(data_fields: dict) -> float:
    """
    Calculates a completeness score based on the presence of data in fields.
    """
    weights = {
        "project_description": 15,
        "objectives": 10,
        "activities": 15,
        "evidence": 20,
        "measurable_results": 15,
        "participants": 5,
        "duration": 5,
        "location": 5,
        "challenges": 5,
        "future_plans": 5
    }
    
    score = 0.0
    for field, weight in weights.items():
        val = data_fields.get(field)
        if val is not None and str(val).strip() != "" and str(val).lower() != "not_provided":
            score += weight
            
    return round(score, 2)

def calculate_overall_confidence(
    completeness_score: float, 
    evidence_quality_score: float, # 0-100
    model_agreement_score: float,  # 0-100
    sdg_alignment_clarity: float   # 0-100
) -> str:
    """
    Determines overall confidence of the analysis.
    """
    avg_score = (completeness_score + evidence_quality_score + model_agreement_score + sdg_alignment_clarity) / 4.0
    
    if completeness_score < 20 or evidence_quality_score < 20:
        return "INSUFFICIENT_DATA"
        
    if avg_score >= 80:
        return "HIGH"
    elif avg_score >= 50:
        return "MEDIUM"
    else:
        return "LOW"
