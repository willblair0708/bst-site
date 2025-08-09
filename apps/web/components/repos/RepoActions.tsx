"use client"
import { Button } from '@/components/ui/button'
import { Star, GitFork, Eye, Download, Code, Play, Settings } from 'lucide-react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

interface Props {
  slug: string
  stars: number
  forks: number
  watchers: number
}

export function RepoActions({ slug, stars, forks, watchers }: Props) {
  const handleStar = () => {
    trackEvent('repo_card_clicked', { slug, action: 'star' })
  }

  const handleFork = () => {
    trackEvent('repo_card_clicked', { slug, action: 'fork' })
  }

  const handleWatch = () => {
    trackEvent('repo_card_clicked', { slug, action: 'watch' })
  }

  const handleClone = () => {
    trackEvent('repo_card_clicked', { slug, action: 'clone' })
    // Copy clone URL to clipboard
    navigator.clipboard.writeText(`https://github.com/${slug}.git`)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleWatch}
        className="font-medium"
      >
        <Eye className="w-4 h-4 mr-1" />
        Watch
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
          {watchers}
        </span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleStar}
        className="font-medium"
      >
        <Star className="w-4 h-4 mr-1" />
        Star
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
          {stars}
        </span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleFork}
        className="font-medium"
      >
        <GitFork className="w-4 h-4 mr-1" />
        Fork
        <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
          {forks}
        </span>
      </Button>

      <div className="flex border border-border rounded-md overflow-hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClone}
          className="rounded-none border-r font-medium"
        >
          <Download className="w-4 h-4 mr-1" />
          Code
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-none px-2"
        >
          <span className="w-2 h-2 border-l border-b transform rotate-45"></span>
        </Button>
      </div>

      <Link href={`/ide?repo=${encodeURIComponent(slug)}`}>
        <Button size="sm" className="font-medium">
          <Code className="w-4 h-4 mr-1" />
          Open in IDE
        </Button>
      </Link>
      
      <Button size="sm" variant="secondary" className="font-medium">
        <Play className="w-4 h-4 mr-1" />
        Reproduce
      </Button>
    </div>
  )
}
