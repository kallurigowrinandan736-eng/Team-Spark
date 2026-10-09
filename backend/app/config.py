import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "Jaldhar - Quantum-AI Powered Smart Irrigation & Water Resource Allocation"
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
    # IBM Quantum Runtime Configuration
    IBM_QUANTUM_INSTANCE_CRN: str = os.getenv(
        "IBM_QUANTUM_INSTANCE_CRN",
        "crn:v1:bluemix:public:quantum-computing:us-east:a/1698aa8a05d44cfcb307241bd6ab8511:47fb8949-6e6f-47ab-8e63-c38955b1cf18::"
    )
    IBM_CLOUD_API_KEY: str = os.getenv("IBM_CLOUD_API_KEY", os.getenv("IBM_QUANTUM_TOKEN", ""))
    IBM_QUANTUM_CHANNEL: str = os.getenv("IBM_QUANTUM_CHANNEL", "ibm_cloud")

settings = Settings()
