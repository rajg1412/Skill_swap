import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BookOpen, Award, Clock, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await axios.get('/api/sessions');
                setSessions(res.data);
            } catch (err) {
                console.error('Error fetching sessions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const stats = [
        { label: 'Credits', value: user?.credits || 0, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-400/10' },
        { label: 'Teaching', value: user?.skillsToTeach?.length || 0, icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Learning', value: user?.skillsToLearn?.length || 0, icon: Star, color: 'text-secondary', bg: 'bg-secondary/10' },
        { label: 'Sessions', value: sessions.length, icon: Clock, color: 'text-green-600', bg: 'bg-green-400/10' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-slate-900">Hello, <span className="gradient-text">{user?.name}</span>!</h1>
                    <p className="text-slate-500">Welcome back to your skill exchange hub.</p>
                </div>
                <Link to="/browse" className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20">
                    Find a Skill <ArrowRight className="w-4 h-4" />
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl flex items-center gap-4 border border-white/50">
                        <div className={`p-4 ${stat.bg} rounded-xl`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Upcoming Sessions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Upcoming Sessions</h2>
                        <Link to="/sessions" className="text-primary hover:underline text-sm font-medium">View All</Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="glass p-8 rounded-2xl text-center text-slate-500 border border-white/50">Loading sessions...</div>
                        ) : sessions.length > 0 ? (
                            sessions.slice(0, 3).map((session) => (
                                <div key={session._id} className="glass p-5 rounded-2xl flex items-center justify-between border border-white/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-lg border border-slate-200 text-slate-700">
                                            {session.teacher?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{session.skill}</h3>
                                            <p className="text-sm text-slate-500">
                                                {session.teacher?._id === user?.id ? `Teaching ${session.learner?.name}` : `Learning from ${session.teacher?.name}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-slate-800">{new Date(session.scheduledTime).toLocaleDateString()}</p>
                                        <p className="text-sm text-primary font-bold">{new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass p-10 rounded-2xl text-center border border-white/50">
                                <p className="text-slate-500 mb-6">No upcoming sessions. Time to learn something new!</p>
                                <Link to="/browse" className="text-primary font-bold hover:underline">Browse Skills</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Profile Mini */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900">My Skills</h2>
                    <div className="glass p-6 rounded-2xl space-y-6 border border-white/50">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Teaching</p>
                            <div className="flex flex-wrap gap-2">
                                {user?.skillsToTeach?.length > 0 ? user.skillsToTeach.map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                                        {s}
                                    </span>
                                )) : <p className="text-sm text-slate-400">Add skills you can teach!</p>}
                            </div>
                        </div>
                        <div className="h-px bg-slate-200"></div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">Learning</p>
                            <div className="flex flex-wrap gap-2">
                                {user?.skillsToLearn?.length > 0 ? user.skillsToLearn.map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20">
                                        {s}
                                    </span>
                                )) : <p className="text-sm text-slate-400">Add skills you want to learn!</p>}
                            </div>
                        </div>
                        <Link to="/profile" className="w-full py-3 glass hover:bg-slate-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4 text-sm border border-slate-200 text-slate-700">
                            Manage Skills
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
