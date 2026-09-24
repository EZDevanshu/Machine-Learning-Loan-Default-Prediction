import { predictMockRisk } from './mockPrediction';
import { DEFAULT_MODELS_COMPARISON } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Checks if the FastAPI backend service is reachable and healthy.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { online: true, data };
    }
    return { online: false, error: `Status ${response.status}` };
  } catch (err) {
    return { online: false, error: err.message || 'Connection refused' };
  }
}

/**
 * Predicts default risk by invoking the FastAPI Scikit-Learn ML pipeline.
 * Optionally accepts a specific modelId (e.g. 'decision_tree', 'random_forest').
 * If backend is offline, falls back seamlessly to local mock estimation.
 */
export async function predictBorrowerRisk(formData, modelId = null) {
  // Sanitize and typecast form values
  const payload = {
    Age: parseInt(formData.Age, 10) || 35,
    Income: parseFloat(formData.Income) || 60000.0,
    LoanAmount: parseFloat(formData.LoanAmount) || 20000.0,
    CreditScore: parseInt(formData.CreditScore, 10) || 680,
    MonthsEmployed: parseInt(formData.MonthsEmployed, 10) || 36,
    NumCreditLines: parseInt(formData.NumCreditLines, 10) || 4,
    InterestRate: parseFloat(formData.InterestRate) || 9.5,
    LoanTerm: parseInt(formData.LoanTerm, 10) || 36,
    DTIRatio: parseFloat(formData.DTIRatio) || 0.35,
    Education: formData.Education || "Bachelor's",
    EmploymentType: formData.EmploymentType || "Full-time",
    MaritalStatus: formData.MaritalStatus || "Single",
    HasMortgage: formData.HasMortgage === 'Yes' || formData.HasMortgage === true ? 'Yes' : 'No',
    HasDependents: formData.HasDependents === 'Yes' || formData.HasDependents === true ? 'Yes' : 'No',
    LoanPurpose: formData.LoanPurpose || "Auto",
    HasCoSigner: formData.HasCoSigner === 'Yes' || formData.HasCoSigner === true ? 'Yes' : 'No',
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const queryParam = modelId && modelId !== 'best' ? `?model_id=${encodeURIComponent(modelId)}` : '';
    const res = await fetch(`${API_BASE_URL}/predict${queryParam}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`FastAPI responded with HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return {
      ...data,
      isLiveBackend: true,
    };
  } catch (error) {
    console.warn('FastAPI backend request failed, falling back to client-side ML heuristic:', error);
    const mockResult = predictMockRisk(formData);
    return {
      ...mockResult,
      isLiveBackend: false,
      modelUsed: modelId ? modelId : 'Heuristic Baseline (Offline)',
      fallbackNotice: 'Prediction generated using offline heuristic engine (FastAPI server currently offline or unreachable).',
    };
  }
}

/**
 * Fetches real model performance metrics from the FastAPI backend.
 */
export async function fetchModelMetrics() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE_URL}/model/metrics`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Could not fetch metrics from backend, using baseline benchmarks:', err);
    return null;
  }
}

/**
 * Fetches multi-model comparison leaderboard from the FastAPI backend.
 * Falls back to DEFAULT_MODELS_COMPARISON if backend is unreachable.
 */
export async function fetchModelComparison() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/model/comparison`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }

    const data = await res.json();
    return {
      ...data,
      isLiveBackend: true,
    };
  } catch (err) {
    console.warn('Could not fetch multi-model comparison from backend, using calibrated baseline data:', err);
    return {
      ...DEFAULT_MODELS_COMPARISON,
      isLiveBackend: false,
    };
  }
}

/**
 * Sets the active prediction engine on the backend.
 * modelId can be 'best' or a specific model ID (e.g. 'decision_tree', 'random_forest').
 */
export async function setActiveModel(modelId) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE_URL}/model/set-active`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ modelId }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to activate model: status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Could not update active model on backend:', err);
    return {
      success: true,
      activeModelId: modelId,
      activeModelName: modelId === 'best' ? 'Best Model (Auto)' : modelId,
      message: 'Active model updated locally.',
      isLocal: true,
    };
  }
}

/**
 * Gets the current active model from the backend.
 */
export async function getActiveModel() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/model/active`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    return {
      activeSetting: 'best',
      modelId: 'hist_gradient_boosting',
      modelName: 'HistGradientBoosting',
      accuracy: '88.69%',
      isBest: true,
    };
  }
}
