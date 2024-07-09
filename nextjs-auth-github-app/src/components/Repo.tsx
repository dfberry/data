'use client'
import { useTransition } from 'react'
import { deleteRepo } from '@/actions/repo'
const Repo = ({ repo }:any) => {
  const [isPending, startTransition] = useTransition()
  return (
    <div
      className={`px-8 py-2 border border-black/25 cursor-pointer`}
      onClick={() => startTransition(() => deleteRepo(repo.id))}
    >
      {repo.url}
    </div>
  )
}

export default Repo