import React, { useState, useEffect } from 'react';
import { AppView, TestStats, User } from './types';
import { LandingPage } from './components/LandingPage';
import { TypingTest } from './components/TypingTest';
import { ResultsPage } from './components/ResultsPage';
import { Button } from './components/Button';
import { AuthForms } from './components/AuthForms';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [lastResults, setLastResults] = useState<TestStats | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('typeMaster_currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
    } catch (e) {
        console.error("Failed to load user session", e);
        localStorage.removeItem('typeMaster_currentUser');
    }
  }, []);

  const handleStartTest = () => {
    setCurrentView(AppView.TEST);
  };

  const handleTestComplete = (stats: TestStats) => {
    setLastResults(stats);
    
    if (user) {
        const updatedUser = {
            ...user,
            history: [...user.history, stats]
        };
        setUser(updatedUser);
        localStorage.setItem('typeMaster_currentUser', JSON.stringify(updatedUser));
        
        try {
            const allUsersStr = localStorage.getItem('typeMaster_users');
            if (allUsersStr) {
                const allUsers: User[] = JSON.parse(allUsersStr);
                const index = allUsers.findIndex(u => u.email === updatedUser.email);
                if (index !== -1) {
                    allUsers[index] = updatedUser;
                    localStorage.setItem('typeMaster_users', JSON.stringify(allUsers));
                }
            }
        } catch(e) {
            console.error("Failed to update user database", e);
        }
    }

    setCurrentView(AppView.RESULTS);
  };

  const handleRetry = () => {
    setLastResults(null);
    setCurrentView(AppView.TEST);
  };

  const handleGoHome = () => {
    setLastResults(null);
    setCurrentView(AppView.LANDING);
  }

  const handleAuthSuccess = (loggedInUser: User) => {
      setUser(loggedInUser);
      localStorage.setItem('typeMaster_currentUser', JSON.stringify(loggedInUser));
      setCurrentView(AppView.DASHBOARD);
  }

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('typeMaster_currentUser');
      setCurrentView(AppView.LANDING);
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden transition-colors duration-300">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation Wrapper for centering content */}
        <div className="flex flex-1 justify-center px-4 sm:px-8 md:px-20 lg:px-40 py-5">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#224249] px-4 md:px-10 py-3 mb-4 rounded-xl bg-white/50 dark:bg-transparent backdrop-blur-sm sticky top-0 z-50">
              <div 
                className="flex items-center gap-4 text-gray-800 dark:text-white cursor-pointer"
                onClick={handleGoHome}
              >
                <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">TypeMaster</h2>
              </div>
              
              <div className="flex flex-1 justify-end gap-8">
                <div className="hidden md:flex items-center gap-9">
                  <button onClick={() => setCurrentView(AppView.TEST)} className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">Test</button>
                  {user && (
                    <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">Dashboard</button>
                  )}
                  <button className="text-gray-600 dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors">About</button>
                </div>
                <div className="flex gap-2">
                    {!user ? (
                        <>
                            {currentView !== AppView.SIGNUP && currentView !== AppView.LOGIN && (
                                <>
                                    <Button onClick={() => setCurrentView(AppView.SIGNUP)} className="!h-9 !px-4 !text-sm hidden sm:flex">Sign Up</Button>
                                    <Button onClick={() => setCurrentView(AppView.LOGIN)} variant="secondary" className="!h-9 !px-4 !text-sm">Login</Button>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-primary hidden sm:block">{user.username}</span>
                            <Button onClick={handleLogout} variant="secondary" className="!h-9 !px-4 !text-sm">Logout</Button>
                        </div>
                    )}
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 min-h-[600px] flex flex-col">
                {currentView === AppView.LANDING && <LandingPage onStart={handleStartTest} />}
                {currentView === AppView.TEST && <TypingTest onComplete={handleTestComplete} />}
                {currentView === AppView.RESULTS && lastResults && <ResultsPage stats={lastResults} onRetry={handleRetry} />}
                {currentView === AppView.LOGIN && <AuthForms view="LOGIN" onSuccess={handleAuthSuccess} onSwitch={() => setCurrentView(AppView.SIGNUP)} />}
                {currentView === AppView.SIGNUP && <AuthForms view="SIGNUP" onSuccess={handleAuthSuccess} onSwitch={() => setCurrentView(AppView.LOGIN)} />}
                {currentView === AppView.DASHBOARD && user && <Dashboard user={user} />}
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-solid border-slate-200 dark:border-[#224249] px-4 md:px-10 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-gray-800 dark:text-white">
                  <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">TypeMaster</h2>
                </div>
                <div className="flex items-center gap-6">
                  <a className="text-gray-600 dark:text-white/80 text-sm font-medium leading-normal hover:text-primary" href="#">Terms of Service</a>
                  <a className="text-gray-600 dark:text-white/80 text-sm font-medium leading-normal hover:text-primary" href="#">Privacy Policy</a>
                  <a className="text-gray-600 dark:text-white/80 text-sm font-medium leading-normal hover:text-primary" href="#">Contact</a>
                </div>
                <p className="text-gray-500 dark:text-white/50 text-sm">© 2024 TypeMaster. All rights reserved.</p>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}