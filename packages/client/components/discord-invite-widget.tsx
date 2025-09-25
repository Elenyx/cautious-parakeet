"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Users, MessageCircle, Shield } from "lucide-react"

interface DiscordInviteWidgetProps {
  inviteCode: string
  className?: string
}

export function DiscordInviteWidget({ 
  inviteCode,
  className = ""
}: DiscordInviteWidgetProps) {
  return (
    <Card className={`relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Join Our Discord
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10"
            onClick={() => window.open(`https://discord.gg/${inviteCode}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect with our community and get support
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Server Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">TicketMesh Community</h3>
              <p className="text-sm text-muted-foreground">Official Discord Server</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
              <Users className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Active Community</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/20">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <Button 
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all duration-200 hover:scale-[1.02]"
          onClick={() => window.open(`https://discord.gg/${inviteCode}`, '_blank')}
        >
          <Users className="w-4 h-4 mr-2" />
          Join Discord Server
        </Button>
      </CardContent>
    </Card>
  )
}
