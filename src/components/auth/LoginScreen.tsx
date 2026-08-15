import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim().toLowerCase() === 'admin' && password === '123456') {
        onLogin('admin');
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác. (Mặc định: admin / 123456)');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8 animate-fadeIn">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 mb-3">
          <span className="font-black text-white text-2xl tracking-tighter">MX</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MindX Job Hub</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">Hệ thống Thu thập & Quản lý Tuyển dụng Nội bộ (SS Team)</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 animate-fadeIn">
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Đăng nhập Quản trị</h2>
            <p className="text-xs text-slate-400 mt-0.5">Xác thực quyền truy cập hệ thống</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2 animate-shake">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tài khoản</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="admin"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary justify-center py-2.5 text-xs font-bold shadow-md shadow-indigo-200 mt-2 disabled:opacity-60"
          >
            <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập vào Hệ thống'}</span>
            {!isLoading && <ArrowRight className="w-3.5 h-3.5 ml-1" />}
          </button>
        </form>

        {/* Demo Account Hint */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Mặc định: <strong className="text-slate-700">admin</strong> / <strong className="text-slate-700">123456</strong>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline text-[11px]"
          >
            <Sparkles className="w-3 h-3" />
            Điền nhanh
          </button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-xs text-slate-400">
        © 2026 MindX Technology School · Student Success System
      </div>
    </div>
  );
};
