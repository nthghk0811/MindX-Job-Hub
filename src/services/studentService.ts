import api from './api';
import { MindXStudent } from '../types/job';

interface StudentsResponse {
  success: boolean;
  data: MindXStudent[];
  count?: number;
}

interface StudentResponse {
  success: boolean;
  data: MindXStudent;
}

export async function getStudents(): Promise<MindXStudent[]> {
  const res = await api.get<StudentsResponse>('/students');
  return res.data.data.map((s: any) => ({
    ...s,
    id: s._id || s.id,
  }));
}

export async function createStudent(data: Omit<MindXStudent, 'id'>): Promise<MindXStudent> {
  const res = await api.post<StudentResponse>('/students', data);
  const s = res.data.data;
  return { ...s, id: (s as any)._id || s.id };
}

export async function bulkCreateStudents(students: Omit<MindXStudent, 'id'>[]): Promise<MindXStudent[]> {
  const res = await api.post<StudentsResponse>('/students/bulk', students);
  return res.data.data.map((s: any) => ({
    ...s,
    id: s._id || s.id,
  }));
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}
