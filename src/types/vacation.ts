export interface VacationRecord {
  id: string;
  employee_id: string;
  year: number;
  days_taken: number;
  days_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface VacationFormData {
  year: number;
  days_taken?: number;
  days_remaining?: number;
}