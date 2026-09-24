from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.routers import health_router, predict_router, model_router, data_router
from app.ml.engine import ml_engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure ML model pipeline is ready
    print(f"[{settings.PROJECT_NAME}] Initializing Scikit-Learn Model Engine...")
    _ = ml_engine.get_metrics()
    print(f"[{settings.PROJECT_NAME}] ML Engine active and ready to accept inference requests.")
    yield
    print(f"[{settings.PROJECT_NAME}] Shutting down service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production Machine Learning API for LoanGuard AI. "
        "Provides probabilistic loan default classification, dynamic SHAP/risk driver explanations, "
        "and real-time validation metrics calculated across 255K+ borrower records."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api/v1
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(predict_router, prefix=settings.API_V1_STR)
app.include_router(model_router, prefix=settings.API_V1_STR)
app.include_router(data_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1_base": settings.API_V1_STR,
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
