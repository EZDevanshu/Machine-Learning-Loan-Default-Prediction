import os
from typing import List

# Avoid Loky worker warning on Windows without wmic
os.environ["LOKY_MAX_CPU_COUNT"] = str(os.cpu_count() or 4)

class Settings:
    PROJECT_NAME: str = "LoanGuard AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Origins (allow Next.js frontend on port 3000 and any local dev origin)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "*"
    ]
    
    # Project Paths
    BACKEND_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    WORKSPACE_ROOT: str = os.path.dirname(BACKEND_DIR)
    MODEL_DIR: str = os.getenv("MODEL_DIR", os.path.join(WORKSPACE_ROOT, "model"))
    
    # Model Artifacts
    MODEL_PATH: str = os.path.join(MODEL_DIR, "loan_default_pipeline.pkl")
    REGISTRY_PATH: str = os.path.join(MODEL_DIR, "models_registry.pkl")
    METRICS_PATH: str = os.path.join(MODEL_DIR, "metrics.json")
    MULTI_METRICS_PATH: str = os.path.join(MODEL_DIR, "multi_model_metrics.json")
    DATA_PATH: str = os.path.join(MODEL_DIR, "Loan_default.csv")
    
    RANDOM_STATE: int = 42

settings = Settings()

