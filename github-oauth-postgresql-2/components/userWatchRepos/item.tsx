'use client'
import { useTransition } from 'react'
import { deleteRepoToWatch } from '@/actions/userWatchRepo'

const UserWatchRepoItemComponent = ({ item }: any) => {

    console.log("UserWatchRepoItemComponent:", item);

    const [isPending, startTransition] = useTransition()

    if (!item) return
    return (
        <div className="flex items-center justify-between mb-4">
            <span className="flex-1">{item.repoName}</span>
            <button
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
                disabled={isPending}
                onClick={(e) => {
                    e.stopPropagation(); // Prevents the click from triggering on the parent div
                    startTransition(() => deleteRepoToWatch(item.id))
                }}
            >
                Delete
            </button>
        </div>
    )
}

export default UserWatchRepoItemComponent