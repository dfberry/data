import RepoList from '@/components/RepoList'
import db from '@/lib/db'

const getData = async () => {
  const todos = await db.repo.findMany({
    where: {},
    orderBy: {
      createdAt: 'desc',
    },
  })

  return todos
}

const RepoPage = async () => {
  const repos = await getData()
  return (
    <div>
      <RepoList repos={repos} />
    </div>
  )
}

export default RepoPage