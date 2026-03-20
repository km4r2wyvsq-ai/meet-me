'use client';

import { AnalyticsPanel } from '@/components/analytics-panel';
import { EventStreamPanel } from '@/components/event-stream-panel';
import { ReportCard } from '@/components/report-card';
import { RolePanel } from '@/components/role-panel';
import { Card } from '@/components/ui';
import { useStore } from '@/lib/store';

export default function AdminPage() {
  const { state } = useStore();
  const canModerate = state.profile.role === 'admin' || state.profile.role === 'moderator';

  if (!canModerate) {
    return (
      <div className="p-6 md:p-8">
        <Card>
          <div className="text-2xl font-bold text-ink">Restricted area</div>
          <p className="mt-2 text-slate-600">Switch to moderator or admin from the demo role controls to view operations screens.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-8">
      <AnalyticsPanel />
      <RolePanel />
      <ReportCard />
      <EventStreamPanel />
    </div>
  );
}
