import { Layout } from "@/components/layout"

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}