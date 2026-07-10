import React from 'react';
import { InteractionForm } from './InteractionForm';
import { ChatPanel } from './ChatPanel';

export const SplitScreenLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      {/* 70% Left Panel - Interaction Form */}
      <InteractionForm />
      
      {/* 30% Right Panel - AI Assistant Chat */}
      <ChatPanel />
    </div>
  );
};
