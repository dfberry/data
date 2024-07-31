import Link from 'next/link';
export default async function HomePage() {

	return (
		<div className="flex justify-between mt-6">
			<a className="bg-blue-500 text-white py-2 px-4 rounded-lg" href="/login/github">Sign in with GitHub</a>
		</div>
	);
}

