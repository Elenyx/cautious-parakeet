import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Users } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
            Ready to Transform Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Discord Support?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance leading-relaxed">
            Join thousands of Discord servers already using TicketMesh to provide exceptional support experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange group">
              <Plus className="w-5 h-5 mr-2" />
              Add to Discord Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground glow-purple bg-transparent"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Our Community
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Free to use • No credit card required • Setup in under 5 minutes
          </div>
        </div>
      </div>
    </section>
  )
}
