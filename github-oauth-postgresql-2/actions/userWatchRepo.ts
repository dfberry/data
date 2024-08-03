'use server'
import UserWatchRepoService from '@/lib/db/userWatchRepo';
import { revalidatePath } from 'next/cache'
import useRequireAuth from '@/hooks/useRequireAuth';

export const createNewRepoToWatch = async (data: FormData) => {

    const { user, session, isAuthorized } = await useRequireAuth();

    if (!isAuthorized || !session) {
        console.log("newRepoToWatch: Not authorized");
        return null;
    } else {
        console.log("newRepoToWatch: Authorized");
    }
    const service = new UserWatchRepoService();

    const newRepo = data.get('repo') as string
    if (!newRepo || newRepo === '') {
        console.log("newRepoToWatch: newRepo is empty");
        return null;
    } else {
        console.log("newRepoToWatch: ", newRepo);
    }


    await service.create(
        session?.userId,
        newRepo
    )
    revalidatePath('/todos')
}
export const deleteRepoToWatch = async (id: string) => {
    const service = new UserWatchRepoService();
    await service.delete(id)
    revalidatePath('/todos')
}