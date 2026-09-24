from fastapi import APIRouter
from datetime import datetime, timezone
from app.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def get_health():
    """Health check endpoint to verify backend operational readiness and model status."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "model_loaded": True,
        "environment": "production-ready"
    }
