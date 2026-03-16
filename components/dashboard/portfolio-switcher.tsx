'use client';

import { useTradingStore } from '@/store/trading-store';
import { cn } from '@/lib/utils';
import { Briefcase, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function PortfolioSwitcher() {
  const { portfolios, activePortfolioId, setActivePortfolio } = useTradingStore();
  const [open, setOpen] = useState(false);
  const active = portfolios.find((p) => p.id === activePortfolioId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm transition-all"
      >
        <Briefcase size={14} className="text-emerald-400" />
        <span className="text-white font-medium">{active?.name ?? 'Portfolio'}</span>
        <ChevronDown size={12} className={cn('text-white/40 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-[#0d1526] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          {portfolios.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActivePortfolio(p.id); setOpen(false); }}
              className={cn(
                'w-full flex flex-col px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0',
                p.id === activePortfolioId && 'bg-emerald-500/10'
              )}
            >
              <span className="text-sm font-medium text-white">{p.name}</span>
              <span className="text-xs text-white/40 font-mono">${p.cashBalance.toFixed(2)} cash</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
