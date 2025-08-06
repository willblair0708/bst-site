"use client"

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommandMenu } from '@/components/command-menu';
import { 
    ChevronRight,
    Plus, 
    Settings, 
    User, 
    LogOut, 
    Star, 
    Bell,
    Shield
} from 'lucide-react';

export function GlobalHeader() {
    return (
        <header className="bg-card text-foreground border-b border-border px-4 h-[60px] flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-card/80">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 text-inherit no-underline">
                    <Shield className="text-primary" size={24} />
                    <span className="text-lg font-semibold">Bastion</span>
                </Link>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/workspace" className="hover:text-foreground">Workspace</Link>
                    <ChevronRight size={16} />
                    <Link href="/workspace/protocols" className="hover:text-foreground">Protocols</Link>
                    <ChevronRight size={16} />
                    <span className="text-foreground">CTP-ABC123</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <CommandMenu />
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Plus size={20} />
                            </Button>
                        </DropdownMenuTrigger>
                         <DropdownMenuContent>
                            <DropdownMenuItem>New Protocol</DropdownMenuItem>
                            <DropdownMenuItem>New Simulation</DropdownMenuItem>
                            <DropdownMenuItem>New Dataset</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Bell size={18} />
                    </Button>

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Avatar className="h-8 w-8 cursor-pointer">
                                <AvatarImage src="https://source.boringavatars.com/beam/40/sarah-johnson" alt="User avatar" />
                                <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuItem><User size={16} className="mr-2" />Profile</DropdownMenuItem>
                            <DropdownMenuItem><Star size={16} className="mr-2" />Starred</DropdownMenuItem>
                            <DropdownMenuItem><Settings size={16} className="mr-2" />Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOut size={16} className="mr-2" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
