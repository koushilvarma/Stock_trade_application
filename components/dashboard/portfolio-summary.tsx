'use client';

import { useMemo } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Activity } from 'lucide-react';

export function PortfolioSummary() {
  const { portfolios, activePortfolioId, assets } = useTradingStore();
  const portfolio = portfolios.find((p) => p.id === activePortfolioId);

  const { totalEquity, totalPnL, totalPnLPercent, totalInvested } = useMemo(() => {
    if (!portfolio) return { totalEquity: 0, totalPnL: 0, totalPnLPercent: 0, totalInvested: 0 };

    let holdingsValue = 0;
    let invested = 0;

    portfolio.holdings.forEach((h) => {
      const asset = assets[h.symbol];
      if (asset) {
        holdingsValue += asset.price * h.quantity;
        invested += h.averageEntryPrice * h.quantity;
      }
    });

    const equity = portfolio.cashBalance + holdingsValue;
    const pnl = holdingsValue - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;

    return {
      totalEquity: equity,
      totalPnL: pnl,
      totalPnLPercent: pnlPct,
      totalInvested: invested,
    };
  }, [portfolio, assets]);

  const isPositive = totalPnL >= 0;

  if (!portfolio) return null;

  const cards = [
    {
      label: 'Total Equity',
      value: `$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign size={18} />,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Cash Balance',
      value: `$${portfolio.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <Activity size={18} />,
      color: 'text-sky-400',
      bg: 'from-sky-500/10 to-sky-500/5',
      border: 'border-sky-500/20',
    },
    {
      label: 'Invested',
      value: `$${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <Briefcase size={18} />,
      color: 'text-violet-400',
      bg: 'from-violet-500/10 to-violet-500/5',
      border: 'border-violet-500/20',
    },
    {
      label: 'Unrealized P&L',
      value: `${isPositive ? '+' : ''}$${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${isPositive ? '+' : ''}${totalPnLPercent.toFixed(2)}%)`,
      icon: isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
      color: isPositive ? 'text-emerald-400' : 'text-red-400',
      bg: isPositive ? 'from-emerald-500/10 to-emerald-500/5' : 'from-red-500/10 to-red-500/5',
      border: isPositive ? 'border-emerald-500/20' : 'border-red-500/20',
    },
  ];

  return (
    <div className="portfolio-summary grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`summary-card bg-gradient-to-br ${c.bg} border ${c.border} rounded-xl p-4 flex flex-col gap-2`}
        >
          <div className={`flex items-center gap-2 ${c.color} opacity-80`}>
            {c.icon}
            <span className="text-xs font-medium uppercase tracking-widest">{c.label}</span>
          </div>
          <div className={`text-lg font-bold ${c.color} font-mono`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
