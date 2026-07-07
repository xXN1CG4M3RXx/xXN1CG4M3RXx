import { useState } from 'react'

function Settings() {
  const [profile, setProfile] = useState({
    siteName: 'My Admin Workspace',
    supportEmail: 'admin@myworkspace.io',
    maintenanceMode: false,
    analyticsEnabled: true,
  })
  const [saveStatus, setSaveStatus] = useState('idle')

  const handleToggle = (key) => {
    setProfile((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleInputChange = (key, val) => {
    setProfile((prev) => ({
      ...prev,
      [key]: val,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 800)
  }

  return (
    <div className="animate-fade-in space-y-8 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">Portal Settings</h1>
        <p className="text-slate-400 text-sm">Configure portal parameters, developer utilities, and backend synchronization toggles.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xs">
        {/* Text Input Block */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={profile.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-hidden focus:border-sky-aqua-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Support Email Address
            </label>
            <input
              type="email"
              value={profile.supportEmail}
              onChange={(e) => handleInputChange('supportEmail', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-hidden focus:border-sky-aqua-500 transition-colors"
            />
          </div>
        </div>

        {/* Toggle Switches */}
        <div className="pt-4 border-t border-slate-800/60 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Maintenance Mode</h3>
              <p className="text-xs text-slate-400">Offline splash screen is shown on production builds.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('maintenanceMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                profile.maintenanceMode ? 'bg-sky-aqua-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Enable Portal Analytics</h3>
              <p className="text-xs text-slate-400">Gather anonymized interface navigation logs to optimize page performance.</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('analyticsEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                profile.analyticsEnabled ? 'bg-sky-aqua-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Panel Submit */}
        <div className="pt-6 border-t border-slate-800/60 flex items-center justify-end">
          <button
            type="submit"
            disabled={saveStatus !== 'idle'}
            className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-sky-aqua-600 to-baltic-blue-600 hover:from-sky-aqua-500 hover:to-baltic-blue-500 text-white shadow-lg shadow-sky-aqua-500/20 transition-all duration-200 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === 'saving' && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {saveStatus === 'idle' && 'Save Changes'}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Settings Saved ✓'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings
