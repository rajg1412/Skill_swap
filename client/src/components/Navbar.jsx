import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Share2, MessageSquare, Calendar, User, Search, LayoutDashboard, LogOut, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Share2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xl font-bold tracking-tight">SkillSwap <span className="text-primary text-sm uppercase">Hub</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
                <Link to="/browse" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                    <Search className="w-4 h-4" />
                    <span>Browse</span>
                </Link>
                {user && (
                    <>
                        <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/sessions" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                            <Calendar className="w-4 h-4" />
                            <span>Sessions</span>
                        </Link>
                        <Link to="/chat" className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors relative">
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat</span>
                            <span className="absolute -top-1 -right-2 w-2 h-2 bg-primary rounded-full"></span>
                        </Link>
                    </>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 text-yellow-600 border border-yellow-400/20 rounded-full">
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-bold">{user.credits}</span>
                        </div>
                        <Link to="/profile" className="p-2 rounded-full glass hover:bg-slate-100 transition-colors text-slate-600 border border-slate-200">
                            <User className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full glass hover:bg-red-50 text-red-500 transition-colors border border-red-100"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="px-5 py-2 rounded-full glass hover:bg-slate-100 font-medium transition-all text-sm text-slate-600 border border-slate-200">
                            Login
                        </Link>
                        <Link to="/register" className="px-5 py-2 rounded-full bg-primary text-white hover:bg-primary/90 font-bold transition-all shadow-lg shadow-primary/20 text-sm">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
