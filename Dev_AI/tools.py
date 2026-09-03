import os
import subprocess
from typing import List

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def read_file(filepath: str) -> str:
    """Reads a file from the repository."""
    full_path = os.path.join(ROOT_DIR, filepath)
    try:
        with open(full_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {e}"

def write_file(filepath: str, content: str) -> str:
    """Writes content to a file in the repository."""
    full_path = os.path.join(ROOT_DIR, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    try:
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote to {filepath}"
    except Exception as e:
        return f"Error writing file: {e}"

def run_command(command: str) -> str:
    """Runs a shell command (e.g., 'npm run test', 'npx tsc', 'pytest') and returns output."""
    try:
        result = subprocess.run(
            command, shell=True, cwd=ROOT_DIR,
            capture_output=True, text=True, timeout=60
        )
        output = result.stdout
        if result.stderr:
            output += "\nSTDERR:\n" + result.stderr
        return output
    except subprocess.TimeoutExpired:
        return "Error: Command timed out after 60 seconds."
    except Exception as e:
        return f"Error running command: {e}"

def search_code(query: str, path: str = ".") -> str:
    """Searches for a text query in the codebase."""
    full_path = os.path.join(ROOT_DIR, path)
    results = []
    exclude_dirs = {".git", "node_modules", ".next", "__pycache__", "SDG_Local_Sandbox", "Dev_AI"}
    
    try:
        for root, dirs, files in os.walk(full_path):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            if query in line:
                                rel_path = os.path.relpath(filepath, ROOT_DIR)
                                results.append(f"{rel_path}:{i+1}: {line.strip()}")
                except UnicodeDecodeError:
                    continue  # skip binary files
        return "\n".join(results[:50]) if results else "No matches found."
    except Exception as e:
        return f"Error searching code: {e}"
