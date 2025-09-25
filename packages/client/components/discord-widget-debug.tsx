"use client"

import { useState, useEffect } from "react"

export function DiscordWidgetDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testWidget = async () => {
      try {
        const response = await fetch('/api/test-discord-widget')
        const data = await response.json()
        setDebugInfo(data)
      } catch (error) {
        setDebugInfo({ error: 'Failed to fetch debug info' })
      } finally {
        setLoading(false)
      }
    }

    testWidget()
  }, [])

  if (loading) {
    return <div className="p-4 bg-muted rounded-lg">Loading debug info...</div>
  }

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Discord Widget Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div><strong>Server ID:</strong> {debugInfo?.serverId}</div>
        <div><strong>Widget URL:</strong> {debugInfo?.widgetUrl}</div>
        <div><strong>Status:</strong> {debugInfo?.status}</div>
        <div><strong>Accessible:</strong> {debugInfo?.accessible ? '✅ Yes' : '❌ No'}</div>
        <div><strong>Message:</strong> {debugInfo?.message}</div>
      </div>

      {debugInfo?.error && (
        <div className="mt-4 p-2 bg-red-500/20 text-red-400 rounded">
          <strong>Error:</strong> {debugInfo.error}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-500/20 text-blue-400 rounded text-sm">
        <strong>If the widget is not showing:</strong><br/>
        1. Go to your Discord server<br/>
        2. Server Settings → Widget<br/>
        3. Enable "Server Widget"<br/>
        4. Make sure the Server ID is correct
      </div>
    </div>
  )
}
