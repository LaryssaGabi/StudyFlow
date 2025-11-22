import { useMemo } from 'react';
import { TrendingUp, Book, Clock, Target, Calendar, Brain } from 'lucide-react';
import { StudyTask, FlashCard } from '../types';

interface StatsViewProps {
  tasks: StudyTask[];
  flashCards: FlashCard[];
}

export function StatsView({ tasks, flashCards }: StatsViewProps) {
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    const totalStudyTime = completedTasks.reduce((acc, task) => 
      acc + (task.duration_minutes || 0), 0);

    const subjectCounts = tasks.reduce((acc, task) => {
      acc[task.subject] = (acc[task.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteSubject = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Nenhuma';

    const masteredCards = flashCards.filter(card => card.mastered).length;
    const totalCards = flashCards.length;
    const cardMasteryRate = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

    const weeklyTasks = new Array(7).fill(0);
    tasks.forEach(task => {
      if (task.completed) {
        weeklyTasks[task.day_of_week] += 1;
      }
    });

    return {
      completedTasks: completedTasks.length,
      totalTasks,
      completionRate,
      totalStudyTime,
      favoriteSubject,
      masteredCards,
      totalCards,
      cardMasteryRate,
      weeklyTasks
    };
  }, [tasks, flashCards]);

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Tarefas Completas</p>
              <p className="text-3xl font-bold">{stats.completedTasks}</p>
              <p className="text-indigo-200 text-sm">de {stats.totalTasks} tarefas</p>
            </div>
            <Target className="w-8 h-8 text-indigo-200" />
          </div>
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-indigo-200 text-xs mt-1">{stats.completionRate.toFixed(1)}% completo</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Tempo de Estudo</p>
              <p className="text-3xl font-bold">{Math.floor(stats.totalStudyTime / 60)}h</p>
              <p className="text-green-200 text-sm">{stats.totalStudyTime % 60}min esta semana</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Matéria Favorita</p>
              <p className="text-xl font-bold truncate">{stats.favoriteSubject}</p>
              <p className="text-orange-200 text-sm">Mais estudada</p>
            </div>
            <Book className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Flash Cards</p>
              <p className="text-3xl font-bold">{stats.masteredCards}</p>
              <p className="text-purple-200 text-sm">de {stats.totalCards} dominados</p>
            </div>
            <Brain className="w-8 h-8 text-purple-200" />
          </div>
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${stats.cardMasteryRate}%` }}
              />
            </div>
            <p className="text-purple-200 text-xs mt-1">{stats.cardMasteryRate.toFixed(1)}% dominado</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Atividade Semanal
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {dayNames.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-500 mb-2">{day}</div>
              <div 
                className="w-full bg-gray-100 rounded-lg py-8 flex items-center justify-center relative overflow-hidden"
              >
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ 
                    height: `${Math.min((stats.weeklyTasks[index] / Math.max(...stats.weeklyTasks, 1)) * 100, 100)}%` 
                  }}
                />
                <span className="relative z-10 text-lg font-bold text-gray-700">
                  {stats.weeklyTasks[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Tarefas completadas por dia da semana
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Progresso Geral
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Taxa de Conclusão</span>
                <span className="font-medium">{stats.completionRate.toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-3 transition-all duration-300"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Flash Cards Dominados</span>
                <span className="font-medium">{stats.cardMasteryRate.toFixed(1)}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full h-3 transition-all duration-300"
                  style={{ width: `${stats.cardMasteryRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Metas da Semana</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Completar 80% das tarefas</span>
              <span className={`text-sm font-medium ${
                stats.completionRate >= 80 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {stats.completionRate >= 80 ? '✅ Concluído' : '🎯 Em progresso'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Estudar 10h por semana</span>
              <span className={`text-sm font-medium ${
                stats.totalStudyTime >= 600 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {stats.totalStudyTime >= 600 ? '✅ Concluído' : `🎯 ${Math.floor(stats.totalStudyTime / 60)}h/10h`}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Dominar 5 flash cards</span>
              <span className={`text-sm font-medium ${
                stats.masteredCards >= 5 ? 'text-green-600' : 'text-orange-600'
              }`}>
                {stats.masteredCards >= 5 ? '✅ Concluído' : `🎯 ${stats.masteredCards}/5`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}