"use client"

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Shield, Award, TestTube2 } from 'lucide-react';

interface StatusRibbonProps {
  power: number;
  diversity: 'Gold' | 'Silver' | 'Bronze' | 'None';
  part11Status: 'Signed' | 'Unsigned';
  twinAUC: number;
}

const getDiversityIcon = (diversity: string) => {
  if (diversity === 'Gold') {
    return <Award className="w-4 h-4 text-equity-gold" />;
  }
  return null;
};

import EvidenceDrawer from './evidence-drawer';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Sparkline from './ui/sparkline';

const mockHistory = {
  power: [0.75, 0.78, 0.81, 0.80, 0.83],
  twinAUC: [0.72, 0.74, 0.76, 0.75, 0.78],
};

export function StatusRibbon({ power, diversity, part11Status, twinAUC }: StatusRibbonProps) {
  const mockJobs = [
    {
      name: 'Protocol Validation',
      status: 'success',
      log: 'All validation checks passed.',
      artifacts: [
        { name: 'validation_report.pdf', url: '#', size: '1.2 MB' },
      ],
    },
    {
      name: 'Synthetic Twin Simulation',
      status: 'running',
      log: 'Simulation in progress... 25% complete.',
      artifacts: [],
    },
  ];

  return (
    <TooltipProvider>
      <div className="bg-background border-b p-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={power >= 0.8 ? 'success' : 'destructive'} className="flex items-center gap-1.5 pl-2 cursor-pointer">
                {power >= 0.8 ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="font-semibold">Power:</span>
                <span>{power.toFixed(2)}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold mb-1">Power History</p>
              <Sparkline data={mockHistory.power} />
            </TooltipContent>
          </Tooltip>

          <Badge variant={diversity === 'Gold' ? 'gold' : 'secondary'} className="flex items-center gap-1.5 pl-2">
            {getDiversityIcon(diversity)}
            <span className="font-semibold">Diversity:</span>
            <span>{diversity}</span>
          </Badge>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={twinAUC > 0.75 ? 'success' : 'warning'} className="flex items-center gap-1.5 pl-2 cursor-pointer">
                <TestTube2 className="w-4 h-4" />
                <span className="font-semibold">Twin-AUC:</span>
                <span>{twinAUC.toFixed(2)}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold mb-1">Twin-AUC History</p>
              <Sparkline data={mockHistory.twinAUC} />
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={part11Status === 'Signed' ? 'success' : 'destructive'} className="flex items-center gap-1.5 pl-2">
            <Shield className="w-4 h-4" />
            <span className="font-semibold">Part 11:</span>
            <span>{part11Status}</span>
          </Badge>
          <EvidenceDrawer jobs={mockJobs} trigger={<button className="text-sm underline">Show Evidence</button>} />
        </div>
      </div>
    </TooltipProvider>
  );
}