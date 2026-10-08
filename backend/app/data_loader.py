import os
import csv
import json
import logging
import pandas as pd
from typing import Dict, List, Any, Optional
from app.config import settings
from app.schemas import Reservoir, Canal, Region, Crop, WeatherData, RainfallData, InflowData, DemandData

logger = logging.getLogger(__name__)

class DataLoader:
    def __init__(self, data_dir: Optional[str] = None):
        self.data_dir = data_dir or settings.DATA_DIR
        self.reservoirs: List[Reservoir] = []
        self.canals: List[Canal] = []
        self.regions: List[Region] = []
        self.crops: List[Crop] = []
        self.weather: List[WeatherData] = []
        self.rainfall: List[RainfallData] = []
        self.inflow_history: List[InflowData] = []
        self.demand_history: List[DemandData] = []
        self.warnings: List[str] = []
        self.load_all()

    def _impute_dataframe(self, df: pd.DataFrame, dataset_name: str) -> pd.DataFrame:
        null_count = df.isnull().sum().sum()
        if null_count > 0:
            warning_msg = f"Imputed {null_count} missing values in {dataset_name} using median/forward-fill."
            logger.warning(warning_msg)
            self.warnings.append(warning_msg)
            # Impute numeric columns with median, non-numeric with bfill/ffill
            for col in df.columns:
                if pd.api.types.is_numeric_dtype(df[col]):
                    df[col] = df[col].fillna(df[col].median())
                else:
                    df[col] = df[col].ffill().bfill().fillna("Unknown")
        return df

    def load_all(self):
        self.warnings.clear()
        self.load_reservoirs()
        self.load_regions()
        self.load_canals()
        self.load_crops()
        self.load_weather()
        self.load_rainfall()
        self.load_inflow_history()
        self.load_demand_history()

    def load_reservoirs(self):
        path = os.path.join(self.data_dir, "reservoirs.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "reservoirs.csv")
            self.reservoirs = [Reservoir(**row) for row in df.to_dict(orient="records")]
        else:
            logger.error(f"Reservoirs CSV not found at {path}")

    def load_regions(self):
        path = os.path.join(self.data_dir, "regions.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "regions.csv")
            self.regions = [Region(**row) for row in df.to_dict(orient="records")]

    def load_canals(self):
        path = os.path.join(self.data_dir, "canals.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "canals.csv")
            records = []
            for row in df.to_dict(orient="records"):
                if isinstance(row.get("path"), str):
                    try:
                        row["path"] = json.loads(row["path"])
                    except Exception:
                        row["path"] = []
                records.append(Canal(**row))
            self.canals = records

    def load_crops(self):
        path = os.path.join(self.data_dir, "crops.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "crops.csv")
            self.crops = [Crop(**row) for row in df.to_dict(orient="records")]

    def load_weather(self):
        path = os.path.join(self.data_dir, "weather.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "weather.csv")
            self.weather = [WeatherData(**row) for row in df.to_dict(orient="records")]

    def load_rainfall(self):
        path = os.path.join(self.data_dir, "rainfall.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "rainfall.csv")
            self.rainfall = [RainfallData(**row) for row in df.to_dict(orient="records")]

    def load_inflow_history(self):
        path = os.path.join(self.data_dir, "inflow_history.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "inflow_history.csv")
            self.inflow_history = [InflowData(**row) for row in df.to_dict(orient="records")]

    def load_demand_history(self):
        path = os.path.join(self.data_dir, "water_demand_history.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df = self._impute_dataframe(df, "water_demand_history.csv")
            self.demand_history = [DemandData(**row) for row in df.to_dict(orient="records")]

    def reset_to_demo(self):
        import subprocess
        script = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../scripts/generate_datasets.py"))
        if os.path.exists(script):
            subprocess.run(["python", script], check=True)
        self.load_all()

data_store = DataLoader()
