export interface TestStats {
    wpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    elapsedTime: number; // in seconds
    history: { time: number; wpm: number }[]; // For the chart
    date?: string;
}

export interface User {
    username: string;
    email: string;
    history: TestStats[];
}

export enum AppView {
    LANDING = 'LANDING',
    TEST = 'TEST',
    RESULTS = 'RESULTS',
    LOGIN = 'LOGIN',
    SIGNUP = 'SIGNUP',
    DASHBOARD = 'DASHBOARD'
}

export const SAMPLE_TEXTS = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all of the letters of the alphabet. As you type, the words will be highlighted, and any mistakes you make will be shown in a different color. Your goal is to type as quickly and accurately as possible before the timer runs out.",
    "Technology is best when it brings people together. It is the art of arranging life to get the greatest amount of fun out of it. The great myth of our times is that technology is communication. We must not allow the clock and the calendar to blind us to the fact that each moment of life is a miracle and mystery.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. It is better to fail in originality than to succeed in imitation. The road to success and the road to failure are almost exactly the same. Success usually comes to those who are too busy to be looking for it.",
    "In the middle of difficulty lies opportunity. Life is not about finding yourself. Life is about creating yourself. You miss 100% of the shots you don't take. Do not go where the path may lead, go instead where there is no path and leave a trail."
];