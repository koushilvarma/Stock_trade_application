import { create } from 'zustand';
import { INITIAL_ASSETS } from '@/lib/market-data';

export interface PricePoint {
  time: number;
  price: number;
}

export interface LiveAsset {
  symbol: string;
  name: string;
  type: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  priceHistory: PricePoint[];
}

export interface Holding {
  symbol: string;
  quantity: number;
  averageEntryPrice: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
  status: 'FILLED' | 'CANCELLED' | 'PENDING';
}

export interface Portfolio {
  id: string;
  name: string;
  cashBalance: number;
  holdings: Holding[];
}

interface TradingState {
  // Market Data
  assets: Record<string, LiveAsset>;
  selectedSymbol: string;

  // Portfolio
  portfolios: Portfolio[];
  activePortfolioId: string;

  // Orders
  orders: Order[];

  // Actions
  initializeAssets: () => void;
  updatePrices: (updates: Record<string, { price: number; volume: number }>) => void;
  setSelectedSymbol: (symbol: string) => void;
  executeOrder: (
    portfolioId: string,
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'MARKET' | 'LIMIT',
    quantity: number,
    limitPrice?: number
  ) => { success: boolean; message: string };
  setActivePortfolio: (id: string) => void;
}

const INITIAL_PORTFOLIO: Portfolio = {
  id: 'portfolio-1',
  name: 'Main Portfolio',
  cashBalance: 100000,
  holdings: [],
};

const SECONDARY_PORTFOLIO: Portfolio = {
  id: 'portfolio-2',
  name: 'Crypto Portfolio',
  cashBalance: 50000,
  holdings: [],
};

export const useTradingStore = create<TradingState>((set, get) => ({
  assets: {},
  selectedSymbol: 'AAPL',
  portfolios: [INITIAL_PORTFOLIO, SECONDARY_PORTFOLIO],
  activePortfolioId: 'portfolio-1',
  orders: [],

  initializeAssets: () => {
    const now = Date.now();
    const assets: Record<string, LiveAsset> = {};
    INITIAL_ASSETS.forEach((asset) => {
      const history: PricePoint[] = [];
      for (let i = 60; i >= 0; i--) {
        const noise = (Math.random() - 0.5) * asset.basePrice * asset.volatility * 10;
        history.push({
          time: now - i * 60000,
          price: parseFloat((asset.basePrice + noise).toFixed(asset.type === 'Forex' ? 4 : 2)),
        });
      }
      assets[asset.symbol] = {
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        price: asset.basePrice,
        previousPrice: asset.basePrice,
        change: 0,
        changePercent: 0,
        volume: Math.floor(Math.random() * 1000000) + 500000,
        priceHistory: history,
      };
    });
    set({ assets });
  },

  updatePrices: (updates) => {
    set((state) => {
      const newAssets = { ...state.assets };
      for (const symbol in updates) {
        if (newAssets[symbol]) {
          const { price, volume } = updates[symbol];
          const prev = newAssets[symbol].price;
          const change = price - newAssets[symbol].priceHistory[0]?.price ?? prev;
          const changePercent = (change / (newAssets[symbol].priceHistory[0]?.price ?? prev)) * 100;
          const newHistory = [
            ...newAssets[symbol].priceHistory,
            { time: Date.now(), price },
          ].slice(-100);
          newAssets[symbol] = {
            ...newAssets[symbol],
            previousPrice: prev,
            price,
            change: parseFloat(change.toFixed(4)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume,
            priceHistory: newHistory,
          };
        }
      }
      return { assets: newAssets };
    });
  },

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setActivePortfolio: (id) => set({ activePortfolioId: id }),

  executeOrder: (portfolioId, symbol, side, type, quantity, limitPrice) => {
    const state = get();
    const asset = state.assets[symbol];
    const portfolioIndex = state.portfolios.findIndex((p) => p.id === portfolioId);

    if (!asset) return { success: false, message: 'Asset not found' };
    if (portfolioIndex === -1) return { success: false, message: 'Portfolio not found' };

    const execPrice = type === 'LIMIT' && limitPrice ? limitPrice : asset.price;
    const total = execPrice * quantity;
    const portfolio = state.portfolios[portfolioIndex];

    if (side === 'BUY') {
      if (portfolio.cashBalance < total) {
        return { success: false, message: 'Insufficient funds' };
      }
    } else {
      const holding = portfolio.holdings.find((h) => h.symbol === symbol);
      if (!holding || holding.quantity < quantity) {
        return { success: false, message: 'Insufficient shares' };
      }
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      symbol,
      side,
      type,
      quantity,
      price: execPrice,
      total,
      timestamp: Date.now(),
      status: 'FILLED',
    };

    const updatedPortfolios = [...state.portfolios];
    const updatedPortfolio = { ...portfolio };
    const updatedHoldings = [...updatedPortfolio.holdings];

    if (side === 'BUY') {
      updatedPortfolio.cashBalance -= total;
      const existingIdx = updatedHoldings.findIndex((h) => h.symbol === symbol);
      if (existingIdx >= 0) {
        const existing = updatedHoldings[existingIdx];
        const totalQty = existing.quantity + quantity;
        updatedHoldings[existingIdx] = {
          ...existing,
          quantity: totalQty,
          averageEntryPrice:
            (existing.averageEntryPrice * existing.quantity + execPrice * quantity) / totalQty,
        };
      } else {
        updatedHoldings.push({ symbol, quantity, averageEntryPrice: execPrice });
      }
    } else {
      updatedPortfolio.cashBalance += total;
      const existingIdx = updatedHoldings.findIndex((h) => h.symbol === symbol);
      if (existingIdx >= 0) {
        const newQty = updatedHoldings[existingIdx].quantity - quantity;
        if (newQty <= 0) {
          updatedHoldings.splice(existingIdx, 1);
        } else {
          updatedHoldings[existingIdx] = { ...updatedHoldings[existingIdx], quantity: newQty };
        }
      }
    }

    updatedPortfolio.holdings = updatedHoldings;
    updatedPortfolios[portfolioIndex] = updatedPortfolio;

    set({ portfolios: updatedPortfolios, orders: [newOrder, ...state.orders].slice(0, 200) });
    return { success: true, message: `${side} order filled at $${execPrice.toFixed(2)}` };
  },
}));
