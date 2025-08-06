'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, Share } from 'lucide-react';

interface ModelActionsProps {
  likes: number;
}

export function ModelActions({ likes }: ModelActionsProps) {
  const [isLiked, setIsLiked] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsLiked(!isLiked)}
      >
        <Star className={`h-4 w-4 ${isLiked ? 'text-yellow-500 fill-current' : ''}`} />
        {formatNumber(likes + (isLiked ? 1 : 0))}
      </Button>
      <Button variant="outline" size="sm">
        <Share className="h-4 w-4" />
      </Button>
    </div>
  );
}
