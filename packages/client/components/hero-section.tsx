"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"

export function HeroSection() {
  const handleAddToDiscord = async () => {
    try {
      const response = await fetch('/api/discord/bot/invite')
      const data = await response.json()
      if (data.inviteUrl) {
        window.open(data.inviteUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to get invite URL:', error)
    }
  }
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-8">
            <span>🎫 Advanced Discord Ticket Management</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            Streamline Your Discord{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Support System
            </span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your Discord server into a professional support hub with TicketMesh. Advanced ticket management,
            automated workflows, and seamless user experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange group"
              onClick={handleAddToDiscord}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Discord
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              Join Discord Community
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Servers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">2M+</div>
              <div className="text-muted-foreground">Tickets Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
