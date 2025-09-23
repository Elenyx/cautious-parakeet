"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Wrench, Mail, Calendar } from "lucide-react"
import Link from "next/link"

interface MaintenancePageProps {
  /**
   * The title of the page (e.g., "Features", "Documentation")
   */
  title: string
  /**
   * A brief description of what this page will contain
   */
  description: string
  /**
   * Expected completion date (optional)
   */
  expectedDate?: string
  /**
   * Contact email for updates (optional)
   */
  contactEmail?: string
}

/**
 * A reusable maintenance/coming soon page component
 * Displays a professional message indicating the page is under development
 */
export function MaintenancePage({ 
  title, 
  description, 
  expectedDate, 
  contactEmail = "support@ticketmesh.com" 
}: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              <Clock className="mr-2 h-3 w-3" />
              Coming Soon
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Maintenance Card */}
          <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Under Development</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;re working hard to bring you this feature. Our team is currently developing 
                and testing to ensure the best possible experience.
              </p>

              {/* Expected Date */}
              {expectedDate && (
                <div className="flex items-center justify-center mb-6 p-4 rounded-lg bg-muted/50">
                  <Calendar className="mr-2 h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Expected Launch: {expectedDate}
                  </span>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Want to be notified when this feature is ready?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" asChild>
                    <Link href={`mailto:${contactEmail}?subject=Notify me about ${title}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Get Notified
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/">
                      Return to Home
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              In the meantime, explore our{" "}
              <Link href="/changelog" className="text-primary hover:underline">
                changelog
              </Link>{" "}
              to see what we&apos;ve been working on.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}