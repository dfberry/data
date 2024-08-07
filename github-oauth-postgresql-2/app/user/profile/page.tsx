import useRequireAuth from "@/hooks/useRequireAuth";

export default async function ProfilePage() {
	const { user, session, isAuthorized } = await useRequireAuth();

	if (!session || !isAuthorized) {
		return null;
	}
	return (
		<>
			<h1>Profile: {user?.username}!</h1>
			<p>Your user ID is {user?.id}.</p>
		</>
	);
}