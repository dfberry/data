'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { RepoType, RepoSchema } from '@/lib/schema/repo'
import Repo from '@/components/GitHub/Repo/Repo'
import Prisma from '@prisma/client'

export const createNewRepo = async (userId: string, data: FormData) => {
  const newRepo = data.get('repo') as string
  if (!newRepo) return { success: false, message: 'Empty repo name' }

  console.log(`newRepo: ${newRepo}`)

  const { error: zodError } = RepoSchema.safeParse({ url: newRepo })
  if (zodError) {
    console.log('createNewRepo: Invalid url ', zodError.format());
    return ({ success: false, message: `invalid input`, error: zodError.format() });
  }

  const whereParams: Prisma.Prisma.RepoWhereInput = {
    url: newRepo,
    userId
  };

  const existingRepo = await db.repo.findFirst({
    where: whereParams,
  });

  if (existingRepo) {
    console.log('Repo already exists');
    return { success: false, message: 'User already has repo' };
  }

  if (newRepo) {
    await db.repo.create({
      data: {
        userId: userId,
        url: newRepo,
      },
    });

    revalidatePath('/profiles/github');
    console.log('Repo created successfully');
    return { success: true, message: 'Repo created successfully' };
  } else {
    console.log('Invalid repo name');
    return { success: false, message: 'Invalid repo name' };
  }
}

export const deleteRepo = async (userId: string, repoId: string) => {

  const whereParams: Prisma.Prisma.RepoWhereInput = {
    id: repoId,
    userId
  };

  const existingRepo = await db.repo.findFirst({
    where: whereParams,
  });

  if (!existingRepo) {
    console.log('Repo does not exist');
    throw new Error('Repo does not exist');
  }
  await db.repo.delete({
    where: { id: existingRepo.id }
  })
  revalidatePath('/profiles/github')
}

export const getReposByUser = async (userId: string) => {
  const whereParams: Prisma.Prisma.RepoWhereInput = {
    userId
  };

  const repos = await db.repo.findMany({
    where: { userId }
  })
  return repos
}
