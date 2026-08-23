import api from './api';

export interface AppUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved' | 'rejected';
  course: string;
  rejectedReason?: string;
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  data: AppUser[];
  total: number;
}

export async function getUsers(status?: string): Promise<AppUser[]> {
  const params = status ? { status } : {};
  const res = await api.get<UsersResponse>('/users', { params });
  return res.data.data;
}

export async function getPendingCount(): Promise<number> {
  const res = await api.get<{ success: boolean; count: number }>('/users/pending-count');
  return res.data.count;
}

export async function approveUser(id: string): Promise<AppUser> {
  const res = await api.patch(`/users/${id}/approve`);
  return res.data.data;
}

export async function rejectUser(id: string, reason?: string): Promise<AppUser> {
  const res = await api.patch(`/users/${id}/reject`, { reason: reason || '' });
  return res.data.data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
