import { MaintenancePage } from "@/components/maintenance-page"

/**
 * Documentation page - currently under development
 * Shows a maintenance message while the documentation is being written
 */
export default function DocumentationPage() {
  return (
    <MaintenancePage
      title="Documentation"
      description="Comprehensive guides, API references, and tutorials to help you get the most out of TicketMesh."
      expectedDate="Q1 2025"
      contactEmail="docs@ticketmesh.com"
    />
  )
}

export const metadata = {
  title: "Documentation - TicketMesh",
  description: "TicketMesh documentation - coming soon. Guides, tutorials, and API references.",
}