"use client"

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings,
  Shield,
  Users,
  Bell,
  Database,
  Key,
  Globe,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

interface Setting {
  key: string
  label: string
  description: string
  value: string | boolean | number
  type: 'text' | 'boolean' | 'number' | 'select' | 'password'
  options?: string[]
  category: string
}

const settings: Setting[] = [
  // General Settings
  {
    key: 'trial_title',
    label: 'Trial Title',
    description: 'Full title of the clinical trial',
    value: 'NSCLC Phase I Safety and Efficacy Trial',
    type: 'text',
    category: 'general'
  },
  {
    key: 'trial_id',
    label: 'Trial ID',
    description: 'Unique identifier for the trial',
    value: 'CTP-ABC123',
    type: 'text',
    category: 'general'
  },
  {
    key: 'sponsor',
    label: 'Sponsor Organization',
    description: 'Sponsoring organization name',
    value: 'Oncology Research Institute',
    type: 'text',
    category: 'general'
  },
  {
    key: 'phase',
    label: 'Trial Phase',
    description: 'Clinical trial phase',
    value: 'Phase I',
    type: 'select',
    options: ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'Phase IV'],
    category: 'general'
  },

  // Security Settings
  {
    key: 'mfa_required',
    label: 'Multi-Factor Authentication',
    description: 'Require MFA for all team members',
    value: true,
    type: 'boolean',
    category: 'security'
  },
  {
    key: 'session_timeout',
    label: 'Session Timeout (minutes)',
    description: 'Automatic logout after inactivity',
    value: 30,
    type: 'number',
    category: 'security'
  },
  {
    key: 'ip_whitelist',
    label: 'IP Address Whitelist',
    description: 'Restrict access to specific IP addresses',
    value: false,
    type: 'boolean',
    category: 'security'
  },

  // Data Management
  {
    key: 'backup_frequency',
    label: 'Backup Frequency',
    description: 'How often to backup trial data',
    value: 'Daily',
    type: 'select',
    options: ['Hourly', 'Daily', 'Weekly'],
    category: 'data'
  },
  {
    key: 'data_retention',
    label: 'Data Retention (years)',
    description: 'How long to retain trial data',
    value: 25,
    type: 'number',
    category: 'data'
  },
  {
    key: 'encrypt_at_rest',
    label: 'Encryption at Rest',
    description: 'Encrypt stored data',
    value: true,
    type: 'boolean',
    category: 'data'
  },

  // Notifications
  {
    key: 'email_notifications',
    label: 'Email Notifications',
    description: 'Send email notifications for key events',
    value: true,
    type: 'boolean',
    category: 'notifications'
  },
  {
    key: 'sae_alerts',
    label: 'SAE Instant Alerts',
    description: 'Immediate notification for serious adverse events',
    value: true,
    type: 'boolean',
    category: 'notifications'
  },
  {
    key: 'amendment_notifications',
    label: 'Amendment Notifications',
    description: 'Notify team of protocol amendments',
    value: true,
    type: 'boolean',
    category: 'notifications'
  },

  // Compliance
  {
    key: 'gcp_compliance',
    label: 'GCP Compliance Monitoring',
    description: 'Monitor Good Clinical Practice compliance',
    value: true,
    type: 'boolean',
    category: 'compliance'
  },
  {
    key: 'audit_trail',
    label: 'Audit Trail',
    description: 'Maintain detailed audit logs',
    value: true,
    type: 'boolean',
    category: 'compliance'
  },
  {
    key: 'regulatory_region',
    label: 'Primary Regulatory Region',
    description: 'Primary regulatory jurisdiction',
    value: 'FDA (United States)',
    type: 'select',
    options: ['FDA (United States)', 'EMA (Europe)', 'PMDA (Japan)', 'Health Canada', 'TGA (Australia)'],
    category: 'compliance'
  }
]

