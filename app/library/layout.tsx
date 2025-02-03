import { Layout } from "@/components/layout"

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Layout>{children}</Layout>
}