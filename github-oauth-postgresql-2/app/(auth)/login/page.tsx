import { validateRequest } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import SignInComponent from "@/components/SignIn";

export default async function LoginPage() {

	const { user } = await validateRequest();
	if (user) {
		return redirect("/user/settings");
	}
	return (
		<>
			<SignInComponent />
		</>
	);
}
