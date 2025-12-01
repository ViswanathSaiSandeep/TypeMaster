import React from 'react';
import { TestStats } from '../types';
import { Button } from './Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsPageProps {
    stats: TestStats;
    onRetry: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ stats, onRetry }) => {
    
    // Prepare data for chart. If history is empty (super fast completion), just use start and end points.
    const chartData = stats.history.length > 0 
        ? stats.history 
        : [{ time: 0, wpm: 0 }, { time: stats.elapsedTime, wpm: stats.wpm }];

    return (
        <div className="flex flex-col gap-6 py-10 px-4 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Test Complete!</p>
                    <p className="text-black/60 dark:text-[#90c1cb] text-base font-normal leading-normal">Here's how you did. Practice makes perfect!</p>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Big WPM Card */}
                <div className="flex flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-[#315f68] flex-1 bg-white dark:bg-white/5 items-center justify-center text-center shadow-lg">
                    <p className="text-black/80 dark:text-white/80 text-lg font-medium leading-normal">Words Per Minute</p>
                    <p className="text-primary text-8xl font-black leading-tight tracking-[-0.03em] drop-shadow-[0_0_15px_rgba(13,204,242,0.5)]">
                        {stats.wpm}
                    </p>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-[#315f68] bg-white dark:bg-white/5 shadow-md">
                        <p className="text-black/80 dark:text-white/80 text-base font-medium leading-normal">Accuracy</p>
                        <p className="text-black dark:text-white tracking-light text-3xl font-bold leading-tight">{stats.accuracy}%</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-[#315f68] bg-white dark:bg-white/5 shadow-md">
                        <p className="text-black/80 dark:text-white/80 text-base font-medium leading-normal">Correct Words</p>
                        <p className="text-green-500 tracking-light text-3xl font-bold leading-tight">{Math.floor(stats.correctChars / 5)}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-[#315f68] bg-white dark:bg-white/5 shadow-md">
                        <p className="text-black/80 dark:text-white/80 text-base font-medium leading-normal">Mistakes</p>
                        <p className="text-red-500 tracking-light text-3xl font-bold leading-tight">{stats.incorrectChars}</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 border border-black/10 dark:border-[#315f68] bg-white dark:bg-white/5 shadow-md">
                        <p className="text-black/80 dark:text-white/80 text-base font-medium leading-normal">Time</p>
                        <p className="text-black dark:text-white tracking-light text-3xl font-bold leading-tight">{Math.round(stats.elapsedTime)}s</p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="flex flex-wrap gap-4 px-4 py-6">
                <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-black/10 dark:border-[#315f68] p-6 bg-white dark:bg-white/5 shadow-lg">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-black dark:text-white text-base font-medium leading-normal">Typing Speed Over Time</p>
                            <p className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight truncate">
                                Avg. {stats.wpm} WPM
                            </p>
                        </div>
                    </div>
                    
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0dccf2" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#0dccf2" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="time" 
                                    stroke="#64748b" 
                                    tick={{fontSize: 12}}
                                    tickFormatter={(val) => `${val}s`}
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    tick={{fontSize: 12}}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#101f22', borderColor: '#315f68', color: '#fff' }}
                                    itemStyle={{ color: '#0dccf2' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="wpm" 
                                    stroke="#0dccf2" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorWpm)" 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center mt-4">
                <div className="flex flex-1 flex-col sm:flex-row gap-3 px-4 py-3 max-w-[480px] justify-center">
                    <Button onClick={onRetry} fullWidth className="!h-12 !text-base shadow-lg hover:shadow-cyan-500/20">
                        Try Again
                    </Button>
                    <Button variant="secondary" fullWidth className="!h-12 !text-base">
                        Share Results
                    </Button>
                </div>
            </div>
        </div>
    );
};