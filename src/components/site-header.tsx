import { School } from 'lucide-react';
import React from 'react';
import { cn } from 'utils/cn';
import { PAGES, linkTo } from 'utils/page';
import { ThemeToggle } from './theme-toggle';

export const SiteHeader = () => (
    <header className="bg-background/60 dark:bg-dark/60 sticky top-0 z-40 w-full border-b dark:border-white/10 shadow-sm backdrop-blur">
        <div className="container flex h-14 items-center">
            <div className="h-14 mr-4 flex">
                <a className="mr-6 flex items-center space-x-2" href={linkTo(document.location, "home")}>
                    <School />
                    <span className="hidden font-bold sm:inline-block">BedsteLectio</span>
                </a>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    {Object.entries(PAGES).map(([key, page]) => (
                        <a key={key} className={cn("transition-colors hover:text-foreground/80", decodeURI(document.location.pathname) === page.link ? "text-foreground" : "text-foreground/60")} href={page.link}>
                            {page.name}
                        </a>
                    ))}
                </nav>
            </div>
            <div className="flex flex-1 justify-end">
                <ThemeToggle />
            </div>
        </div>
    </header>
);