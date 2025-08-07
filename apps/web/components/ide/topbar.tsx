"use client"

import React from "react"
import { CommandMenu } from "@/components/command-menu"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Rocket, ShieldCheck, Handshake, Hash } from "lucide-react"
import { VerifyButton } from "@/components/ui/verify-button"
import { HashChip } from "@/components/ui/hash-chip"

export function Topbar() {
  return (
    <div className="h-12 border-b border-border flex items-center gap-3 px-3 bg-background/70 backdrop-blur-xl">
      {/* Pillar declaration */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-primary-100 border border-border shadow-elevation-1">
        <span className="text-lg">🛠️</span>
        <span className="text-sm font-medium">Composable Models</span>
      </div>

      <div className="flex-1 max-w-[640px]">
        <CommandMenu />
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <VerifyButton className="rounded-xl" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Execute the protocol and emit a signed Research Bundle
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <HashChip hash="discovery@a1b2c3" className="rounded-xl" />
      </div>
    </div>
  )
}


