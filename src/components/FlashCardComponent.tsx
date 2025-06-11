import React, { useState } from 'react';
import { RotateCcw, Edit3, Trash2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { FlashCard } from '../types';

interface FlashCardComponentProps {
  card: FlashCard;
  onUpdate: (id: string, updates: Partial<FlashCard>) => void;
  onDelete: (id: string) => void;
  onReview: (id: string, wasCorrect: boolean) => void;
}

const DIFFICULTY_COLORS = {
  easy: 'border-green-200 bg-green-50',
  medium: 'border-yellow-200 bg-yellow-50',
  hard: 'border-red-200 bg-red-50'
};

const DIFFICULTY_DOT_COLORS = {
  easy: 'bg-green-400',
  medium: 'bg-yellow-400',
  hard: 'bg-red-400'
};

export function FlashCardComponent({ card, onUpdate, onDelete, onReview }: FlashCardComponentProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState(card.question);
  const [editAnswer, setEditAnswer] = useState(card.answer);
  const [editSubject, setEditSubject] = useState(card.subject);
  const [editDifficulty, setEditDifficulty] = useState(card.difficulty);

  const handleSave = () => {
    onUpdate(card.id, {
      question: editQuestion,
      answer: editAnswer,
      subject: editSubject,
      difficulty: editDifficulty
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setEditSubject(card.subject);
    setEditDifficulty(card.difficulty);
    setIsEditing(false);
  };

  const handleReview = (wasCorrect: boolean) => {
    onReview(card.id, wasCorrect);
    setIsFlipped(false);
  };

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
      card.mastered 
        ? 'border-green-200 bg-green-50' 
        : DIFFICULTY_COLORS[card.difficulty]
    } ${isFlipped ? 'transform scale-105' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pergunta
            </label>
            <textarea
              value={editQuestion}
              onChange={(e) => setEditQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resposta
            </label>
            <textarea
              value={editAnswer}
              onChange={(e) => setEditAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Matéria"
            />
            <select
              value={editDifficulty}
              onChange={(e) => setEditDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Médio</option>
              <option value="hard">Difícil</option>
            </select>
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
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${DIFFICULTY_DOT_COLORS[card.difficulty]}`} />
              <span className="text-sm font-medium text-gray-600">{card.subject}</span>
              {card.mastered && (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  Dominado
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                {isFlipped ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="min-h-[80px] flex items-center">
              {!isFlipped ? (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pergunta:</p>
                  <p className="text-gray-900 font-medium">{card.question}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Resposta:</p>
                  <p className="text-gray-900 font-medium">{card.answer}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p>Revisões: {card.review_count}</p>
              {card.last_reviewed && (
                <p>Última: {new Date(card.last_reviewed).toLocaleDateString()}</p>
              )}
            </div>

            {isFlipped && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleReview(false)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Errei
                </button>
                <button
                  onClick={() => handleReview(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Acertei
                </button>
              </div>
            )}

            {!isFlipped && (
              <button
                onClick={() => setIsFlipped(true)}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Revelar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}