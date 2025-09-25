import { DiscordWidgetDebug } from "@/components/discord-widget-debug"

export default function TestWidgetPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Discord Widget Test</h1>
        
        {/* Debug Info */}
        <DiscordWidgetDebug />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Direct iframe test */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Direct Iframe</h2>
            <iframe
              src="https://discord.com/widget?id=1420828084805959702&theme=dark"
              width="350"
              height="500"
              allowTransparency={true}
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              className="rounded-lg"
              title="Discord Server Widget"
            />
          </div>

          {/* Component test */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Component Test</h2>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
                <iframe
                  src="https://discord.com/widget?id=1420828084805959702&theme=dark"
                  width="350"
                  height="500"
                  allowTransparency={true}
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="w-full rounded-lg"
                  title="Discord Server Widget"
                  style={{ border: 'none', backgroundColor: 'transparent' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test with Discord's official server */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Test with Discord's Official Server (Should Work)</h2>
          <iframe
            src="https://discord.com/widget?id=81384788765712384&theme=dark"
            width="350"
            height="500"
            allowTransparency={true}
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            className="rounded-lg"
            title="Discord Official Server Widget"
          />
        </div>

        <div className="mt-8 p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2">Instructions</h3>
          <p className="text-muted-foreground text-sm">
            1. If the Discord Official Server widget above shows content but yours doesn't, your server widget is not enabled<br/>
            2. Go to your Discord server → Server Settings → Widget → Enable "Server Widget"<br/>
            3. Make sure the Server ID is correct: 1420828084805959702<br/>
            4. Also try the HTML test file: <a href="/discord-widget-test.html" className="text-primary hover:underline">/discord-widget-test.html</a>
          </p>
        </div>
      </div>
    </div>
  )
}
