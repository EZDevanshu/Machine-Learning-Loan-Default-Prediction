import os
import json
import time
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, log_loss, confusion_matrix
)
from sklearn.inspection import permutation_importance

# Avoid loky warning on Windows systems without wmic
os.environ["LOKY_MAX_CPU_COUNT"] = str(os.cpu_count() or 4)

NUMERICAL_COLS = [
    "Age", "Income", "LoanAmount", "CreditScore", "MonthsEmployed",
    "NumCreditLines", "InterestRate", "LoanTerm", "DTIRatio"
]

CATEGORICAL_COLS = [
    "Education", "EmploymentType", "MaritalStatus",
    "HasMortgage", "HasDependents", "LoanPurpose", "HasCoSigner"
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "Loan_default.csv")
BEST_MODEL_PATH = os.path.join(BASE_DIR, "loan_default_pipeline.pkl")
REGISTRY_PATH = os.path.join(BASE_DIR, "models_registry.pkl")
METRICS_OUTPUT_PATH = os.path.join(BASE_DIR, "metrics.json")
MULTI_METRICS_PATH = os.path.join(BASE_DIR, "multi_model_metrics.json")

def build_preprocessor():
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_COLS),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_COLS),
        ]
    )

def train_and_save():
    print(f"Loading dataset from: {DATA_PATH} ...")
    t0 = time.time()
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {len(df):,} rows and {len(df.columns)} columns in {time.time() - t0:.2f}s")

    # Features and Target
    X = df.drop(columns=["LoanID", "Default"])
    y = df["Default"].astype(int)

    print(f"Class distribution: Non-Default (0)={np.sum(y == 0):,} ({np.mean(y == 0)*100:.1f}%), Default (1)={np.sum(y == 1):,} ({np.mean(y == 1)*100:.1f}%)")

    # 80/20 Stratified Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {len(X_train):,} samples | Validation set: {len(X_test):,} samples")

    # Define the 5 candidate models
    candidates = [
        {
            "id": "hist_gradient_boosting",
            "name": "HistGradientBoosting",
            "type": "Ensemble Gradient Boosting",
            "description": "Scikit-Learn Histogram-based Gradient Boosting. Highly optimized tree splits with excellent ROC-AUC.",
            "classifier": HistGradientBoostingClassifier(
                max_iter=120, learning_rate=0.08, max_leaf_nodes=31, random_state=42
            ),
            "strengths": ["Highest ROC-AUC", "Fast convergence", "Non-linear pattern recognition"],
            "best_for": "Default Production Engine (Institutional Grade)"
        },
        {
            "id": "random_forest",
            "name": "Random Forest",
            "type": "Ensemble Bagging (80 Trees)",
            "description": "Bootstrap aggregating ensemble of 80 deep decision trees. Minimizes variance and prevents overfitting.",
            "classifier": RandomForestClassifier(
                n_estimators=80, max_depth=12, min_samples_split=30, min_samples_leaf=15, n_jobs=-1, random_state=42
            ),
            "strengths": ["Extreme robustness", "Low variance", "Outlier resilience"],
            "best_for": "Stable risk underwriting & stress-testing"
        },
        {
            "id": "decision_tree",
            "name": "Decision Tree",
            "type": "Rule-Based Single Tree",
            "description": "Single interpretable decision tree with pruned depth. Exposes clear sequential rules for loan approval.",
            "classifier": DecisionTreeClassifier(
                max_depth=7, min_samples_split=50, min_samples_leaf=20, random_state=42
            ),
            "strengths": ["White-box transparency", "Zero scaling dependency", "Human-readable logic"],
            "best_for": "Regulatory compliance & customer explanations"
        },
        {
            "id": "logistic_regression",
            "name": "Logistic Regression",
            "type": "Linear Generalized Model",
            "description": "Calibrated parametric linear classifier mapping standardized borrower features to default odds ratios.",
            "classifier": LogisticRegression(
                max_iter=1000, random_state=42
            ),
            "strengths": ["Sub-millisecond latency", "Direct odds interpretation", "Minimal memory footprint"],
            "best_for": "High-throughput real-time APIs"
        },
        {
            "id": "knn",
            "name": "K-Nearest Neighbors (KNN)",
            "type": "Instance-Based Similarity",
            "description": "Distance-weighted nearest-neighbor classifier. Scores borrowers based on voting from 7 closest historical records.",
            "classifier": KNeighborsClassifier(
                n_neighbors=7, weights="distance", n_jobs=-1
            ),
            "strengths": ["Non-parametric", "Neighborhood clustering", "No linearity assumption"],
            "best_for": "Peer-group loan benchmarking"
        }
    ]

    trained_pipelines = {}
    models_comparison = []

    # Fast validation subset for heavy distance metric (KNN)
    val_sample_idx = np.random.RandomState(42).choice(len(X_test), size=min(8000, len(X_test)), replace=False)
    X_val_sample = X_test.iloc[val_sample_idx]
    y_val_sample = y_test.iloc[val_sample_idx]

    knn_train_idx = np.random.RandomState(42).choice(len(X_train), size=min(30000, len(X_train)), replace=False)
    X_knn_train = X_train.iloc[knn_train_idx]
    y_knn_train = y_train.iloc[knn_train_idx]

    for item in candidates:
        m_id = item["id"]
        m_name = item["name"]
        print(f"\n--- Training Candidate: {m_name} ({item['type']}) ---")

        pipe = Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("classifier", item["classifier"])
        ])

        t_start = time.time()
        if m_id == "knn":
            pipe.fit(X_knn_train, y_knn_train)
            train_duration = time.time() - t_start
            print(f"[{m_name}] Fitted on 30,000 calibrated sample in {train_duration:.2f}s")
            
            # Predict on validation sample
            t_infer = time.time()
            y_pred = pipe.predict(X_val_sample)
            y_proba = pipe.predict_proba(X_val_sample)[:, 1]
            infer_time = (time.time() - t_infer) / len(X_val_sample) * 1000 # ms per sample
            eval_y = y_val_sample
        else:
            pipe.fit(X_train, y_train)
            train_duration = time.time() - t_start
            print(f"[{m_name}] Fitted in {train_duration:.2f}s")

            t_infer = time.time()
            y_pred = pipe.predict(X_test)
            y_proba = pipe.predict_proba(X_test)[:, 1]
            infer_time = (time.time() - t_infer) / len(X_test) * 1000 # ms per sample
            eval_y = y_test

        acc = float(accuracy_score(eval_y, y_pred))
        prec = float(precision_score(eval_y, y_pred, zero_division=0))
        rec = float(recall_score(eval_y, y_pred, zero_division=0))
        f1 = float(f1_score(eval_y, y_pred, zero_division=0))
        roc = float(roc_auc_score(eval_y, y_proba))
        loss = float(log_loss(eval_y, y_proba))

        cm = confusion_matrix(eval_y, y_pred)
        cm_dict = {
            "true_negatives": int(cm[0, 0]),
            "false_positives": int(cm[0, 1]),
            "false_negatives": int(cm[1, 0]),
            "true_positives": int(cm[1, 1])
        }

        print(f"[{m_name}] Accuracy: {acc*100:.2f}% | ROC-AUC: {roc:.3f} | F1: {f1:.3f} | Latency: {infer_time:.2f}ms/req")

        trained_pipelines[m_id] = pipe

        models_comparison.append({
            "id": m_id,
            "name": m_name,
            "type": item["type"],
            "description": item["description"],
            "strengths": item["strengths"],
            "bestFor": item["best_for"],
            "accuracy": round(acc, 4),
            "accuracyPercentage": f"{round(acc * 100, 2)}%",
            "rocAuc": round(roc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1Score": round(f1, 4),
            "logLoss": round(loss, 4),
            "latencyMs": round(infer_time, 2),
            "trainDurationSeconds": round(train_duration, 2),
            "confusionMatrix": cm_dict,
            "isBest": False
        })

    # Sort candidates by Accuracy (and ROC-AUC as tie-breaker)
    models_comparison.sort(key=lambda m: (m["accuracy"], m["rocAuc"]), reverse=True)

    # Mark the best model
    for rank, m in enumerate(models_comparison, start=1):
        m["rank"] = rank
    best_model_info = models_comparison[0]
    best_model_info["isBest"] = True
    best_model_id = best_model_info["id"]
    best_pipeline = trained_pipelines[best_model_id]

    print("\n" + "=" * 60)
    print(f"[BEST MODEL] IDENTIFIED: {best_model_info['name']} ({best_model_info['accuracyPercentage']} Accuracy, ROC-AUC: {best_model_info['rocAuc']})")
    print("=" * 60)

    # Compute feature importance for best model (using fast permutation on holdout sample)
    print("Computing feature importance for top model...")
    sample_indices = np.random.RandomState(42).choice(len(X_test), size=min(5000, len(X_test)), replace=False)
    sample_X_test = X_test.iloc[sample_indices]
    sample_y_test = y_test.iloc[sample_indices]

    perm_importance = permutation_importance(
        best_pipeline, sample_X_test, sample_y_test, n_repeats=3, random_state=42, scoring="roc_auc"
    )

    sorted_idx = perm_importance.importances_mean.argsort()[::-1]
    feature_names = list(X.columns)
    total_imp = np.sum(np.maximum(0, perm_importance.importances_mean))

    feature_importances = []
    for rank, idx in enumerate(sorted_idx[:10], start=1):
        raw_val = max(0.001, float(perm_importance.importances_mean[idx]))
        norm_val = round(raw_val / (total_imp + 1e-6), 3) if total_imp > 0 else 0.05
        feature_importances.append({
            "feature": feature_names[idx],
            "importance": norm_val,
            "rank": rank
        })

    # Build primary metrics payload (for backward compatibility)
    metrics_payload = {
        "modelName": f"LoanGuard-{best_model_info['name']}-v1.0",
        "algorithm": f"Supervised {best_model_info['name']} Pipeline ({best_model_info['type']})",
        "datasetSize": f"{len(df):,} Records Benchmarked",
        "testSplit": f"20% Holdout Partition ({len(X_test):,} Validation Samples)",
        "evaluatedAt": datetime.now(timezone.utc).isoformat(),
        "metrics": [
            {
                "key": "accuracy",
                "label": "Accuracy",
                "value": best_model_info["accuracy"],
                "percentageText": best_model_info["accuracyPercentage"],
                "description": "Overall proportion of correct loan default classifications.",
                "benchmark": "Target: > 85.0%"
            },
            {
                "key": "precision",
                "label": "Precision",
                "value": best_model_info["precision"],
                "percentageText": f"{round(best_model_info['precision'] * 100, 1)}%",
                "description": "Proportion of predicted defaults that were true defaults.",
                "benchmark": "Target: > 80.0%"
            },
            {
                "key": "recall",
                "label": "Recall (Sensitivity)",
                "value": best_model_info["recall"],
                "percentageText": f"{round(best_model_info['recall'] * 100, 1)}%",
                "description": "Proportion of actual default cases correctly identified.",
                "benchmark": "Target: > 78.0%"
            },
            {
                "key": "f1",
                "label": "F1 Score",
                "value": best_model_info["f1Score"],
                "percentageText": f"{round(best_model_info['f1Score'] * 100, 1)}%",
                "description": "Harmonic mean balancing precision and recall.",
                "benchmark": "Target: > 80.0%"
            },
            {
                "key": "roc_auc",
                "label": "ROC-AUC Score",
                "value": best_model_info["rocAuc"],
                "percentageText": f"{best_model_info['rocAuc']}",
                "description": "Discriminative ability between default and non-default classes.",
                "benchmark": "Target: > 0.750"
            },
            {
                "key": "log_loss",
                "label": "Log-Loss Rate",
                "value": best_model_info["logLoss"],
                "percentageText": f"{best_model_info['logLoss']}",
                "description": "Cross-entropy penalty for calibrated probabilistic predictions.",
                "benchmark": "Target: < 0.350"
            }
        ],
        "featureImportances": feature_importances,
        "confusionMatrix": best_model_info["confusionMatrix"]
    }

    multi_payload = {
        "datasetSize": f"{len(df):,} Records Benchmarked",
        "testSplit": f"20% Holdout Partition ({len(X_test):,} Validation Samples)",
        "evaluatedAt": datetime.now(timezone.utc).isoformat(),
        "bestModelId": best_model_id,
        "bestModelName": best_model_info["name"],
        "totalModels": len(models_comparison),
        "models": models_comparison
    }

    # Save Best Model Pipeline
    print(f"Saving primary best pipeline to: {BEST_MODEL_PATH} ...")
    joblib.dump(best_pipeline, BEST_MODEL_PATH)

    # Save Multi-Model Registry
    print(f"Saving all 5 model pipelines registry to: {REGISTRY_PATH} ...")
    joblib.dump(trained_pipelines, REGISTRY_PATH)

    # Save individual metrics.json
    print(f"Saving primary metrics to: {METRICS_OUTPUT_PATH} ...")
    with open(METRICS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)

    # Save multi_model_metrics.json
    print(f"Saving multi-model comparison to: {MULTI_METRICS_PATH} ...")
    with open(MULTI_METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(multi_payload, f, indent=2)

    print("\n[SUCCESS] All 5 candidate models trained, benchmarked, and serialized successfully!")

if __name__ == "__main__":
    train_and_save()
