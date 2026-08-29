// utils/distressEngine.js

const calculateDistressScore = (rainfallDeficit, priceDrop, daysUntilLoanDue) => {
    // 1. Rainfall Penalty (Weight: 40%)
    // Assuming a 50% deficit is the worst-case scenario (100 penalty points)
    let rainfallPenalty = (rainfallDeficit / 50) * 100;
    rainfallPenalty = Math.max(0, Math.min(rainfallPenalty, 100)); 

    // 2. Mandi Price Penalty (Weight: 35%)
    // Assuming a 30% price drop below MSP is the worst-case scenario
    let pricePenalty = (priceDrop / 30) * 100;
    pricePenalty = Math.max(0, Math.min(pricePenalty, 100));

    // 3. Loan Proximity Penalty (Weight: 25%)
    // 0 days left = 100 penalty points. > 30 days left = 0 penalty points.
    let loanPenalty = 0;
    if (daysUntilLoanDue <= 0) {
        loanPenalty = 100;
    } else if (daysUntilLoanDue <= 30) {
        loanPenalty = ((30 - daysUntilLoanDue) / 30) * 100;
    }

    // Final Weighted Score
    const finalScore = (0.40 * rainfallPenalty) + (0.35 * pricePenalty) + (0.25 * loanPenalty);
    const roundedScore = Math.round(finalScore);

    // Determine Status
    let status = 'SAFE';
    if (roundedScore >= 80) status = 'CRITICAL DISTRESS';
    else if (roundedScore >= 55) status = 'ASSISTANCE RECOMMENDED';

    return {
        score: roundedScore,
        status: status,
        breakdown: {
            rainfallPenalty: Math.round(rainfallPenalty),
            pricePenalty: Math.round(pricePenalty),
            loanPenalty: Math.round(loanPenalty)
        }
    };
};

module.exports = { calculateDistressScore };