"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Terminal, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaygroundProps {
  params: {
    id: string;
  };
}

export default function ModelPlayground({ params }: PlaygroundProps) {
  const modelId = decodeURIComponent(params.id);
  const [code, setCode] = useState(`# Example usage for ${modelId}\n\n# TODO: call the model API here\n`);

  return (
    <div className="min-h-screen bg-background py-10 px-5">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-semibold tracking-tight capitalize">
          {modelId.replace(/-/g, " ")} Playground
        </h1>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="code">
              <Terminal className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Run Sample Code</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-[300px] bg-muted p-4 rounded-md font-mono text-sm outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button className="mt-4">Run</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Runtime Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon…</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
