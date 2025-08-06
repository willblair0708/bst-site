import { cn } from "@/lib/utils";
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft,
  FileCode,
  Users,
  Building,
  UploadCloud,
  Github
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 border-b border-border flex items-center justify-between">
        {children}
    </div>
)

const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
)

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("p-4", className)}>
        {children}
    </div>
)


export default function NewTrialPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold text-foreground">Create a New Trial Repository</h1>
            <p className="text-muted-foreground mt-2">
              A trial repository contains your protocol, data, simulations, and collaboration history, all version-controlled by Git.
            </p>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader><CardTitle>Trial Details</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="owner">Owner</Label>
                            <Input id="owner" defaultValue="bastion-research" className="mt-2" />
                        </div>
                        <div>
                            <Label htmlFor="trial-name">Trial Name</Label>
                            <Input id="trial-name" placeholder="e.g., CTP-ABC123" className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="A short description of your trial." className="mt-2" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Initialize with a Protocol</CardTitle></CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground mb-4">
                        You can create a blank trial and add a protocol later, or initialize from a template or an existing file.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button variant="outline" className="h-24 flex-col">
                            <FileCode className="w-6 h-6 mb-2" />
                            <span>Use a Template</span>
                        </Button>
                         <Button variant="outline" className="h-24 flex-col">
                            <UploadCloud className="w-6 h-6 mb-2" />
                            <span>Upload a File</span>
                        </Button>
                         <Button variant="outline" className="h-24 flex-col">
                            <Github className="w-6 h-6 mb-2" />
                            <span>Import from GitHub</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20">
                    Create Trial Repository
                </Button>
            </div>
        </div>

    </div>
  )
}
