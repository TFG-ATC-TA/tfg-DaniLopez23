from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
import pandas as pd
import uvicorn
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import logging 
from fastapi.logger import logger as fastapi_logger
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.patches import Patch

MODEL_PATH = "model/trained_model - new.pkl"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración inicial
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("ml-api")
fastapi_logger.handlers = logger.handlers
fastapi_logger.setLevel(logging.DEBUG)


# Cargar modelo
model_data = joblib.load(MODEL_PATH)
rocket = model_data['rocket']
classifier = model_data['classifier']
le = model_data['label_encoder']
window_config = model_data['window_config']
WINDOW_SIZE = window_config['window_size']


class SensorData(BaseModel):
    DateTime: str
    AccelX: float
    OverSurfaceTemperature: float
    SurfaceTemperature: float

class PredictionRequest(BaseModel):
    data: list[SensorData]


@app.post("/predict")
async def predict(request: PredictionRequest):
    logger.info("Cantidad de muestras recibidas: %d", len(request.data))
    try:
        # Crear DataFrame desde los datos de entrada
        df = pd.DataFrame([{
            "DateTime": entry.DateTime,
            "AccelX": entry.AccelX,
            "OverSurfaceTemperature": entry.OverSurfaceTemperature,
            "SurfaceTemperature": entry.SurfaceTemperature
        } for entry in request.data])

        if len(df) < WINDOW_SIZE:
            raise ValueError(f"Se requieren al menos {WINDOW_SIZE} muestras")

        # Procesar timestamps
        try:
            timestamps = [datetime.strptime(ts, "%Y-%m-%d %H:%M:%S%z") for ts in df["DateTime"]]
        except Exception as e:
            raise ValueError(f"Formato DateTime inválido: {str(e)}")

        df["DateTime"] = timestamps

        # Calcular duración de muestra
        sample_duration = (timestamps[1] - timestamps[0]).total_seconds() if len(timestamps) > 1 else 5

        # Procesar datos
        windows = process_input(df)
        X_transformed = rocket.transform(windows)
        predictions = classifier.predict(X_transformed)

       # Generar intervalos por ventana
        intervals = []
        for j in range(len(predictions)):
            start_idx = j * WINDOW_SIZE
            end_idx = start_idx + WINDOW_SIZE - 1

            if end_idx >= len(timestamps):
                end_idx = len(timestamps) - 1

            start_time = timestamps[start_idx]
            end_time = timestamps[end_idx] + timedelta(seconds=sample_duration)

            intervals.append({
                "inicio": start_time.strftime("%Y-%m-%d %H:%M:%S"),  # Formato correcto
                "fin": end_time.strftime("%Y-%m-%d %H:%M:%S"),       # Formato correcto
                "estado": le.inverse_transform([predictions[j]])[0]
            })

        # Agregar predicciones al DataFrame
        prediction_labels = le.inverse_transform(predictions)
        df["Prediction"] = [
            prediction_labels[min(j // WINDOW_SIZE, len(prediction_labels) - 1)]
            for j in range(len(df))
        ]

        # Generar gráfica
        fig, ax1 = plt.subplots(figsize=(14, 8))

        # Graficar datos de IMU
        ax1.plot(df["DateTime"], df["AccelX"], label="Accel X", color="b", marker=".", linestyle="-", markersize=4)
        ax1.set_xlabel("Fecha/Hora")
        ax1.set_ylabel("Accel X", color="b")
        ax1.tick_params(axis="y", labelcolor="b")
        ax1.grid(True)

        # Crear eje secundario para temperaturas
        ax2 = ax1.twinx()
        ax2.plot(df["DateTime"], df["SurfaceTemperature"], label="Surface Temp", color="g", marker=".", linestyle="-", markersize=4)
        ax2.plot(df["DateTime"], df["OverSurfaceTemperature"], label="Over Surface Temp", color="orange", marker=".", linestyle="-", markersize=4)
        ax2.set_ylabel("Temperatura (ºC)", color="g")
        ax2.tick_params(axis="y", labelcolor="g")

        # Colorear zonas según estados
        color_map = {
            "MAINTENANCE": "yellow",
            "CLEANING": "orange",
            "MILKING": "blue",
            "COOLING": "green",
            "EMPTY TANK": "red",
            "UNKNOWN": "gray"
        }

        prev_time = None
        current_state = None

        for _, row in df.iterrows():
            if row["Prediction"] != current_state:
                if prev_time is not None:
                    ax1.axvspan(prev_time, row["DateTime"], facecolor=color_map.get(current_state, "gray"), alpha=0.3)
                current_state = row["Prediction"]
                prev_time = row["DateTime"]

        # Último segmento
        if prev_time is not None:
            ax1.axvspan(prev_time, df["DateTime"].iloc[-1], facecolor=color_map.get(current_state, "gray"), alpha=0.3)

        # Leyenda personalizada
        legend_elements = [Patch(facecolor=color_map[state], alpha=0.3, label=state) 
                        for state in le.classes_.tolist() + ["UNKNOWN"] if state in color_map]
        ax1.legend(handles=legend_elements, loc="upper left")

        # Formatear eje X
        ax1.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m-%d %H:%M:%S"))
        ax1.xaxis.set_major_locator(mdates.HourLocator(interval=1))
        plt.xticks(rotation=45)

        # Título y guardar imagen
        plt.title("Datos de sensores y estados predichos")
        plt.tight_layout()
        plt.savefig("predictions_plot.png")  # Guardar la gráfica como imagen
        plt.close()

        return {
            "intervals": intervals,
            "states": le.classes_.tolist(),
            "plot_path": "predictions_plot.png"
        }

    except Exception as e:
        logger.exception(f"Error procesando la solicitud: {str(e)}")
        return {"error": str(e)}
    
def process_input(data: pd.DataFrame):
    df = data.drop(columns=["DateTime"]).fillna(0)
    
    if len(df) < WINDOW_SIZE:
        raise ValueError(f"Se requieren al menos {WINDOW_SIZE} muestras")

    # Crear ventanas completas sin overlap
    n_windows = len(df) // WINDOW_SIZE
    valid_length = n_windows * WINDOW_SIZE
    df = df.iloc[:valid_length]
    
    raw_windows = [df.values[i:i+WINDOW_SIZE] for i in range(0, valid_length, WINDOW_SIZE)]
    
    # Escalar cada ventana
    scaled_windows = []
    for window in raw_windows:
        scaler = StandardScaler()
        scaled_window = scaler.fit_transform(window)
        scaled_windows.append(scaled_window.T)
    
    return np.array(scaled_windows)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)