import { Calendar, Brain, BarChart3, FileText } from 'lucide-react';
import { DayOfWeek } from '../types';

interface SidebarProps {
  selectedDay: DayOfWeek;
  onDaySelect: (day: DayOfWeek) => void;
  currentView: 'tasks' | 'flashcards' | 'stats' | 'themes';
  onViewChange: (view: 'tasks' | 'flashcards' | 'stats' | 'themes') => void;
}

const DAYS = [
  { id: 1, name: 'Segunda', shortName: 'SEG' },
  { id: 2, name: 'Terça', shortName: 'TER' },
  { id: 3, name: 'Quarta', shortName: 'QUA' },
  { id: 4, name: 'Quinta', shortName: 'QUI' },
  { id: 5, name: 'Sexta', shortName: 'SEX' },
  { id: 6, name: 'Sábado', shortName: 'SAB' },
  { id: 0, name: 'Domingo', shortName: 'DOM' }
] as const;

export function Sidebar({ selectedDay, onDaySelect, currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          StudyFlow
        </h1>
        <p className="text-sm text-gray-500 mt-1">Seu assistente de estudos</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Navegação
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => onViewChange('tasks')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'tasks'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4 mr-3" />
              Tarefas de Estudo
            </button>
            <button
              onClick={() => onViewChange('flashcards')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'flashcards'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Brain className="w-4 h-4 mr-3" />
              Flash Cards
            </button>
            <button
              onClick={() => onViewChange('stats')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'stats'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Estatísticas
            </button>
            <button
              onClick={() => onViewChange('themes')}
              className={`w-full flex items-centthemeser px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'themes'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 mr-3" />
              Temas de redação
            </button>
          </div>
        </div>

        {currentView === 'tasks' && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Dias da Semana
            </h3>
            <div className="space-y-1">
              {DAYS.map((day) => (
                <button
                  key={day.id}
                  onClick={() => onDaySelect(day.id as DayOfWeek)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedDay === day.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{day.name}</span>
                  <span className="text-xs opacity-75">{day.shortName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
          <p className="text-xs text-indigo-600 font-medium">💡 Dica do dia</p>
          <p className="text-xs text-gray-600 mt-1">
            Revise seus flash cards diariamente para melhor retenção!
          </p>
        </div>
      </div>
    </div>
  );
}