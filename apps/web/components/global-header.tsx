"use client"

import React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommandMenu } from '@/components/command-menu';
import { 
    Plus, 
    Settings, 
    User, 
    LogOut, 
    Bell,
    Users,
    GitBranch,
    LayoutDashboard
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function GlobalHeader() {
    return (
        <header className="bg-background/90 text-foreground border-b border-border/50 px-6 h-[64px] flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 text-inherit no-underline font-bold text-xl">
                    <span>Runix</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-2xl">
                    <Link href="/dashboard" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'rounded-xl' })}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                    <Link href="/explore" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'rounded-xl' })}>
                        <GitBranch className="w-4 h-4 mr-2" />
                        Explore
                    </Link>
                    <Link href="/community" className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'rounded-xl' })}>
                        <Users className="w-4 h-4 mr-2" />
                        Community
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-3">
                <CommandMenu />
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
                    <Bell size={18} />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-xl">
                            <Plus size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="rounded-2xl border-border/50 shadow-elevation-2">
                        <DropdownMenuItem className="rounded-xl">New Project</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl">New Model</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl">Import Repository</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Avatar className="h-9 w-9 cursor-pointer border-2 border-border/30 shadow-sm hover:shadow-md transition-all duration-200">
                            <AvatarImage src="https://source.boringavatars.com/beam/40/williamblair" alt="User avatar" />
                            <AvatarFallback className="bg-primary-100 text-primary-500 font-semibold">WB</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/50 shadow-elevation-2">
                        <DropdownMenuItem className="rounded-xl"><User size={16} className="mr-2" />Profile</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl"><Settings size={16} className="mr-2" />Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-xl">
                            <LogOut size={16} className="mr-2" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
