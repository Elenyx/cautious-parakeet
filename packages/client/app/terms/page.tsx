import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Home, FileText, Shield, Cookie, Copyright } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | TicketMesh",
  description: "Terms of Service for TicketMesh Discord Bot and Web Dashboard",
}

export default function TermsOfServicePage() {
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
                  <Button variant="default" className="w-full flex items-center gap-2">
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
            <CardDescription>
              By accessing and using TicketMesh ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              These Terms of Service ("Terms") govern your use of our Discord bot and web dashboard services. If you do not agree to these Terms, please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              TicketMesh is a Discord bot and web dashboard that provides ticket management services for Discord servers. Our services include:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Automated ticket creation and management</li>
              <li>• User support and moderation tools</li>
              <li>• Server administration features</li>
              <li>• Analytics and reporting capabilities</li>
              <li>• Web dashboard for server management</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Accounts and Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Account Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• You must be at least 13 years old to use our services</li>
                <li>• You must have a valid Discord account</li>
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for maintaining account security</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Account Responsibilities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Keep your login credentials secure and confidential</li>
                <li>• Notify us immediately of any unauthorized access</li>
                <li>• You are responsible for all activities under your account</li>
                <li>• One account per person or organization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Acceptable Use Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Permitted Uses</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Managing legitimate support tickets and user inquiries</li>
                <li>• Server moderation and administration</li>
                <li>• Community management and engagement</li>
                <li>• Educational and non-commercial purposes</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Prohibited Uses</h3>
              <p className="text-muted-foreground mb-3">You may not use our services to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Harass, abuse, or harm others</li>
                <li>• Spam or send unsolicited communications</li>
                <li>• Distribute malware, viruses, or harmful code</li>
                <li>• Impersonate others or provide false information</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Use our services for illegal or fraudulent activities</li>
                <li>• Interfere with the proper functioning of our services</li>
                <li>• Create multiple accounts to circumvent restrictions</li>
                <li>• Use our services to compete with us</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Our Rights</h3>
              <p className="text-muted-foreground">
                TicketMesh and all related trademarks, copyrights, and intellectual property are owned by us. You may not use our intellectual property without our written permission.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Content</h3>
              <p className="text-muted-foreground">
                You retain ownership of content you create or upload through our services. By using our services, you grant us a limited license to use, store, and process your content as necessary to provide our services.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Third-Party Content</h3>
              <p className="text-muted-foreground">
                Our services may include content from third parties. We do not claim ownership of such content and are not responsible for its accuracy or legality.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Availability and Modifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Service Availability</h3>
              <p className="text-muted-foreground">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. We may experience downtime for maintenance, updates, or technical issues.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Service Modifications</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify, suspend, or discontinue any part of our services at any time. We will provide reasonable notice of significant changes when possible.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Feature Updates</h3>
              <p className="text-muted-foreground">
                We continuously improve our services and may add, modify, or remove features. Some features may be available only to certain users or subscription tiers.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pricing and Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Free Tier</h3>
              <p className="text-muted-foreground">
                We offer a free tier with basic functionality. Free tier users are subject to usage limits and may have reduced access to certain features.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Premium Services</h3>
              <p className="text-muted-foreground">
                Premium features are available through subscription plans. Pricing and features are subject to change with reasonable notice.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Payments are processed securely through third-party providers</li>
                <li>• Subscriptions renew automatically unless cancelled</li>
                <li>• Refunds are handled on a case-by-case basis</li>
                <li>• You are responsible for all applicable taxes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            
            <p className="text-muted-foreground">
              By using our services, you consent to the collection and use of information as described in our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Termination by You</h3>
              <p className="text-muted-foreground">
                You may terminate your account at any time by contacting us or using the account deletion features in our dashboard.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Termination by Us</h3>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Effect of Termination</h3>
              <p className="text-muted-foreground">
                Upon termination, your right to use our services will cease immediately. We may delete your account data, though some information may be retained as required by law.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Disclaimers and Limitations of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Service Disclaimers</h3>
              <p className="text-muted-foreground">
                Our services are provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of our services.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Maximum Liability</h3>
              <p className="text-muted-foreground">
                Our total liability to you for any claims arising out of or relating to these Terms or our services shall not exceed the amount you paid us for the services in the 12 months preceding the claim.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless TicketMesh and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or expenses (including attorney's fees) arising from:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Your use of our services</li>
              <li>• Your violation of these Terms</li>
              <li>• Your violation of any third-party rights</li>
              <li>• Any content you submit or transmit through our services</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law and Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Dispute Resolution</h3>
              <p className="text-muted-foreground">
                Any disputes arising out of or relating to these Terms or our services shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of material changes through our services or by email. Your continued use of our services after such modifications constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Severability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining Terms will remain in full force and effect.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="space-y-2 text-muted-foreground">
              <p>• Email: legal@ticketmesh.com</p>
              <p>• Discord: Join our support server</p>
              <p>• Website: Contact form on our website</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
