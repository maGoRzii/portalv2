export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleSupabaseError(error: any): never {
  console.error('Supabase error:', error);
  
  if (error?.code === '42501') {
    throw new AppError('No tienes permiso para realizar esta acción', 'PERMISSION_DENIED');
  }
  
  if (error?.code?.startsWith('23')) {
    throw new AppError('Error de validación en los datos', 'VALIDATION_ERROR');
  }
  
  throw new AppError(
    'Ha ocurrido un error en el servidor. Por favor, inténtalo de nuevo.',
    'SERVER_ERROR',
    error
  );
}