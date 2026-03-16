'use client';

import { useMemo } from 'react';
import { useTradingStore } from '@/store/trading-store';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1526] border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="text-white/50">{format(payload[0].payload.time, 'HH:mm:ss')}</p>
        <p className="text-emerald-400 font-mono font-bold">${payload[0].value?.toFixed(4)}</p>
      </div>
    );
  }
  return null;
};

export function PriceChart() {
  const { assets, selectedSymbol } = useTradingStore();
  const asset = assets[selectedSymbol];

  const isUp = (asset?.changePercent ?? 0) >= 0;
  const color = isUp ? '#10b981' : '#ef4444';

  const chartData = useMemo(
    () => asset?.priceHistory ?? [],
    [asset?.priceHistory]
  );

  const minPrice = useMemo(() => Math.min(...chartData.map((d) => d.price)) * 0.9998, [chartData]);
  const maxPrice = useMemo(() => Math.max(...chartData.map((d) => d.price)) * 1.0002, [chartData]);

  if (!asset) return null;

  return (
    <div className="price-chart flex flex-col h-full p-4 gap-4">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{asset.symbol}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 font-medium">{asset.type}</span>
          </div>
          <div className="text-sm text-white/40">{asset.name}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-3xl font-mono font-bold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            ${asset.price < 10 ? asset.price.toFixed(4) : asset.price.toFixed(2)}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isUp ? '+' : ''}{asset.change.toFixed(4)} ({isUp ? '+' : ''}{asset.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1"><Activity size={12} /> Vol: {(asset.volume / 1_000_000).toFixed(2)}M</span>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorGrad-${selectedSymbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tickFormatter={(v) => format(v, 'HH:mm')}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v < 10 ? v.toFixed(3) : v.toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#colorGrad-${selectedSymbol})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
