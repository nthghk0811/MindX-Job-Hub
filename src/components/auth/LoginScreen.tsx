import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        setError('Tài khoản hoặc mật khẩu không chính xác.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 shadow-md shadow-indigo-100 mb-3">
          <span className="font-bold text-white text-lg tracking-tight">MX</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">MindX Job Hub</h1>
        <p className="text-xs text-slate-500 mt-0.5">Hệ thống Quản lý Tuyển dụng Nội bộ</p>
      </div>

      {/* Login Card - Clean & Minimalist */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-sm font-bold text-slate-900">Đăng nhập</h2>
          <p className="text-xs text-slate-400 mt-0.5">Nhập thông tin quản trị viên để tiếp tục</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản</label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Tên tài khoản"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Mật khẩu"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password}
            className="w-full btn-primary justify-center py-2 text-xs font-semibold mt-2 disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        © 2026 MindX Technology School · Student Success System
      </div>
    </div>
  );
};
