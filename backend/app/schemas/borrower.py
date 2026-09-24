from pydantic import BaseModel, Field, field_validator
from typing import Literal, Union

class BorrowerFeatures(BaseModel):
    Age: int = Field(default=35, ge=18, le=100, description="Age of primary borrower in years (18-100)")
    Income: float = Field(default=65000.0, ge=1000.0, description="Annual gross income in USD")
    LoanAmount: float = Field(default=25000.0, ge=500.0, description="Principal requested loan amount in USD")
    CreditScore: int = Field(default=680, ge=300, le=850, description="FICO credit score (300-850)")
    MonthsEmployed: int = Field(default=42, ge=0, le=600, description="Months in current or recent employment")
    NumCreditLines: int = Field(default=4, ge=0, le=30, description="Number of active open credit lines")
    InterestRate: float = Field(default=9.5, ge=1.0, le=40.0, description="Annual percentage rate (APR)")
    LoanTerm: int = Field(default=36, ge=6, le=120, description="Repayment duration in months")
    DTIRatio: float = Field(default=0.35, ge=0.0, le=1.5, description="Debt-to-Income ratio (0.00 to 1.00+)")
    
    Education: Literal["High School", "Bachelor's", "Master's", "Doctorate"] = Field(
        default="Bachelor's", description="Highest completed educational attainment"
    )
    EmploymentType: Literal["Full-time", "Part-time", "Self-employed", "Unemployed"] = Field(
        default="Full-time", description="Current employment status"
    )
    MaritalStatus: Literal["Single", "Married", "Divorced"] = Field(
        default="Single", description="Marital status"
    )
    HasMortgage: Union[str, bool] = Field(
        default="Yes", description="Has an active home mortgage ('Yes'/'No' or True/False)"
    )
    HasDependents: Union[str, bool] = Field(
        default="No", description="Has financially dependent family members ('Yes'/'No' or True/False)"
    )
    LoanPurpose: Literal["Auto", "Business", "Education", "Home Improvement", "Personal"] = Field(
        default="Auto", description="Intended purpose for loan proceeds"
    )
    HasCoSigner: Union[str, bool] = Field(
        default="No", description="Has secondary co-signer guarantee ('Yes'/'No' or True/False)"
    )

    @field_validator("HasMortgage", "HasDependents", "HasCoSigner", mode="before")
    @classmethod
    def normalize_yes_no(cls, v):
        if isinstance(v, bool):
            return "Yes" if v else "No"
        if isinstance(v, str):
            clean = v.strip().capitalize()
            return "Yes" if clean in ["Yes", "Y", "True", "1"] else "No"
        return "No"

    model_config = {
        "json_schema_extra": {
            "example": {
                "Age": 38,
                "Income": 75000,
                "LoanAmount": 20000,
                "CreditScore": 720,
                "MonthsEmployed": 48,
                "NumCreditLines": 4,
                "InterestRate": 8.5,
                "LoanTerm": 36,
                "DTIRatio": 0.28,
                "Education": "Bachelor's",
                "EmploymentType": "Full-time",
                "MaritalStatus": "Married",
                "HasMortgage": "Yes",
                "HasDependents": "Yes",
                "LoanPurpose": "Home Improvement",
                "HasCoSigner": "Yes"
            }
        }
    }
