import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Edit3, Trash2, BookOpen } from 'lucide-react';
import { StudyTask } from '../types';

interface TaskCardProps {
  task: StudyTask;
  onToggleComplete: (id: string, completed: boolean) => void;
  onUpdate: (id: string, updates: Partial<StudyTask>) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_COLORS = {
  low: 'border-green-200 bg-green-50',
  medium: 'border-yellow-200 bg-yellow-50',
  high: 'border-red-200 bg-red-50'
};

const PRIORITY_DOT_COLORS = {
  low: 'bg-green-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400'
};

export function TaskCard({ task, onToggleComplete, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editSubject, setEditSubject] = useState(task.subject);
  const [editDuration, setEditDuration] = useState(task.duration_minutes?.toString() || '');

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription || null,
      subject: editSubject,
      duration_minutes: editDuration ? parseInt(editDuration) : null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditSubject(task.subject);
    setEditDuration(task.duration_minutes?.toString() || '');
    setIsEditing(false);
  };

  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
      task.completed 
        ? 'border-gray-200 bg-gray-50 opacity-75' 
        : PRIORITY_COLORS[task.priority]
    }`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(task.id, !task.completed)}
          className={`mt-1 transition-colors ${
            task.completed 
              ? 'text-green-500 hover:text-green-600'
              : 'text-gray-400 hover:text-indigo-500'
          }`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Título da tarefa"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Descrição (opcional)"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Matéria"
                />
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Min"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT_COLORS[task.priority]}`} />
                <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h3>
              </div>
              
              {task.description && (
                <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{task.subject}</span>
                </div>
                {task.duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{task.duration_minutes} min</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}