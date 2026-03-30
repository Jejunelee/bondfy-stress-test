import { useMemo } from "react";
import { InvestorMetrics, YearlyCashFlow } from "../investor";

export const useInvestorMetrics = (
  investedAmount: number,
  yearsInvested: number,
  bondSize: number,
  tenor: number,
  couponRate: number
): InvestorMetrics => {
  return useMemo(() => {
    // Calculate pro-rata share based on investment relative to bond size
    const ownershipPct = investedAmount / bondSize;
    
    // Annual coupon payment
    const annualCouponIncome = bondSize * couponRate * ownershipPct;
    
    // Total coupon payments over investment period (capped at bond tenor)
    const yearsOfCoupons = Math.min(yearsInvested, tenor);
    const totalCouponPayments = annualCouponIncome * yearsOfCoupons;
    
    // Principal is only returned if investor holds to full tenure
    const principalReturned = yearsInvested >= tenor ? investedAmount : 0;
    
    // Total return = coupons + principal (if returned)
    const totalReturn = totalCouponPayments + principalReturned;
    const netProfit = totalReturn - investedAmount;
    
    // ROI calculations
    const roi = (netProfit / investedAmount) * 100;
    const annualizedReturn = yearsInvested > 0 
      ? (Math.pow(1 + roi / 100, 1 / yearsInvested) - 1) * 100 
      : 0;
    
    // Yearly cash flow projections
    const yearlyCashFlow: YearlyCashFlow[] = [];
    let cumulativeReturn = 0;
    let remainingPrincipal = investedAmount;
    
    for (let year = 1; year <= yearsInvested; year++) {
      let couponPayment = 0;
      let principalPayment = 0;
      
      // Coupon payments only during bond tenure
      if (year <= tenor) {
        couponPayment = annualCouponIncome;
      }
      
      // Principal returned at end of bond tenure if held to maturity
      if (year === tenor && year <= yearsInvested) {
        principalPayment = investedAmount;
        remainingPrincipal = 0;
      }
      
      const yearlyTotal = couponPayment + principalPayment;
      cumulativeReturn += yearlyTotal;
      
      yearlyCashFlow.push({
        year,
        couponPayment,
        principalPayment,
        yearlyTotal,
        cumulativeReturn,
        remainingPrincipal,
      });
    }
    
    // Benchmark comparisons
    const bankDepositRate = 0.04; // 4% annual
    const bankDepositReturn = investedAmount * Math.pow(1 + bankDepositRate, yearsInvested) - investedAmount;
    
    const bondMarketRate = 0.06; // 6% annual
    const bondMarketAvgReturn = investedAmount * Math.pow(1 + bondMarketRate, yearsInvested) - investedAmount;
    
    const premiumVsBank = bankDepositReturn > 0 
      ? ((netProfit - bankDepositReturn) / bankDepositReturn) * 100 
      : 0;
    
    // Break-even analysis - when cumulative return >= invested amount
    let breakEvenYear = 0;
    let cumulative = 0;
    for (let i = 0; i < yearlyCashFlow.length; i++) {
      cumulative += yearlyCashFlow[i].yearlyTotal;
      if (cumulative >= investedAmount && breakEvenYear === 0) {
        breakEvenYear = yearlyCashFlow[i].year;
        break;
      }
    }
    
    // Risk-adjusted return (return / years to break-even)
    const riskAdjustedReturn = breakEvenYear > 0 ? roi / breakEvenYear : roi / yearsInvested;
    
    // Effective yield on investment
    const effectiveYield = (annualCouponIncome / investedAmount) * 100;
    
    return {
      investedAmount,
      yearsInvested,
      bondSize,
      tenor,
      couponRate,
      ownershipPct,
      totalCouponPayments,
      annualCouponIncome,
      principalReturned,
      totalReturn,
      netProfit,
      roi,
      annualizedReturn,
      yearlyCashFlow,
      bankDepositReturn,
      bondMarketAvgReturn,
      premiumVsBank,
      breakEvenYear,
      riskAdjustedReturn,
      effectiveYield,
    };
  }, [investedAmount, yearsInvested, bondSize, tenor, couponRate]);
};