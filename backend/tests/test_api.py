import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "LoanGuard AI Backend"
    assert data["status"] == "online"

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True

def test_model_metrics():
    response = client.get("/api/v1/model/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert len(data["metrics"]) >= 6
    metric_keys = [m["key"] for m in data["metrics"]]
    assert "accuracy" in metric_keys
    assert "precision" in metric_keys
    assert "recall" in metric_keys
    assert "f1" in metric_keys
    assert "roc_auc" in metric_keys

def test_predict_low_risk():
    payload = {
        "Age": 42,
        "Income": 95000,
        "LoanAmount": 20000,
        "CreditScore": 780,
        "MonthsEmployed": 72,
        "NumCreditLines": 3,
        "InterestRate": 6.8,
        "LoanTerm": 36,
        "DTIRatio": 0.24,
        "Education": "Master's",
        "EmploymentType": "Full-time",
        "MaritalStatus": "Married",
        "HasMortgage": "Yes",
        "HasDependents": "Yes",
        "LoanPurpose": "Home Improvement",
        "HasCoSigner": "Yes"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "riskProbability" in data
    assert "riskLevel" in data
    assert data["riskLevel"] in ["LOW", "MEDIUM", "HIGH"]
    assert "recommendation" in data
    assert "keyFactors" in data
    assert len(data["keyFactors"]) > 0

def test_predict_high_risk():
    payload = {
        "Age": 22,
        "Income": 25000,
        "LoanAmount": 22000,
        "CreditScore": 560,
        "MonthsEmployed": 6,
        "NumCreditLines": 7,
        "InterestRate": 18.5,
        "LoanTerm": 60,
        "DTIRatio": 0.58,
        "Education": "High School",
        "EmploymentType": "Unemployed",
        "MaritalStatus": "Single",
        "HasMortgage": "No",
        "HasDependents": "Yes",
        "LoanPurpose": "Personal",
        "HasCoSigner": "No"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["riskLevel"] == "HIGH"
    assert data["riskProbability"] >= 45.0
    assert data["statusColor"] == "red"

def test_predict_invalid_credit_score():
    # Credit score must be <= 850
    payload = {
        "Age": 35,
        "Income": 60000,
        "LoanAmount": 20000,
        "CreditScore": 999,  # Invalid
        "MonthsEmployed": 36,
        "NumCreditLines": 4,
        "InterestRate": 9.5,
        "LoanTerm": 36,
        "DTIRatio": 0.35,
        "Education": "Bachelor's",
        "EmploymentType": "Full-time",
        "MaritalStatus": "Single",
        "HasMortgage": "Yes",
        "HasDependents": "No",
        "LoanPurpose": "Auto",
        "HasCoSigner": "No"
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 422  # Pydantic validation error

def test_data_sample():
    response = client.get("/api/v1/data/sample")
    assert response.status_code == 200
    data = response.json()
    assert "records" in data
    assert len(data["records"]) > 0
