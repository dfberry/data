import Link from 'next/link';
import { GitHubUser } from "@/lib/github";
import SignOutComponent from './SignOut';
import { FaGithub } from "react-icons/fa"; // Import GitHub icon from React Icons
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import { GiShadowFollower } from "react-icons/gi";
import { SlUserFollowing } from "react-icons/sl";
type ProfileComponentProps = {
	ghUser: GitHubUser | null;
};

export default function ProfileComponent({ ghUser }: ProfileComponentProps) {

	if (!ghUser) {
		return (
			<div className="container mx-auto p-4">
				<div className="bg-white shadow-md rounded-lg p-6">
					<h1 className="text-2xl font-bold">Profile</h1>
					<p className="mt-4 text-gray-800">No user found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="bg-white shadow-md rounded-lg p-6">
				<div className="flex items-center space-x-4">
					<img
						className="w-16 h-16 rounded-full"
						src={ghUser.avatar_url}
						alt={`${ghUser.login}'s avatar`}
					/>
					<div>
						<h1 className="text-2xl font-bold">{ghUser.name}</h1>
						<p className="text-gray-600">@{ghUser.login}</p>
					</div>
				</div>
				<p className="mt-4 text-gray-800">{ghUser.bio}</p>
				<div id="repos" className="mt-6 grid grid-cols-3 gap-4">
					<div className="bg-gray-100 p-4 rounded-lg text-center" title="Number of public repositories">
						<h2 className="text-xl font-semibold">{ghUser.public_repos}</h2>
						<RiGitRepositoryCommitsLine className="h-6 w-6 mx-auto" />
					</div>
					<div className="bg-gray-100 p-4 rounded-lg text-center">
						<h2 className="text-xl font-semibold">{ghUser.followers}</h2>
						<GiShadowFollower className="h-6 w-6 mx-auto" />
					</div>
					<div className="bg-gray-100 p-4 rounded-lg text-center">
						<h2 className="text-xl font-semibold">{ghUser.following}</h2>
						<SlUserFollowing className="h-6 w-6 mx-auto" />
					</div>
				</div>

				<div id="bottom-nav" className="flex justify-between items-center mt-4">
					<Link prefetch={false} href={`https://github.com/${ghUser.login}`} className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
						<FaGithub className="h-6 w-6 mr-2" />
						<span>GitHub</span> {/* Add text to the button */}
					</Link>
					<SignOutComponent />
				</div>
			</div>
		</div>
	);
}