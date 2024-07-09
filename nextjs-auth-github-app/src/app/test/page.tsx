import Link from 'next/link';
export default function MyTest() {

    // The Link component enables client-side navigation between two pages in the same Next.js app.


    return (
        <div className="flex flex-col items-start">
            <h1>MyTest</h1>
            <a href="https://nextjs.org" className="mt-2">Next.js!</a>
            <Link href="https://nextjs.org" className="mt-2">Next.js with Link</Link>
            <Link href="/profile" className="mt-2">Profile with Link</Link>
        </div>
    );

}