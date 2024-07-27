import Link from 'next/link';
export default async function SignInComponent() {

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Link prefetch={false} href="/login/github" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Sign in with GitHub
            </Link>
        </div>
    );
}