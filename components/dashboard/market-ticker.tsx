'use client';

import { useEffect, useRef } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MarketTicker() {
  const { assets } = useTradingStore();
  const tickerRef = useRef<HTMLDivElement>(null);

  const assetList = Object.values(assets);

  return (
    <div className="ticker-wrapper overflow-hidden border-y border-white/10 bg-black/30 backdrop-blur-sm py-2 relative">
      <div className="absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-[#090e1a] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-[#090e1a] to-transparent pointer-events-none" />
      <div className="ticker-track flex gap-8 animate-ticker whitespace-nowrap" ref={tickerRef}>
        {[...assetList, ...assetList].map((asset, idx) => {
          const isUp = asset.price >= asset.previousPrice;
          return (
            <div key={`${asset.symbol}-${idx}`} className="flex items-center gap-2 shrink-0">
              <span className="text-white/50 text-xs font-bold tracking-wider">{asset.symbol}</span>
              <span className={cn('font-mono text-sm font-semibold', isUp ? 'text-emerald-400' : 'text-red-400')}>
                {asset.price.toFixed(asset.type === 'Forex' ? 4 : 2)}
              </span>
              <span className={cn('flex items-center gap-0.5 text-xs font-medium', isUp ? 'text-emerald-400/70' : 'text-red-400/70')}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%
              </span>
              <span className="text-white/20 text-xs">|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
