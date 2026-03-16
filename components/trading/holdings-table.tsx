'use client';

import { useTradingStore } from '@/store/trading-store';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';

export function HoldingsTable() {
  const { portfolios, activePortfolioId, assets } = useTradingStore();
  const portfolio = portfolios.find((p) => p.id === activePortfolioId);

  const rows = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.holdings.map((h) => {
      const asset = assets[h.symbol];
      const currentPrice = asset?.price ?? h.averageEntryPrice;
      const currentValue = currentPrice * h.quantity;
      const costBasis = h.averageEntryPrice * h.quantity;
      const pnl = currentValue - costBasis;
      const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
      return { ...h, currentPrice, currentValue, pnl, pnlPct, assetType: asset?.type ?? '' };
    });
  }, [portfolio, assets]);

  if (!portfolio) return null;

  return (
    <div className="holdings-table overflow-auto">
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-white/20 text-sm gap-2">
          <span className="text-4xl">📊</span>
          <span>No holdings yet. Place your first order!</span>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Asset', 'Qty', 'Avg Entry', 'Current', 'Value', 'P&L'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isUp = row.pnl >= 0;
              return (
                <tr key={row.symbol} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{row.symbol}</div>
                    <div className="text-xs text-white/30">{row.assetType}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-white/80">
                    {row.quantity < 1 ? row.quantity.toFixed(6) : row.quantity.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-mono text-white/60">
                    ${row.averageEntryPrice.toFixed(row.averageEntryPrice < 10 ? 4 : 2)}
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    ${row.currentPrice.toFixed(row.currentPrice < 10 ? 4 : 2)}
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    ${row.currentValue.toFixed(2)}
                  </td>
                  <td className={cn('px-4 py-3 font-mono font-medium', isUp ? 'text-emerald-400' : 'text-red-400')}>
                    <div className="flex items-center gap-1">
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isUp ? '+' : ''}${row.pnl.toFixed(2)}
                    </div>
                    <div className="text-xs opacity-70">
                      {isUp ? '+' : ''}{row.pnlPct.toFixed(2)}%
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
