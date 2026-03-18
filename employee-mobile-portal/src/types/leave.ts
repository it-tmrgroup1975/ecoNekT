// src/types/employee.ts หรือ src/types/leave.ts

export interface LeaveQuota {
  type: 'sick' | 'casual' | 'annual';
  label: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}