import React from 'react'
import { cn } from '../../lib/utils'

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('animate-pulse bg-cream-300/60 rounded-xl', className)} />
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-cream-300 shadow-sm flex flex-col space-y-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton className="h-4 w-1/3 rounded" />
      <Skeleton className="h-5 w-4/5 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}
