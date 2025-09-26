import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, FileText, Mail, Clock, ArrowLeft, Home, Shield, Cookie, Copyright } from "lucide-react"

export const metadata: Metadata = {
  title: "DMCA Policy | TicketMesh",
  description: "DMCA Policy and Copyright Information for TicketMesh",
}

export default function DMCAPage() {
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
                  <Button variant="outline" className="w-full flex items-center gap-2 btn-outline-hover">
                    <Cookie className="w-4 h-4" />
                    Cookies
                  </Button>
                </Link>
                <Link href="/dmca">
                  <Button variant="default" className="w-full flex items-center gap-2">
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
            DMCA Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Digital Millennium Copyright Act Compliance
          </p>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> This DMCA policy applies to both our Discord bot services and web dashboard. We take copyright infringement seriously and will respond to valid DMCA notices promptly.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              TicketMesh respects the intellectual property rights of others and expects our users to do the same.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              In accordance with the Digital Millennium Copyright Act (DMCA), we have implemented procedures for receiving written notification of claimed copyright infringement and for processing such claims in accordance with the law.
            </p>
            
            <p className="text-muted-foreground">
              This policy outlines our procedures for handling copyright infringement claims related to content transmitted through our Discord bot or displayed on our web dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Reporting Copyright Infringement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">How to File a DMCA Notice</h3>
              <p className="text-muted-foreground mb-4">
                If you believe that your copyrighted work has been copied and is accessible through our services in a way that constitutes copyright infringement, you may notify us by providing the following information:
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Required Information
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• A physical or electronic signature of the copyright owner or authorized agent</li>
                  <li>• Identification of the copyrighted work claimed to have been infringed</li>
                  <li>• Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material</li>
                  <li>• Contact information (address, telephone number, and email address)</li>
                  <li>• A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
                  <li>• A statement that the information in the notification is accurate and that you are authorized to act on behalf of the copyright owner</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>DMCA Notice Submission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Submit Your DMCA Notice
              </h3>
              <p className="text-muted-foreground mb-4">
                Please send your DMCA notice to our designated agent:
              </p>
              
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> dmca@ticketmesh.win</p>
                <p><strong>Subject Line:</strong> DMCA Copyright Infringement Notice</p>
                <p><strong>Response Time:</strong> We will respond within 24-48 hours</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Alternative Contact Methods</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Discord: Contact our support team through our official server</li>
                <li>• Website: Use our contact form with "DMCA Notice" as the subject</li>
                <li>• Postal Mail: Available upon request for formal notices</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Response Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline and Process
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Step 1: Receipt and Review (24-48 hours)</h4>
                <p className="text-muted-foreground text-sm">
                  We will acknowledge receipt of your DMCA notice and begin reviewing the claim for completeness and validity.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Step 2: Investigation (1-3 business days)</h4>
                <p className="text-muted-foreground text-sm">
                  Our team will investigate the alleged infringement, verify the information provided, and locate the content in question.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Step 3: Action (1-2 business days)</h4>
                <p className="text-muted-foreground text-sm">
                  If the claim is valid, we will remove or disable access to the infringing material and notify the user who posted it.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Step 4: Follow-up</h4>
                <p className="text-muted-foreground text-sm">
                  We will provide you with confirmation of the action taken and information about our counter-notification process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Counter-Notification Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you believe that your content was removed or disabled as a result of mistake or misidentification, you may file a counter-notification.
            </p>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Counter-Notification Requirements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your physical or electronic signature</li>
                <li>• Identification of the material that was removed or disabled</li>
                <li>• A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                <li>• Your name, address, and telephone number</li>
                <li>• Consent to the jurisdiction of the federal court in your district</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <h4 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Important Warning</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Filing a false counter-notification may result in liability for damages, including costs and attorney's fees. Please ensure you have a good faith belief that the material was removed by mistake.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Repeat Infringer Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              In accordance with the DMCA, we maintain a policy of terminating, in appropriate circumstances, users who are repeat infringers of copyrighted material.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Our Policy</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• First offense: Warning and content removal</li>
                  <li>• Second offense: Temporary suspension (7-30 days)</li>
                  <li>• Third offense: Extended suspension (30-90 days)</li>
                  <li>• Fourth offense: Permanent ban from our services</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Appeals Process</h4>
                <p className="text-muted-foreground text-sm">
                  Users may appeal enforcement actions by providing evidence that the content was not infringing or that they have permission to use the material.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scope of This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This DMCA policy applies to content transmitted through our services, including:
            </p>
            
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Discord Bot Services</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Ticket messages and attachments</li>
                  <li>• User-generated content in tickets</li>
                  <li>• Bot configuration and custom messages</li>
                  <li>• Server settings and customizations</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Web Dashboard</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• User-uploaded content</li>
                  <li>• Custom themes and configurations</li>
                  <li>• Documentation and help content</li>
                  <li>• Community-generated resources</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitations and Disclaimers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Our Role</h4>
                <p className="text-muted-foreground text-sm">
                  TicketMesh acts as a service provider and does not actively monitor content for copyright infringement. We respond to valid DMCA notices but do not make determinations about copyright validity.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">User Responsibility</h4>
                <p className="text-muted-foreground text-sm">
                  Users are responsible for ensuring they have the right to use any content they post or transmit through our services. We are not liable for user-generated content.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Legal Advice</h4>
                <p className="text-muted-foreground text-sm">
                  This policy is for informational purposes only and does not constitute legal advice. If you have questions about copyright law, please consult with an attorney.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Considerations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              While this policy is based on U.S. DMCA law, we respect international copyright laws and will work with rights holders from other jurisdictions to address copyright concerns.
            </p>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">International Users</h4>
              <p className="text-muted-foreground text-sm">
                If you are located outside the United States, you may still file a notice with us. We will evaluate international copyright claims on a case-by-case basis and may refer you to local legal resources.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may update this DMCA policy from time to time to reflect changes in the law or our practices. We will notify users of material changes by:
            </p>
            
            <ul className="space-y-2 text-muted-foreground">
              <li>• Posting the updated policy on our website</li>
              <li>• Sending email notifications to registered users</li>
              <li>• Announcing changes through our Discord server</li>
              <li>• Updating the "Last updated" date</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              For DMCA-related inquiries, please contact our designated agent:
            </p>
            
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> dmca@ticketmesh.win</p>
              <p><strong>Discord:</strong> Join our support server</p>
              <p><strong>Website:</strong> Contact form on our website</p>
              <p><strong>Response Time:</strong> 24-48 hours for initial response</p>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Need Help?</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                If you're unsure whether your situation constitutes copyright infringement, or if you need help understanding this policy, please contact us. We're here to help resolve copyright concerns fairly and efficiently.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
