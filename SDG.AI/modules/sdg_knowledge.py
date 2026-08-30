import json
from typing import Dict, Any, List

# Static definition of the 17 SDGs to prevent LLM hallucination.
# (For a production system, this can be expanded with all 169 targets)
SDG_KNOWLEDGE_BASE = {
    1: {
        "name": "No Poverty",
        "description": "End poverty in all its forms everywhere.",
        "keywords": ["poverty", "income", "vulnerable", "basic needs", "financial inclusion"],
        "domains": ["social", "economic"],
        "example_targets": ["1.1 Eradicate extreme poverty", "1.2 Reduce poverty by half", "1.4 Equal rights to economic resources"]
    },
    2: {
        "name": "Zero Hunger",
        "description": "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.",
        "keywords": ["food", "agriculture", "nutrition", "hunger", "farming"],
        "domains": ["social", "environmental"],
        "example_targets": ["2.1 Universal access to safe and nutritious food", "2.3 Double the productivity and incomes of small-scale food producers", "2.4 Sustainable food production"]
    },
    3: {
        "name": "Good Health and Well-being",
        "description": "Ensure healthy lives and promote well-being for all at all ages.",
        "keywords": ["health", "disease", "mortality", "well-being", "medicine", "healthcare"],
        "domains": ["social"],
        "example_targets": ["3.4 Reduce mortality from non-communicable diseases", "3.8 Achieve universal health coverage", "3.d Improve early warning systems for global health risks"]
    },
    4: {
        "name": "Quality Education",
        "description": "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
        "keywords": ["education", "school", "learning", "training", "literacy", "students"],
        "domains": ["social"],
        "example_targets": ["4.1 Free primary and secondary education", "4.3 Equal access to affordable technical, vocational and higher education", "4.4 Increase the number of people with relevant skills for financial success"]
    },
    5: {
        "name": "Gender Equality",
        "description": "Achieve gender equality and empower all women and girls.",
        "keywords": ["women", "girls", "equality", "discrimination", "empowerment"],
        "domains": ["social"],
        "example_targets": ["5.1 End discrimination against women and girls", "5.5 Ensure full participation in leadership and decision-making", "5.b Promote empowerment of women through technology"]
    },
    6: {
        "name": "Clean Water and Sanitation",
        "description": "Ensure availability and sustainable management of water and sanitation for all.",
        "keywords": ["water", "sanitation", "hygiene", "pollution", "drinking water", "irrigation"],
        "domains": ["environmental", "social"],
        "example_targets": ["6.1 Safe and affordable drinking water", "6.3 Improve water quality, wastewater treatment and safe reuse", "6.4 Increase water-use efficiency and ensure freshwater supplies"]
    },
    7: {
        "name": "Affordable and Clean Energy",
        "description": "Ensure access to affordable, reliable, sustainable and modern energy for all.",
        "keywords": ["energy", "electricity", "renewable", "solar", "wind", "efficiency"],
        "domains": ["environmental", "economic"],
        "example_targets": ["7.1 Universal access to modern energy", "7.2 Increase global percentage of renewable energy", "7.3 Double the improvement in energy efficiency"]
    },
    8: {
        "name": "Decent Work and Economic Growth",
        "description": "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
        "keywords": ["economy", "jobs", "employment", "growth", "work", "productivity"],
        "domains": ["economic"],
        "example_targets": ["8.1 Sustainable economic growth", "8.2 Diversify, innovate and upgrade for economic productivity", "8.5 Full employment and decent work with equal pay"]
    },
    9: {
        "name": "Industry, Innovation and Infrastructure",
        "description": "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
        "keywords": ["infrastructure", "innovation", "industry", "technology", "research"],
        "domains": ["economic", "environmental"],
        "example_targets": ["9.1 Develop sustainable, resilient and inclusive infrastructures", "9.4 Upgrade all industries and infrastructures for sustainability", "9.5 Enhance research and upgrade industrial technologies"]
    },
    10: {
        "name": "Reduced Inequality",
        "description": "Reduce inequality within and among countries.",
        "keywords": ["inequality", "inclusion", "discrimination", "disparity", "marginalized"],
        "domains": ["social", "economic"],
        "example_targets": ["10.1 Reduce income inequalities", "10.2 Promote universal social, economic and political inclusion", "10.3 Ensure equal opportunities and end discrimination"]
    },
    11: {
        "name": "Sustainable Cities and Communities",
        "description": "Make cities and human settlements inclusive, safe, resilient and sustainable.",
        "keywords": ["cities", "urban", "housing", "transport", "public spaces", "settlements"],
        "domains": ["environmental", "social"],
        "example_targets": ["11.1 Safe and affordable housing", "11.2 Affordable and sustainable transport systems", "11.6 Reduce the environmental impact of cities"]
    },
    12: {
        "name": "Responsible Consumption and Production",
        "description": "Ensure sustainable consumption and production patterns.",
        "keywords": ["consumption", "production", "waste", "recycling", "materials", "circular economy"],
        "domains": ["environmental", "economic"],
        "example_targets": ["12.2 Sustainable management and use of natural resources", "12.3 Halve global per capita food waste", "12.5 Substantially reduce waste generation"]
    },
    13: {
        "name": "Climate Action",
        "description": "Take urgent action to combat climate change and its impacts.",
        "keywords": ["climate", "emissions", "carbon", "warming", "greenhouse gas", "resilience"],
        "domains": ["environmental"],
        "example_targets": ["13.1 Strengthen resilience and adaptive capacity to climate-related disasters", "13.2 Integrate climate change measures into policies and planning", "13.3 Build knowledge and capacity to meet climate change"]
    },
    14: {
        "name": "Life Below Water",
        "description": "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
        "keywords": ["ocean", "marine", "sea", "fish", "plastics", "coastal"],
        "domains": ["environmental"],
        "example_targets": ["14.1 Reduce marine pollution", "14.2 Protect and restore ecosystems", "14.4 Sustainable fishing"]
    },
    15: {
        "name": "Life on Land",
        "description": "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
        "keywords": ["land", "forest", "biodiversity", "soil", "desertification", "animals", "ecosystem"],
        "domains": ["environmental"],
        "example_targets": ["15.1 Conserve and restore terrestrial and freshwater ecosystems", "15.2 End deforestation and restore degraded forests", "15.5 Protect biodiversity and natural habitats"]
    },
    16: {
        "name": "Peace, Justice and Strong Institutions",
        "description": "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
        "keywords": ["peace", "justice", "institutions", "corruption", "violence", "law"],
        "domains": ["social"],
        "example_targets": ["16.1 Reduce violence everywhere", "16.3 Promote the rule of law and ensure equal access to justice", "16.5 Substantially reduce corruption and bribery"]
    },
    17: {
        "name": "Partnerships for the Goals",
        "description": "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.",
        "keywords": ["partnerships", "cooperation", "global", "capacity building", "technology transfer"],
        "domains": ["social", "economic"],
        "example_targets": ["17.6 Knowledge sharing and cooperation for access to science, technology and innovation", "17.7 Promote sustainable technologies to developing countries", "17.16 Enhance the global partnership for sustainable development"]
    }
}

def get_sdg_metadata_context() -> str:
    """Returns a formatted string of SDG knowledge for injection into LLM prompts."""
    context = "UN SUSTAINABLE DEVELOPMENT GOALS KNOWLEDGE BASE:\n\n"
    for sdg_id, data in SDG_KNOWLEDGE_BASE.items():
        context += f"SDG {sdg_id}: {data['name']}\n"
        context += f"  Description: {data['description']}\n"
        context += f"  Domains: {', '.join(data['domains'])}\n"
        context += f"  Key Targets: {', '.join(data['example_targets'])}\n\n"
    return context

def get_sdg_by_id(sdg_id: int) -> Dict[str, Any]:
    return SDG_KNOWLEDGE_BASE.get(sdg_id, {})
