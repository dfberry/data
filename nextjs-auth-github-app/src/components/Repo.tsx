'use client'
import { useTransition } from 'react'

const Repo = ({ repo }:any) => {
  return (
    <div
      className={`px-8 py-2 border border-black/25 cursor-pointer`}
    >
      {repo.url}
    </div>
  )
}

export default Repo