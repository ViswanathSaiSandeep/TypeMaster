import React, { useState } from 'react';
import { Button } from './Button';
import { User } from '../types';

interface AuthFormsProps {
    view: 'LOGIN' | 'SIGNUP';
    onSuccess: (user: User) => void;
    onSwitch: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ view, onSuccess, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Mock Authentication Logic
        const storedUsersStr = localStorage.getItem('typeMaster_users');
        const users: User[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];

        if (view === 'SIGNUP') {
            if (!username) {
                setError('Username is required');
                return;
            }
            if (users.find(u => u.email === email)) {
                setError('User already exists');
                return;
            }
            const newUser: User = { username, email, history: [] };
            users.push(newUser);
            localStorage.setItem('typeMaster_users', JSON.stringify(users));
            // Also store password theoretically, but we are mocking
            localStorage.setItem(`typeMaster_pwd_${email}`, password);
            onSuccess(newUser);
        } else {
            const user = users.find(u => u.email === email);
            const storedPwd = localStorage.getItem(`typeMaster_pwd_${email}`);
            
            if (user && storedPwd === password) {
                onSuccess(user);
            } else {
                setError('Invalid credentials');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-10 px-4 w-full animate-in fade-in zoom-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-[#182f34] border border-slate-200 dark:border-[#315f68] rounded-xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                    {view === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
                </h2>
                
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {view === 'SIGNUP' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Username</label>
                            <input 
                                type="text"
                                className="form-input rounded-lg border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-primary focus:border-primary"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="johndoe"
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
                        <input 
                            type="email"
                            className="form-input rounded-lg border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-primary focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                        <input 
                            type="password"
                            className="form-input rounded-lg border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-primary focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <Button type="submit" fullWidth className="mt-4 !h-12 !text-base">
                        {view === 'LOGIN' ? 'Login' : 'Sign Up'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    {view === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={onSwitch} className="text-primary hover:underline font-medium">
                        {view === 'LOGIN' ? 'Sign up' : 'Log in'}
                    </button>
                </div>
            </div>
        </div>
    );
};