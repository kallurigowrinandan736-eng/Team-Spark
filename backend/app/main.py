import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.data_loader import data_store
from app.ml.demand_model import demand_predictor
from app.ml.inflow_model import inflow_forecaster
from app.routers import data, predictions, optimization, scenarios, alerts, recommendations, pipeline, upload, quantum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aquaq")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing AquaQ AI and Optimization Engine...")
    logger.info(f"Loaded {len(data_store.reservoirs)} reservoirs, {len(data_store.canals)} canals, {len(data_store.crops)} crop command areas.")
    logger.info("Demand and Inflow ML models ready.")
    yield
    logger.info("Shutting down AquaQ Engine.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Jaldhar - Quantum-AI Powered Smart Irrigation & Water Resource Allocation",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(data.router, prefix=settings.API_V1_STR)
app.include_router(predictions.router, prefix=settings.API_V1_STR)
app.include_router(optimization.router, prefix=settings.API_V1_STR)
app.include_router(quantum.router, prefix=settings.API_V1_STR)
app.include_router(scenarios.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(pipeline.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "honesty_notice": "Quantum-Inspired Simulation (QUBO + SQA) running on classical hardware with demo datasets."
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "data_loaded": {
            "reservoirs": len(data_store.reservoirs),
            "canals": len(data_store.canals),
            "crops": len(data_store.crops)
        }
    }
