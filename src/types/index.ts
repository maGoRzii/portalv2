export interface Holiday {
  date: string;
  name: string;
}

export interface ShiftPreference {
  date: string;
  selected: boolean;
  compensation: 'double' | 'day-off' | '';
}

export interface FormData {
  firstName: string;
  lastName: string;
  comments: string;
}