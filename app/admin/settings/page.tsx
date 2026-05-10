'use client'

import { Settings, Globe, Bell, Shield, Database, Palette } from 'lucide-react'

const sections = [
  {
    title: 'General',
    icon: Globe,
    settings: [
      { label: 'Platform Name', value: 'Traveloop', type: 'text' },
      { label: 'Tagline', value: 'AI-Powered Travel Planning', type: 'text' },
      { label: 'Support Email', value: 'support@traveloop.com', type: 'text' },
      { label: 'Default Language', value: 'English', type: 'text' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { label: 'Email Notifications', value: 'true', type: 'toggle' },
      { label: 'Push Notifications', value: 'false', type: 'toggle' },
      { label: 'Trip Reminders', value: 'true', type: 'toggle' },
      { label: 'Budget Alerts', value: 'true', type: 'toggle' },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    settings: [
      { label: 'Two-Factor Auth', value: 'false', type: 'toggle' },
      { label: 'Session Timeout (min)', value: '60', type: 'number' },
      { label: 'Max Login Attempts', value: '5', type: 'number' },
    ],
  },
  {
    title: 'Database',
    icon: Database,
    settings: [
      { label: 'Supabase Project', value: 'eryzxmgwglxn', type: 'text' },
      { label: 'Region', value: 'ap-south-1', type: 'text' },
      { label: 'Auto Backup', value: 'true', type: 'toggle' },
    ],
  },
  {
    title: 'Theme',
    icon: Palette,
    settings: [
      { label: 'Primary Color', value: '#F5A623', type: 'color' },
      { label: 'Dark Mode', value: '#0F1B2D', type: 'color' },
      { label: 'Font Family', value: 'Inter', type: 'text' },
    ],
  },
]

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-500" /> Platform Settings
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Global configuration and preferences</p>
      </div>

      {sections.map(section => {
        const Icon = section.icon
        return (
          <div key={section.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 border-b border-gray-100">
              <Icon className="w-4 h-4 text-navy-900" />
              <h3 className="font-bold text-navy-900 text-sm">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {section.settings.map(setting => (
                <div key={setting.label} className="flex items-center justify-between px-6 py-4">
                  <p className="text-sm text-navy-900 font-medium">{setting.label}</p>
                  <div className="w-52">
                    {setting.type === 'toggle' ? (
                      <div className="flex justify-end">
                        <button className={`w-12 h-6 rounded-full transition-colors relative ${setting.value === 'true' ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${setting.value === 'true' ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ) : setting.type === 'color' ? (
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-6 h-6 rounded-lg border border-gray-200" style={{ backgroundColor: setting.value }} />
                        <input
                          className="w-28 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-right font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                          defaultValue={setting.value}
                        />
                      </div>
                    ) : (
                      <input
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                        defaultValue={setting.value}
                        type={setting.type}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20">
          Save All Settings
        </button>
      </div>
    </div>
  )
}
