
import Link from 'next/link';
import SignOutComponent from "../SignOut";

const Nav = () => {
    return (
        <>
            <nav className="nav-container">
                <div className="bg-gray-300 shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center space-x-4">
                        <div className="left">
                            <div className="container mx-auto flex justify-between items-center">
                                <Link href="/user/settings" className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center">
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                        <div className="right">
                            <SignOutComponent />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Nav
