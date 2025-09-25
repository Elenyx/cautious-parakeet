import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Home, FileText, Shield, Cookie, Copyright } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy | TicketMesh",
  description: "Cookie Policy for TicketMesh Web Dashboard",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        {/* Navigation Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-200">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 btn-outline-hover">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
          </div>
          
          {/* Legal Pages Navigation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Legal Documents
              </CardTitle>
              <CardDescription>
                Navigate between our legal documents and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/privacy">
                  <Button variant="outline" className="w-full flex items-center gap-2 btn-outline-hover">
                    <Shield className="w-4 h-4" />
                    Privacy
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" className="w-full flex items-center gap-2 btn-outline-hover">
                    <FileText className="w-4 h-4" />
                    Terms
                  </Button>
                </Link>
                <Link href="/cookies">
                  <Button variant="default" className="w-full flex items-center gap-2">
                    <Cookie className="w-4 h-4" />
                    Cookies
                  </Button>
                </Link>
                <Link href="/dmca">
                  <Button variant="outline" className="w-full flex items-center gap-2 btn-outline-hover">
                    <Copyright className="w-4 h-4" />
                    DMCA
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Legal Document
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
            <CardDescription>
              This Cookie Policy explains how TicketMesh uses cookies and similar technologies when you visit our web dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            
            <p className="text-muted-foreground">
              This policy explains what cookies are, how we use them, the types of cookies we use, and how you can control your cookie preferences.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We use cookies and similar technologies for several purposes:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Essential Functionality</h4>
                <p className="text-muted-foreground text-sm">
                  To enable core website functionality, such as user authentication, session management, and security features.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Performance & Analytics</h4>
                <p className="text-muted-foreground text-sm">
                  To understand how visitors interact with our website, improve performance, and optimize user experience.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Personalization</h4>
                <p className="text-muted-foreground text-sm">
                  To remember your preferences, settings, and provide a customized experience.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Marketing & Advertising</h4>
                <p className="text-muted-foreground text-sm">
                  To deliver relevant advertisements and measure the effectiveness of our marketing campaigns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Types of Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Essential Cookies</h3>
              <p className="text-muted-foreground mb-3">
                These cookies are necessary for the website to function properly and cannot be disabled.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Authentication tokens for logged-in users</li>
                  <li>• Session management cookies</li>
                  <li>• Security and fraud prevention cookies</li>
                  <li>• Load balancing and performance cookies</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Performance Cookies</h3>
              <p className="text-muted-foreground mb-3">
                These cookies collect information about how you use our website to help us improve it.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Google Analytics cookies</li>
                  <li>• Page load time tracking</li>
                  <li>• Error tracking and debugging</li>
                  <li>• User interaction analytics</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Functional Cookies</h3>
              <p className="text-muted-foreground mb-3">
                These cookies enable enhanced functionality and personalization.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Language and region preferences</li>
                  <li>• Theme and display settings</li>
                  <li>• Dashboard layout preferences</li>
                  <li>• Notification preferences</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Marketing Cookies</h3>
              <p className="text-muted-foreground mb-3">
                These cookies are used to track visitors across websites for advertising purposes.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Social media tracking pixels</li>
                  <li>• Advertising network cookies</li>
                  <li>• Conversion tracking</li>
                  <li>• Retargeting cookies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may use third-party services that set their own cookies. These services help us provide better functionality and analyze our website performance.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Google Analytics</h4>
                <p className="text-muted-foreground text-sm">
                  We use Google Analytics to understand how visitors use our website. Google Analytics uses cookies to collect information about your use of our website.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Learn more: <a href="https://policies.google.com/privacy" className="text-primary hover:underline">Google Privacy Policy</a>
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Discord OAuth</h4>
                <p className="text-muted-foreground text-sm">
                  When you log in with Discord, Discord may set cookies to manage the authentication process.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Learn more: <a href="https://discord.com/privacy" className="text-primary hover:underline">Discord Privacy Policy</a>
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cloudflare</h4>
                <p className="text-muted-foreground text-sm">
                  We use Cloudflare for security and performance. Cloudflare may set cookies for security purposes and to improve website performance.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Learn more: <a href="https://www.cloudflare.com/privacypolicy/" className="text-primary hover:underline">Cloudflare Privacy Policy</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookie Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cookies have different lifespans depending on their purpose:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Session Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  These cookies are temporary and are deleted when you close your browser. They are used for essential website functionality.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  These cookies remain on your device for a set period or until you delete them. They remember your preferences and settings.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Authentication Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  These cookies typically last for 30 days or until you log out, allowing you to stay logged in across browser sessions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Browser Settings</h3>
              <p className="text-muted-foreground mb-3">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• View and delete cookies</li>
                <li>• Block cookies from specific websites</li>
                <li>• Block all cookies</li>
                <li>• Receive notifications when cookies are set</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Cookie Consent</h3>
              <p className="text-muted-foreground mb-3">
                When you first visit our website, you'll see a cookie consent banner. You can:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Accept all cookies</li>
                <li>• Reject non-essential cookies</li>
                <li>• Customize your preferences</li>
                <li>• Change your preferences at any time</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Opt-Out Links</h3>
              <p className="text-muted-foreground mb-3">
                You can opt out of specific tracking services:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Google Analytics Opt-out</a></li>
                <li>• <a href="https://www.aboutads.info/choices/" className="text-primary hover:underline">Digital Advertising Alliance</a></li>
                <li>• <a href="https://www.youronlinechoices.eu/" className="text-primary hover:underline">European Interactive Digital Advertising Alliance</a></li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Impact of Disabling Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you choose to disable cookies, some features of our website may not function properly:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Essential Features</h4>
                <p className="text-muted-foreground text-sm">
                  You may not be able to log in, access your dashboard, or use core functionality.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Personalization</h4>
                <p className="text-muted-foreground text-sm">
                  Your preferences and settings may not be saved between visits.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Performance</h4>
                <p className="text-muted-foreground text-sm">
                  The website may load slower or not function optimally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates to This Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Posting the updated policy on our website</li>
              <li>• Updating the "Last updated" date</li>
              <li>• Sending you an email notification (if applicable)</li>
              <li>• Displaying a notice on our website</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
            <CardDescription>
              Depending on your location, you may have certain rights regarding cookies and your personal data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Right to Information</h4>
                <p className="text-muted-foreground text-sm">
                  You have the right to know what cookies we use and how we use them.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Right to Consent</h4>
                <p className="text-muted-foreground text-sm">
                  You have the right to give or withdraw consent for non-essential cookies.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Right to Access</h4>
                <p className="text-muted-foreground text-sm">
                  You have the right to access information about the cookies we use.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Right to Object</h4>
                <p className="text-muted-foreground text-sm">
                  You have the right to object to the use of cookies for certain purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            
            <div className="space-y-2 text-muted-foreground">
              <p>• Email: privacy@ticketmesh.com</p>
              <p>• Discord: Join our support server</p>
              <p>• Website: Contact form on our website</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
