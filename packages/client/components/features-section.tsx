import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Settings, FileText, AlertTriangle, CreditCard, ArrowRight, Sparkles } from "lucide-react"

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
      gradient: "from-blue-500/20 to-purple-500/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    {
      icon: FileText,
      title: "Automatic Transcripts",
      description:
        "Every ticket conversation is automatically saved and archived with detailed metadata and participant information.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-23%20234114-hH8QgCtd01ovmFwzf4cVkc5TAwX4Y4.png",
      color: "text-secondary",
      gradient: "from-green-500/20 to-teal-500/20",
      iconBg: "bg-gradient-to-br from-green-500 to-teal-600",
    },
    {
      icon: AlertTriangle,
      title: "Multi-Category Support",
      description:
        "Organize tickets by type - General Support, Bug Reports, Appeals, and Billing. Each with custom workflows.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-09-23%20234031-l6kJteTM9sIs65OQeVgN5V1F5g1aA1.png",
      color: "text-primary",
      gradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
      icon: CreditCard,
      title: "Advanced Error Logging",
      description:
        "Comprehensive error tracking and logging system to ensure your bot runs smoothly with detailed diagnostics.",
      image:
        "https://i.imgur.com/wN2NXLb.png",
      color: "text-secondary",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            Everything you need for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
              Modern Discord Servers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Transform your Discord community with our comprehensive ticket system. 
            Built for scale, designed for simplicity.
          </p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6 lg:max-w-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${feature.iconBg} shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-border to-transparent flex-1"></div>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-primary font-medium group cursor-pointer">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 lg:max-w-2xl">
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-2 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02]">
                    <div className="rounded-2xl overflow-hidden">
                      <Image
                        src={feature.image || "/placeholder.svg"}
                        alt={feature.title}
                        width={800}
                        height={500}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full blur-sm animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/30 transition-colors cursor-pointer group">
            <span className="text-sm font-medium">Explore all features</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </section>
  )
}
