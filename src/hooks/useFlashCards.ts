import { useState, useEffect } from 'react';
import { firestoreHelpers } from '../lib/firebase';
import { FlashCard } from '../types';
import toast from 'react-hot-toast';

export function useFlashCards() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await firestoreHelpers.getFlashCards();
      setCards(data as FlashCard[]);
    } catch (error) {
      console.error('Error fetching flash cards:', error);
      toast.error('Erro ao carregar flash cards');
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (card: Omit<FlashCard, 'id' | 'created_at' | 'updated_at' | 'review_count' | 'mastered' | 'last_reviewed'>) => {
    try {
      const data = await firestoreHelpers.addFlashCard(card);
      setCards(prev => [data as FlashCard, ...prev]);
      toast.success('Flash card adicionado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding flash card:', error);
      toast.error('Erro ao adicionar flash card');
      throw error;
    }
  };

  const updateCard = async (id: string, updates: Partial<FlashCard>) => {
    try {
      await firestoreHelpers.updateFlashCard(id, updates);
      setCards(prev => prev.map(card => 
        card.id === id ? { ...card, ...updates, updated_at: new Date().toISOString() } : card
      ));
      return { id, ...updates };
    } catch (error) {
      console.error('Error updating flash card:', error);
      toast.error('Erro ao atualizar flash card');
      throw error;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await firestoreHelpers.deleteFlashCard(id);
      setCards(prev => prev.filter(card => card.id !== id));
      toast.success('Flash card removido com sucesso!');
    } catch (error) {
      console.error('Error deleting flash card:', error);
      toast.error('Erro ao remover flash card');
      throw error;
    }
  };

  const reviewCard = async (id: string, wasCorrect: boolean) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const newReviewCount = card.review_count + 1;
    const shouldBeMastered = wasCorrect && newReviewCount >= 3;

    await updateCard(id, {
      review_count: newReviewCount,
      last_reviewed: new Date().toISOString(),
      mastered: shouldBeMastered
    });
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    reviewCard,
    refetch: fetchCards
  };
}