const complianceStatus = [
  { item: 'IRB Approval', status: 'compliant', expires: '2024-12-15' },
  { item: 'FDA IND Active', status: 'compliant', expires: '2025-06-30' },
  { item: 'GCP Training Current', status: 'compliant', expires: '2024-08-20' },
  { item: 'Site Agreements', status: 'warning', expires: '2024-03-01' },
  { item: 'Insurance Coverage', status: 'compliant', expires: '2024-11-30' },
  { item: 'Data Transfer Agreements', status: 'expired', expires: '2024-01-15' }
]

const integrations = [
  { name: 'CTMS Integration', status: 'connected', description: 'Clinical Trial Management System' },
  { name: 'eCRF System', status: 'connected', description: 'Electronic Case Report Forms' },
  { name: 'IWRS', status: 'pending', description: 'Interactive Web Response System' },
  { name: 'Safety Database', status: 'connected', description: 'Adverse Event Reporting' },
  { name: 'Regulatory Portal', status: 'disconnected', description: 'Regulatory Submissions' }
]

export default function SettingsPage() {
  const [activeSettings, setActiveSettings] = useState<Record<string, any>>({})
  const [showApiKey, setShowApiKey] = useState(false)

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category)
  }

  const handleSettingChange = (key: string, value: any) => {
    setActiveSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'connected':
        return 'text-green-600 bg-green-100'
      case 'warning':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'expired':
      case 'disconnected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'warning':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'expired':
      case 'disconnected':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const renderSettingInput = (setting: Setting) => {
    const currentValue = activeSettings[setting.key] ?? setting.value

    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={currentValue as boolean}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm">{setting.label}</span>
          </label>
        )
      case 'select':
        return (
          <select
            value={currentValue as string}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'number':
        return (
          <input
            type="number"
            value={currentValue as number}
            onChange={(e) => handleSettingChange(setting.key, parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        )
      case 'password':
        return (
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={currentValue as string}
              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
              className="w-full p-2 pr-10 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-3"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        )
      default:
        return (
          <input
            type="text"
            value={currentValue as string}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trial Settings</h1>
          <p className="text-gray-600 mt-1">Configure trial parameters, security, and compliance</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">General Settings</h2>
            <div className="space-y-6">
              {getSettingsByCategory('general').map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.label}
                  </label>
                  {renderSettingInput(setting)}
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
            <div className="space-y-6">
              {getSettingsByCategory('security').map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.label}
                  </label>
                  {renderSettingInput(setting)}
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">API Keys</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value="bst_live_1234567890abcdef"
                      readOnly
                      className="w-full p-2 pr-10 border rounded-md bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-3"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button variant="outline">
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Use this key to authenticate API requests
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Data Management</h2>
            <div className="space-y-6">
              {getSettingsByCategory('data').map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.label}
                  </label>
                  {renderSettingInput(setting)}
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Export/Import */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Data Export/Import</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Export Trial Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Export all trial data in various formats
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Import Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Import data from external sources
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>
            <div className="space-y-6">
              {getSettingsByCategory('notifications').map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{setting.label}</h3>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Compliance Settings</h2>
            <div className="space-y-6">
              {getSettingsByCategory('compliance').map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setting.label}
                  </label>
                  {renderSettingInput(setting)}
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Compliance Status</h2>
            <div className="space-y-4">
              {complianceStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h3 className="font-medium">{item.item}</h3>
                      <p className="text-sm text-gray-500">
                        Expires: {new Date(item.expires).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">System Integrations</h2>
            <div className="space-y-4">
              {integrations.map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-6">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-900">Archive Trial</h3>
                  <p className="text-sm text-red-700">
                    Archive this trial and make it read-only
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Archive Trial
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-900">Delete Trial</h3>
                  <p className="text-sm text-red-700">
                    Permanently delete this trial and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Trial
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="accessibility" className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-6">Accessibility Settings</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="text-size">Text Size</Label>
                <Slider id="text-size" defaultValue={[16]} max={24} min={12} step={1} />
                <p className="text-sm text-gray-500 mt-1">Adjust the text size across the application.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="dyslexia-mode" />
                <Label htmlFor="dyslexia-mode">Dyslexia-Friendly Mode</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}