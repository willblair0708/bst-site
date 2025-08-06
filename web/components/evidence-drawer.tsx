"use client"

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface Artifact {
  name: string;
  url: string;
  size: string;
}

interface CIJob {
  name: string;
  status: 'success' | 'failure' | 'running';
  log: string;
  artifacts: Artifact[];
}

interface EvidenceDrawerProps {
  jobs: CIJob[];
  trigger: React.ReactNode;
}

const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ jobs, trigger }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Evidence Drawer</SheetTitle>
          <SheetDescription>
            CI job logs and artifacts for this pull request.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {jobs.map((job) => (
            <div key={job.name} className="border rounded-lg">
              <div className="p-4 border-b">
                <h4 className="font-semibold">{job.name}</h4>
                <p className={`text-sm ${
                  job.status === 'success' ? 'text-green-500' : 
                  job.status === 'failure' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  Status: {job.status}
                </p>
              </div>
              <div className="p-4 bg-gray-900 text-white rounded-b-lg">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {job.log}
                </pre>
              </div>
              {job.artifacts.length > 0 && (
                <div className="p-4 border-t">
                  <h5 className="font-semibold mb-2">Artifacts</h5>
                  <ul className="space-y-2">
                    {job.artifacts.map((artifact) => (
                      <li key={artifact.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{artifact.name}</p>
                          <p className="text-sm text-gray-500">{artifact.size}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={artifact.url} download>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EvidenceDrawer;