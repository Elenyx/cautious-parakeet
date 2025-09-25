import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Home, FileText, Shield, Cookie, Copyright } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | TicketMesh",
  description: "Privacy Policy for TicketMesh Discord Bot and Web Dashboard",
}

export default function PrivacyPolicyPage() {
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
                  <Button variant="default" className="w-full flex items-center gap-2">
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
                  <Button variant="outline" className="w-full flex items-center gap-2 btn-outline-hover">
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
            <CardDescription>
              This Privacy Policy describes how TicketMesh ("we", "our", or "us") collects, uses, and protects your information when you use our Discord bot and web dashboard services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By using TicketMesh, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Discord Bot Data</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Discord User ID and Username</li>
                <li>• Server (Guild) ID and basic server information</li>
                <li>• Ticket messages and metadata</li>
                <li>• Bot configuration settings</li>
                <li>• Command usage statistics</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Web Dashboard Data</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Discord OAuth information (with your consent)</li>
                <li>• Server management preferences</li>
                <li>• Usage analytics and performance metrics</li>
                <li>• Support ticket interactions</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Automatically Collected Data</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• IP addresses and browser information</li>
                <li>• Cookies and similar tracking technologies</li>
                <li>• Error logs and crash reports</li>
                <li>• Performance and usage statistics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Service Provision</h4>
                <p className="text-muted-foreground text-sm">
                  To provide and maintain our Discord bot and web dashboard services, including ticket management, user authentication, and server administration.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Communication</h4>
                <p className="text-muted-foreground text-sm">
                  To send you important updates, security notifications, and respond to your support requests.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Analytics & Improvement</h4>
                <p className="text-muted-foreground text-sm">
                  To analyze usage patterns, improve our services, and develop new features based on user needs.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Security & Compliance</h4>
                <p className="text-muted-foreground text-sm">
                  To ensure the security of our services, prevent abuse, and comply with legal obligations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>With your consent:</strong> When you explicitly authorize us to share your information</li>
              <li>• <strong>Service providers:</strong> With trusted third-party services that help us operate our platform (e.g., hosting providers, analytics services)</li>
              <li>• <strong>Legal requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
              <li>• <strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Encryption of data in transit and at rest</li>
              <li>• Regular security audits and vulnerability assessments</li>
              <li>• Access controls and authentication mechanisms</li>
              <li>• Secure data centers and infrastructure</li>
              <li>• Employee training on data protection practices</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Access and Portability</h4>
                <p className="text-muted-foreground text-sm">
                  Request access to your personal information and receive a copy in a portable format.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Correction and Updates</h4>
                <p className="text-muted-foreground text-sm">
                  Request correction of inaccurate or incomplete personal information.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Deletion</h4>
                <p className="text-muted-foreground text-sm">
                  Request deletion of your personal information, subject to certain exceptions.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Opt-out</h4>
                <p className="text-muted-foreground text-sm">
                  Opt out of certain data processing activities, such as marketing communications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Account data: Retained while your account is active and for a reasonable period after closure</li>
              <li>• Ticket data: Retained for operational purposes and deleted according to your server settings</li>
              <li>• Analytics data: Aggregated and anonymized data may be retained for longer periods</li>
              <li>• Legal compliance: Some data may be retained longer to comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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
