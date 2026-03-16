export type AssetClass = 'Stock' | 'Crypto' | 'Forex' | 'Commodity';

export interface AssetConfig {
  symbol: string;
  name: string;
  type: AssetClass;
  basePrice: number;
  volatility: number; 
}

export const INITIAL_ASSETS: AssetConfig[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', basePrice: 175.50, volatility: 0.002 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Stock', basePrice: 420.20, volatility: 0.0025 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock', basePrice: 165.10, volatility: 0.003 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock', basePrice: 178.30, volatility: 0.0035 },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock', basePrice: 185.00, volatility: 0.006 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Stock', basePrice: 880.60, volatility: 0.008 },
  { symbol: 'META', name: 'Meta Platforms', type: 'Stock', basePrice: 495.20, volatility: 0.004 },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', basePrice: 68500.00, volatility: 0.012 },
  { symbol: 'ETH', name: 'Ethereum', type: 'Crypto', basePrice: 3850.00, volatility: 0.015 },
  { symbol: 'SOL', name: 'Solana', type: 'Crypto', basePrice: 145.20, volatility: 0.02 },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'Crypto', basePrice: 0.15, volatility: 0.03 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'Forex', basePrice: 1.0850, volatility: 0.0005 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', type: 'Forex', basePrice: 1.2640, volatility: 0.0007 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', type: 'Forex', basePrice: 151.20, volatility: 0.0006 },
  { symbol: 'GLD', name: 'Gold', type: 'Commodity', basePrice: 2350.10, volatility: 0.001 },
  { symbol: 'USO', name: 'Crude Oil', type: 'Commodity', basePrice: 82.50, volatility: 0.004 },
];
