import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function BackButton({ className = "" }: { className?: string }) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-[#2563EB] hover:border-blue-100 hover:bg-blue-50 transition-all duration-300 hover:-translate-x-1 ${className}`}
      aria-label="Go back to homepage"
    >
      <ArrowLeft className="w-5 h-5" />
    </Link>
  )
}
