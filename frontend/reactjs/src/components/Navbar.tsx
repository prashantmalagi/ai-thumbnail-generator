import { MenuIcon, XIcon, LogOutIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate('/');
    };

    // Get initials from user name for avatar
    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <Link to='/'>
                    <img src="/logo.svg" alt="logo" width={130} height={34} />
                </Link>

                <div className="hidden md:flex items-center gap-8 transition duration-500">
                    <Link to='/' className="hover:text-pink-300 transition">Home</Link>
                    <Link to='/generate' className="hover:text-pink-300 transition">Generations</Link>
                    <Link to='/my-generation' className="hover:text-pink-300 transition">My Generations</Link>
                    <Link to='/contact' className="hover:text-pink-300 transition">Contact</Link>
                </div>

                {isLoggedIn ? (
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-pink-950/60 border border-pink-800/50 rounded-full pl-1 pr-4 py-1">
                            <span className="flex items-center justify-center size-8 rounded-full bg-pink-600 text-white text-xs font-semibold">
                                {initials}
                            </span>
                            <span className="text-sm text-slate-300 max-w-24 truncate">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm text-pink-300 border border-pink-800/60 hover:bg-pink-950/50 active:scale-95 transition-all rounded-full"
                        >
                            <LogOutIcon size={14} />
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')} className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">
                        Get Started
                    </button>
                )}

                <button onClick={() => setIsOpen(true)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={() => setIsOpen(false)} to='/'>Home</Link>
                <Link onClick={() => setIsOpen(false)} to='/generate'>Generations</Link>
                <Link onClick={() => setIsOpen(false)} to='/my-generation'>My Generations</Link>
                <Link onClick={() => setIsOpen(false)} to='/contact'>Contact</Link>
                {isLoggedIn ? (
                    <>
                        <span className="text-slate-400 text-base">{user?.name}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-pink-400">
                            <LogOutIcon size={16} />
                            Logout
                        </button>
                    </>
                ) : (
                    <Link onClick={() => setIsOpen(false)} to='/login'>Login</Link>
                )}
                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}