'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, PlusCircle, User, Settings } from "lucide-react"
import { useEffect, useState } from "react"

interface Activity {
  id: string; // bot returns string ids
  title: string;
  server: string;
  time: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch("/api/activity/owned");
        if (!response.ok) {
          throw new Error("Failed to fetch activity");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setActivities(data as Activity[]);
        } else if (data?.error) {
          setError(typeof data.error === 'string' ? data.error : 'Failed to fetch activity');
        } else {
          setActivities([]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getActivityIcon = (title: string) => {
    if (title.includes("resolved")) return CheckCircle;
    if (title.includes("created")) return PlusCircle;
    if (title.includes("assigned")) return User;
    return Settings;
  };

  const getActivityColor = (title: string) => {
    if (title.includes("resolved")) return "text-green-400";
    if (title.includes("created")) return "text-blue-400";
    if (title.includes("assigned")) return "text-purple-400";
    return "text-orange-400";
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading && <p>Loading activity...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.title);
            const color = getActivityColor(activity.title);
            return (
              <div key={activity.id} className="flex items-start">
                <Icon className={`w-5 h-5 mr-4 mt-1 ${color}`} />
                <div>
                  <div className="font-bold">{activity.title}</div>
                  <div className="text-sm text-zinc-400">
                    {activity.server} • {activity.time}
                  </div>
                </div>
              </div>
            );
          })}
          {!loading && activities.length === 0 && !error && (
            <p className="text-zinc-400">No recent activity in your owned servers.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}