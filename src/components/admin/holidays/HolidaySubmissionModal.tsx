import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { DeleteButton } from '../DeleteButton';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { HOLIDAYS } from '../../../data/holidays';

interface HolidaySubmission {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  comments: string | null;
  holiday_shifts: Array<{
    holiday_date: string;
    compensation_type: string;
  }>;
}

interface HolidaySubmissionModalProps {
  submission: HolidaySubmission;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export function HolidaySubmissionModal({ 
  submission, 
  onClose, 
  onDelete,
  onUpdate 
}: HolidaySubmissionModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComments, setEditedComments] = useState(submission.comments);
  const [editedShifts, setEditedShifts] = useState(
    HOLIDAYS.map(holiday => ({
      holiday_date: holiday.date,
      selected: submission.holiday_shifts.some(shift => shift.holiday_date === holiday.date),
      compensation_type: submission.holiday_shifts.find(shift => shift.holiday_date === holiday.date)?.compensation_type || ''
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('holiday_submissions')
        .delete()
        .eq('id', submission.id);

      if (error) throw error;
      onDelete(submission.id);
      onClose();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Error al eliminar la solicitud');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const selectedShifts = editedShifts.filter(shift => shift.selected);
      
      if (selectedShifts.length === 0) {
        toast.error('Debe seleccionar al menos un día festivo');
        return;
      }

      // Update comments
      const { error: commentsError } = await supabase
        .from('holiday_submissions')
        .update({ comments: editedComments || null })
        .eq('id', submission.id);

      if (commentsError) throw commentsError;

      // Delete existing shifts
      const { error: deleteError } = await supabase
        .from('holiday_shifts')
        .delete()
        .eq('submission_id', submission.id);

      if (deleteError) throw deleteError;

      // Insert new shifts
      const { error: shiftsError } = await supabase
        .from('holiday_shifts')
        .insert(
          selectedShifts.map(shift => ({
            submission_id: submission.id,
            holiday_date: shift.holiday_date,
            compensation_type: shift.compensation_type
          }))
        );

      if (shiftsError) throw shiftsError;

      toast.success('Cambios guardados correctamente');
      setIsEditing(false);
      
      // Update the submission data
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShiftChange = (date: string, field: 'selected' | 'compensation_type', value: any) => {
    setEditedShifts(shifts => shifts.map(shift => 
      shift.holiday_date === date 
        ? { 
            ...shift, 
            [field]: value,
            ...(field === 'selected' && !value ? { compensation_type: '' } : {})
          }
        : shift
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {submission.first_name} {submission.last_name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(submission.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
              )}
              <DeleteButton onDelete={handleDelete} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Días seleccionados:</h4>
                <div className="space-y-3">
                  {editedShifts.map((shift) => (
                    <div key={shift.holiday_date} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={shift.selected}
                        onChange={(e) => handleShiftChange(shift.holiday_date, 'selected', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {formatDate(shift.holiday_date)}
                      </span>
                      {shift.selected && (
                        <select
                          value={shift.compensation_type}
                          onChange={(e) => handleShiftChange(shift.holiday_date, 'compensation_type', e.target.value)}
                          className="text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar compensación</option>
                          <option value="double">Pago doble</option>
                          <option value="day-off">Día libre</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Comentarios:</h4>
                <textarea
                  value={editedComments || ''}
                  onChange={(e) => setEditedComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Días seleccionados:</h4>
                <div className="space-y-2">
                  {submission.holiday_shifts.map((shift, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{formatDate(shift.holiday_date)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${shift.compensation_type === 'double' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'}`}
                      >
                        {shift.compensation_type === 'double' ? 'Pago doble' : 'Día libre'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {submission.comments && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Comentarios:</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {submission.comments}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}