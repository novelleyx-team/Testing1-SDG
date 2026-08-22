import fitz  # PyMuPDF
import os

def extract_text_from_document(file_path: str) -> str:
    """
    Universal File Scanner: Extract text from various document formats.
    Supports PDF for now, can be extended to DOCX, PPT, etc.
    """
    text_content = ""
    ext = os.path.splitext(file_path)[1].lower()
    
    try:
        if ext == '.pdf':
            doc = fitz.open(file_path)
            for page in doc:
                text_content += page.get_text()
            doc.close()
        elif ext in ['.txt', '.csv']:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text_content = f.read()
        else:
            # Fallback or placeholder for DOCX, PPTX, etc.
            text_content = f"[Extraction for {ext} not fully implemented yet.]"
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        text_content = f"[Error extracting text: {e}]"
        
    return text_content.strip()
