import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Settings, FileText, AlertTriangle, CreditCard } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Settings,
      title: "Interactive Setup Wizard",
      description:
        "Configure your ticket system in minutes with our step-by-step setup wizard. No technical knowledge required.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-23%20234042-oFUkGMmIRFTNyv0unn0zEBUnUXhjpd.png",
      color: "text-primary",
    },
    {
      icon: FileText,
      title: "Automatic Transcripts",
      description:
        "Every ticket conversation is automatically saved and archived with detailed metadata and participant information.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-23%20234114-hH8QgCtd01ovmFwzf4cVkc5TAwX4Y4.png",
      color: "text-secondary",
    },
    {
      icon: AlertTriangle,
      title: "Multi-Category Support",
      description:
        "Organize tickets by type - General Support, Bug Reports, Appeals, and Billing. Each with custom workflows.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-23%20234031-l6kJteTM9sIs65OQeVgN5V1F5g1aA1.png",
      color: "text-primary",
    },
    {
      icon: CreditCard,
      title: "Advanced Error Logging",
      description:
        "Comprehensive error tracking and logging system to ensure your bot runs smoothly with detailed diagnostics.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-23%20234237-1um7FOpg8ATvuLpVzwBwB1oL7DtRoQ.png",
      color: "text-secondary",
    },
  ]

  return (
    <section id="features" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Modern Discord Servers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need to provide exceptional support to your Discord community members.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border/50 hover:bg-card/70 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg bg-background/50 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border border-border/50 group-hover:border-border transition-colors">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
