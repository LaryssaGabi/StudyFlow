import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { AddTaskForm } from './components/AddTaskForm';
import { FlashCardComponent } from './components/FlashCardComponent';
import { AddFlashCardForm } from './components/AddFlashCardForm';
import { StatsView } from './components/StatsView';
import { useStudyTasks } from './hooks/useStudyTasks';
import { useFlashCards } from './hooks/useFlashCards';
import { DayOfWeek } from './types';

const DAY_NAMES = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado'
} as const;

function App() {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(1);
  const [currentView, setCurrentView] = useState<'tasks' | 'flashcards' | 'stats' | 'themes'>('tasks');

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  } = useStudyTasks(currentView === 'tasks' ? selectedDay : undefined);

  const {
    cards,
    loading: cardsLoading,
    addCard,
    updateCard,
    deleteCard,
    reviewCard
  } = useFlashCards();

  const { tasks: allTasks } = useStudyTasks();

  const renderMainContent = () => {
    if (currentView === 'stats') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Estatísticas de Estudo</h1>
            <p className="text-gray-600 mt-2">Acompanhe seu progresso e desempenho</p>
          </div>
          <StatsView tasks={allTasks} flashCards={cards} />
        </div>
      );
    }

    if (currentView === 'flashcards') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Flash Cards</h1>
            <p className="text-gray-600 mt-2">Pratique e memorize conceitos importantes</p>
          </div>
          <div className="space-y-6">
            <AddFlashCardForm onAddCard={addCard} />
            {cardsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum flash card encontrado.</p>
                <p className="text-sm text-gray-400 mt-1">Crie seu primeiro flash card para começar a estudar!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                  <FlashCardComponent key={card.id} card={card} onUpdate={updateCard} onDelete={deleteCard} onReview={reviewCard} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (currentView === 'themes') {
      return (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Temas de Redação</h1>
            <p className="text-gray-600 mt-2">Pratique seus temas de redação</p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Em breve...</p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{DAY_NAMES[selectedDay]}</h1>
          <p className="text-gray-600 mt-2">Organize suas tarefas de estudo para hoje</p>
        </div>
        <div className="space-y-6">
          <AddTaskForm dayOfWeek={selectedDay} onAddTask={addTask} />
          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma tarefa para {DAY_NAMES[selectedDay]}.</p>
              <p className="text-sm text-gray-400 mt-1">Adicione uma tarefa para começar seu planejamento de estudos!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggleComplete={toggleTaskCompletion} onUpdate={updateTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '14px' },
        }}
      />
      <Sidebar selectedDay={selectedDay} onDaySelect={setSelectedDay} currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-auto">{renderMainContent()}</main>
    </div>
  );
}

export default App;