import { lucia, validateRequest } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import SignOutComponent from "@/components/SignOut";
export default async function Page() {
	const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
	return (
		<>
			<SignOutComponent />
		</>
	);
}

