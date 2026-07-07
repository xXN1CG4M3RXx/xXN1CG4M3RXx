import { useState } from 'react'

function FirebasePlayground() {
  const [testData, setTestData] = useState('')
  const [logs, setLogs] = useState([])
  const [simulatedUsers, setSimulatedUsers] = useState([
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'Admin' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' }
  ])

  // Get env status
  const envKeys = [
    { name: 'VITE_FIREBASE_API_KEY', value: import.meta.env.VITE_FIREBASE_API_KEY },
    { name: 'VITE_FIREBASE_AUTH_DOMAIN', value: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN },
    { name: 'VITE_FIREBASE_PROJECT_ID', value: import.meta.env.VITE_FIREBASE_PROJECT_ID },
    { name: 'VITE_FIREBASE_STORAGE_BUCKET', value: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET },
    { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID },
    { name: 'VITE_FIREBASE_APP_ID', value: import.meta.env.VITE_FIREBASE_APP_ID }
  ]

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('de-CH', { hour12: false })
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev])
  }

  const handleTestWrite = (e) => {
    e.preventDefault()
    if (!testData.trim()) return

    addLog(`Simulating Write to Firestore: collection("playground").add({ text: "${testData}" })`)
    
    // Simulating database latency
    setTimeout(() => {
      addLog(`Success! Firestore Document written successfully (Mock ID: doc_${Math.random().toString(36).substr(2, 9)})`)
      setTestData('')
    }, 600)
  }

  const triggerMockAuth = () => {
    addLog('Initiating Firebase Auth flow: signInWithEmailAndPassword()')
    setTimeout(() => {
      addLog('Auth status change: User signed in as alice@example.com')
    }, 500)
  }

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">Firebase Playground</h1>
        <p className="text-slate-400 text-sm">Verify and test your Firebase integration environment variables and database connections.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Environment Monitor */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xs">
          <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Environment Variables
          </h2>
          <div className="space-y-3">
            {envKeys.map((env) => (
              <div key={env.name} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0 text-sm">
                <span className="font-mono text-slate-400 text-xs">{env.name}</span>
                {env.value ? (
                  <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs select-all">
                    {env.value.substring(0, 6)}...{env.value.substring(env.value.length - 4)}
                  </span>
                ) : (
                  <span className="font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-xs">
                    Not Defined
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Database Simulation Form */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              Firestore Write Sandbox
            </h2>
            <form onSubmit={handleTestWrite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Document content
                </label>
                <input
                  type="text"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  placeholder="Enter custom text for Firestore doc..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2 px-4 rounded-xl text-sm transition-all duration-200 shadow-md shadow-purple-500/10"
              >
                Write Simulated Document
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-center">
            <span className="text-xs text-slate-400">Mock Firebase Auth Flow</span>
            <button
              onClick={triggerMockAuth}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              Sign In (Mock Account)
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Sandbox Console */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6">
        <h2 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 font-mono">
          <span className="text-purple-500">&gt;</span> Console Log Monitor
        </h2>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 h-40 overflow-y-auto font-mono text-xs text-slate-400 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.length === 0 ? (
            <p className="text-slate-600 italic">Console idle. Trigger actions above to view mock client-side operations...</p>
          ) : (
            logs.map((log, idx) => (
              <p key={idx} className={log.includes('Success') ? 'text-emerald-400' : log.includes('Initiating') || log.includes('Simulating') ? 'text-indigo-400' : 'text-slate-300'}>
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default FirebasePlayground
