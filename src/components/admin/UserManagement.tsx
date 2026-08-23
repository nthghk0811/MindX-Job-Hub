import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, Trash2, RefreshCw, Loader2, Users, Clock, UserCheck, UserX } from 'lucide-react';
import { AppUser, getUsers, approveUser, rejectUser, deleteUser, getPendingCount } from '../../services/userService';

type StatusFilter = 'pending' | 'approved' | 'rejected';

interface UserManagementProps {
  onPendingCountChange?: (count: number) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onPendingCountChange }) => {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('pending');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ id: string; text: string } | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers(activeStatus);
      setUsers(data);
      // Update pending count
      const count = await getPendingCount();
      onPendingCountChange?.(count);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus, onPendingCountChange]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleApprove = async (id: string, name: string) => {
    setActionId(id);
    try {
      await approveUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      showToast(`Đã duyệt tài khoản ${name}`);
      const count = await getPendingCount();
      onPendingCountChange?.(count);
    } catch { showToast('Lỗi khi duyệt tài khoản'); }
    finally { setActionId(null); }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionId(id);
    setRejectReason(null);
    try {
      await rejectUser(id, reason);
      setUsers(prev => prev.filter(u => u._id !== id));
      showToast('Đã từ chối tài khoản');
      const count = await getPendingCount();
      onPendingCountChange?.(count);
    } catch { showToast('Lỗi khi từ chối'); }
    finally { setActionId(null); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa tài khoản "${name}"? Hành động này không thể hoàn tác.`)) return;
    setActionId(id);
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      showToast(`Đã xóa tài khoản ${name}`);
    } catch { showToast('Lỗi khi xóa tài khoản'); }
    finally { setActionId(null); }
  };

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'approved', label: 'Đã duyệt' },
    { key: 'rejected', label: 'Từ chối' },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-emerald-100 text-emerald-700',
      rejected: 'bg-rose-100 text-rose-700',
    };
    const label: Record<string, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };
    return (
      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status] || ''}`}>
        {label[status] || status}
      </span>
    );
  };

  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Quản lý Tài khoản Học viên
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Duyệt/từ chối yêu cầu đăng ký tài khoản từ học viên</p>
        </div>
        <button onClick={fetchUsers} disabled={isLoading} className="btn-secondary text-xs py-1.5 px-3 gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveStatus(t.key)}
            className={`text-xs px-4 py-1.5 rounded-lg font-semibold transition-all ${
              activeStatus === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* User List */}
      {isLoading ? (
        <div className="p-10 flex flex-col items-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-xs">Đang tải...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="p-10 text-center text-slate-400">
          <div className="text-3xl mb-2">{activeStatus === 'pending' ? '🎉' : '—'}</div>
          <p className="text-xs font-semibold text-slate-500">
            {activeStatus === 'pending' ? 'Không có yêu cầu nào đang chờ duyệt' :
             activeStatus === 'approved' ? 'Chưa có tài khoản nào được duyệt' : 'Không có tài khoản bị từ chối'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(user => (
            <div key={user._id} className="flex items-center justify-between border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 text-sm">{user.fullName}</span>
                  {statusBadge(user.status)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  @{user.username} · {user.email}
                </p>
                {user.course && (
                  <p className="text-xs text-indigo-600 mt-0.5 font-medium">{user.course}</p>
                )}
                {user.rejectedReason && (
                  <p className="text-xs text-rose-500 mt-0.5">Lý do: {user.rejectedReason}</p>
                )}
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4 shrink-0">
                {activeStatus === 'pending' && (
                  <>
                    {/* Reject with reason */}
                    {rejectReason?.id === user._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text" autoFocus
                          value={rejectReason.text}
                          onChange={e => setRejectReason({ id: user._id, text: e.target.value })}
                          placeholder="Lý do từ chối (tuỳ chọn)"
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 w-44 focus:outline-none focus:border-rose-400"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleReject(user._id, rejectReason.text);
                            if (e.key === 'Escape') setRejectReason(null);
                          }}
                        />
                        <button onClick={() => handleReject(user._id, rejectReason.text)} className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs py-1 px-2">
                          Xác nhận
                        </button>
                        <button onClick={() => setRejectReason(null)} className="btn-ghost text-slate-400 text-xs py-1 px-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(user._id, user.username)}
                          disabled={actionId === user._id}
                          className="btn-primary text-xs py-1.5 px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Duyệt
                        </button>
                        <button
                          onClick={() => setRejectReason({ id: user._id, text: '' })}
                          className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs py-1.5 px-3 gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          Từ chối
                        </button>
                      </>
                    )}
                  </>
                )}
                <button
                  onClick={() => handleDelete(user._id, user.fullName)}
                  disabled={actionId === user._id}
                  className="btn-ghost text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs p-1.5"
                  title="Xóa tài khoản"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};
