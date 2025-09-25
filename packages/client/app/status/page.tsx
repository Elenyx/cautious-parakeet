"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Activity,
  Server,
  Database,
  Bot,
  Globe,
  TrendingUp,
  AlertTriangle,
  Home,
  Bell,
  History,
  ExternalLink,
  Copy,
  Check
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ServiceStatus {
  id: string
  name: string
  status: "operational" | "degraded" | "outage" | "maintenance"
  uptime: number
  responseTime: number
  lastIncident?: {
    title: string
    date: string
    resolved: boolean
  }
}

interface Incident {
  id: string
  title: string
  description: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  severity: "minor" | "major" | "critical"
  startTime: string
  endTime?: string
  affectedServices: string[]
}

interface StatusData {
  overallStatus: "operational" | "degraded" | "outage"
  services: ServiceStatus[]
  incidents: Incident[]
  uptime: {
    last24h: number
    last7d: number
    last30d: number
  }
}

const statusConfig = {
  operational: {
    label: "Operational",
    color: "bg-green-500",
    icon: CheckCircle,
    textColor: "text-green-600"
  },
  degraded: {
    label: "Degraded Performance",
    color: "bg-yellow-500",
    icon: AlertCircle,
    textColor: "text-yellow-600"
  },
  outage: {
    label: "Service Outage",
    color: "bg-red-500",
    icon: XCircle,
    textColor: "text-red-600"
  },
  maintenance: {
    label: "Maintenance",
    color: "bg-blue-500",
    icon: Clock,
    textColor: "text-blue-600"
  }
}

const severityConfig = {
  minor: {
    label: "Minor",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle
  },
  major: {
    label: "Major",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle
  },
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle
  }
}

const incidentStatusConfig = {
  investigating: {
    label: "Investigating",
    color: "bg-yellow-100 text-yellow-800"
  },
  identified: {
    label: "Identified",
    color: "bg-orange-100 text-orange-800"
  },
  monitoring: {
    label: "Monitoring",
    color: "bg-blue-100 text-blue-800"
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800"
  }
}

export default function StatusPage() {
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchStatus = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    }
    
    try {
      const response = await fetch('/api/status')
      if (response.ok) {
        const data = await response.json()
        setStatusData(data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const copyStatusUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading status...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!statusData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load status information. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const overallConfig = statusConfig[statusData.overallStatus]
  const OverallIcon = overallConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20 status-page">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 btn-outline-hover"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
            <div className="hidden sm:block h-6 w-px bg-border" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Service Status</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStatus(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 btn-outline-hover"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyStatusUrl}
              className="flex items-center space-x-2 btn-outline-hover"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy URL'}</span>
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-lg">
            Real-time status of TicketMesh services and infrastructure
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Auto-refresh every 30 seconds</span>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <OverallIcon className={`w-6 h-6 ${overallConfig.textColor}`} />
                  <span>Overall Status</span>
                </CardTitle>
                <CardDescription>
                  Current status of all TicketMesh services
                </CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className={`${overallConfig.textColor} border-current`}
              >
                {overallConfig.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Uptime Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last 24 Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {statusData.uptime.last24h.toFixed(2)}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+0.1% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {statusData.uptime.last7d.toFixed(2)}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+0.05% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {statusData.uptime.last30d.toFixed(2)}%
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+0.02% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Services</span>
            </CardTitle>
            <CardDescription>
              Status of individual TicketMesh services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.services.map((service) => {
                const config = statusConfig[service.status]
                const Icon = config.icon
                
                return (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {service.id === 'api' && <Globe className="w-5 h-5 text-muted-foreground" />}
                        {service.id === 'bot' && <Bot className="w-5 h-5 text-muted-foreground" />}
                        {service.id === 'database' && <Database className="w-5 h-5 text-muted-foreground" />}
                        {service.id === 'discord' && <Server className="w-5 h-5 text-muted-foreground" />}
                        <span className="font-medium">{service.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {service.uptime.toFixed(2)}% uptime
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {service.responseTime}ms avg response
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 ${config.textColor}`} />
                        <Badge variant="outline" className={config.textColor}>
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        {statusData.incidents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Recent Incidents</span>
              </CardTitle>
              <CardDescription>
                Latest incidents and their resolution status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusData.incidents.map((incident) => {
                  const severityConfigData = severityConfig[incident.severity]
                  const statusConfigData = incidentStatusConfig[incident.status]
                  const SeverityIcon = severityConfigData.icon
                  
                  return (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{incident.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {incident.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={severityConfigData.color}>
                            <SeverityIcon className="w-3 h-3 mr-1" />
                            {severityConfigData.label}
                          </Badge>
                          <Badge variant="outline" className={statusConfigData.color}>
                            {statusConfigData.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                          Started: {formatDistanceToNow(new Date(incident.startTime), { addSuffix: true })}
                          {incident.endTime && (
                            <span className="ml-4">
                              Resolved: {formatDistanceToNow(new Date(incident.endTime), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        <div>
                          Affected: {incident.affectedServices.join(", ")}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscribe to Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Stay Updated</span>
            </CardTitle>
            <CardDescription>
              Get notified when there are service incidents or updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Discord Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Join our Discord server for real-time incident updates and announcements.
                </p>
                <Button variant="outline" size="sm" className="w-full btn-outline-hover">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Join Discord Server
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Status Page RSS</h4>
                <p className="text-sm text-muted-foreground">
                  Subscribe to our RSS feed for automated status updates.
                </p>
                <Button variant="outline" size="sm" className="w-full btn-outline-hover">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  RSS Feed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Status History</span>
            </CardTitle>
            <CardDescription>
              Recent status changes and maintenance windows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">All Systems Operational</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(Date.now() - 2 * 60 * 60 * 1000), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All services are running normally
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">API Response Time Degradation</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(Date.now() - 4 * 60 * 60 * 1000), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Some users experienced slower API response times
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Scheduled Maintenance</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(Date.now() - 24 * 60 * 60 * 1000), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Database optimization completed successfully
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Status page updates automatically every 30 seconds. 
            For real-time updates, follow our{" "}
            <a href="/discord" className="text-primary hover:underline hover:text-primary/80 transition-colors">
              Discord server
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
