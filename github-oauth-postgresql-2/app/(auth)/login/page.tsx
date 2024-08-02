import { validateRequest } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {

	const { user } = await validateRequest();
	if (user) {
		return redirect("/settings");
	}
	return (
		<>
			<h1>Sign in</h1>
			<a href="/login/github">Sign in with GitHub</a>
		</>
	);
}
