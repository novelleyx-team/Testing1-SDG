import os

# Base storage directory
STORAGE_ROOT = os.getenv("STORAGE_ROOT", os.path.join(os.getcwd(), "SDG_Storage_Vault"))

# Logical partitions
PARTITIONS = {
    "users": os.path.join(STORAGE_ROOT, "users"),
    "projects": os.path.join(STORAGE_ROOT, "projects"),
    "temp": os.path.join(STORAGE_ROOT, "temporary"),
    "logs": os.path.join(STORAGE_ROOT, "logs"),
    "backups": os.path.join(STORAGE_ROOT, "backups"),
    "cache": os.path.join(STORAGE_ROOT, "cache"),
}

# Create directories on startup
for path in PARTITIONS.values():
    os.makedirs(path, exist_ok=True)

# Quota limits (Bytes)
QUOTAS = {
    "USER_MAX_TOTAL_BYTES": int(os.getenv("USER_MAX_TOTAL_BYTES", 2 * 1024 * 1024 * 1024)), # 2 GB
    "PROJECT_MAX_TOTAL_BYTES": int(os.getenv("PROJECT_MAX_TOTAL_BYTES", 500 * 1024 * 1024)), # 500 MB
    "FILE_MAX_BYTES": int(os.getenv("FILE_MAX_BYTES", 50 * 1024 * 1024)), # 50 MB
}

# Allowed MIME types for user uploads
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", # docx
    "image/jpeg",
    "image/png",
    "text/csv"
}
