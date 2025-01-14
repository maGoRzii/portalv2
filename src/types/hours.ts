export interface Employee {
  id: string;
  employee_number?: string;
  full_name: string;
  group?: string;
  email?: string;
  phone?: string;
  contract_hours?: number;
  position?: string;
  position_code?: string;
  status: 'active' | 'future_leave' | 'inactive';
  leave_date?: string;
  leave_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeWithBalance extends Employee {
  total_balance: number;
  pending_holidays: number;
}

export interface HoursRecord {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  extra_hours: number;
  returned_hours: number;
  paid_hours: number;
  pending_holiday: boolean;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface HoursFormData {
  start_date: string;
  end_date: string;
  extra_hours: number;
  returned_hours: number;
  paid_hours: number;
  pending_holiday: boolean;
}