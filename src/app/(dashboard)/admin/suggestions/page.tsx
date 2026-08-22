"use client";

import { useSuggestionsStore } from "@/store/suggestions-store";
import { Card } from "@/components/ui/card";
import { MailOpen, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSuggestionsPage() {
  const { suggestions, updateStatus, deleteSuggestion } = useSuggestionsStore();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending': return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase"><Clock size={12}/> Pending</span>;
      case 'Reviewed': return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase"><MailOpen size={12}/> Reviewed</span>;
      case 'Implemented': return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase"><CheckCircle2 size={12}/> Implemented</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Platform Suggestions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Review feature requests and feedback submitted via the global tablet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {suggestions.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-[#111827] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <MailOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500">No Suggestions Yet</h3>
            <p className="text-gray-400">Your inbox is completely clear.</p>
          </div>
        ) : (
          suggestions.map((sug) => (
            <Card key={sug.id} className="p-6 rounded-[18px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] shadow-sm flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">{sug.id}</span>
                    {getStatusBadge(sug.status)}
                  </div>
                  <span className="text-sm text-gray-400 font-medium">{sug.date}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{sug.topic}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                    Submitted by: {sug.name} ({sug.authorType})
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-[#111827] p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {sug.content}
                </div>
              </div>

              <div className="w-full md:w-48 flex flex-col gap-2 shrink-0 md:border-l md:border-gray-100 dark:md:border-gray-800 md:pl-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Actions</h4>
                
                {sug.status === 'Pending' && (
                  <Button 
                    onClick={() => updateStatus(sug.id, 'Reviewed')}
                    variant="outline"
                    className="w-full justify-start text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <MailOpen size={16} className="mr-2" /> Mark Reviewed
                  </Button>
                )}
                
                {sug.status === 'Reviewed' && (
                  <Button 
                    onClick={() => updateStatus(sug.id, 'Implemented')}
                    variant="outline"
                    className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <CheckCircle2 size={16} className="mr-2" /> Implement
                  </Button>
                )}

                <Button 
                  onClick={() => deleteSuggestion(sug.id)}
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto"
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </Button>
              </div>

            </Card>
          ))
        )}
      </div>
    </div>
  );
}
