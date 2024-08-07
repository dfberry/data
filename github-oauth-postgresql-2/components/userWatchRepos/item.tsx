'use client'
import { Suspense, useTransition } from 'react'
import { deleteRepoToWatch } from '@/actions/userWatchRepo'
import Link from 'next/link'
type Props = {
    item: any;
    enableDelete: boolean;
    enableReportLink: boolean;
}

const UserWatchRepoItemComponent = ({ item, enableDelete, enableReportLink }: Props) => {

    //console.log("UserWatchRepoItemComponent:item ", item);
    console.log("UserWatchRepoItemComponent:enableDelete ", enableDelete);
    console.log("UserWatchRepoItemComponent:enableReportLink ", enableReportLink);

    const [isPending, startTransition] = useTransition()

    if (!item) return
    return (
        <Suspense fallback={<p>Loading data...</p>}>
            <div className="flex items-center justify-between mb-4 p-4 bg-white shadow-md rounded-md">
                <span className="flex-1 text-gray-800 font-medium">{item.repoName}</span>
                <div className="flex space-x-2">
                    {enableReportLink && (
                        <Link
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition-colors"
                            href={`/user/query/repos/${item.id}`}>

                            Report

                        </Link>
                    )}
                    {enableDelete && (
                        <button
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
                            disabled={isPending}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevents the click from triggering on the parent div
                                startTransition(() => deleteRepoToWatch(item.id));
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </Suspense>
    )
}

export default UserWatchRepoItemComponent