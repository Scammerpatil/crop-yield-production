import sys
import pandas as pd
import joblib

yield_model = joblib.load("python/models/yield_model.pkl")
production_model = joblib.load("python/models/production_model.pkl")
crop_enc = joblib.load("python/models/Crop_encoder.pkl")
state_enc = joblib.load("python/models/State_encoder.pkl")
season_enc = joblib.load("python/models/Season_encoder.pkl")


if __name__ == "__main__":
    crop = sys.argv[1]
    crop_year = sys.argv[2]
    season = sys.argv[3]    
    state = sys.argv[4]
    area = sys.argv[5]
    rainfall = sys.argv[6]
    pesticide = sys.argv[7]
    fertilizer = sys.argv[8]
    
    encoded_input = {
        "Crop": crop_enc.transform([crop.strip()])[0],
        "Crop_Year": int(crop_year),
        "Season": season_enc.transform([season.strip()])[0],
        "State": state_enc.transform([state.strip()])[0],
        "Area": float(area),
        "Annual_Rainfall": float(rainfall),
        "Fertilizer": float(fertilizer),
        "Pesticide": float(pesticide)
    }
    
    X_yield_sample = pd.DataFrame([encoded_input])

    predicted_yield = yield_model.predict(X_yield_sample)[0]
    X_production_sample = X_yield_sample.copy()
    X_production_sample["Predicted_Yield"] = predicted_yield
    predicted_production = production_model.predict(X_production_sample)[0]
    print(predicted_yield)
    print(predicted_production)
