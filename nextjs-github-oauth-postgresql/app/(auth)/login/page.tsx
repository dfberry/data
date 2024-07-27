// import { validateRequest } from "@/lib/auth";
// import { redirect } from "next/navigation";

export default async function Page() {
	// const { user } = await validateRequest();
	// if (user) {
	// 	return redirect("/profile");
	// }
	return (
		<>
			<div className="flex justify-between mt-6">
				<a className="bg-blue-500 text-white py-2 px-4 rounded-lg" href="/login/github">Sign in with GitHub</a>
			</div>
		</>
	);
}
