import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export const InteractionForm: React.FC = () => {
  const interaction = useSelector((state: RootState) => state.interaction);

  return (
    <div className="flex-1 bg-white p-6 border-r overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800">Interaction Details</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">HCP Name</label>
            <input 
              type="text" 
              id="hcpName"
              name="hcpName"
              readOnly 
              value={interaction.hcpName}
              className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none transition-colors duration-300"
              placeholder="e.g. Dr. Raj Sharma"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Hospital / Clinic</label>
            <input 
              type="text" 
              id="hospital"
              name="hospital"
              readOnly 
              value={interaction.hospital}
              className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
            <input 
              type="text" 
              id="interactionType"
              name="interactionType"
              readOnly 
              value={interaction.interactionType}
              className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
            <input 
              type="text" 
              id="interactionDate"
              name="interactionDate"
              readOnly 
              value={interaction.interactionDate}
              className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
            <input 
              type="text" 
              id="interactionTime"
              name="interactionTime"
              readOnly 
              value={interaction.interactionTime}
              className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Topics Discussed</label>
          <textarea 
            id="topicsDiscussed"
            name="topicsDiscussed"
            readOnly 
            value={interaction.topicsDiscussed}
            className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none h-24 transition-colors duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Summary</label>
          <textarea 
            id="summary"
            name="summary"
            readOnly 
            value={interaction.summary}
            className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none h-24 transition-colors duration-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Sentiment</label>
            <input 
              type="text" 
              id="sentiment"
              name="sentiment"
              readOnly 
              value={interaction.sentiment}
              className="w-full p-2 border rounded bg-slate-50 text-slate-900 focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Action Items / Follow-ups</label>
          <div className="w-full p-2 border rounded bg-slate-50 min-h-[4rem] text-slate-900">
            {interaction.actionItems && interaction.actionItems.length > 0 ? (
              <ul className="list-disc pl-5">
                {interaction.actionItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <span className="text-slate-400 italic">No action items</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
