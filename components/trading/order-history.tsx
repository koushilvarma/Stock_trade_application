'use client';

import { useTradingStore } from '@/store/trading-store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function OrderHistory() {
  const { orders } = useTradingStore();

  return (
    <div className="order-history overflow-auto">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-white/20 text-sm gap-2">
          <span className="text-4xl">📋</span>
          <span>No orders yet</span>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Time', 'Symbol', 'Side', 'Type', 'Qty', 'Price', 'Total', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 text-xs text-white/40 font-mono">
                  {format(order.timestamp, 'HH:mm:ss')}
                </td>
                <td className="px-4 py-3 font-bold text-white">{order.symbol}</td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'px-2 py-0.5 rounded-md text-xs font-bold',
                    order.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {order.side}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-white/50">{order.type}</td>
                <td className="px-4 py-3 font-mono text-white/80">
                  {order.quantity < 1 ? order.quantity.toFixed(6) : order.quantity.toFixed(2)}
                </td>
                <td className="px-4 py-3 font-mono text-white/80">${order.price.toFixed(2)}</td>
                <td className="px-4 py-3 font-mono text-white">${order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={cn('flex items-center gap-1 text-xs', {
                    'text-emerald-400': order.status === 'FILLED',
                    'text-red-400': order.status === 'CANCELLED',
                    'text-yellow-400': order.status === 'PENDING',
                  })}>
                    {order.status === 'FILLED' ? <CheckCircle2 size={11} /> : order.status === 'CANCELLED' ? <XCircle size={11} /> : <Clock size={11} />}
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
