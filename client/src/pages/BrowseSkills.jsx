import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, BookOpen, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BrowseSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingSkill, setBookingSkill] = useState(null);
    const [bookingTime, setBookingTime] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await axios.get('/api/skills');
            setSkills(res.data);
        } catch (err) {
            console.error('Error fetching skills:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to book a session');
        if (user.credits < 1) return alert('Insufficient credits');

        setIsBooking(true);
        try {
            // For MVP, we need a teacher ID. In a real app, skills would be linked to users.
            // Since our Skill model is simple, let's assume we fetch users who teach this skill.
            // For now, let's mock a teacher ID if one isn't provided (or add a field to Skill model)

            await axios.post('/api/sessions/book', {
                teacherId: bookingSkill.teacherId || '659876543210987654321098', // Mock fallback
                skill: bookingSkill.name,
                scheduledTime: bookingTime
            });
            setBookingStatus('success');
            setTimeout(() => {
                setBookingSkill(null);
                setBookingStatus(null);
            }, 2000);
        } catch (err) {
            setBookingStatus('error');
        } finally {
            setIsBooking(false);
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-900">Discover New <span className="gradient-text">Masteries</span></h1>
                <p className="text-slate-500">Explore skills from our community of passionate experts.</p>

                <div className="relative mt-8 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        className="w-full !pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm hover:shadow-md focus:shadow-lg focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg text-slate-900 placeholder:text-slate-400"
                        placeholder="Search for skills (e.g. Piano, Coding, Cooking...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Loading skills...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.length > 0 ? filteredSkills.map((skill) => (
                        <div key={skill._id} className="glass-card p-6 flex flex-col h-full border border-white/50">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                                    {skill.category}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-bold">1 hour</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-900">{skill.name}</h3>
                            <p className="text-slate-500 text-sm flex-grow mb-6 line-clamp-3">{skill.description}</p>

                            <button
                                onClick={() => setBookingSkill(skill)}
                                className="w-full py-3 glass hover:bg-primary hover:text-white hover:border-primary rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-slate-700 border border-slate-200"
                            >
                                Book Session <BookOpen className="w-4 h-4" />
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full py-24 text-center glass rounded-[2.5rem] border border-white/50 shadow-inner">
                            <div className="max-w-xs mx-auto mb-8 opacity-20">
                                <Search className="w-20 h-20 mx-auto mb-4" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No skills found</h3>
                            <p className="text-slate-500 mb-8 px-4">We couldn't find any skills matching "<span className="font-bold">{searchTerm}</span>". Try another keyword or category!</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-bold hover:bg-slate-200 transition-all"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Booking Modal */}
            {bookingSkill && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="glass max-w-md w-full p-8 rounded-2xl shadow-2xl relative overflow-hidden border border-white/50">
                        {bookingStatus === 'success' && (
                            <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center text-white z-10 animate-in fade-in zoom-in">
                                <Check className="w-16 h-16 mb-4" />
                                <h3 className="text-2xl font-bold">Session Booked!</h3>
                                <p>Redirecting to dashboard...</p>
                            </div>
                        )}

                        <button
                            onClick={() => setBookingSkill(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-2 text-slate-900">Book Session</h2>
                        <p className="text-slate-500 mb-6">Learning <span className="text-primary font-bold">{bookingSkill.name}</span></p>

                        <form onSubmit={handleBookSession} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 ml-1">Select Date & Time</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900"
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-sm text-slate-600">
                                <div className="flex justify-between mb-2">
                                    <span>Cost</span>
                                    <span className="text-slate-900 font-bold">1 Credit</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Your Balance</span>
                                    <span className={user?.credits >= 1 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                                        {user?.credits || 0} Credits
                                    </span>
                                </div>
                            </div>

                            {bookingStatus === 'error' && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Failed to book session. Please try again.</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isBooking || user?.credits < 1}
                                className="w-full py-3 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isBooking ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : user?.credits < 1 ? (
                                    'Insufficient Credits'
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseSkills;
