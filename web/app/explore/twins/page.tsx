"use client"

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ChevronsUpDown } from 'lucide-react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const twinVersions = [
  { id: 'v1.2', name: 'Version 1.2 (Latest)' },
  { id: 'v1.1', name: 'Version 1.1' },
  { id: 'v1.0', name: 'Version 1.0' },
];

const variables = [
  'Age', 'BMI', 'Baseline-Tumor-Size', 'Genetic-Marker-A', 'Genetic-Marker-B'
];

const DigitalTwinExplorerPage = () => {
  const [selectedVersion, setSelectedVersion] = useState(twinVersions[0].id);
  const [xAxis, setXAxis] = useState('Age');
  const [yAxis, setYAxis] = useState('Baseline-Tumor-Size');
  const [zAxis, setZAxis] = useState('BMI');

  const plotData = [
    {
      x: Array.from({ length: 50 }, () => Math.random() * 50 + 20),
      y: Array.from({ length: 50 }, () => Math.random() * 100 + 10),
      z: Array.from({ length: 50 }, () => Math.random() * 15 + 18),
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        size: 5,
        color: '#19A7CE',
        opacity: 0.8
      },
      name: 'Real-world'
    },
    {
      x: Array.from({ length: 50 }, () => Math.random() * 50 + 25),
      y: Array.from({ length: 50 }, () => Math.random() * 100 + 5),
      z: Array.from({ length: 50 }, () => Math.random() * 15 + 20),
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        size: 5,
        color: '#F3C94C',
        opacity: 0.8
      },
      name: 'Synthetic'
    }
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Rail */}
      <div className="w-64 border-r bg-white p-4 space-y-6">
        <h2 className="text-lg font-semibold">Twin Explorer</h2>
        
        <div>
          <label className="text-sm font-medium">Twin Version</label>
          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger>
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {twinVersions.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Plot Variables</h3>
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium">X-Axis</label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variables.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Y-Axis</label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variables.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Z-Axis</label>
              <Select value={zAxis} onValueChange={setZAxis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variables.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Button className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download Cohort Notebook
        </Button>
      </div>

      {/* Main Plot */}
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardContent className="h-full">
            <Plot
              data={plotData as any}
              layout={{
                width: undefined,
                height: undefined,
                autosize: true,
                title: 'Digital Twin vs. Real-World Cohort',
                scene: {
                  xaxis: { title: xAxis },
                  yaxis: { title: yAxis },
                  zaxis: { title: zAxis },
                }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Rail */}
      <div className="w-72 border-l bg-white p-4 space-y-4">
        <h3 className="text-lg font-semibold">Slice Insights</h3>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Synthetic cohort is slightly younger on average (35.2 vs 38.1 years).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">BMI Outliers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">3 outliers detected in the real-world cohort with BMI > 35.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalTwinExplorerPage;