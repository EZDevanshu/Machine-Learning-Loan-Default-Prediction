from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class KeyFactor(BaseModel):
    text: str = Field(description="Description of the contributing risk driver factor")
    positive: bool = Field(description="True if factor lowers default risk, False if factor increases risk")

class RecapData(BaseModel):
    creditScore: int = Field(description="Borrower FICO credit score")
    dtiRatio: str = Field(description="Formatted Debt-to-Income percentage string")
    loanAmount: str = Field(description="Formatted principal loan amount string")
    income: str = Field(description="Formatted annual gross income string")

class RiskPredictionResponse(BaseModel):
    riskProbability: float = Field(description="Calibrated probability percentage of default (0.0 - 100.0)")
    riskLevel: Literal["LOW", "MEDIUM", "HIGH"] = Field(description="Categorical risk tier classification")
    statusColor: Literal["green", "amber", "red"] = Field(description="UI theme indicator color")
    badgeText: str = Field(description="Descriptive badge string for user interface")
    recommendation: str = Field(description="Automated underwriting insight and guidance")
    keyFactors: List[KeyFactor] = Field(default_factory=list, description="Top positive and negative risk contributors")
    recap: RecapData = Field(description="Recap of primary borrower financial metrics")
    evaluatedAt: str = Field(description="ISO timestamp when prediction was generated")
    engine: str = Field(default="FastAPI + Scikit-Learn Supervised ML", description="ML model engine identifier")
    confidenceScore: Optional[float] = Field(default=None, description="Model prediction confidence score (0.0 to 1.0)")
    modelUsed: Optional[str] = Field(default=None, description="Name of the model that executed inference")
    modelId: Optional[str] = Field(default=None, description="Identifier of the model that executed inference")
    modelAccuracy: Optional[str] = Field(default=None, description="Benchmark accuracy of the model used")
    isBestModel: Optional[bool] = Field(default=None, description="True if the prediction was run by the best model")
