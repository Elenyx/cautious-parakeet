import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <main className="max-w-7xl mx-auto">
          <HeroSection />
          <FeaturesSection />
        </main>
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
