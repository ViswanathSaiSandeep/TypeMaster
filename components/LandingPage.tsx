import React from 'react';
import { Button } from './Button';

interface LandingPageProps {
    onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="@container">
                <div className="flex flex-col gap-6 px-4 py-16 text-center @[480px]:gap-8 @[864px]:py-24">
                    <div className="flex flex-col items-center gap-6 @[480px]:gap-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl">
                                Unlock Your True Typing Speed
                            </h1>
                            <h2 className="text-gray-600 dark:text-white/80 text-base font-normal leading-normal @[480px]:text-lg max-w-2xl mx-auto">
                                Test your typing skills, track your progress, and compete with others around the world.
                            </h2>
                        </div>
                        <Button onClick={onStart} className="!h-12 !px-8 !text-base">Start Test Now</Button>
                    </div>
                    <div 
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl mt-8 shadow-2xl border border-white/10" 
                        style={{backgroundImage: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop")', backgroundPosition: 'center 30%'}}
                    ></div>
                </div>
            </div>

            {/* Feature Section */}
            <div className="flex flex-col gap-10 px-4 py-10 @container">
                <div className="flex flex-col gap-4 text-center items-center">
                    <h2 className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black max-w-[720px]">
                        How It Works
                    </h2>
                    <p className="text-gray-600 dark:text-white/80 text-base font-normal leading-normal max-w-[720px]">
                        A simple and straightforward process to get your results in seconds.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: 'play_circle', title: 'Start the Test', desc: 'Simply click the start button to begin a new typing challenge.' },
                        { icon: 'keyboard', title: 'Type the Words', desc: 'Accurately type the words that appear on the screen as fast as you can.' },
                        { icon: 'leaderboard', title: 'See Your Results', desc: 'Get instant feedback on your speed, accuracy, and words per minute.' }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-[#315f68] bg-white dark:bg-[#182f34] p-6 flex-col text-center items-center shadow-lg transition-transform hover:-translate-y-1">
                            <div className="text-primary text-4xl">
                                <span className="material-symbols-outlined" style={{ fontSize: '40px', lineHeight: 1 }}>{feature.icon}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-[#90c1cb] text-sm font-normal leading-normal">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Features Section */}
            <div className="py-10">
                <h2 className="text-gray-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em] px-4 pb-6 pt-5 text-center">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    {[
                         { title: 'Different Test Modes', desc: 'Choose from various text lengths and difficulty levels to suit your practice needs.', img: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1000&auto=format&fit=crop' },
                         { title: 'Detailed Analytics', desc: 'Track your progress over time with in-depth statistics and performance charts.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop' },
                         { title: 'Global Leaderboard', desc: 'See how you stack up against typists from around the world and climb the ranks.', img: 'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=1000&auto=format&fit=crop' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <div 
                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl border border-white/10" 
                                style={{backgroundImage: `url("${item.img}")`}}
                            ></div>
                            <div>
                                <p className="text-gray-900 dark:text-white text-lg font-medium leading-normal">{item.title}</p>
                                <p className="text-gray-600 dark:text-[#90c1cb] text-sm font-normal leading-normal">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};