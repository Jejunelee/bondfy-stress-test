export interface InvestorMetrics {
    investedAmount: number;
    yearsInvested: number;
    bondSize: number;
    tenor: number;
    couponRate: number;
    ownershipPct: number;
    
    // Returns
    totalCouponPayments: number;
    annualCouponIncome: number;
    principalReturned: number;
    totalReturn: number;
    netProfit: number;
    roi: number;
    annualizedReturn: number;
    effectiveYield: number;
    
    // Cash flow
    yearlyCashFlow: YearlyCashFlow[];
    
    // Comparisons
    bankDepositReturn: number;
    bondMarketAvgReturn: number;
    premiumVsBank: number;
    
    // Risk metrics
    breakEvenYear: number;
    riskAdjustedReturn: number;
  }
  
  export interface YearlyCashFlow {
    year: number;
    couponPayment: number;
    principalPayment: number;
    yearlyTotal: number;
    cumulativeReturn: number;
    remainingPrincipal: number;
  }