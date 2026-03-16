'use client';

import { useEffect, useState } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { Users } from 'lucide-react';

const TRADER_NAMES = [
  'AlphaWolf', 'Quant_X', 'TradeMaster', 'MarketOwl', 'BullRun99',
  'NightTrader', 'VolSurfer', 'SkyCapital', 'EdgeHolder', 'FluxRider',
  'CryptoNaut', 'DeltaHedge', 'Nexus_T', 'ZeroLag', 'PinBar_Pro',
  'LongShort', 'ArbitrageK', 'MomentumX', 'SignalFX', 'TechTracer'
];

interface SimActivity {
  id: number;
  trader: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price: number;
  time: number;
}

export function ActiveUsersPanel() {
  const { assets } = useTradingStore();
  const [activities, setActivities] = useState<SimActivity[]>([]);
  const [activeCount, setActiveCount] = useState(52);
  const assetSymbols = Object.keys(assets);

  useEffect(() => {
    if (assetSymbols.length === 0) return;
    const interval = setInterval(() => {
      const sym = assetSymbols[Math.floor(Math.random() * assetSymbols.length)];
      const asset = useTradingStore.getState().assets[sym];
      if (!asset) return;

      const newActivity: SimActivity = {
        id: Date.now(),
        trader: TRADER_NAMES[Math.floor(Math.random() * TRADER_NAMES.length)],
        symbol: sym,
        side: Math.random() > 0.48 ? 'BUY' : 'SELL',
        qty: parseFloat((Math.random() * 50 + 0.1).toFixed(2)),
        price: asset.price,
        time: Date.now(),
      };

      setActivities((prev) => [newActivity, ...prev].slice(0, 15));
      setActiveCount(Math.floor(Math.random() * 30) + 45);
    }, 1200);
    return () => clearInterval(interval);
  }, [assetSymbols.length]);

  return (
    <div className="active-users flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Users size={13} className="text-white/40" />
          <span className="text-xs text-white/50 font-medium">{activeCount} active traders</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-0">
        {activities.map((act) => (
          <div key={act.id} className="flex items-center gap-2 px-4 py-2 border-b border-white/5 hover:bg-white/3 transition-all animate-in slide-in-from-top-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: act.side === 'BUY' ? '#10b981' : '#ef4444' }} />
            <span className="text-white/60 font-medium truncate flex-1">{act.trader}</span>
            <span className={`font-bold shrink-0 ${act.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{act.side}</span>
            <span className="text-white/40 shrink-0">{act.qty}×</span>
            <span className="text-white font-mono shrink-0">{act.symbol}</span>
            <span className="text-white/30 font-mono shrink-0">@{act.price < 10 ? act.price.toFixed(3) : act.price.toFixed(2)}</span>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="flex items-center justify-center h-20 text-white/20 text-xs">Loading market activity...</div>
        )}
      </div>
    </div>
  );
}
