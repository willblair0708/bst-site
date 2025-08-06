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
        <header className="bg-background/80 text-foreground border-b border-border px-4 h-[56px] flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 text-inherit no-underline font-bold text-lg">
                    <span>Runix</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/dashboard" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                    <Link href="/explore" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                        <GitBranch className="w-4 h-4 mr-2" />
                        Explore
                    </Link>
                    <Link href="/community" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                        <Users className="w-4 h-4 mr-2" />
                        Community
                    </Link>
                </nav>
            </div>

            <div className="flex items-center gap-2">
                <CommandMenu />
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Bell size={18} />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Plus size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem>New Project</DropdownMenuItem>
                        <DropdownMenuItem>New Model</DropdownMenuItem>
                        <DropdownMenuItem>Import Repository</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarImage src="https://source.boringavatars.com/beam/40/williamblair" alt="User avatar" />
                            <AvatarFallback>WB</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem><User size={16} className="mr-2" />Profile</DropdownMenuItem>
                        <DropdownMenuItem><Settings size={16} className="mr-2" />Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut size={16} className="mr-2" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
