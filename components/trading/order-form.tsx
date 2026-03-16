'use client';

import { useState } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { cn } from '@/lib/utils';
import { Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function OrderForm() {
  const { assets, selectedSymbol, portfolios, activePortfolioId, executeOrder } = useTradingStore();
  const asset = assets[selectedSymbol];
  const portfolio = portfolios.find((p) => p.id === activePortfolioId);

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [loading, setLoading] = useState(false);

  if (!asset || !portfolio) return null;

  const execPrice = orderType === 'LIMIT' && limitPrice ? parseFloat(limitPrice) : asset.price;
  const qty = parseFloat(quantity) || 0;
  const total = execPrice * qty;

  const holding = portfolio.holdings.find((h) => h.symbol === selectedSymbol);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (orderType === 'LIMIT' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast.error('Please enter a valid limit price');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = executeOrder(activePortfolioId, selectedSymbol, side, orderType, qty, parseFloat(limitPrice));
      if (result.success) {
        toast.success(result.message, { description: `${qty} × ${selectedSymbol}` });
        setQuantity('');
        setLimitPrice('');
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form flex flex-col gap-4 p-4">
      {/* Side selector */}
      <div className="flex rounded-xl overflow-hidden border border-white/10">
        {(['BUY', 'SELL'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={cn(
              'flex-1 py-2.5 text-sm font-bold transition-all',
              s === 'BUY'
                ? side === 'BUY'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-transparent text-white/40 hover:text-white hover:bg-emerald-500/10'
                : side === 'SELL'
                ? 'bg-red-500 text-black'
                : 'bg-transparent text-white/40 hover:text-white hover:bg-red-500/10'
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Order type */}
      <div className="flex gap-2">
        {(['MARKET', 'LIMIT'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOrderType(t)}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all',
              orderType === t
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/5 bg-transparent text-white/30 hover:text-white/60'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Current price */}
      <div className="text-xs text-white/40 flex justify-between">
        <span>Market Price</span>
        <span className="font-mono text-white">${asset.price.toFixed(asset.price < 10 ? 4 : 2)}</span>
      </div>

      {/* Limit price field */}
      {orderType === 'LIMIT' && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40">Limit Price ($)</label>
          <input
            type="number"
            step="any"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder={asset.price.toFixed(2)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>
      )}

      {/* Quantity */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/40">Quantity</label>
        <input
          type="number"
          step="any"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="0.00"
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-white/20 outline-none focus:border-emerald-500/60 transition-colors"
        />
        <div className="flex gap-1 mt-1">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => {
                if (side === 'BUY') {
                  const maxQty = portfolio.cashBalance / execPrice;
                  setQuantity(((maxQty * pct) / 100).toFixed(6));
                } else if (holding) {
                  setQuantity(((holding.quantity * pct) / 100).toFixed(6));
                }
              }}
              className="flex-1 py-1 rounded text-xs text-white/40 bg-white/5 hover:bg-white/10 hover:text-white transition-all"
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white/5 rounded-xl p-3 space-y-1.5 text-xs">
        <div className="flex justify-between text-white/40">
          <span>Est. Total</span>
          <span className="font-mono text-white">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white/40">
          <span>Available Cash</span>
          <span className="font-mono">${portfolio.cashBalance.toFixed(2)}</span>
        </div>
        {holding && (
          <div className="flex justify-between text-white/40">
            <span>Current Holdings</span>
            <span className="font-mono">{holding.quantity.toFixed(6)} {selectedSymbol}</span>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all',
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-95',
          side === 'BUY'
            ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
        )}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Zap size={14} />
            {side} {selectedSymbol}
          </>
        )}
      </button>

      <div className="flex items-center gap-1 justify-center text-xs text-white/20">
        <ShieldCheck size={10} />
        <span>Simulated — no real money involved</span>
      </div>
    </form>
  );
}
