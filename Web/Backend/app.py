import pickle
import sys
import os

import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io

# Paths
BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
PIPELINE_PATH = os.path.join(BASE_DIR, "Models", "churn_pipeline.pkl")
THRESHOLD     = 0.6

# Pipeline helper functions
transformer  = None
top_features = []

def feature_engineering(df):
    df = df.copy()
    services = ["Streaming Movies", "Streaming TV", "Online Security", "Tech Support"]
    for col in services:
        df[col] = df[col].map({"Yes": 1, "No": 0, "No internet service": 0})
    df["num_services"] = df[services].sum(axis=1)
    df["Total Charges"] = pd.to_numeric(df["Total Charges"], errors="coerce")
    df = df.dropna(subset=["Total Charges"]).reset_index(drop=True)
    df["Avg monthly revenue"] = df["Total Charges"] / (df["Tenure Months"] + 1)
    cltv_min    = df["CLTV"].min()
    cltv_max    = df["CLTV"].max()
    cltv_scaled = (df["CLTV"] - cltv_min) / (cltv_max - cltv_min)
    df["loyalty_score"] = round(
        (
            0.8 * cltv_scaled
            + 0.1 * df["Contract"].map({"Month-to-month": 0, "One year": 1, "Two year": 1})
            + 0.1 * df["Payment Method"]
                      .isin(["Bank transfer (automatic)", "Credit card (automatic)"])
                      .astype(int)
        ) * 100, 2,
    )
    for col in ["Multiple Lines", "Online Backup", "Device Protection"]:
        df[col] = df[col].apply(lambda x: 1 if x == "Yes" else 0)
    useless_cols = df.iloc[:, :9].columns.tolist()
    df.drop(columns=useless_cols, inplace=True)
    df.drop(columns=["Churn Label", "Churn Reason"], inplace=True)
    df.drop(columns=services, inplace=True)
    return df


def clean_column_names(df):
    df.columns = [
        col.replace("tnf1__", "").replace("tnf2__", "").replace("remainder__", "")
        for col in df.columns
    ]
    return df


def to_encoded_dataframe(arr):
    return clean_column_names(pd.DataFrame(arr, columns=transformer.get_feature_names_out()))


def select_top_features(df):
    return df[[f for f in top_features if f in df.columns]]


sys.modules["__main__"].feature_engineering  = feature_engineering
sys.modules["__main__"].clean_column_names    = clean_column_names
sys.modules["__main__"].to_encoded_dataframe  = to_encoded_dataframe
sys.modules["__main__"].select_top_features   = select_top_features

# Loading the pipeline
with open(PIPELINE_PATH, "rb") as f:
    churn_pipeline = pickle.load(f)

transformer  = churn_pipeline.named_steps["encoding"]
top_features = churn_pipeline.named_steps["model"].feature_names_in_.tolist()

app = FastAPI(title="Churn Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Churn Prediction API is running. Use POST /predict to upload a CSV."}


@app.get("/health")
def health():
    return {"status": "ok"}

async def get_clean_df(file: UploadFile) -> pd.DataFrame:
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    df_clean = df[
        pd.to_numeric(df["Total Charges"], errors="coerce").notna()
    ].reset_index(drop=True)

    if df_clean.empty:
        raise HTTPException(
            status_code=400,
            detail="No valid rows found after filtering invalid Total Charges."
        )

    return df_clean

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    df_clean = await get_clean_df(file)

    df_features = feature_engineering(df_clean)

    probabilities = churn_pipeline.predict_proba(df_clean)[:, 1]
    predictions   = (probabilities > THRESHOLD).astype(int)
    
    loyality_scores = df_features['loyalty_score'].to_numpy()
    
    # print(loyality_scores)
    risk_lvl = []
    
    for prob in probabilities:
        if prob > 0.7:
            risk_lvl.append("High")
        elif prob > 0.4 and prob < 0.7:
            risk_lvl.append("Medium")
        else:
            risk_lvl.append("Low")

    result = []
    for i, row in df_clean.iterrows():
        result.append({
            "customer_id":       row["CustomerID"],
            "churn_probability": round(float(probabilities[i]), 4),
            "churn_prediction":  int(predictions[i]),
            "loyalty_score":     loyality_scores[i],
            "risk_level" : risk_lvl[i]
        })
    
    return {
        "predictions" :     result
    }




def feature_engineering_eda(df):
    df = df.copy()
    services = ["Streaming Movies", "Streaming TV", "Online Security", "Tech Support"]
    for col in services:
        df[col] = df[col].map({"Yes": 1, "No": 0, "No internet service": 0})
    df["num_services"] = df[services].sum(axis=1)
    df["Total Charges"] = pd.to_numeric(df["Total Charges"], errors="coerce")
    df = df.dropna(subset=["Total Charges"]).reset_index(drop=True)
    df["Avg monthly revenue"] = df["Total Charges"] / (df["Tenure Months"] + 1)
    cltv_min    = df["CLTV"].min()
    cltv_max    = df["CLTV"].max()
    cltv_scaled = (df["CLTV"] - cltv_min) / (cltv_max - cltv_min)
    df["loyalty_score"] = round(
        (
            0.8 * cltv_scaled
            + 0.1 * df["Contract"].map({"Month-to-month": 0, "One year": 1, "Two year": 1})
            + 0.1 * df["Payment Method"]
                      .isin(["Bank transfer (automatic)", "Credit card (automatic)"])
                      .astype(int)
        ) * 100, 2,
    )
    for col in ["Multiple Lines", "Online Backup", "Device Protection"]:
        df[col] = df[col].apply(lambda x: 1 if x == "Yes" else 0)
    
    useless_cols = df.iloc[:, :9].columns.tolist()
    df.drop(columns=useless_cols, inplace=True)
    df['Churn Reason'] = df['Churn Reason'].fillna("No Churn")
    
    return df


@app.post("/analytics")
async def analytics(file: UploadFile = File(...)):
 
    df_clean = await get_clean_df(file)
    df       = feature_engineering_eda(df_clean)
    
    kpi = {
        "total_customers" : len(df),
        "churn_rate" : round(df["Churn Value"].mean() * 100, 2),
        "avg_monthly_charges" : round(df['Monthly Charges'].mean(),2),
        "avg_tenure" : round(df['Tenure Months'].mean(),2)
    }
    
    churn_dist = round((df["Churn Value"].value_counts(normalize=True) * 100),2).to_dict()
    top_churn_reasons = df['Churn Reason'].value_counts().iloc[1:6].to_dict()
    payment_method_risk = round((df.groupby('Payment Method')['Churn Value'].mean().sort_values(ascending=False) * 100),2).to_dict()
    service_protection_impact = df.groupby(['Tech Support','Online Security'])['Churn Value'].mean().reset_index().to_dict(orient='records')
    
    df['charge_bucket'] = pd.cut(df['Monthly Charges'], bins=8).astype(str)

    bucket_churn = (
        df.groupby('charge_bucket')['Churn Value']
        .mean()
        .reset_index(name='churn_rate')
        .sort_values('churn_rate')
        .to_dict(orient='records')
    )
    
    churn_rate_by_contract = round((df.groupby('Contract')['Churn Value'].mean() * 100),2).to_dict()

    
    return {
        "kpi" : kpi,
        "churn_distribution" : churn_dist,
        "top_churn_reasons" : top_churn_reasons,
        "payment_method_risk" : payment_method_risk,
        "service_protection_impact" : service_protection_impact,
        "bucket_churn" : bucket_churn,
        "churn_rate_by_contract" : churn_rate_by_contract
    } 