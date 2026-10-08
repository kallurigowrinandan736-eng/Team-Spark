import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AquaQ - Quantum-AI Powered Smart Irrigation & Water Resource Allocation"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "*"
    ]
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data"))
    
    # Alert Thresholds
    RESERVOIR_CRITICAL_LEVEL_PCT: float = 25.0
    RESERVOIR_WARNING_LEVEL_PCT: float = 40.0
    CANAL_OVERLOAD_UTILIZATION_PCT: float = 90.0
    CANAL_EXCESSIVE_LOSS_PCT: float = 14.0
    CROP_DEFICIT_CRITICAL_PCT: float = 25.0
    DROUGHT_RAINFALL_DEFICIT_PCT: float = -30.0

    class Config:
        case_sensitive = True

settings = Settings()
