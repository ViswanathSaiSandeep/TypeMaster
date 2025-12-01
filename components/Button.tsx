import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'icon';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    fullWidth = false, 
    className = '',
    ...props 
}) => {
    const baseStyles = "cursor-pointer items-center justify-center overflow-hidden rounded-lg font-bold leading-normal tracking-[0.015em] transition-all active:scale-95";
    
    const variants = {
        primary: "bg-primary text-background-dark hover:brightness-110",
        secondary: "bg-slate-200 dark:bg-[#224249] text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-[#315f68]",
        outline: "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
        icon: "p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full"
    };

    const sizes = variant === 'icon' ? '' : 'h-10 px-4 min-w-[84px]';
    const width = fullWidth ? 'w-full flex' : 'inline-flex';

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`}
            {...props}
        >
            <span className="truncate flex items-center gap-2">{children}</span>
        </button>
    );
};