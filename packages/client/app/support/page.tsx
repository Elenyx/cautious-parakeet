import { MaintenancePage } from "@/components/maintenance-page"

/**
 * Support page - currently under development
 * Shows a maintenance message while the support system is being built
 */
export default function SupportPage() {
  return (
    <MaintenancePage
      title="Support"
      description="Get help with TicketMesh, report issues, and connect with our support team for assistance."
      expectedDate="Q1 2025"
      contactEmail="support@ticketmesh.win"
    />
  )
}

export const metadata = {
  title: "Support - TicketMesh",
  description: "TicketMesh support - coming soon. Get help and assistance with your Discord ticket management.",
}