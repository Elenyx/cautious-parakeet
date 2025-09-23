import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Community Manager",
      server: "TechHub Discord",
      content:
        "TicketMesh transformed our support system completely. We went from chaotic DMs to organized, professional ticket handling. Our response time improved by 300%.",
      rating: 5,
      avatar: "/professional-male-avatar.png",
    },
    {
      name: "Sarah Johnson",
      role: "Server Owner",
      server: "Gaming Legends",
      content:
        "The setup wizard made implementation incredibly easy. Within 10 minutes, we had a fully functional ticket system that our 50K members love using.",
      rating: 5,
      avatar: "/professional-female-avatar.png",
    },
    {
      name: "Mike Rodriguez",
      role: "Support Lead",
      server: "Creative Studios",
      content:
        "The automatic transcripts and error logging features are game-changers. We can track every interaction and resolve issues faster than ever before.",
      rating: 5,
      avatar: "/professional-hispanic-male-avatar.jpg",
    },
  ]

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Discord Communities
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            See what server owners and community managers are saying about TicketMesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:bg-card/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-foreground mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</blockquote>

                <div className="flex items-center space-x-3">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-border"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-secondary">{testimonial.server}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
