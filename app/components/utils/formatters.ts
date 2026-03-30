export const formatCurrency = (n: number): string => {
    if (n >= 1e9) return `₱${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `₱${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `₱${(n / 1e3).toFixed(0)}K`;
    return `₱${Math.round(n)}`;
  };
  
  export const formatPercent = (n: number, decimals = 1): string =>
    `${n.toFixed(decimals)}%`;
  
  export const getReferralTier = (bond: number) => {
    const TIERS = [
      { label: "₱0–250M", rate: 0.001, pct: "0.1%" },
      { label: "₱250M–500M", rate: 0.002, pct: "0.2%" },
      { label: "₱500M–750M", rate: 0.003, pct: "0.3%" },
      { label: "₱750M+", rate: 0.004, pct: "0.4%" },
    ];
    
    if (bond <= 250_000_000) return TIERS[0];
    if (bond <= 500_000_000) return TIERS[1];
    if (bond <= 750_000_000) return TIERS[2];
    return TIERS[3];
  };