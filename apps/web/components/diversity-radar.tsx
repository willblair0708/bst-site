"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DiversityMetric {
  name: string;
  value: number; // Percentage
}

interface DiversityRadarProps {
  title: string;
  metrics: DiversityMetric[];
}

const DiversityRadar: React.FC<DiversityRadarProps> = ({ title, metrics }) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const hasGoldLevel = metrics.some(metric => metric.value >= 90);

  useEffect(() => {
    if (hasGoldLevel) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasGoldLevel]);

  return (
    <Card className={showCelebration ? 'animate-celebration' : ''}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {metrics.map(metric => (
            <div key={metric.name} className="flex items-center">
              <span className="w-32 text-sm">{metric.name}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    metric.value >= 90 ? 'bg-bastion-equity-gold animate-badge-flip' : 'bg-bastion-trust-teal'
                  }`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              <span className="ml-2 text-sm font-semibold">{metric.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiversityRadar;