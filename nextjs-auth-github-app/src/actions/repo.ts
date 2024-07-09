'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const createNewRepo = async (data: FormData) => {


  const newRepo = data.get('repo') as string
  console.log(`newRepo: ${newRepo}`)

  if (newRepo) {
    // @ts-ignore
    await db.repo.create({
      data: {
        url: newRepo,
      },
    })

    revalidatePath('/profiles/repos')
  }
}

export const deleteRepo = async (id: string) => {
    await db.repo.delete({
      where: { id }
    })
    revalidatePath('/profiles/repos')
  }
