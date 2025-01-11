import React from 'react';
import { Layout } from 'lucide-react';
import { TaskColumn } from './TaskColumn';
import { TaskDateFilter } from './TaskDateFilter';
import { TaskLabelFilter } from './TaskLabelFilter';
import { useTasks } from '../../../hooks/useTasks';
import { useTaskFilter } from '../../../hooks/useTaskFilter';

export function TaskBoard() {
  const { tasks, loading, addTask, editTask, moveTask, deleteTask } = useTasks();
  const { 
    selectedDate, 
    selectedLabel,
    setSelectedDate, 
    setSelectedLabel,
    filterTasks 
  } = useTaskFilter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredTasks = filterTasks(tasks);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tablero de Tareas</h2>
        </div>
        <div className="flex items-center gap-4">
          <TaskDateFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onClearDate={() => setSelectedDate('')}
          />
          <TaskLabelFilter
            selectedLabel={selectedLabel}
            onChange={setSelectedLabel}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          id="todo"
          title="Por Hacer"
          tasks={filteredTasks.todo}
          onAddTask={addTask}
          onEditTask={editTask}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          id="inProgress"
          title="En Proceso"
          tasks={filteredTasks.inProgress}
          onAddTask={addTask}
          onEditTask={editTask}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
        <TaskColumn
          id="done"
          title="Finalizado"
          tasks={filteredTasks.done}
          onAddTask={addTask}
          onEditTask={editTask}
          onMoveTask={moveTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
}