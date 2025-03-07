from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
import pandas as pd
import uvicorn

MODEL_PATH = "model/trained_model.pkl"

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo
model_data = joblib.load(MODEL_PATH)
rocket = model_data['rocket']
classifier = model_data['classifier']
scaler = model_data['scaler']
le = model_data['label_encoder']
WINDOW_SIZE = model_data['window_size']
STEP_SIZE = WINDOW_SIZE

class PredictionRequest(BaseModel):
    AccelX: list[float]
    SurfaceTemperature: list[float]
    OverSurfaceTemperature: list[float]

@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        windows, step = process_input(request)
        X_transformed = rocket.transform(windows)
        predictions = classifier.predict(X_transformed)

        final_predictions = []
        for i in range(len(request.AccelX)):
            votes = []
            for j, pred in enumerate(predictions):
                start = j * step
                end = start + WINDOW_SIZE
                if start <= i < end:
                    votes.append(pred)
            if votes:
                final_pred = le.inverse_transform([max(set(votes), key=votes.count)])[0]
            else:
                final_pred = "UNKNOWN"
            final_predictions.append(final_pred)

        final_predictions = ["UNKNOWN" if pd.isna(pred) else pred for pred in final_predictions]

        return {
            "predictions": final_predictions,
            "states": le.classes_.tolist()
        }
    
    except Exception as e:
        return {"error": str(e)}

def process_input(data: PredictionRequest):
    df = pd.DataFrame({
        'AccelX': data.AccelX,
        'Surface temperature (ºC)': data.SurfaceTemperature,
        'Over surface temperature (ºC)': data.OverSurfaceTemperature
    })
    
    df = df.fillna(0)  

    if len(df) < WINDOW_SIZE:
        raise ValueError(f"Se requieren al menos {WINDOW_SIZE} muestras")

    X = scaler.transform(df.values)

    step = STEP_SIZE  
    windows = [X[i:i+WINDOW_SIZE].T for i in range(0, len(X) - WINDOW_SIZE + 1, step)]

    return np.array(windows), step  

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
