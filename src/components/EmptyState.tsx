import React from 'react'
import { Database, AlertCircle } from 'lucide-react'
import { contentConfig } from '@/config/content'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-gray-700 border-dashed rounded-2xl h-full min-h-[300px]">
      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
        {icon || <Database className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-md">
        <AlertCircle className="w-4 h-4" />
        {contentConfig.components.emptyState.policyEnforcedText}
      </div>
    </div>
  )
}
