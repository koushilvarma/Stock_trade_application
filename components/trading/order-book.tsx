'use client';

import { useMemo } from 'react';
import { useTradingStore } from '@/store/trading-store';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export function OrderBook() {
  const { assets, selectedSymbol } = useTradingStore();
  const asset = assets[selectedSymbol];

  const { bids, asks } = useMemo(() => {
    if (!asset) return { bids: [], asks: [] };
    const numLevels = 8;
    const spread = asset.price * 0.0003;
    const tickSize = asset.price < 1 ? 0.0001 : asset.price < 100 ? 0.01 : 0.1;

    const asks: OrderBookEntry[] = [];
    let runningAsk = 0;
    for (let i = numLevels; i >= 1; i--) {
      const p = parseFloat((asset.price + spread * i).toFixed(asset.price < 10 ? 4 : 2));
      const s = parseFloat((Math.random() * 500 + 50).toFixed(2));
      runningAsk += s;
      asks.unshift({ price: p, size: s, total: parseFloat(runningAsk.toFixed(2)) });
    }

    const bids: OrderBookEntry[] = [];
    let runningBid = 0;
    for (let i = 1; i <= numLevels; i++) {
      const p = parseFloat((asset.price - spread * i).toFixed(asset.price < 10 ? 4 : 2));
      const s = parseFloat((Math.random() * 500 + 50).toFixed(2));
      runningBid += s;
      bids.push({ price: p, size: s, total: parseFloat(runningBid.toFixed(2)) });
    }

    return { bids, asks };
  }, [asset?.price]);

  const maxTotal = Math.max(
    ...(bids.map(b => b.total)),
    ...(asks.map(a => a.total)),
  );

  if (!asset) return null;

  const Row = ({ entry, side }: { entry: OrderBookEntry; side: 'bid' | 'ask' }) => {
    const isAsk = side === 'ask';
    const pct = (entry.total / maxTotal) * 100;
    return (
      <div className="relative flex justify-between items-center px-3 py-[3px] text-xs font-mono overflow-hidden group hover:bg-white/5">
        <div
          className={`absolute inset-y-0 ${isAsk ? 'right-0' : 'left-0'} opacity-10`}
          style={{ width: `${pct}%`, background: isAsk ? '#ef4444' : '#10b981' }}
        />
        <span className={isAsk ? 'text-red-400' : 'text-emerald-400'}>{entry.price.toFixed(asset.price < 10 ? 4 : 2)}</span>
        <span className="text-white/50">{entry.size.toFixed(2)}</span>
        <span className="text-white/30">{entry.total.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="order-book flex flex-col text-xs">
      <div className="flex justify-between px-3 py-2 text-white/20 uppercase tracking-wider border-b border-white/5">
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>
      <div className="flex flex-col">
        {asks.map((ask, i) => <Row key={`ask-${i}`} entry={ask} side="ask" />)}
      </div>
      <div className="flex items-center justify-center py-2 border-y border-white/10 bg-white/3">
        <span className="font-mono font-bold text-sm text-white">${asset.price.toFixed(asset.price < 10 ? 4 : 2)}</span>
        <span className={`ml-2 text-xs ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {asset.changePercent >= 0 ? '▲' : '▼'} {Math.abs(asset.changePercent).toFixed(2)}%
        </span>
      </div>
      <div className="flex flex-col">
        {bids.map((bid, i) => <Row key={`bid-${i}`} entry={bid} side="bid" />)}
      </div>
    </div>
  );
}
