import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, User, Search, MessageSquare, Loader2 } from 'lucide-react';

const Chat = () => {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        // In a real app, we'd fetch actual conversations. 
        // Here we'll mock some for demonstration based on sessions.
        const fetchConversations = async () => {
            try {
                const res = await axios.get('/api/sessions');
                const uniqueUsers = [];
                const seen = new Set();

                res.data.forEach(s => {
                    const other = s.teacher?._id === user?.id ? s.learner : s.teacher;
                    if (other && !seen.has(other._id)) {
                        uniqueUsers.push(other);
                        seen.add(other._id);
                    }
                });

                setConversations(uniqueUsers);
                if (uniqueUsers.length > 0) setActiveChat(uniqueUsers[0]);
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();

        socketRef.current = io('/', {
            auth: { token }
        });

        socketRef.current.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socketRef.current.disconnect();
    }, [user, token]);

    useEffect(() => {
        if (activeChat) {
            fetchMessages();
            socketRef.current.emit('join_room', activeChat._id);
        }
    }, [activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`/api/messages/${activeChat._id}`);
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        const messageData = {
            receiverId: activeChat._id,
            content: input,
            room: activeChat._id // Simplify for MVP
        };

        try {
            const res = await axios.post('/api/messages', messageData);
            socketRef.current.emit('send_message', { ...res.data, room: activeChat._id });
            setMessages((prev) => [...prev, res.data]);
            setInput('');
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <div className="h-[calc(100vh-180px)] glass rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/50">
            {/* Sidebar */}
            <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full !pl-10 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                            placeholder="Search chats..."
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                    ) : conversations.length > 0 ? (
                        conversations.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => setActiveChat(chat)}
                                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors hover:bg-white/80 ${activeChat?._id === chat._id ? 'bg-primary/10 border-r-4 border-primary' : ''}`}
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                    {chat.name.charAt(0)}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-sm text-slate-900">{chat.name}</h4>
                                    <p className="text-xs text-slate-500 truncate">Click to open chat</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 p-6">
                            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm text-slate-500">No conversations yet. Book a session to start chatting!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeChat ? (
                <div className="flex-grow flex flex-col bg-slate-50/30">
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                                {activeChat.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{activeChat.name}</h3>
                                <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium ${msg.sender === user?.id
                                    ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
                                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
                                    }`}>
                                    {msg.content}
                                    <p className={`text-[10px] mt-1 flex justify-end ${msg.sender === user?.id ? 'text-white/70' : 'text-slate-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-200">
                        <div className="relative flex gap-4">
                            <input
                                type="text"
                                className="flex-grow py-3 px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-3 bg-primary text-white hover:bg-primary/90 rounded-2xl shadow-lg shadow-primary/30 transition-all font-bold"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-400 bg-slate-50/10">
                    <MessageSquare className="w-20 h-20 mb-6 opacity-10" />
                    <p className="text-xl font-medium">Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    );
};

export default Chat;
