import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, GitCommit, Plus, Bug, Zap, Shield, Sparkles } from "lucide-react"

/**
 * Changelog page component displaying version history with semantic versioning
 * Features modern design with categorized changes and proper date formatting
 */
export default function ChangelogPage() {
  const changelogEntries = [
    {
      version: "1.2.1",
      date: "2025-09-25",
      type: "patch" as const,
      changes: [
        { type: "improved", description: "Enhanced Discord API rate limiting with proper retry-after handling" },
        { type: "improved", description: "Extended cache durations to reduce API call frequency (5x fewer requests)" },
        { type: "added", description: "Request deduplication system to prevent duplicate API calls" },
        { type: "fixed", description: "Rate limiter now respects Discord's actual retry timing instead of fixed timeouts" },
        { type: "improved", description: "Significantly reduced Discord API rate limit errors and improved reliability" },
      ]
    },
    {
      version: "1.2.0",
      date: "2025-09-20",
      type: "minor" as const,
      changes: [
        { type: "added", description: "Advanced ticket analytics and reporting dashboard" },
        { type: "added", description: "Custom role-based permissions system" },
        { type: "improved", description: "Enhanced mobile responsiveness across all components" },
        { type: "fixed", description: "Resolved memory leak in real-time message processing" },
      ]
    },
    {
      version: "1.1.0",
      date: "2025-09-10",
      type: "minor" as const,
      changes: [
        { type: "added", description: "Ticket templates for common support scenarios" },
        { type: "added", description: "Integration with popular helpdesk platforms" },
        { type: "improved", description: "Streamlined onboarding process for new servers" },
        { type: "fixed", description: "Various UI inconsistencies in dark mode" },
      ]
    },
    {
      version: "1.0.2",
      date: "2025-09-05",
      type: "patch" as const,
      changes: [
        { type: "fixed", description: "Critical bug in ticket assignment notifications" },
        { type: "fixed", description: "Timezone display issues in ticket timestamps" },
        { type: "improved", description: "Reduced Discord API rate limit errors by 40%" },
      ]
    },
    {
      version: "1.0.1",
      date: "2025-09-02",
      type: "patch" as const,
      changes: [
        { type: "fixed", description: "Slash command registration failing on some servers" },
        { type: "fixed", description: "Ticket transcripts not generating properly" },
        { type: "improved", description: "Better error handling for network timeouts" },
      ]
    },
    {
      version: "1.0.0",
      date: "2025-08-30",
      type: "major" as const,
      changes: [
        { type: "added", description: "🎉 Initial public release of TicketMesh" },
        { type: "added", description: "Complete Discord ticket management system" },
        { type: "added", description: "Modern glassmorphism UI with responsive design" },
        { type: "added", description: "Real-time ticket notifications and updates" },
        { type: "added", description: "Advanced automation workflows and triggers" },
        { type: "security", description: "Enterprise-grade encryption for all data" },
      ]
    }
  ]

  /**
   * Get the appropriate icon for change type
   */
  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4 text-green-500" />
      case 'improved': case 'changed': return <Zap className="w-4 h-4 text-blue-500" />
      case 'fixed': return <Bug className="w-4 h-4 text-orange-500" />
      case 'security': return <Shield className="w-4 h-4 text-purple-500" />
      case 'removed': return <GitCommit className="w-4 h-4 text-red-500" />
      default: return <Sparkles className="w-4 h-4 text-gray-500" />
    }
  }

  /**
   * Get the appropriate badge variant for version type
   */
  const getVersionBadge = (type: string) => {
    switch (type) {
      case 'major': return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">Major</Badge>
      case 'minor': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Minor</Badge>
      case 'patch': return <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">Patch</Badge>
      default: return <Badge variant="outline">Release</Badge>
    }
  }

  /**
   * Format date to readable format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Changelog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Stay up to date with the latest features, improvements, and fixes in TicketMesh.
            </p>
          </div>

          {/* Changelog Entries */}
          <div className="space-y-8">
            {changelogEntries.map((entry) => (
              <Card key={entry.version} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl font-bold">
                        v{entry.version}
                      </CardTitle>
                      {getVersionBadge(entry.type)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {entry.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-start gap-3">
                        {getChangeIcon(change.type)}
                        <span className="text-muted-foreground leading-relaxed">
                          {change.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12 p-6 rounded-lg bg-card/30 border border-border/50">
            <p className="text-muted-foreground">
              For technical support or feature requests, join our{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Discord community
              </a>{" "}
              or visit our{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                GitHub repository
              </a>.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}