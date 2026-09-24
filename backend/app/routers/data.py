import os
import pandas as pd
from fastapi import APIRouter
from typing import List, Dict, Any
from app.config import settings

router = APIRouter(prefix="/data", tags=["Dataset & Presets"])

SAMPLE_DATASET = [
    {
        "LoanID": "LGD-10482", "Age": 42, "Income": 85000, "LoanAmount": 25000,
        "CreditScore": 740, "MonthsEmployed": 64, "NumCreditLines": 3, "InterestRate": 7.2,
        "LoanTerm": 36, "DTIRatio": 0.28, "Education": "Master's", "EmploymentType": "Full-time",
        "MaritalStatus": "Married", "HasMortgage": "Yes", "HasDependents": "Yes",
        "LoanPurpose": "Home Improvement", "HasCoSigner": "Yes", "Default": 0
    },
    {
        "LoanID": "LGD-10483", "Age": 26, "Income": 38000, "LoanAmount": 18000,
        "CreditScore": 590, "MonthsEmployed": 14, "NumCreditLines": 6, "InterestRate": 14.8,
        "LoanTerm": 48, "DTIRatio": 0.52, "Education": "High School", "EmploymentType": "Part-time",
        "MaritalStatus": "Single", "HasMortgage": "No", "HasDependents": "No",
        "LoanPurpose": "Personal", "HasCoSigner": "No", "Default": 1
    },
    {
        "LoanID": "LGD-10484", "Age": 35, "Income": 62000, "LoanAmount": 15000,
        "CreditScore": 685, "MonthsEmployed": 42, "NumCreditLines": 4, "InterestRate": 9.1,
        "LoanTerm": 36, "DTIRatio": 0.34, "Education": "Bachelor's", "EmploymentType": "Full-time",
        "MaritalStatus": "Single", "HasMortgage": "Yes", "HasDependents": "No",
        "LoanPurpose": "Auto", "HasCoSigner": "No", "Default": 0
    },
    {
        "LoanID": "LGD-10485", "Age": 51, "Income": 110000, "LoanAmount": 45000,
        "CreditScore": 780, "MonthsEmployed": 120, "NumCreditLines": 4, "InterestRate": 6.5,
        "LoanTerm": 60, "DTIRatio": 0.22, "Education": "Doctorate", "EmploymentType": "Full-time",
        "MaritalStatus": "Married", "HasMortgage": "Yes", "HasDependents": "Yes",
        "LoanPurpose": "Business", "HasCoSigner": "Yes", "Default": 0
    },
    {
        "LoanID": "LGD-10486", "Age": 29, "Income": 42000, "LoanAmount": 22000,
        "CreditScore": 615, "MonthsEmployed": 18, "NumCreditLines": 7, "InterestRate": 16.2,
        "LoanTerm": 60, "DTIRatio": 0.48, "Education": "High School", "EmploymentType": "Self-employed",
        "MaritalStatus": "Divorced", "HasMortgage": "No", "HasDependents": "Yes",
        "LoanPurpose": "Education", "HasCoSigner": "No", "Default": 1
    }
]

PRESETS = {
    "lowRisk": {
        "Age": 42, "Income": 95000, "LoanAmount": 20000, "CreditScore": 780,
        "MonthsEmployed": 72, "NumCreditLines": 3, "InterestRate": 6.8, "LoanTerm": 36,
        "DTIRatio": 0.24, "Education": "Master's", "EmploymentType": "Full-time",
        "MaritalStatus": "Married", "HasMortgage": "Yes", "HasDependents": "Yes",
        "LoanPurpose": "Home Improvement", "HasCoSigner": "Yes"
    },
    "mediumRisk": {
        "Age": 32, "Income": 55000, "LoanAmount": 25000, "CreditScore": 670,
        "MonthsEmployed": 30, "NumCreditLines": 5, "InterestRate": 11.2, "LoanTerm": 48,
        "DTIRatio": 0.38, "Education": "Bachelor's", "EmploymentType": "Full-time",
        "MaritalStatus": "Single", "HasMortgage": "No", "HasDependents": "No",
        "LoanPurpose": "Auto", "HasCoSigner": "No"
    },
    "highRisk": {
        "Age": 24, "Income": 28000, "LoanAmount": 22000, "CreditScore": 575,
        "MonthsEmployed": 10, "NumCreditLines": 7, "InterestRate": 17.5, "LoanTerm": 60,
        "DTIRatio": 0.54, "Education": "High School", "EmploymentType": "Part-time",
        "MaritalStatus": "Single", "HasMortgage": "No", "HasDependents": "Yes",
        "LoanPurpose": "Personal", "HasCoSigner": "No"
    }
}

@router.get("/sample", summary="Sample Dataset Rows")
def get_sample_data():
    if os.path.exists(settings.DATA_PATH):
        try:
            df = pd.read_csv(settings.DATA_PATH, nrows=10)
            return {"total_records": len(df), "records": df.to_dict(orient="records")}
        except Exception:
            pass
    return {"total_records": len(SAMPLE_DATASET), "records": SAMPLE_DATASET}

@router.get("/presets", summary="Borrower Presets for Testing")
def get_presets():
    return PRESETS

@router.get("/stats", summary="Dataset Statistical Aggregates")
def get_stats():
    return {
        "total_borrowers": 255347,
        "default_rate": 11.6,
        "average_credit_score": 678,
        "average_loan_amount": 24800,
        "average_dti_ratio": 0.35,
        "default_distribution": [
            {"name": "Non-Default (0)", "value": 225694, "percentage": 88.4},
            {"name": "Default (1)", "value": 29653, "percentage": 11.6}
        ]
    }

