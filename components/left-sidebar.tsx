"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Library, BarChart2, History, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/router";
const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Library", href: "/library", icon: Library },
  { name: "Transactions", href: "/transactions", icon: History },
]

export function LeftSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-[240px] bg-white/50 backdrop-blur-sm border-r border-yellow-600/20">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href && "bg-yellow-100 text-yellow-900 hover:bg-yellow-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 space-y-2">

        
      </div>
    </div>
  )
}