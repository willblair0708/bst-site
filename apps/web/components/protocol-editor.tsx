"use client"

import React, { useState, useCallback, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import * as yaml from 'js-yaml'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, CheckCircle, Save, Eye, Code } from 'lucide-react'

interface ProtocolEditorProps {
  initialValue?: string
  onSave?: (content: string) => void
  readOnly?: boolean
}

interface ValidationError {
  message: string
  line?: number
}

const defaultProtocol = `id: CTP-ABC123
title: Example Phase I Trial
version: v1.0
inclusionCriteria:
  - Age 18-75
  - Confirmed NSCLC diagnosis
  - ECOG Performance Status 0-1
exclusionCriteria:
  - Prior immunotherapy
  - Active autoimmune disease
endpoints:
  primary:
    - Safety and tolerability
  secondary:
    - Overall response rate
    - Progression-free survival
design:
  phase: "I"
  allocation: "Single Arm"
  intervention: "Experimental Drug X"
  dosing: "3+3 dose escalation"
`

export function ProtocolEditor({ initialValue = defaultProtocol, onSave, readOnly = false }: ProtocolEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValid, setIsValid] = useState(true)
  const [activeTab, setActiveTab] = useState("editor")
  const [loading, setLoading] = useState(false)
  
  // Load protocol from API on mount
  useEffect(() => {
    const loadProtocol = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/protocol')
        const data = await response.json()
        if (data.exists && data.content) {
          setContent(data.content)
        }
      } catch (error) {
        console.error('Failed to load protocol:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProtocol()
  }, [])

  const validateYaml = useCallback((yamlContent: string) => {
    try {
      const parsed = yaml.load(yamlContent)
      
      // Basic validation - check required fields
      const validationErrors: ValidationError[] = []
      
      if (!parsed || typeof parsed !== 'object') {
        validationErrors.push({ message: 'Invalid YAML structure' })
      } else {
        const protocol = parsed as any
        
        if (!protocol.id) {
          validationErrors.push({ message: 'Missing required field: id' })
        } else if (!/^CTP-[A-Z0-9]{6}$/.test(protocol.id)) {
          validationErrors.push({ message: 'ID must match pattern: CTP-XXXXXX' })
        }
        
        if (!protocol.title) {
          validationErrors.push({ message: 'Missing required field: title' })
        }
        
        if (!protocol.version) {
          validationErrors.push({ message: 'Missing required field: version' })
        }
        
        if (!protocol.inclusionCriteria || !Array.isArray(protocol.inclusionCriteria)) {
          validationErrors.push({ message: 'Missing or invalid inclusionCriteria array' })
        }
      }
      
      setErrors(validationErrors)
      setIsValid(validationErrors.length === 0)
      
    } catch (error) {
      setErrors([{ message: `YAML Parse Error: ${error}` }])
      setIsValid(false)
    }
  }, [])

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newContent = value || ''
    setContent(newContent)
    validateYaml(newContent)
  }, [validateYaml])

  const handleSave = useCallback(async () => {
    if (!isValid) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/protocol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        console.log('Protocol saved successfully:', result.message)
        if (onSave) {
          onSave(content)
        }
      } else {
        console.error('Failed to save protocol:', result.error)
      }
    } catch (error) {
      console.error('Error saving protocol:', error)
    } finally {
      setLoading(false)
    }
  }, [content, isValid, onSave])

  const renderPreview = () => {
    try {
      const parsed = yaml.load(content) as any
      return (
        <div className="p-4 space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{parsed?.title || 'Untitled Protocol'}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">ID:</span> {parsed?.id || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Version:</span> {parsed?.version || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Phase:</span> {parsed?.design?.phase || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Allocation:</span> {parsed?.design?.allocation || 'N/A'}
              </div>
            </div>
          </div>
          
          {parsed?.inclusionCriteria && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Inclusion Criteria</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {parsed.inclusionCriteria.map((criterion: string, index: number) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          )}
          
          {parsed?.exclusionCriteria && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Exclusion Criteria</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {parsed.exclusionCriteria.map((criterion: string, index: number) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    } catch {
      return (
        <div className="p-4 text-center text-gray-500">
          Invalid YAML - cannot preview
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Protocol Editor</h2>
          {isValid ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <Button 
              onClick={handleSave} 
              disabled={!isValid || loading}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Protocol'}
            </Button>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border-b">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Validation Errors:</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="editor">
            <Code className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="flex-1 p-4">
          <Editor
            height="100%"
            defaultLanguage="yaml"
            value={content}
            onChange={handleEditorChange}
            options={{
              readOnly,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
            theme="vs-light"
          />
        </TabsContent>

        <TabsContent value="preview" className="flex-1">
          <div className="h-full overflow-auto">
            {renderPreview()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}