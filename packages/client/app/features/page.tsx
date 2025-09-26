import { MaintenancePage } from "@/components/maintenance-page"

/**
 * Features page - currently under development
 * Shows a maintenance message while the features page is being built
 */
export default function FeaturesPage() {
  return (
    <MaintenancePage
      title="Features"
      description="Discover the powerful features that make TicketMesh the ultimate Discord ticket management solution."
      expectedDate="Q1 2025"
      contactEmail="features@ticketmesh.win"
    />
  )
}

export const metadata = {
  title: "Features - TicketMesh",
  description: "Explore TicketMesh features - coming soon. The ultimate Discord ticket management solution.",
}