"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GitPullRequest,
  GitMerge,
  GitCommit,
  FileDiff,
  ShieldCheck,
  Circle,
  MessageSquare,
  ChevronDown,
  Paperclip
} from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import ProtocolDiff from '@/components/protocol-diff';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const pullRequest = {
  id: 12,
  title: "Feat: Add adaptive randomization arm for biomarker-positive cohort",
  status: "Open",
  author: "Dr. Valenti",
  branch: { from: "feat/adaptive-randomization", to: "main" },
  createdAt: "2024-08-15T10:00:00Z",
  checks: [
    { name: "Protocol Linting", status: "Success", duration: "1m 12s" },
    { name: "Compliance Rules (21 CFR Part 11)", status: "Success", duration: "2m 24s" },
    { name: "AEGIS Simulation (Power)", status: "Success", duration: "12m 45s" },
  ],
  reviewers: [
    { name: "Dr. Chen", avatar: "https://i.pravatar.cc/40?u=chen", status: "Approved" },
    { name: "regulators:fda", avatar: "https://i.pravatar.cc/40?u=fda", status: "Changes Requested" },
    { name: "IRB", avatar: "https://i.pravatar.cc/40?u=irb", status: "Pending" },
  ],
  fileChanges: [
    {
      filename: "protocol.yaml",
      additions: 58,
      deletions: 12,
      patch: `@@ -45,7 +45,14 @@ arms:
   - name: standard_of_care
     description: "Standard chemotherapy regimen."
-    size: 150
+    size: 75
+  - name: experimental_adaptive
+    description: "Experimental drug with adaptive randomization for biomarker-positive patients."
+    size: 75
+    randomization_rules:
+      - if: "patient.biomarker == 'positive'"
+        stratum: "biomarker_positive"
+        allocation: "adaptive"
 
 eligibility:
   - criteria: "Age >= 18"`
    }
  ],
  timeline: [
    { type: "COMMIT", author: "Dr. Valenti", message: "Initial commit for adaptive randomization", time: "2024-08-15T10:05:00Z" },
    { type: "REVIEW", author: "Dr. Chen", status: "Approved", message: "Looks good, great power analysis.", time: "2024-08-15T14:30:00Z" },
    { type: "COMMENT", author: "regulators:fda", message: "Please provide a reference for the adaptive algorithm.", time: "2024-08-15T15:00:00Z" },
  ]
}

const StatusBadge = ({ status }: { status: string }) => {
    const statusMap = {
        Open: { icon: GitPullRequest, color: "text-green-400", text: "Open" },
        Merged: { icon: GitMerge, color: "text-purple-400", text: "Merged" },
    }
    const { icon: Icon, color, text } = statusMap[status as keyof typeof statusMap] || statusMap.Open;
    return <Badge variant="outline" className={`border-0 bg-secondary ${color}`}><Icon className={`w-4 h-4 mr-2 ${color}`} />{text}</Badge>
}

export default function PullRequestDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
            <p className="text-sm text-muted-foreground">Pull Request #{pullRequest.id}</p>
            <h1 className="text-3xl font-semibold text-foreground mt-1">{pullRequest.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
                <StatusBadge status={pullRequest.status} />
                <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{pullRequest.author}</span> wants to merge changes from <code className="bg-secondary px-1 py-0.5 rounded">{pullRequest.branch.from}</code> into <code className="bg-secondary px-1 py-0.5 rounded">{pullRequest.branch.to}</code>
                </p>
            </div>
        </div>

      <Tabs defaultValue="conversation">
        <TabsList>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="commits">Commits ({pullRequest.timeline.filter(i=>i.type==="COMMIT").length})</TabsTrigger>
            <TabsTrigger value="checks">Checks ({pullRequest.checks.length})</TabsTrigger>
            <TabsTrigger value="files">Files Changed ({pullRequest.fileChanges.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="conversation" className="mt-6">
            {/* Conversation Timeline would go here */}
            <div className="text-center text-muted-foreground py-12">Conversation timeline coming soon.</div>
        </TabsContent>
        <TabsContent value="files" className="mt-6">
            <div className="border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                    <h3 className="font-semibold">{pullRequest.fileChanges[0].filename}</h3>
                </div>
                <ProtocolDiff patch={pullRequest.fileChanges[0].patch} oldProtocol="" newProtocol="" />
            </div>
        </TabsContent>
        {/* Other Tabs content would go here */}
      </Tabs>
    </div>
  )
}
