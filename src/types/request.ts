export type RequestType = 
  | 'schedule_change' 
  | 'hours_return'
  | 'holiday_return'
  | 'medical'
  | 'personal'
  | 'clock_card'
  | 'talks';

export type RequestStatus = 'pending' | 'done';
export type ClockCardOption = 'never_had' | 'lost_damaged';

export const REQUEST_TYPES: { id: RequestType; label: string }[] = [
  { id: 'schedule_change', label: 'Cambios de Horario' },
  { id: 'hours_return', label: 'DH - Devolución de Horas' },
  { id: 'holiday_return', label: 'DF - Devolución de Festivos' },
  { id: 'medical', label: 'Justificante Médico' },
  { id: 'personal', label: 'Asunto Personal' },
  { id: 'clock_card', label: 'Tarjeta de Fichar' },
  { id: 'talks', label: 'Talks - feedback o asuntos a tratar de unos 15 min con dirección' }
];

export const CLOCK_CARD_OPTIONS: { value: ClockCardOption; label: string }[] = [
  { value: 'never_had', label: 'Nunca he tenido una' },
  { value: 'lost_damaged', label: 'Perdida o deteriorada' }
];

export interface Request {
  id: string;
  first_name: string;
  last_name: string;
  message: string;
  type: RequestType;
  status: RequestStatus;
  clock_card_option?: ClockCardOption;
  attachments?: string[];
  created_at: string;
}

export interface RequestFormData {
  firstName: string;
  lastName: string;
  message: string;
  type: RequestType;
  clockCardOption?: ClockCardOption;
  files: File[];
}