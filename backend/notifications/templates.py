from typing import Dict

class TemplateEngine:
    """
    Strict Template Engine.
    AI is NOT permitted to dynamically alter these templates.
    """
    
    TEMPLATES = {
        "ANALYSIS_COMPLETED_EMAIL": {
            "subject": "Your NOVELLEYX SDG Analysis is Complete - {project_name}",
            "body": "Hello {student_name},\n\nYour SDG Analysis for '{project_name}' has been successfully completed by the NOVELLEYX AI Engine.\n\nYou can view and download your detailed PDF report here: {report_link}\n\nBest regards,\nThe NOVELLEYX Team"
        },
        "ANALYSIS_COMPLETED_SMS": {
            "body": "Your NOVELLEYX SDG analysis for {project_name} has been completed. Log in to view your report."
        },
        "ANALYSIS_FAILED_EMAIL": {
            "subject": "Notice Regarding Your SDG Analysis - {project_name}",
            "body": "Hello {student_name},\n\nThere was an issue processing your SDG Analysis for '{project_name}'. Please log in to your dashboard to review the submission and try again.\n\nBest regards,\nThe NOVELLEYX Team"
        }
    }

    @classmethod
    def render(cls, template_id: str, context: Dict[str, str], channel: str = "EMAIL") -> Dict[str, str]:
        if template_id not in cls.TEMPLATES:
            raise ValueError(f"Unknown template ID: {template_id}")
            
        template = cls.TEMPLATES[template_id]
        
        rendered = {}
        if channel == "EMAIL":
            if "subject" not in template:
                raise ValueError(f"Template {template_id} does not support EMAIL channel")
            rendered["subject"] = template["subject"].format(**context)
            rendered["body"] = template["body"].format(**context)
        elif channel == "SMS":
            if "subject" in template and "body" not in cls.TEMPLATES[template_id + "_SMS"]:
                # Simple fallback
                rendered["body"] = template["body"].format(**context)
            else:
                rendered["body"] = template["body"].format(**context)
                
        return rendered
