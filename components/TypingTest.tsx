import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_TEXTS, TestStats } from '../types';
import { Button } from './Button';

interface TypingTestProps {
    onComplete: (stats: TestStats) => void;
}

const TEST_DURATION = 60; // seconds

export const TypingTest: React.FC<TypingTestProps> = ({ onComplete }) => {
    const [targetText, setTargetText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
    const [isActive, setIsActive] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [history, setHistory] = useState<{ time: number; wpm: number }[]>([]);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const userInputRef = useRef<string>('');

    // Initialize test
    const startTest = useCallback(() => {
        const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
        setTargetText(randomText);
        setUserInput('');
        userInputRef.current = '';
        setStartTime(null);
        startTimeRef.current = null;
        setTimeLeft(TEST_DURATION);
        setIsActive(false);
        setWpm(0);
        setAccuracy(0);
        setHistory([]);
        
        // Focus input after a small delay
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    useEffect(() => {
        startTest();
        return () => stopTimer();
    }, [startTest]);

    const stopTimer = () => {
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const calculateStats = (input: string, startTime: number | null, currentTime: number) => {
        if (!startTime || input.length === 0) {
            return { wpm: 0, accuracy: 0, correctChars: 0, incorrectChars: 0 };
        }

        let durationSeconds = (currentTime - startTime) / 1000;
        // Enforce a minimum sensible duration to prevent division by near-zero (causing infinite WPM)
        if (durationSeconds < 2) durationSeconds = 2; 

        const minutes = durationSeconds / 60;
        let correctChars = 0;
        let incorrectChars = 0;

        for (let i = 0; i < input.length; i++) {
            if (i < targetText.length) {
                if (input[i] === targetText[i]) {
                    correctChars++;
                } else {
                    incorrectChars++;
                }
            } else {
                incorrectChars++;
            }
        }

        // Net WPM: ((TotalChars - UncorrectedErrors) / 5) / TimeInMinutes
        const netWords = Math.max(0, (input.length - incorrectChars) / 5);
        const currentWpm = Math.round(netWords / minutes);

        // Accuracy is based on total characters typed
        const currentAccuracy = input.length > 0 
            ? Math.round((correctChars / input.length) * 100) 
            : 0;

        return { wpm: currentWpm, accuracy: currentAccuracy, correctChars, incorrectChars };
    };

    const finishTest = useCallback(() => {
        stopTimer();
        setIsActive(false);
        
        const finalInput = userInputRef.current;
        const now = Date.now();
        // Fallback to now minus duration if start time is missing (edge case safety)
        const start = startTimeRef.current || (now - (TEST_DURATION * 1000)); 
        
        const stats = calculateStats(finalInput, start, now);
        
        let elapsedTime = (now - start) / 1000;
        if (elapsedTime < 1) elapsedTime = 1;

        onComplete({
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            correctChars: stats.correctChars,
            incorrectChars: stats.incorrectChars,
            totalChars: finalInput.length,
            elapsedTime: elapsedTime,
            history: [...history, { time: TEST_DURATION - timeLeft, wpm: stats.wpm }],
            date: new Date().toISOString()
        });
    }, [targetText, history, onComplete, timeLeft]);

    // Timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => stopTimer();
    }, [isActive]);

    useEffect(() => {
        if (isActive && timeLeft === 0) {
            finishTest();
        }
    }, [timeLeft, isActive, finishTest]);

    // Live Stats
    useEffect(() => {
        if (!isActive || !startTime) return;

        const interval = setInterval(() => {
             const now = Date.now();
             const stats = calculateStats(userInputRef.current, startTimeRef.current, now);
             
             setWpm(stats.wpm);
             setAccuracy(stats.accuracy);

             setHistory(prev => {
                const timePoint = Math.round((now - startTimeRef.current!) / 1000);
                if (prev.length > 0 && prev[prev.length - 1].time === timePoint) return prev;
                return [...prev, { time: timePoint, wpm: stats.wpm }];
             });
        }, 500);

        return () => clearInterval(interval);
    }, [isActive, startTime]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        if (!isActive && value.length === 1 && !startTime) {
            setIsActive(true);
            const now = Date.now();
            setStartTime(now);
            startTimeRef.current = now;
        }

        setUserInput(value);
        userInputRef.current = value;

        if (value.length >= targetText.length) {
            finishTest();
        }
    };

    const handleRestart = () => {
        stopTimer();
        startTest();
    };

    const preventPasteOrDrop = (e: React.SyntheticEvent) => {
        e.preventDefault();
    };

    const renderText = () => {
        return targetText.split('').map((char, index) => {
            let colorClass = "text-slate-500 dark:text-slate-500 opacity-50";
            let decoration = "";
            let bgClass = "";

            if (index < userInput.length) {
                if (userInput[index] === char) {
                    colorClass = "text-slate-900 dark:text-slate-100 opacity-100";
                } else {
                    colorClass = "text-red-500 dark:text-red-400 opacity-100";
                    decoration = "underline decoration-red-500";
                }
            } else if (index === userInput.length) {
                 bgClass = "bg-primary/20 rounded-sm";
                 colorClass = "text-primary dark:text-primary opacity-100 underline decoration-primary";
            }

            return (
                <span key={index} className={`${colorClass} ${decoration} ${bgClass} transition-colors duration-75`}>
                    {char}
                </span>
            );
        });
    };

    const progressPercentage = Math.min(100, (userInput.length / targetText.length) * 100);

    return (
        <div className="flex flex-col gap-6 py-6 px-4 sm:px-6 w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
            {/* Timer and Progress Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className="flex flex-col w-full gap-2">
                    <div className="flex justify-between items-end">
                         <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Progress</span>
                         <span className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                            {timeLeft}s
                         </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 rounded-lg p-4 border bg-background-light dark:bg-background-dark border-black/10 dark:border-white/10 shadow-sm flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Net WPM</p>
                    <p className="text-slate-900 dark:text-white text-2xl font-bold">{wpm}</p>
                </div>
                <div className="flex-1 rounded-lg p-4 border bg-background-light dark:bg-background-dark border-black/10 dark:border-white/10 shadow-sm flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Accuracy</p>
                    <p className="text-slate-900 dark:text-white text-2xl font-bold">{accuracy}%</p>
                </div>
                <Button 
                    variant="secondary" 
                    onClick={handleRestart}
                    className="!h-auto !w-16 !min-w-0 rounded-lg aspect-square flex-shrink-0"
                    title="Restart Test"
                >
                    <span className="material-symbols-outlined text-2xl">refresh</span>
                </Button>
            </div>

            {/* Typing Area with Hidden Input */}
            <div 
                className="bg-white dark:bg-[#182f34] rounded-xl p-8 text-2xl leading-relaxed tracking-wide font-mono shadow-md border border-slate-200 dark:border-[#315f68] relative min-h-[300px] cursor-text flex flex-wrap content-start"
                onClick={() => inputRef.current?.focus()}
            >
                <input
                    ref={inputRef}
                    value={userInput}
                    onChange={handleInputChange}
                    onPaste={preventPasteOrDrop}
                    onDrop={preventPasteOrDrop}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    className="absolute inset-0 opacity-0 z-0 h-full w-full cursor-default"
                    disabled={timeLeft === 0 && isActive}
                />
                
                <div className="relative z-10 pointer-events-none break-words whitespace-pre-wrap w-full select-none">
                    {renderText()}
                </div>
                
                {!isActive && userInput.length === 0 && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-400 dark:text-slate-500 text-lg opacity-50 animate-pulse">Click or Start Typing...</span>
                    </div>
                )}
            </div>
        </div>
    );
};