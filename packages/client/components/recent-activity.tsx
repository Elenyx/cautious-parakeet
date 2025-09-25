'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, PlusCircle, User, Settings } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
  const pollRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch("/api/activity/owned", { cache: 'no-store' });
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
    // Poll every 20s for fresh activity
    pollRef.current = setInterval(fetchActivity, 20000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
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
          {loading && <p className="text-zinc-400">Loading activity...</p>}
          {error && (
            <div className="text-red-400 p-4 bg-red-900/20 border border-red-800 rounded-md">
              <p className="font-medium">Unable to load recent activity</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs mt-2 text-red-300">
                Activity data will appear once you have servers with the bot installed.
              </p>
            </div>
          )}
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