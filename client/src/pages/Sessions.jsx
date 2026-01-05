import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchSessions();
    }, []);

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

    const handleUpdateStatus = async (sessionId, status) => {
        try {
            if (status === 'completed') {
                await axios.patch(`/api/sessions/complete/${sessionId}`);
            } else if (status === 'cancelled') {
                await axios.patch(`/api/sessions/cancel/${sessionId}`);
            }
            fetchSessions();
        } catch (err) {
            alert('Failed to update session status');
        }
    };

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold mb-2 text-slate-900">My <span className="gradient-text">Sessions</span></h1>
                <p className="text-slate-500">Track and manage your teaching and learning appointments.</p>
            </header>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading your sessions...</div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {sessions.length > 0 ? sessions.map((session) => (
                        <div key={session._id} className="glass p-8 rounded-3xl border border-white/50 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${session.teacher?._id === user?.id ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{session.skill}</h3>
                                        <p className="text-sm text-slate-500">
                                            {session.teacher?._id === user?.id ? `Teaching ${session.learner?.name}` : `Learning from ${session.teacher?.name}`}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${session.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {session.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm">
                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {new Date(session.scheduledTime).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                {session.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(session._id, 'completed')}
                                            className="flex-grow py-3 bg-green-500 text-white hover:bg-green-600 rounded-xl font-bold transition-all shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Mark Complete
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(session._id, 'cancelled')}
                                            className="flex-grow py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm border border-red-100"
                                        >
                                            <XCircle className="w-4 h-4" /> Cancel
                                        </button>
                                    </>
                                )}
                                <Link
                                    to="/chat"
                                    className="p-3 glass hover:bg-slate-50 rounded-xl transition-all border border-slate-200"
                                    title="Message"
                                >
                                    <MessageCircle className="w-5 h-5 text-slate-500" />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center glass rounded-[3rem] border border-white/50">
                            <p className="text-slate-500 mb-6">No sessions found. Ready to start your journey?</p>
                            <Link to="/browse" className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all inline-block shadow-lg shadow-primary/20">
                                Find Skills to Learn
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Sessions;
