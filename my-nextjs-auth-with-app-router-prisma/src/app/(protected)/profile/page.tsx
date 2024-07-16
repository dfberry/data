import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "@/auth/config";

const ProfilePage = async () => {
  console.log("ProfilePage2");
  const session = await getServerSession(options);
  console.log("Session:", JSON.stringify(session, null, 2));
  return (
    <div>
      <h1>Profile</h1>
      <div>
        {session?.user?.name && <h2>Hello {session.user.name}!</h2>}
        {session?.user?.image && (
          <div>
            <Image
              src={session.user.image}
              width={200}
              height={200}
              alt={`Profile Pic for ${session.user.name}`}
              priority={true}
            />
            <div className="flex items-center">
              <Link href="/profile/github" className="pr-2 border-r border-gray-300 text-blue-500 hover:text-blue-700 underline">Configuration</Link>
              <Link href="/profile/github/reports/issues" className="px-2 border-r border-gray-300 text-blue-500 hover:text-blue-700 underline">Issues</Link>
              <Link href="/profile/github/reports/repos" className="pl-2 text-blue-500 hover:text-blue-700 underline">Repos</Link>
            </div>
            <div className="bg-gray-100 text-gray-800 p-4 border border-gray-300 rounded">
              {JSON.stringify(session, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;