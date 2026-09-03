import os
import uuid
import hashlib
import shutil
from fastapi import UploadFile, HTTPException
from backend.storage.config import PARTITIONS, QUOTAS, ALLOWED_MIME_TYPES
from Superbase_db import database as db

class StorageService:
    @staticmethod
    def _calculate_checksum(file_path: str) -> str:
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    @staticmethod
    def _validate_quota(scope: str, scope_id: str, new_bytes: int, limit: int):
        current_usage = db.get_storage_usage(scope, scope_id)
        if current_usage + new_bytes > limit:
            raise HTTPException(status_code=413, detail=f"Storage quota exceeded for {scope} {scope_id}")

    @staticmethod
    async def upload_file(file: UploadFile, owner_id: str, project_id: str = None) -> dict:
        # 1. Validate MIME
        if file.content_type not in ALLOWED_MIME_TYPES and file.content_type != "application/pdf":
            raise HTTPException(status_code=415, detail="Unsupported file type")
            
        # 2. Setup temporary location for validation
        temp_id = f"temp_{uuid.uuid4().hex}"
        temp_path = os.path.join(PARTITIONS["temp"], temp_id)
        
        try:
            # 3. Stream to temp file and calculate size
            size_bytes = 0
            with open(temp_path, "wb") as buffer:
                while chunk := await file.read(8192):
                    size_bytes += len(chunk)
                    if size_bytes > QUOTAS["FILE_MAX_BYTES"]:
                        raise HTTPException(status_code=413, detail="File exceeds maximum allowed size")
                    buffer.write(chunk)
                    
            # 4. Check quotas
            StorageService._validate_quota("user", owner_id, size_bytes, QUOTAS["USER_MAX_TOTAL_BYTES"])
            if project_id:
                StorageService._validate_quota("project", project_id, size_bytes, QUOTAS["PROJECT_MAX_TOTAL_BYTES"])
                
            # 5. Checksum
            checksum = StorageService._calculate_checksum(temp_path)
            
            # 6. Generate secure deterministic path
            file_id = f"file_{uuid.uuid4().hex}"
            ext = os.path.splitext(file.filename)[1]
            secure_filename = f"{file_id}{ext}"
            
            if project_id:
                # projects/{project_id}/documents/{secure_filename}
                proj_dir = os.path.join(PARTITIONS["projects"], project_id, "documents")
                os.makedirs(proj_dir, exist_ok=True)
                final_path = os.path.join(proj_dir, secure_filename)
                storage_key = f"projects/{project_id}/documents/{secure_filename}"
            else:
                user_dir = os.path.join(PARTITIONS["users"], owner_id)
                os.makedirs(user_dir, exist_ok=True)
                final_path = os.path.join(user_dir, secure_filename)
                storage_key = f"users/{owner_id}/{secure_filename}"
                
            # 7. Move file
            shutil.move(temp_path, final_path)
            
            # 8. Record in DB
            db.register_file(
                file_id=file_id,
                owner_id=owner_id,
                project_id=project_id,
                original_filename=file.filename,
                storage_key=storage_key,
                mime_type=file.content_type,
                size_bytes=size_bytes,
                checksum=checksum
            )
            
            db.record_storage_usage("user", owner_id, size_bytes)
            if project_id:
                db.record_storage_usage("project", project_id, size_bytes)
                
            db.log_storage_event(f"evt_{uuid.uuid4().hex}", file_id, "UPLOAD", owner_id)
            
            return {
                "file_id": file_id,
                "filename": file.filename,
                "size_bytes": size_bytes,
                "status": "success"
            }
            
        finally:
            # Cleanup temp if it still exists
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @staticmethod
    def get_absolute_path(storage_key: str) -> str:
        # Prevent path traversal
        if ".." in storage_key or storage_key.startswith("/"):
            raise HTTPException(status_code=400, detail="Invalid storage key")
            
        parts = storage_key.split("/")
        if parts[0] not in PARTITIONS:
            raise HTTPException(status_code=400, detail="Invalid partition")
            
        return os.path.join(PARTITIONS[parts[0]], *parts[1:])

    @staticmethod
    def delete_file(file_id: str, actor_id: str):
        record = db.get_file(file_id)
        if not record:
            raise HTTPException(status_code=404, detail="File not found")
            
        if record["owner_id"] != actor_id:
            # Admin check can be added here
            raise HTTPException(status_code=403, detail="Forbidden")
            
        # Soft delete or hard delete? Let's do hard delete for now but wrap in try
        abs_path = StorageService.get_absolute_path(record["storage_key"])
        if os.path.exists(abs_path):
            os.remove(abs_path)
            
        # Deduct quota
        db.record_storage_usage("user", record["owner_id"], -record["size_bytes"])
        if record["project_id"]:
            db.record_storage_usage("project", record["project_id"], -record["size_bytes"])
            
        db.update_file_status(file_id, "DELETED")
        db.log_storage_event(f"evt_{uuid.uuid4().hex}", file_id, "DELETE", actor_id)

    @staticmethod
    def register_system_file(source_path: str, owner_id: str, project_id: str, original_filename: str, mime_type: str) -> dict:
        """Move a system-generated file into managed storage and register it."""
        size_bytes = os.path.getsize(source_path)
        
        # Check quotas
        StorageService._validate_quota("user", owner_id, size_bytes, QUOTAS["USER_MAX_TOTAL_BYTES"])
        if project_id:
            StorageService._validate_quota("project", project_id, size_bytes, QUOTAS["PROJECT_MAX_TOTAL_BYTES"])
            
        checksum = StorageService._calculate_checksum(source_path)
        file_id = f"file_{uuid.uuid4().hex}"
        ext = os.path.splitext(original_filename)[1]
        secure_filename = f"{file_id}{ext}"
        
        if project_id:
            proj_dir = os.path.join(PARTITIONS["projects"], project_id, "pdf")
            os.makedirs(proj_dir, exist_ok=True)
            final_path = os.path.join(proj_dir, secure_filename)
            storage_key = f"projects/{project_id}/pdf/{secure_filename}"
        else:
            user_dir = os.path.join(PARTITIONS["users"], owner_id)
            os.makedirs(user_dir, exist_ok=True)
            final_path = os.path.join(user_dir, secure_filename)
            storage_key = f"users/{owner_id}/{secure_filename}"
            
        shutil.move(source_path, final_path)
        
        db.register_file(
            file_id=file_id,
            owner_id=owner_id,
            project_id=project_id,
            original_filename=original_filename,
            storage_key=storage_key,
            mime_type=mime_type,
            size_bytes=size_bytes,
            checksum=checksum
        )
        
        db.record_storage_usage("user", owner_id, size_bytes)
        if project_id:
            db.record_storage_usage("project", project_id, size_bytes)
            
        db.log_storage_event(f"evt_{uuid.uuid4().hex}", file_id, "SYSTEM_CREATE", owner_id)
        
        return {
            "file_id": file_id,
            "filename": original_filename,
            "size_bytes": size_bytes,
            "storage_key": storage_key,
            "absolute_path": final_path
        }
