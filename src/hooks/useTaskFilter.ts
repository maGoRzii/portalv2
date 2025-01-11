import { useState } from 'react';
import { TaskType } from '../types/task';

export function useTaskFilter() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');

  const filterTasks = (tasks: Record<string, TaskType[]>) => {
    return Object.entries(tasks).reduce((acc, [status, taskList]) => {
      acc[status] = taskList.filter(task => {
        const matchesDate = !selectedDate || task.due_date === selectedDate;
        const matchesLabel = !selectedLabel || task.label_id === selectedLabel;
        return matchesDate && matchesLabel;
      });
      return acc;
    }, {} as Record<string, TaskType[]>);
  };

  return {
    selectedDate,
    selectedLabel,
    setSelectedDate,
    setSelectedLabel,
    filterTasks
  };
}