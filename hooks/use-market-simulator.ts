'use client';

import { useEffect, useRef } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { INITIAL_ASSETS } from '@/lib/market-data';

const TICK_INTERVAL_MS = 800;

export function useMarketSimulator() {
  const { assets, initializeAssets, updatePrices } = useTradingStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      initializeAssets();
      isInitialized.current = true;
    }
  }, [initializeAssets]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updates: Record<string, { price: number; volume: number }> = {};

      INITIAL_ASSETS.forEach((assetConfig) => {
        const currentAsset = useTradingStore.getState().assets[assetConfig.symbol];
        if (!currentAsset) return;

        // Simulate multiple concurrent user orders affecting price
        // 50+ traders placing orders shifts price with random walk
        const numSimulatedTraders = Math.floor(Math.random() * 60) + 20;
        let priceImpact = 0;
        for (let i = 0; i < numSimulatedTraders; i++) {
          priceImpact += (Math.random() - 0.495) * assetConfig.volatility;
        }
        priceImpact /= numSimulatedTraders;

        // Mean reversion to keep prices realistic
        const meanReversionFactor = 0.001;
        const meanReversion = (assetConfig.basePrice - currentAsset.price) * meanReversionFactor;

        const newPrice = currentAsset.price * (1 + priceImpact + meanReversion);
        const decimals = assetConfig.type === 'Forex' ? 4 : 2;
        const clampedPrice = Math.max(newPrice, assetConfig.basePrice * 0.5);

        const volumeChange = Math.floor((Math.random() - 0.4) * 50000);
        const newVolume = Math.max(currentAsset.volume + volumeChange, 0);

        updates[assetConfig.symbol] = {
          price: parseFloat(clampedPrice.toFixed(decimals)),
          volume: newVolume,
        };
      });

      updatePrices(updates);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [updatePrices]);
}
