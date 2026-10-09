"""
Entrypoint script to train and evaluate Jaldhara Reservoir Inflow ML model.
Run from repository root:
    python scripts/train_ml_model.py
"""
import sys
from pathlib import Path

# Add backend to path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.ml.train_inflow_model import train_and_evaluate

if __name__ == "__main__":
    print("=" * 60)
    print("Jaldhara ML Pipeline: Training & Evaluation (Stage 4)")
    print("=" * 60)
    metadata = train_and_evaluate()
    print("\nTraining complete! Key metrics:")
    print(f"Algorithm: {metadata['algorithm']}")
    print(f"MAE (MCM):  {metadata['evaluation_metrics']['mcm']['mae']}")
    print(f"RMSE (MCM): {metadata['evaluation_metrics']['mcm']['rmse']}")
    print(f"R-squared:  {metadata['evaluation_metrics']['mcm']['r2']}")
    print(f"MAE (ML):   {metadata['evaluation_metrics']['megaliters']['mae']} ML")
    print(f"RMSE (ML):  {metadata['evaluation_metrics']['megaliters']['rmse']} ML")
