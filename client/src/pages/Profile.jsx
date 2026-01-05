import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Award, BookOpen, Star, Plus, X, Save } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [skillType, setSkillType] = useState('teach'); // 'teach' or 'learn'

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        // In a real app, this would hit an API
        console.log(`Adding ${newSkill} to ${skillType}`);
        setNewSkill('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <header className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-white/50">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl text-white">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h1 className="text-4xl font-bold mb-2 text-slate-900">{user?.name}</h1>
                    <p className="text-slate-500 mb-4 flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" /> {user?.email}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="px-4 py-2 glass rounded-2xl flex items-center gap-2 border border-slate-100">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className="font-bold text-slate-700">{user?.credits} Credits</span>
                        </div>
                        <div className="px-4 py-2 glass rounded-2xl flex items-center gap-2 border border-slate-100">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="font-bold text-slate-700">{user?.rating || 4.8} Rating</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 glass hover:bg-slate-50 rounded-xl font-bold transition-all text-slate-700 border border-slate-200"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Skills to Teach */}
                <div className="glass p-8 rounded-3xl space-y-6 border border-white/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                            <BookOpen className="w-6 h-6 text-primary" /> Skills I Teach
                        </h2>
                        {isEditing && (
                            <button onClick={() => setSkillType('teach')} className="p-1 hover:text-primary transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {user?.skillsToTeach?.map((skill, i) => (
                            <div key={i} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center gap-2 group font-medium">
                                {skill}
                                {isEditing && <X className="w-4 h-4 cursor-pointer hover:text-primary-dark" />}
                            </div>
                        ))}
                        {isEditing && skillType === 'teach' && (
                            <form onSubmit={handleAddSkill} className="w-full mt-2">
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full text-sm py-3"
                                    placeholder="Type skill and press Enter..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                            </form>
                        )}
                        {!user?.skillsToTeach?.length && !isEditing && <p className="text-slate-400 italic">No skills added yet.</p>}
                    </div>
                </div>

                {/* Skills to Learn */}
                <div className="glass p-8 rounded-3xl space-y-6 border border-white/50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                            <Star className="w-6 h-6 text-secondary" /> Skills I Want to Learn
                        </h2>
                        {isEditing && (
                            <button onClick={() => setSkillType('learn')} className="p-1 hover:text-secondary transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {user?.skillsToLearn?.map((skill, i) => (
                            <div key={i} className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl flex items-center gap-2 group font-medium">
                                {skill}
                                {isEditing && <X className="w-4 h-4 cursor-pointer hover:text-secondary-dark" />}
                            </div>
                        ))}
                        {isEditing && skillType === 'learn' && (
                            <form onSubmit={handleAddSkill} className="w-full mt-2">
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full text-sm py-3"
                                    placeholder="Type skill and press Enter..."
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                />
                            </form>
                        )}
                        {!user?.skillsToLearn?.length && !isEditing && <p className="text-slate-400 italic">No skills added yet.</p>}
                    </div>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-4 border border-white/50">
                <h2 className="text-2xl font-bold text-slate-900">About Me</h2>
                {isEditing ? (
                    <textarea
                        className="w-full h-32 text-sm"
                        defaultValue={user?.bio}
                        placeholder="Tell us about yourself, your hobbies, and what drives you..."
                    />
                ) : (
                    <p className="text-slate-500 leading-relaxed font-medium">
                        {user?.bio || "No bio updated yet. Add a short bio to let others know more about you!"}
                    </p>
                )}
            </div>

            {isEditing && (
                <div className="flex justify-end">
                    <button className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
                        <Save className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
