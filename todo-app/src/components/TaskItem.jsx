import React from 'react';
import { Check, Trash2, Edit3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import '../index.css';

export default function TaskItem({
  task,
  handleToggleStatus,
  handleEditTask,
  handleDeleteTask
}) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 0: return <Clock className="w-4 h-4 text-amber-500" />;
      case 1: return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Pendiente';
      case 1: return 'Completada';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {getStatusIcon(task.status)}
            <h3 className={`text-lg font-semibold ${task.status === 1 ? 'text-green-300 line-through' : 'text-white'}`}>
              {task.name}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-lg ${
              task.status === 1
                ? 'bg-green-500/20 text-green-200'
                : 'bg-amber-500/20 text-amber-200'
            }`}>
              {getStatusText(task.status)}
            </span>
          </div>
          {task.description && (
            <p className="text-white/70 mb-4">{task.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleToggleStatus(task)}
            className={`p-2 rounded-xl transition-colors ${
              task.status === 1
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
            title={task.status === 1 ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {task.status === 1 ? <Clock className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleEditTask(task)}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
            title="Editar tarea"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDeleteTask(task.id)}
            className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
