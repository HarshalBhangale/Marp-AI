import { Layout } from "@/components/layout"

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}