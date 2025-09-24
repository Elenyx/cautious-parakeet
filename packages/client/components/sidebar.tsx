'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Server, Command } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Servers',
      href: '/dashboard/servers',
      icon: Server,
    },
    {
      name: 'Commands',
      href: '/dashboard/commands',
      icon: Command,
    },
  ]

  return (
    <aside className="w-64 bg-zinc-950 text-white p-4 border-r border-border/50">
      <div className="text-2xl font-bold mb-6">TicketMesh</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center p-2 rounded-md hover:bg-zinc-800 transition-colors',
                  pathname === item.href ? 'bg-zinc-800 text-primary' : 'text-zinc-400',
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}