# ChurnGuard — Customer Churn Prediction & Analytics

An end-to-end machine learning web app that predicts customer churn and generates analytics insights from telecom customer data.

**Tech Stack:** Python · Scikit-learn · FastAPI · Next.js · Recharts · Tailwind CSS · shadcn/ui

---

## What it does

- Upload a CSV of telecom customer data
- Get per-customer churn predictions with probability, risk level, and loyalty score
- View an analytics dashboard with 6 insight charts based on the uploaded data

---

## Project Structure

```
Customer Churn/
├── Notebook/
│   └── main.ipynb 
├── Web/
│   ├── Backend/
│   │   ├── app.py                   # FastAPI server
│   │   ├── Models/
│   │   │   └── churn_pipeline.pkl   # Trained sklearn pipeline
│   │   └── requirement.txt
│   └── Frontend/
│       ├── src/
│       └── package.json
└── Telco_customer_churn.csv         # Sample dataset
```

---

## Local Setup

### Prerequisites

- Python 3.9+
- Node.js 18+

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/your-username/customer-churn.git
cd customer-churn
```

---

### Step 2 — Backend setup

```bash
cd Web/Backend

# Create and activate virtual environment
python -m venv venv


venv\Scripts\activate

# Install dependencies
pip install -r requirement.txt
```

`requirement.txt` should contain:
```
fastapi
uvicorn
pandas
scikit-learn
python-multipart
```

Start the backend:

```bash
.\venv\Scripts\python.exe -m uvicorn app:app --reload
```

Backend runs at: `http://localhost:8000`

You can verify it's working by visiting `http://localhost:8000` in your browser — you should see:
```json
{"message": "Churn Prediction API is running."}
```

---

### Step 3 — Frontend setup

Open a new terminal:

```bash
cd Web/Frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

### Step 4 — Using the app

1. Go to `http://localhost:3000`
2. Upload the `Telco_customer_churn.csv` file (or any CSV with the same column structure)
3. View predictions in the table — each customer gets a churn probability, risk level (High/Medium/Low), and loyalty score
4. Navigate to the Analytics page to see 6 insight charts generated from the uploaded data


---
