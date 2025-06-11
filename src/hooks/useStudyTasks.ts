import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StudyTask, DayOfWeek } from '../types';
import toast from 'react-hot-toast';

export function useStudyTasks(dayOfWeek?: DayOfWeek) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('study_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (dayOfWeek !== undefined) {
        query = query.eq('day_of_week', dayOfWeek);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<StudyTask, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('study_tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
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
      const { data, error } = await supabase
        .from('study_tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Erro ao atualizar tarefa');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('study_tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
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