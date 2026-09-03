import fitz  # PyMuPDF
import os
import zipfile
import logging
from PIL import Image
import io

logger = logging.getLogger("SDG_AI_Parser")

def parse_document(file_path: str) -> str:
    """
    Extracts text from a given document. Supports PDF currently.
    Returns plain text containing the document's content.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
        
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        return _parse_pdf(file_path)
    elif ext == ".zip":
        return _parse_zip_code(file_path)
    elif ext in [".png", ".jpg", ".jpeg", ".bmp", ".tiff"]:
        return _parse_image_ocr(file_path)
    else:
        logger.warning(f"Unsupported file extension {ext} for AI extraction.")
        return ""

def _parse_pdf(file_path: str) -> str:
    """Extracts text from PDF. Includes OCR on images within the PDF if available."""
    text_content = []
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text = page.get_text()
            if text.strip():
                text_content.append(text)
            else:
                # If page is empty, try OCR on images
                for img_info in page.get_images(full=True):
                    xref = img_info[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    try:
                        img = Image.open(io.BytesIO(image_bytes))
                        import pytesseract
                        ocr_text = pytesseract.image_to_string(img)
                        text_content.append(ocr_text)
                    except Exception as e:
                        logger.warning(f"OCR failed for image in PDF: {e}")
        return "\n".join(text_content)
    except Exception as e:
        logger.error(f"Failed to parse PDF {file_path}: {e}")
        return ""

def _parse_zip_code(file_path: str) -> str:
    """Extracts text from common source code files within a zip archive."""
    allowed_exts = {".py", ".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".txt", ".java", ".cpp", ".c", ".h", ".html", ".css"}
    text_content = []
    
    try:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            for file_info in zip_ref.infolist():
                if file_info.is_dir():
                    continue
                    
                ext = os.path.splitext(file_info.filename)[1].lower()
                if ext in allowed_exts:
                    try:
                        with zip_ref.open(file_info) as f:
                            content = f.read().decode('utf-8', errors='ignore')
                            text_content.append(f"--- FILE: {file_info.filename} ---")
                            # Truncate very long individual files to save tokens
                            text_content.append(content[:10000]) 
                    except Exception as e:
                        logger.warning(f"Could not read {file_info.filename} in zip: {e}")
                        
        return "\n\n".join(text_content)
    except zipfile.BadZipFile:
        logger.error(f"Bad zip file: {file_path}")
        return ""
    except Exception as e:
        logger.error(f"Error extracting zip {file_path}: {e}")
        return ""

def _parse_image_ocr(file_path: str) -> str:
    """Extracts text from an image using local Tesseract OCR."""
    try:
        import pytesseract
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return text
    except ImportError:
        logger.error("pytesseract is not installed. OCR failed.")
        return ""
    except Exception as e:
        logger.error(f"Failed to OCR image {file_path}: {e}")
        return ""
