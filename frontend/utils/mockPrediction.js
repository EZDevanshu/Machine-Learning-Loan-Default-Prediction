/**
 * Isolated Mock Prediction Utility for LoanGuard AI
 * 
 * Future Backend Integration:
 * This function is structured to mirror the exact input payload and response payload expected
 * from the future Python ML backend API (e.g., POST /api/v1/predict).
 * 
 * @param {Object} formData - Borrower financial and demographic features
 * @returns {Object} Mock prediction outcome with risk probability, level, recommendations, and key indicators.
 */
export function predictMockRisk(formData) {
  const age = Number(formData.Age) || 35;
  const income = Number(formData.Income) || 60000;
  const loanAmount = Number(formData.LoanAmount) || 20000;
  const creditScore = Number(formData.CreditScore) || 680;
  const monthsEmployed = Number(formData.MonthsEmployed) || 36;
  const numCreditLines = Number(formData.NumCreditLines) || 4;
  const interestRate = Number(formData.InterestRate) || 9.5;
  const dtiRatio = Number(formData.DTIRatio) || 0.35;
  
  const hasCoSigner = formData.HasCoSigner === 'Yes' || formData.HasCoSigner === true;
  const hasMortgage = formData.HasMortgage === 'Yes' || formData.HasMortgage === true;
  const hasDependents = formData.HasDependents === 'Yes' || formData.HasDependents === true;
  const employmentType = formData.EmploymentType || 'Full-time';
  const education = formData.Education || "Bachelor's";

  // Weighted risk scoring heuristic based on statistical lending metrics
  let baseScore = 0.20; // 20% baseline default rate

  // 1. Credit Score impact (High impact)
  if (creditScore >= 750) baseScore -= 0.15;
  else if (creditScore >= 700) baseScore -= 0.08;
  else if (creditScore >= 640) baseScore += 0.04;
  else baseScore += 0.22;

  // 2. DTI Ratio impact (High impact)
  if (dtiRatio > 0.50) baseScore += 0.18;
  else if (dtiRatio > 0.40) baseScore += 0.10;
  else if (dtiRatio < 0.25) baseScore -= 0.06;

  // 3. Loan-to-Income ratio
  const ltiRatio = income > 0 ? loanAmount / income : 1.5;
  if (ltiRatio > 0.7) baseScore += 0.12;
  else if (ltiRatio > 0.4) baseScore += 0.05;
  else baseScore -= 0.04;

  // 4. Employment & Tenure
  if (employmentType === 'Unemployed') baseScore += 0.25;
  else if (employmentType === 'Part-time') baseScore += 0.08;
  else if (employmentType === 'Self-employed') baseScore += 0.04;

  if (monthsEmployed < 12) baseScore += 0.08;
  else if (monthsEmployed > 60) baseScore -= 0.06;

  // 5. Interest Rate
  if (interestRate > 15) baseScore += 0.10;
  else if (interestRate < 7) baseScore -= 0.04;

  // 6. Safeguards & Stabilizers
  if (hasCoSigner) baseScore -= 0.09;
  if (education === 'Master\'s' || education === 'Doctorate') baseScore -= 0.03;
  if (numCreditLines > 6) baseScore += 0.05;

  // Bound between 3% and 96%
  let riskProbability = Math.max(0.03, Math.min(0.96, baseScore));
  const probabilityPercentage = (riskProbability * 100).toFixed(1);

  // Categorize Risk Level
  let riskLevel = 'LOW';
  let statusColor = 'green';
  let badgeText = 'Low Risk Profile';
  let recommendation = 'Low estimated default risk. Borrower profile demonstrates strong financial health and debt sustainability. Standard approval recommended.';

  if (riskProbability >= 0.45) {
    riskLevel = 'HIGH';
    statusColor = 'red';
    badgeText = 'High Risk Profile';
    recommendation = 'Elevated probability of default detected. High Debt-to-Income or weaker credit metrics indicate potential repayment stress. Secondary manual review or additional collateral recommended.';
  } else if (riskProbability >= 0.22) {
    riskLevel = 'MEDIUM';
    statusColor = 'amber';
    badgeText = 'Moderate Risk Profile';
    recommendation = 'Moderate default probability. Borrower meets baseline criteria but has key risk factors (e.g. moderate credit score or high LTI). Strict loan terms or co-signer required.';
  }

  // Key factors extraction
  const keyFactors = [];
  if (creditScore >= 720) keyFactors.push({ text: `Strong Credit Score (${creditScore})`, positive: true });
  else if (creditScore < 650) keyFactors.push({ text: `Low Credit Score (${creditScore})`, positive: false });

  if (dtiRatio <= 0.35) keyFactors.push({ text: `Healthy DTI Ratio (${(dtiRatio * 100).toFixed(0)}%)`, positive: true });
  else keyFactors.push({ text: `High Debt Burden (${(dtiRatio * 100).toFixed(0)}% DTI)`, positive: false });

  if (hasCoSigner) keyFactors.push({ text: 'Guaranteed with Co-Signer', positive: true });
  else keyFactors.push({ text: 'No Co-Signer present', positive: false });

  if (monthsEmployed >= 36) keyFactors.push({ text: `Stable Employment (${monthsEmployed} mos)`, positive: true });
  else keyFactors.push({ text: `Short Job Tenure (${monthsEmployed} mos)`, positive: false });

  return {
    riskProbability: parseFloat(probabilityPercentage),
    riskLevel,
    statusColor,
    badgeText,
    recommendation,
    keyFactors,
    evaluatedAt: new Date().toISOString(),
    recap: {
      creditScore,
      dtiRatio: `${(dtiRatio * 100).toFixed(0)}%`,
      loanAmount: `$${loanAmount.toLocaleString()}`,
      income: `$${income.toLocaleString()}`,
    }
  };
}
