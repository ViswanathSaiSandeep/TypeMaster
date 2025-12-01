import React from 'react';
import { User } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    // Calculate stats
    const totalTests = user.history.length;
    const avgWpm = totalTests > 0 
        ? Math.round(user.history.reduce((acc, curr) => acc + curr.wpm, 0) / totalTests) 
        : 0;
    const maxWpm = totalTests > 0
        ? Math.max(...user.history.map(h => h.wpm))
        : 0;
    
    // Prepare chart data (last 20 tests)
    const chartData = user.history.slice(-20).map((h, i) => ({
        index: i + 1,
        wpm: h.wpm,
        accuracy: h.accuracy,
        date: h.date ? new Date(h.date).toLocaleDateString() : `Test ${i+1}`
    }));

    return (
        <div className="flex flex-col gap-8 py-10 px-4 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Welcome back, <span className="text-primary font-semibold">{user.username}</span>.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#182f34] dark:to-[#101f22] p-8 rounded-2xl border border-slate-200 dark:border-[#315f68] shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <span className="material-symbols-outlined text-6xl">history</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tests Taken</p>
                    <p className="text-5xl font-black text-slate-900 dark:text-white mt-4">{totalTests}</p>
                </div>
                
                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#182f34] dark:to-[#101f22] p-8 rounded-2xl border border-slate-200 dark:border-[#315f68] shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <span className="material-symbols-outlined text-6xl">speed</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Speed</p>
                    <div className="flex items-baseline gap-2 mt-4">
                        <p className="text-5xl font-black text-primary">{avgWpm}</p>
                        <span className="text-xl font-medium text-slate-500">WPM</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-slate-50 dark:from-[#182f34] dark:to-[#101f22] p-8 rounded-2xl border border-slate-200 dark:border-[#315f68] shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <span className="material-symbols-outlined text-6xl">emoji_events</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Best Speed</p>
                     <div className="flex items-baseline gap-2 mt-4">
                        <p className="text-5xl font-black text-green-500">{maxWpm}</p>
                        <span className="text-xl font-medium text-slate-500">WPM</span>
                    </div>
                </div>
            </div>

            {/* Charts and History Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Progress Chart */}
                <div className="bg-white dark:bg-[#182f34] p-6 rounded-2xl border border-slate-200 dark:border-[#315f68] shadow-sm flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">monitoring</span>
                        Performance Trend
                    </h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        {totalTests > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorWpmDash" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0dccf2" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#0dccf2" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                    <XAxis 
                                        dataKey="index" 
                                        stroke="#64748b" 
                                        tick={{fontSize: 12}}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        stroke="#64748b" 
                                        tick={{fontSize: 12}}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#101f22', borderColor: '#315f68', color: '#fff', borderRadius: '8px' }}
                                        itemStyle={{ color: '#0dccf2' }}
                                        labelFormatter={(label) => `Test ${label}`}
                                        cursor={{ stroke: 'rgba(13, 204, 242, 0.5)', strokeWidth: 2 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="wpm" 
                                        stroke="#0dccf2" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorWpmDash)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                No data available yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Tests List */}
                <div className="bg-white dark:bg-[#182f34] rounded-2xl border border-slate-200 dark:border-[#315f68] shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-6 border-b border-slate-200 dark:border-[#315f68] flex justify-between items-center bg-slate-50 dark:bg-black/20">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                             <span className="material-symbols-outlined text-primary">list_alt</span>
                             Recent History
                        </h3>
                    </div>
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-[#101f22] sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">Date</th>
                                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">WPM</th>
                                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400">Acc</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {user.history.slice().reverse().map((test, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 text-slate-700 dark:text-slate-300">
                                            {test.date ? new Date(test.date).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="p-4">
                                            <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded">{test.wpm}</span>
                                        </td>
                                        <td className={`p-4 font-medium ${test.accuracy >= 95 ? 'text-green-500' : 'text-orange-500'}`}>
                                            {test.accuracy}%
                                        </td>
                                    </tr>
                                ))}
                                {user.history.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-slate-500">
                                            Start your first test to see history here!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};