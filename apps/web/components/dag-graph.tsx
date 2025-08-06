"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Play, 
  Hash,
  GitCommit,
  Database,
  Zap,
  Upload
} from 'lucide-react'

interface DAGNode {
  id: string
  name: string
  type: 'data' | 'transform' | 'model' | 'output'
  status: 'pending' | 'running' | 'success' | 'failed' | 'idle'
  dependencies: string[]
  position: { x: number; y: number }
  hash?: string
  runtime?: string
}

interface DAGGraphProps {
  nodes: DAGNode[]
  onNodeClick?: (node: DAGNode) => void
  onRunPipeline?: () => void
  className?: string
}

const mockNodes: DAGNode[] = [
  {
    id: 'data-1',
    name: 'Patient Data',
    type: 'data',
    status: 'success',
    dependencies: [],
    position: { x: 100, y: 200 },
    hash: 'a1b2c3d4',
    runtime: '2.3s'
  },
  {
    id: 'transform-1', 
    name: 'Data Cleaning',
    type: 'transform',
    status: 'success',
    dependencies: ['data-1'],
    position: { x: 300, y: 150 },
    hash: 'e5f6g7h8',
    runtime: '45.2s'
  },
  {
    id: 'transform-2',
    name: 'Feature Engineering', 
    type: 'transform',
    status: 'running',
    dependencies: ['data-1'],
    position: { x: 300, y: 250 },
    hash: 'i9j0k1l2',
    runtime: '12.8s'
  },
  {
    id: 'model-1',
    name: 'ML Training',
    type: 'model', 
    status: 'pending',
    dependencies: ['transform-1', 'transform-2'],
    position: { x: 500, y: 200 },
    hash: 'm3n4o5p6'
  },
  {
    id: 'output-1',
    name: 'Results Export',
    type: 'output',
    status: 'idle',
    dependencies: ['model-1'],
    position: { x: 700, y: 200 },
    hash: 'q7r8s9t0'
  }
]

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'data': return Database
    case 'transform': return GitCommit
    case 'model': return Zap
    case 'output': return Upload
    default: return Hash
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return CheckCircle2
    case 'failed': return AlertCircle
    case 'running': return Play
    case 'pending': return Clock
    default: return Clock
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-accent border-accent'
    case 'failed': return 'text-destructive border-destructive'
    case 'running': return 'text-primary border-primary animate-pulse'
    case 'pending': return 'text-muted-foreground border-muted-foreground'
    default: return 'text-muted-foreground border-muted-foreground'
  }
}

