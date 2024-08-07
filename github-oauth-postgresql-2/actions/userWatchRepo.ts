"use server";
import UserWatchRepoService from "@/lib/db/userWatchRepo";
import GitHubRepoService from "@/lib/github/repo";
import { getDbTokenByDbUserId } from "@/lib/db/db";
import { revalidatePath } from "next/cache";
import useRequireAuth from "@/hooks/useRequireAuth";

export const CreateNewRepoToWatch = async (newRepo: string) => {
  const { user, session, isAuthorized } = await useRequireAuth();

  if (!isAuthorized || !session) {
    console.log("createNewRepoToWatch: Not authorized");
    return null;
  } else {
    console.log("createNewRepoToWatch: Authorized");
  }
  const service = new UserWatchRepoService();

  if (!newRepo || newRepo === "") {
    console.log("createNewRepoToWatch: newRepo is empty");
    return null;
  } else {
    //console.log("newRepoToWatch: ", newRepo);
  }
  const accessToken = await getDbTokenByDbUserId(session?.userId);

  // verify db exists
  const repo = await GitHubRepoService.repoInfo(accessToken!, newRepo);
  if (!repo) {
    console.log("createNewRepoToWatch: Repo not found");
    throw new Error("Repo not found");
  }

  // add repo to db
  await UserWatchRepoService.create(session?.userId, newRepo);
  revalidatePath("/todos");
};
export const DeleteRepoToWatch = async (id: string) => {
  await UserWatchRepoService.delete(id);
  revalidatePath("/todos");
};
