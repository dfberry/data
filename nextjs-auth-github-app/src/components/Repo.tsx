'use client'
import { useTransition } from 'react'
import { deleteRepo } from '@/actions/repo'
const Repo = ({ repo }:any) => {
  const [isPending, startTransition] = useTransition()
  return (
    <div className="px-8 py-2 border border-black/25 flex justify-between items-center">
      <span>{repo.url}</span>
      <button
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation(); // Prevents the click from triggering on the parent div
          startTransition(() => deleteRepo(repo.id))
        }}
      >
        Delete
      </button>
    </div>
  )
}

export default Repo