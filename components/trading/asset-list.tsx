'use client';

import { useMemo, useState } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { INITIAL_ASSETS, AssetClass } from '@/lib/market-data';

const CLASSES: (AssetClass | 'All')[] = ['All', 'Stock', 'Crypto', 'Forex', 'Commodity'];

export function AssetList() {
  const { assets, selectedSymbol, setSelectedSymbol } = useTradingStore();
  const [filter, setFilter] = useState<AssetClass | 'All'>('All');
  const [search, setSearch] = useState('');

  const filteredAssets = useMemo(() => {
    return Object.values(assets).filter((a) => {
      const matchesClass = filter === 'All' || a.type === filter;
      const matchesSearch =
        a.symbol.toLowerCase().includes(search.toLowerCase()) ||
        a.name.toLowerCase().includes(search.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [assets, filter, search]);

  return (
    <div className="asset-list flex flex-col h-full">
      <div className="flex gap-2 p-3 border-b border-white/5 flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/60 w-full transition-colors"
        />
        <div className="flex gap-1 w-full overflow-x-auto">
          {CLASSES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                filter === c
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredAssets.map((asset) => {
          const isUp = asset.changePercent >= 0;
          const isSelected = asset.symbol === selectedSymbol;
          return (
            <button
              key={asset.symbol}
              onClick={() => setSelectedSymbol(asset.symbol)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left transition-all border-b border-white/5 hover:bg-white/5',
                isSelected && 'bg-emerald-500/10 border-l-2 border-l-emerald-500'
              )}
            >
              <div>
                <div className="text-sm font-bold text-white">{asset.symbol}</div>
                <div className="text-xs text-white/40 truncate max-w-[120px]">{asset.name}</div>
              </div>
              <div className="text-right">
                <div className={cn('text-sm font-mono font-semibold', isUp ? 'text-emerald-400' : 'text-red-400')}>
                  {asset.price < 10 ? asset.price.toFixed(4) : asset.price.toFixed(2)}
                </div>
                <div className={cn('text-xs flex items-center justify-end gap-0.5', isUp ? 'text-emerald-400/70' : 'text-red-400/70')}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
