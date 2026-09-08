import json
from pipeline.orchestrator import PipelineOrchestrator
from pipeline.schemas import ValidatedClaim, SDGRelevance, SDGScoreDetails, ImpactLevel

class MockAIProvider:
    """A dummy provider to simulate the SLM and LLM behavior for testing."""
    def generate_structured(self, prompt: str, schema_class: type):
        schema_name = schema_class.__name__
        
        if schema_name == "NormalizedData":
            return schema_class(
                project_name="Clean Campus Initiative",
                project_description="We cleaned the college campus for 2 days. 120 students participated.",
                activities="Campus cleanup",
                duration="2 Days",
                participants="120",
                measurable_results=None, # Missing data
                evidence=None # Missing data
            )
            
        if schema_name == "FactExtractionResult":
            return schema_class(facts=[
                {"category": "STUDENT_PROVIDED", "fact": "120 students participated.", "source": "Input", "confidence": "HIGH"},
                {"category": "STUDENT_PROVIDED", "fact": "The activity lasted 2 days.", "source": "Input", "confidence": "HIGH"},
            ])
            
        if schema_name == "DataGapResult":
            return schema_class(gaps=[
                {"field_name": "measurable_results", "missing_information": "Quantity of waste collected not provided.", "impact_on_analysis": "HIGH"}
            ], completeness_score=0.0)
            
        if schema_name == "ContradictionSchema":
            return schema_class(contradictions=[])
            
        if schema_name == "SDGMappingSchema":
            return schema_class(
                primary_sdgs=[
                    SDGRelevance(
                        sdg_number=11, 
                        sdg_name="Sustainable Cities and Communities",
                        relevance_category="POSSIBLE",
                        score_details=SDGScoreDetails(activity_alignment=15, objective_alignment=10, evidence_strength=5, outcome_alignment=0, target_alignment=0, total_score=30),
                        reasoning="The activity may contribute to SDG 11 by improving local environments.",
                        evidence_used=["Campus cleanup"],
                        confidence="MEDIUM"
                    )
                ],
                secondary_sdgs=[]
            )
            
        if schema_name == "ImpactSchema":
            return schema_class(
                output_analysis=[ImpactLevel(level="ACTIVITY", description="Campus was cleaned", evidence_available=True)],
                outcome_analysis=[],
                potential_impact="Long-term environmental impact requires further measurement."
            )
            
        if schema_name == "RecSchema":
            return schema_class(recommendations=[])
            
        if schema_name == "ValidatedClaimsSchema":
            return schema_class(validated_claims=[
                ValidatedClaim(
                    claim="The project reduced campus waste by 40%.",
                    type="AI_INTERPRETATION",
                    evidence=[],
                    source="AI",
                    confidence="LOW",
                    verified=False # This is the crucial part: hallucination detected and rejected
                )
            ])
            
        # Fallback
        return schema_class.construct()

def test_pipeline():
    print("Initializing Pipeline...")
    mock_provider = MockAIProvider()
    orchestrator = PipelineOrchestrator(slm_provider=mock_provider, llm_provider=mock_provider)
    
    raw_input = {
        "project_name": "Clean Campus Initiative",
        "project_description": "We cleaned collg campus",
        "participants": "120",
        "duration": "2 Days"
    }
    
    print("Running Pipeline...")
    report = orchestrator.run_pipeline(raw_input)
    
    print("\n--- FINAL REPORT ---")
    print(json.dumps(report.dict(), indent=2))
    
    # Assertions to verify requirements
    assert "Completeness Score" in report.data_quality_assessment
    assert "Analysis derived solely from verifiable student facts." in report.evidence_analysis
    assert "Rejected" in report.audit_trail["stages"]["hallucination_guard"]
    
    print("\n[SUCCESS] Pipeline executed and passed hallucination & completeness checks.")

if __name__ == "__main__":
    test_pipeline()
