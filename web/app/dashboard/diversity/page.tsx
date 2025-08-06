"use client"

import React from 'react';
import DiversityRadar from '@/components/diversity-radar';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const DiversityHeatMapPage = () => {
  const breastCancerMetrics = [
    { name: 'African-American', value: 93 },
    { name: 'Asian', value: 48 },
    { name: 'Hispanic', value: 78 },
    { name: 'Elderly', value: 31 },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diversity Heat-Map</h1>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share on X (Advocate Mode)
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DiversityRadar title="Breast Cancer" metrics={breastCancerMetrics} />
        {/* Add more radars for other diseases */}
      </div>
    </div>
  );
};

export default DiversityHeatMapPage;