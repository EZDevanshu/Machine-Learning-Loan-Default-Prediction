from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class MetricDetail(BaseModel):
    key: str = Field(description="Internal metric identifier")
    label: str = Field(description="Human readable display name")
    value: float = Field(description="Metric numerical value (e.g. 0.884 for 88.4%)")
    percentageText: str = Field(description="Formatted percentage string (e.g. '88.4%')")
    description: str = Field(description="Summary explanation of what the metric measures")
    benchmark: str = Field(description="Industry standard comparison or target")

class FeatureImportance(BaseModel):
    feature: str
    importance: float
    rank: int

class ModelMetricsResponse(BaseModel):
    modelName: str = Field(default="GradientBoosted-LoanClassifier-v1.0")
    algorithm: str = Field(default="Ensemble Gradient Boosting & Logistic Calibrator")
    datasetSize: str = Field(default="255,347 Records")
    testSplit: str = Field(default="20% Holdout Test Partition (51,069 records)")
    evaluatedAt: str = Field(description="ISO timestamp of metric calculation")
    metrics: List[MetricDetail]
    featureImportances: List[FeatureImportance]
    confusionMatrix: Optional[Dict[str, int]] = None

class ModelComparisonItem(BaseModel):
    id: str
    name: str
    type: str
    description: str
    strengths: List[str]
    bestFor: str
    accuracy: float
    accuracyPercentage: str
    rocAuc: float
    precision: float
    recall: float
    f1Score: float
    logLoss: float
    latencyMs: float
    trainDurationSeconds: float
    confusionMatrix: Optional[Dict[str, int]] = None
    isBest: bool
    isActive: bool = False
    rank: int

class MultiModelComparisonResponse(BaseModel):
    datasetSize: str
    testSplit: str
    evaluatedAt: str
    bestModelId: str
    bestModelName: str
    activeModelId: str
    activeModelName: str
    totalModels: int
    models: List[ModelComparisonItem]

class SetActiveModelRequest(BaseModel):
    modelId: str = Field(description="ID of the model to activate, or 'best' for highest accuracy model")

class SetActiveModelResponse(BaseModel):
    success: bool
    activeModelId: str
    activeModelName: str
    message: str