export function DAGGraph({ nodes = mockNodes, onNodeClick, onRunPipeline, className = "" }: DAGGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isIdle, setIsIdle] = useState(false)
  const [runningNodes, setRunningNodes] = useState<Set<string>>(new Set())

  // Simulate idle state for orbit animation
  useEffect(() => {
    const timer = setTimeout(() => setIsIdle(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Simulate pipeline execution
  const handleRunPipeline = () => {
    if (onRunPipeline) onRunPipeline()
    
    // Reset all nodes to pending
    const pendingNodes = nodes.filter(n => n.status !== 'success')
    
    // Animate through pipeline execution
    pendingNodes.forEach((node, index) => {
      setTimeout(() => {
        setRunningNodes(prev => new Set([...prev, node.id]))
        
        // Complete after a delay
        setTimeout(() => {
          setRunningNodes(prev => {
            const newSet = new Set(prev)
            newSet.delete(node.id)
            return newSet
          })
        }, 2000 + Math.random() * 3000)
      }, index * 1000)
    })
  }

  const renderConnections = () => {
    return nodes.map(node => 
      node.dependencies.map(depId => {
        const depNode = nodes.find(n => n.id === depId)
        if (!depNode) return null
        
        return (
          <line
            key={`${depId}-${node.id}`}
            x1={depNode.position.x + 60}
            y1={depNode.position.y + 30}
            x2={node.position.x}
            y2={node.position.y + 30}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="transition-all duration-300"
            markerEnd="url(#arrowhead)"
          />
        )
      })
    ).flat()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative bg-background border border-border rounded-2xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-lg font-display font-medium text-foreground">Pipeline Graph</h3>
          <p className="text-sm text-muted-foreground">5 nodes • 2 running • 1 pending</p>
        </motion.div>
        <motion.button
          onClick={handleRunPipeline}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-medium font-medium"
        >
          <motion.div 
            className="w-4 h-4 relative"
            animate={{ rotate: runningNodes.size > 0 ? 360 : 0 }}
            transition={{ duration: 2, repeat: runningNodes.size > 0 ? Infinity : 0, ease: "linear" }}
          >
            <svg className="w-4 h-4 progress-ring" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" 
                      strokeDasharray="50.26" strokeDashoffset="12.5" 
                      className="animate-progress-ring" />
            </svg>
            <Play className="w-2 h-2 absolute inset-1" />
          </motion.div>
          <span>Run Pipeline</span>
        </motion.button>
      </div>

      {/* SVG Canvas */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden bg-card rounded-xl border border-border" 
        style={{ height: '400px' }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          className="transition-transform duration-300"
        >
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="hsl(var(--border))"
              />
            </marker>
          </defs>

          {/* Render connections */}
          <motion.g
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeInOut" }}
          >
            {renderConnections()}
          </motion.g>

          {/* Render nodes */}
          {nodes.map((node, index) => {
            const NodeIcon = getNodeIcon(node.type)
            const StatusIcon = getStatusIcon(node.status)
            const isHovered = hoveredNode === node.id
            const isRunning = runningNodes.has(node.id)
            const shouldOrbit = isIdle && node.status === 'idle'

            return (
              <g key={node.id}>
                {/* Node container */}
                <foreignObject
                  x={node.position.x}
                  y={node.position.y}
                  width="120"
                  height="60"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => onNodeClick?.(node)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{
                      opacity: 1, 
                      scale: isRunning ? [1, 1.02, 1] : 1, 
                      y: 0,
                      ...(shouldOrbit && {
                        x: [0, 5, 0, -5, 0],
                        y: [0, -2, 0, 2, 0]
                      })
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    transition={{
                      scale: isRunning ? { 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      } : {},
                      x: shouldOrbit ? { 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      } : {},
                      y: shouldOrbit ? { 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      } : {}
                    }}
                    className={`
                      dag-node paper-layers p-3 rounded-xl border-2 bg-card transition-all duration-300
                      ${getStatusColor(node.status)}
                      ${isHovered ? 'shadow-lg' : ''}
                      ${node.status === 'success' ? 'dag-node success' : ''}
                      ${node.status === 'failed' ? 'dag-node failed' : ''}
                      ${isRunning ? 'border-primary shadow-lg shadow-primary/20' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <motion.div
                        animate={{ rotate: isRunning ? 360 : 0 }}
                        transition={{ duration: 2, repeat: isRunning ? Infinity : 0, ease: "linear" }}
                      >
                        <NodeIcon className="w-3 h-3" />
                      </motion.div>
                      <motion.div
                        animate={isRunning ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        } : {}}
                        transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                      >
                        <StatusIcon className="w-3 h-3" />
                      </motion.div>
                    </div>
                    <div className="text-xs font-medium text-foreground truncate">
                      {node.name}
                    </div>
                    <div className="text-2xs text-muted-foreground font-mono">
                      {node.hash && `${node.hash}`}
                      {node.runtime && ` • ${node.runtime}`}
                    </div>
                  </motion.div>
                </foreignObject>

                {/* Hover details */}
                <AnimatePresence>
                  {isHovered && (
                    <foreignObject
                      x={node.position.x + 130}
                      y={node.position.y}
                      width="200"
                      height="80"
                      className="pointer-events-none"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-popover border border-border rounded-lg p-3 shadow-lg"
                      >
                        <div className="text-sm font-medium text-foreground">{node.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {node.type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Status: {node.status}
                        </div>
                        {node.hash && (
                          <div className="text-xs font-mono text-accent mt-1">
                            SHA: {node.hash}...
                          </div>
                        )}
                      </motion.div>
                    </foreignObject>
                  )}
                </AnimatePresence>
              </g>
            )
          })}
        </svg>

        {/* Zoom controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="absolute bottom-4 right-4 flex space-x-2"
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-background border border-border rounded-md flex items-center justify-center hover:bg-muted transition-medium"
          >
            <span className="text-xs">+</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-background border border-border rounded-md flex items-center justify-center hover:bg-muted transition-medium"
          >
            <span className="text-xs">-</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="mt-4 flex items-center space-x-6 text-xs text-muted-foreground"
      >
        {[
          { color: 'border-accent', label: 'Success' },
          { color: 'border-primary', label: 'Running', animate: true },
          { color: 'border-muted-foreground', label: 'Pending' },
          { color: 'border-destructive', label: 'Failed' }
        ].map((item, index) => (
          <motion.div 
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + index * 0.1, duration: 0.3 }}
            className="flex items-center space-x-1"
          >
            <motion.div 
              className={`w-3 h-3 border-2 ${item.color} rounded-full ${item.animate ? 'animate-pulse' : ''}`}
              whileHover={{ scale: 1.2 }}
            />
            <span>{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}