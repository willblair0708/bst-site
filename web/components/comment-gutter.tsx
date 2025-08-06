"use client"

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: string;
  author: string;
  avatarUrl?: string;
  timestamp: string;
  content: string;
  tag: 'IRB' | 'Stats' | 'Patient' | 'Regulatory';
}

interface CommentGutterProps {
  comments: Comment[];
}

const tagColors = {
  IRB: 'bg-blue-500',
  Stats: 'bg-green-500',
  Patient: 'bg-purple-500',
  Regulatory: 'bg-red-500',
};

const CommentGutter: React.FC<CommentGutterProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="p-4 text-sm text-center text-gray-500">
        <MessageSquare className="w-6 h-6 mx-auto mb-2" />
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3">
          <div className={`w-1.5 h-full rounded-full ${tagColors[comment.tag]}`} />
          <Avatar>
            <AvatarImage src={comment.avatarUrl} alt={comment.author} />
            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-gray-500">{formatRelativeTime(comment.timestamp)}</span>
              <Badge variant="secondary">{comment.tag}</Badge>
            </div>
            <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentGutter;