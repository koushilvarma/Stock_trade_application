'use client';

import { useMarketSimulator } from '@/hooks/use-market-simulator';
import { MarketTicker } from '@/components/dashboard/market-ticker';
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary';
import { PortfolioSwitcher } from '@/components/dashboard/portfolio-switcher';
import { ActiveUsersPanel } from '@/components/dashboard/active-users';
import { AssetList } from '@/components/trading/asset-list';
import { PriceChart } from '@/components/trading/price-chart';
import { OrderForm } from '@/components/trading/order-form';
import { OrderBook } from '@/components/trading/order-book';
import { HoldingsTable } from '@/components/trading/holdings-table';
import { OrderHistory } from '@/components/trading/order-history';
import { useTradingStore } from '@/store/trading-store';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

type BottomTab = 'holdings' | 'orders' | 'activity';

export default function TradingPlatform() {
  useMarketSimulator();
  const { assets } = useTradingStore();
  const [bottomTab, setBottomTab] = useState<BottomTab>('holdings');

  const isReady = Object.keys(assets).length > 0;

  return (
    <div className="trading-bg min-h-screen flex flex-col text-white">
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: { background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)', color: 'white' },
        }}
      />

      {/* ─── Header ─── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/8 glass-panel shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">TradeFlow</span>
            <span className="ml-2 text-xs text-emerald-400/70 font-medium hidden sm:inline">Pro Terminal</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Markets Open</span>
          </div>
          <PortfolioSwitcher />
        </div>
      </header>

      {/* ─── Live Ticker ─── */}
      <div className="shrink-0 z-10">
        {isReady && <MarketTicker />}
      </div>

      {/* ─── Portfolio Summary Row ─── */}
      <div className="shrink-0 px-3 pt-3 z-10">
        {isReady && <PortfolioSummary />}
      </div>

      {/* ─── Main Terminal Layout ─── */}
      <div className="flex flex-1 min-h-0 gap-0 p-3 pt-2 gap-2">

        {/* LEFT: Asset List */}
        <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 glass-panel rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Markets</h2>
          </div>
          {isReady && <AssetList />}
        </div>

        {/* CENTER: Chart + Bottom Tabs */}
        <div className="flex flex-col flex-1 min-w-0 gap-2">

          {/* Chart area */}
          <div className="glass-panel rounded-xl overflow-hidden" style={{ height: '380px', minHeight: '280px', flexShrink: 0 }}>
            {isReady ? <PriceChart /> : (
              <div className="flex items-center justify-center h-full text-white/20 text-sm">Initializing market data...</div>
            )}
          </div>

          {/* Bottom tabs: Holdings / Orders / Activity */}
          <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col min-h-0">
            <div className="flex border-b border-white/5 shrink-0">
              {([
                ['holdings', 'Holdings'],
                ['orders', 'Order History'],
                ['activity', 'Live Activity'],
              ] as [BottomTab, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setBottomTab(key)}
                  className={cn(
                    'px-5 py-3 text-xs font-medium transition-all border-b-2',
                    bottomTab === key
                      ? 'text-emerald-400 border-emerald-400'
                      : 'text-white/30 border-transparent hover:text-white/60'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto min-h-0">
              {bottomTab === 'holdings' && <HoldingsTable />}
              {bottomTab === 'orders' && <OrderHistory />}
              {bottomTab === 'activity' && isReady && <ActiveUsersPanel />}
            </div>
          </div>
        </div>

        {/* RIGHT: Order Book + Order Form */}
        <div className="hidden md:flex flex-col w-64 xl:w-72 shrink-0 gap-2">
          {/* Order Book */}
          <div className="glass-panel rounded-xl overflow-hidden flex-1">
            <div className="px-4 py-3 border-b border-white/5">
              <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Order Book</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
              {isReady && <OrderBook />}
            </div>
          </div>

          {/* Order Form */}
          <div className="glass-panel rounded-xl overflow-hidden shrink-0">
            <div className="px-4 py-3 border-b border-white/5">
              <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Place Order</h2>
            </div>
            {isReady && <OrderForm />}
          </div>
        </div>
      </div>

      {/* ─── Mobile: Order Form (shown at bottom on small screen) ─── */}
      <div className="md:hidden shrink-0 glass-panel border-t border-white/8 mt-2">
        <div className="px-4 py-3 border-b border-white/5">
          <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Place Order</h2>
        </div>
        {isReady && <OrderForm />}
      </div>
    </div>
  );
}
