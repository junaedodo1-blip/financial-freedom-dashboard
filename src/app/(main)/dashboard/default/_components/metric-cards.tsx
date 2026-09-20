import { DollarSign, TrendingUp, UserPlus, Users, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <DollarSign className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Total Revenue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">$0.00</div>
            <Badge>
              <TrendingUp className="size-3" />
              0%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Visitors for the last 6 months</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <UserPlus className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>New Customers</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">0</div>
            <Badge variant="outline">
              <TrendingUp className="size-3" />
              0%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Baseline state active</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Users className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Active Accounts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">0</div>
            <Badge>
              <TrendingUp className="size-3" />
              0%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Engagement baseline</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Waves className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Growth Rate</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">0.0%</div>
            <Badge>
              <TrendingUp className="size-3" />
              0%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Baseline growth projection</p>
        </CardContent>
      </Card>
    </div>
  );
}
