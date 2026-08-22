import { create } from 'zustand';

export interface Suggestion {
  id: string;
  authorType: 'Student' | 'Faculty' | 'Admin';
  name: string;
  topic: string;
  content: string;
  date: string;
  status: 'Pending' | 'Reviewed' | 'Implemented';
}

interface SuggestionsState {
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, 'id' | 'date' | 'status'>) => void;
  updateStatus: (id: string, status: Suggestion['status']) => void;
  deleteSuggestion: (id: string) => void;
}

export const useSuggestionsStore = create<SuggestionsState>((set) => ({
  suggestions: [
    {
      id: "SUG-1001",
      authorType: "Faculty",
      name: "Dr. Alan Turing",
      topic: "New Template Request",
      content: "We need a specific template for computational biology projects that automatically checks for genetic sequence plagiarism.",
      date: "Jul 12, 2026",
      status: "Reviewed"
    }
  ],
  addSuggestion: (suggestion) => set((state) => {
    const newSug: Suggestion = {
      ...suggestion,
      id: `SUG-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };
    return { suggestions: [newSug, ...state.suggestions] };
  }),
  updateStatus: (id, status) => set((state) => ({
    suggestions: state.suggestions.map(s => s.id === id ? { ...s, status } : s)
  })),
  deleteSuggestion: (id) => set((state) => ({
    suggestions: state.suggestions.filter(s => s.id !== id)
  }))
}));
