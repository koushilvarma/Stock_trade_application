import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">₹</span>
            </div>
            StockFlow
          </h1>
          <p className="text-slate-300">Real-time stock trading made simple</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Live Market Data</h3>
            <p className="text-slate-300 text-sm">Get real-time quotes and advanced charts</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Instant Trading</h3>
            <p className="text-slate-300 text-sm">Execute trades in seconds with our lightning-fast platform</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Secure & Trusted</h3>
            <p className="text-slate-300 text-sm">Bank-level security for your investments</p>
          </div>
        </div>

        <p className="text-slate-400 text-sm">© 2026 StockFlow. All rights reserved.</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₹</span>
              </div>
              StockFlow
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
