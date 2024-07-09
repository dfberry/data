import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

import { SignOutButton } from "@/components/SignOutButton";

const SignOutPage = async () => {
  const session = await getServerSession(options);

  if (!session) {
    console.log(`SignOutPage: !session so redirect to root`)
  }

  if (!session) {
    redirect("/");
  } else {
    return (
      <div>
        <h1>SignOutPage</h1>

        <SignOutButton />
      </div>
    );
  }
};

export default SignOutPage;
