import { Ticket, Users, Settings, BarChart3, Menu } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 md:hidden" />
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">TicketMesh</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-card md:block">
          <nav className="space-y-2 p-4">
            <a
              href="#"
              className="flex items-center space-x-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Ticket className="h-5 w-5" />
              <span>Tickets</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to TicketMesh - Your Discord ticket management system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Total Tickets</h3>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Open Tickets</h3>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Active Users</h3>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Avg Response Time</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">
                -8.1% from last month
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Latest ticket updates and system events
                </p>
              </div>
              <div className="border-t p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ticket #1234 resolved</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New ticket created</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">User joined server</p>
                      <p className="text-xs text-muted-foreground">10 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
