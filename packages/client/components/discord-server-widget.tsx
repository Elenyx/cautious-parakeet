"use client"

interface DiscordServerWidgetProps {
  serverId: string
  theme?: "dark" | "light"
  width?: number
  height?: number
  className?: string
}

export function DiscordServerWidget({ 
  serverId, 
  theme = "dark", 
  width = 350, 
  height = 500,
  className = ""
}: DiscordServerWidgetProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
        <iframe
          src={`https://discord.com/widget?id=${serverId}&theme=${theme}`}
          width={width}
          height={height}
          allowTransparency={true}
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          className="w-full rounded-lg"
          title="Discord Server Widget"
          style={{ border: 'none', backgroundColor: 'transparent' }}
        />
      </div>
    </div>
  )
}

// Compact version for smaller spaces
export function DiscordServerWidgetCompact({ 
  serverId, 
  theme = "dark",
  className = ""
}: Omit<DiscordServerWidgetProps, 'width' | 'height'>) {
  return (
    <div className={`relative ${className}`}>
      <iframe
        src={`https://discord.com/widget?id=${serverId}&theme=${theme}`}
        width="280"
        height="400"
        allowTransparency={true}
        frameBorder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="w-full rounded-lg"
        title="Discord Server Widget"
      />
    </div>
  )
}
