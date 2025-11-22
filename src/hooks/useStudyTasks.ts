import { useState, useEffect } from 'react';
import { firestoreHelpers } from '../lib/firebase';
import { StudyTask, DayOfWeek } from '../types';
import toast from 'react-hot-toast';

export function useStudyTasks(dayOfWeek?: DayOfWeek) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await firestoreHelpers.getStudyTasks(dayOfWeek);
      setTasks(data as StudyTask[]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<StudyTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await firestoreHelpers.addStudyTask(task);
      setTasks(prev => [data as StudyTask, ...prev]);
      toast.success('Tarefa adicionada com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Erro ao adicionar tarefa');
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<StudyTask>) => {
    try {
      await firestoreHelpers.updateStudyTask(id, updates);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
      ));
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Erro ao atualizar tarefa');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await firestoreHelpers.deleteStudyTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Tarefa removida com sucesso!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Erro ao remover tarefa');
      throw error;
    }
  };

  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    await updateTask(id, { completed });
  };

  useEffect(() => {
    fetchTasks();
  }, [dayOfWeek]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: fetchTasks
  };
}