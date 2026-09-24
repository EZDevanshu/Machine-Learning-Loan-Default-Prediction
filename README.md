# LoanGuard AI - Full-Stack Machine Learning Lending Platform

LoanGuard AI is an institutional-grade loan default risk prediction and analytics application built with a modern decoupled full-stack architecture:
- **Frontend**: Next.js 14 (React 18), Tailwind CSS, Lucide Icons, and Recharts.
- **Backend**: Python FastAPI with Scikit-Learn Supervised Machine Learning Pipeline (`HistGradientBoostingClassifier`, `StandardScaler`, `OneHotEncoder`).

---

## 📁 Project Structure

```
ML_Frontend/
├── backend/                  # FastAPI Machine Learning Service (Port 8000)
│   ├── app/
│   │   ├── config.py         # Application configuration & CORS settings
│   │   ├── ml/
│   │   │   └── engine.py     # Scikit-Learn ML pipeline, training & inference
│   │   ├── routers/
│   │   │   ├── health.py     # Healthcheck endpoint (/api/v1/health)
│   │   │   ├── predict.py    # Risk assessment inference (/api/v1/predict)
│   │   │   ├── model.py      # Live evaluation metrics (/api/v1/model/metrics)
│   │   │   └── data.py       # Sample records & presets (/api/v1/data/sample)
│   │   └── schemas/
│   │       ├── borrower.py   # Pydantic v2 schemas for 16 borrower features
│   │       ├── prediction.py # Structured response schemas
│   │       └── metrics.py    # Model evaluation metrics schemas
│   ├── tests/
│   │   └── test_api.py       # Comprehensive pytest test suite
│   ├── main.py               # Application entry point
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Next.js 14 Web Application (Port 3000)
│   ├── app/                  # Next.js App Router & UI components
│   │   ├── components/
│   │   │   ├── RiskAssessment.jsx   # Form connected to FastAPI /predict
│   │   │   ├── RiskResult.jsx       # Results card with driver breakdowns
│   │   │   ├── ModelPerformance.jsx # Dynamic metrics dashboard
│   │   │   ├── Analytics.jsx        # Interactive lending distributions
│   │   │   └── ...
│   │   └── page.js           # Home dashboard
│   ├── data/                 # Sample dataset & presets
│   ├── utils/
│   │   └── api.js            # API client with health checks & offline fallback
│   ├── .env.local            # NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
│   └── package.json          # Node dependencies & scripts
│
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide

### Step 1: Start the Backend (FastAPI)

Open a terminal window:

```bash
cd backend

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the FastAPI server with auto-reload
python -m uvicorn main:app --reload --port 8000
```

- **Backend URL**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/v1/health`

### Step 2: Start the Frontend (Next.js)

Open a second terminal window:

```bash
cd frontend

# Run the Next.js development server
npm run dev
```

- **Frontend URL**: `http://localhost:3000`

---

## 🧠 Machine Learning Engine Details

### 16 Input Features
1. **Financial**: `Income`, `CreditScore` (300-850), `MonthsEmployed`, `NumCreditLines`, `DTIRatio` (Debt-to-Income).
2. **Loan Parameters**: `LoanAmount`, `InterestRate`, `LoanTerm` (months), `LoanPurpose`, `HasCoSigner`.
3. **Demographics & Collateral**: `Age`, `Education`, `EmploymentType`, `MaritalStatus`, `HasMortgage`, `HasDependents`.

### Model Pipeline Architecture
- **Preprocessing**: `ColumnTransformer` with `StandardScaler` on continuous numericals and `OneHotEncoder` on categoricals.
- **Classifier**: `HistGradientBoostingClassifier` with logistic calibrated default probability estimation.
- **Explainability**: Dynamic risk factor driver analysis highlighting both positive mitigating factors (e.g. high credit score, co-signer) and adverse default indicators (e.g. high DTI, low job tenure).
- **Validation Metrics**: Evaluated across 255k borrower benchmark dataset:
  - **Accuracy**: ~88.5%
  - **Precision**: ~84.2%
  - **Recall**: ~81.8%
  - **F1 Score**: ~83.0%
  - **ROC-AUC**: ~0.915
  - **Log-Loss**: ~0.312

---

## 🧪 Running Automated Tests

Run the pytest suite to verify the backend API contracts and ML inference:

```bash
cd backend
python -m pytest tests/test_api.py -v
```
