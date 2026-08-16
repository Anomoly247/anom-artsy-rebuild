import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import {
  filterAdminUsers,
  isAdminUserActive,
  selectAdminUsers,
  type AdminUserRoleFilter,
  type AdminUserStatusFilter,
  type AdminUserSummary,
} from '../../../shared/adminUserFilters';
import { ADMIN_TAB_IDS, resolveAdminTabShortcut, type AdminTabId } from '../../../shared/adminTabShortcuts';
import { buildModerationUndoOperations, type ModerationUndoAction } from '../../../shared/moderationUndo';
import { Settings, Users, BarChart3, Package, Zap, Lock, ArrowLeft, Plus, Trash2, ShieldCheck, ShieldOff, ScrollText, CheckSquare, Square, Download, Search, CalendarDays, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

type PendingModerationAction =
  | { kind: 'role'; userId: number; userLabel: string; nextRole: 'user' | 'admin' }
  | { kind: 'status'; userId: number; userLabel: string; nextStatus: 'active' | 'suspended' }
  | { kind: 'bulk-role'; userIds: number[]; nextRole: 'admin' }
  | { kind: 'bulk-status'; userIds: number[]; nextStatus: 'suspended' };

const AUDIT_CHART_CONFIG = {
  actions: { label: 'Actions', color: '#00ffff' },
} satisfies ChartConfig;

const AUDIT_ACTION_TYPES = [
  'update_user_role_admin',
  'update_user_role_user',
  'update_user_status_active',
  'update_user_status_suspended',
  'bulk_update_user_role_admin',
  'bulk_update_user_status_suspended',
] as const;

export default function OwnerControlPanel() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    return ADMIN_TAB_IDS.includes(requestedTab as typeof ADMIN_TAB_IDS[number])
      ? requestedTab!
      : 'dashboard';
  });
  const [settings, setSettings] = useState({
    siteName: 'Anom Artsy',
    siteDescription: 'Unite physical and digital identity for social good',
    maxCoinsPerDay: 100,
    levelUpXP: 1000,
    achievementMultiplier: 1,
  });
  const [userQuery, setUserQuery] = useState('');
  const deferredUserQuery = useDeferredValue(userQuery);
  const [userRoleFilter, setUserRoleFilter] = useState<AdminUserRoleFilter>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<AdminUserStatusFilter>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [auditAdminQuery, setAuditAdminQuery] = useState('');
  const [auditActionType, setAuditActionType] = useState<string>('all');
  const [auditTargetQuery, setAuditTargetQuery] = useState('');
  const [auditStartDate, setAuditStartDate] = useState('');
  const [auditEndDate, setAuditEndDate] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const auditPageSize = 25;
  const auditQueryInput = useMemo(() => ({
    adminQuery: auditAdminQuery.trim() || undefined,
    actionType: auditActionType === 'all' ? undefined : auditActionType,
    targetUserQuery: auditTargetQuery.trim() || undefined,
    startDate: auditStartDate ? new Date(`${auditStartDate}T00:00:00.000Z`).toISOString() : undefined,
    endDate: auditEndDate ? new Date(`${auditEndDate}T23:59:59.999Z`).toISOString() : undefined,
    limit: auditPageSize,
    offset: (auditPage - 1) * auditPageSize,
  }), [auditAdminQuery, auditActionType, auditTargetQuery, auditStartDate, auditEndDate, auditPage]);

  // Real-time data queries
  const { data: stats } = trpc.system.getStats.useQuery(undefined, { refetchInterval: 5000 });
  const { data: users = [], refetch: refetchUsers } = trpc.system.getAllUsers.useQuery(undefined, { refetchInterval: 10000 });
  const { data: events = [] } = trpc.system.getEvents.useQuery(undefined, { refetchInterval: 5000 });
  const auditQuery = trpc.system.getAuditLogs.useQuery(auditQueryInput, {
    enabled: activeTab === 'audit',
    refetchInterval: activeTab === 'audit' ? 5000 : false,
  });
  const auditSummaryQuery = trpc.system.getAuditSummaryStats.useQuery(undefined, {
    enabled: activeTab === 'audit',
    refetchInterval: activeTab === 'audit' ? 10000 : false,
  });
  const auditLogs = auditQuery.data?.logs ?? [];
  const auditTotal = auditQuery.data?.total ?? 0;
  const refetchAuditLogs = auditQuery.refetch;
  const auditTimeline = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const entry of auditSummaryQuery.data?.recentTimeline ?? []) {
      const label = new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      buckets.set(label, (buckets.get(label) ?? 0) + 1);
    }
    return Array.from(buckets, ([label, actions]) => ({ label, actions })).slice(-14);
  }, [auditSummaryQuery.data?.recentTimeline]);
  const filteredUsers = useMemo(
    () =>
      filterAdminUsers(users, {
        query: deferredUserQuery,
        role: userRoleFilter,
        status: userStatusFilter,
      }),
    [users, deferredUserQuery, userRoleFilter, userStatusFilter],
  );
  const visibleUserIds = useMemo(() => filteredUsers.map((target) => target.id), [filteredUsers]);
  const selectedVisibleUserIds = useMemo(
    () => selectedUserIds.filter((id) => visibleUserIds.includes(id)),
    [selectedUserIds, visibleUserIds],
  );
  const allVisibleUsersSelected = filteredUsers.length > 0 && selectedVisibleUserIds.length === filteredUsers.length;
  const selectedIncludesCurrentUser = user?.id !== undefined && selectedVisibleUserIds.includes(user.id);

  // Mutations
  const updateSettingsMutation = trpc.system.updateSettings.useMutation();
  const createEventMutation = trpc.system.createEvent.useMutation();
  const deleteEventMutation = trpc.system.deleteEvent.useMutation();
  const updateUserRoleMutation = trpc.system.updateUserRole.useMutation();
  const updateUserStatusMutation = trpc.system.updateUserStatus.useMutation();
  const bulkUpdateUserRoleMutation = trpc.system.bulkUpdateUserRole.useMutation();
  const bulkUpdateUserStatusMutation = trpc.system.bulkUpdateUserStatus.useMutation();
  const exportAuditLogsCsvMutation = trpc.system.exportAuditLogsCsv.useMutation();
  const [pendingModerationAction, setPendingModerationAction] = useState<PendingModerationAction | null>(null);
  const undoInFlightRef = useRef(false);
  const isModerationPending = updateUserRoleMutation.isPending || updateUserStatusMutation.isPending || bulkUpdateUserRoleMutation.isPending || bulkUpdateUserStatusMutation.isPending;
  const auditPageCount = Math.max(1, Math.ceil(auditTotal / auditPageSize));
  const isBulkModerationAction = pendingModerationAction?.kind === 'bulk-role' || pendingModerationAction?.kind === 'bulk-status';
  const pendingBulkUserIds = isBulkModerationAction ? pendingModerationAction.userIds : [];
  const pendingBulkUsers = selectAdminUsers(users, pendingBulkUserIds);

  const selectAdminTab = (tab: AdminTabId) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url);
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      const tab = resolveAdminTabShortcut(event);
      if (!tab) return;
      event.preventDefault();
      selectAdminTab(tab);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    imageUrl: '',
  });

  // Check if user is admin/owner
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e] p-4 flex items-center justify-center">
        <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-8 max-w-md">
          <div className="flex items-center justify-center mb-4">
            <Lock className="w-12 h-12 text-[#00ffff]" />
          </div>
          <h1 className="text-2xl font-bold text-center text-[#00ffff] mb-4">Access Denied</h1>
          <p className="text-center text-gray-300 mb-6">
            Only administrators can access the Owner Control Panel.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold"
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createEventMutation.mutateAsync({
        title: eventForm.title,
        description: eventForm.description,
        date: new Date(eventForm.date).toISOString(),
        imageUrl: eventForm.imageUrl,
      });
      toast.success('Event created successfully!');
      setEventForm({ title: '', description: '', date: '', imageUrl: '' });
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEventMutation.mutateAsync({ eventId });
      toast.success('Event deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const requestRoleChange = (target: AdminUserSummary) => {
    setPendingModerationAction({
      kind: 'role',
      userId: target.id,
      userLabel: target.name || target.email || `User #${target.id}`,
      nextRole: target.role === 'admin' ? 'user' : 'admin',
    });
  };

  const requestStatusChange = (target: AdminUserSummary) => {
    setPendingModerationAction({
      kind: 'status',
      userId: target.id,
      userLabel: target.name || target.email || `User #${target.id}`,
      nextStatus: target.status === 'suspended' ? 'active' : 'suspended',
    });
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((current) => current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId]);
  };

  const toggleAllVisibleUsers = () => {
    setSelectedUserIds((current) => {
      if (allVisibleUsersSelected) return current.filter((id) => !visibleUserIds.includes(id));
      return Array.from(new Set([...current, ...visibleUserIds]));
    });
  };

  const requestBulkRoleChange = () => {
    if (selectedVisibleUserIds.length === 0) return;
    setPendingModerationAction({ kind: 'bulk-role', userIds: selectedVisibleUserIds, nextRole: 'admin' });
  };

  const requestBulkStatusChange = () => {
    if (selectedVisibleUserIds.length === 0) return;
    setPendingModerationAction({ kind: 'bulk-status', userIds: selectedVisibleUserIds, nextStatus: 'suspended' });
  };

  const handleUndoModeration = async (undoAction: ModerationUndoAction) => {
    if (undoInFlightRef.current) return;
    undoInFlightRef.current = true;
    try {
      await Promise.all(buildModerationUndoOperations(undoAction).map((operation) => {
        if ('role' in operation) return updateUserRoleMutation.mutateAsync(operation);
        return updateUserStatusMutation.mutateAsync(operation);
      }));
      await Promise.all([refetchUsers(), refetchAuditLogs(), auditSummaryQuery.refetch()]);
      toast.success('Moderation action reverted.', { description: 'The reversal was recorded in the audit stream.' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Undo could not be completed.');
    } finally {
      undoInFlightRef.current = false;
    }
  };

  const handleConfirmModeration = async () => {
    if (!pendingModerationAction) return;

    const action = pendingModerationAction;
    try {
      if (action.kind === 'role') {
        const target = users.find((candidate) => candidate.id === action.userId);
        await updateUserRoleMutation.mutateAsync({ userId: action.userId, role: action.nextRole });
        toast.success(`${action.userLabel} is now ${action.nextRole === 'admin' ? 'an admin' : 'a member'}.`, {
          description: 'Role change recorded in the audit stream.',
          duration: 10000,
          action: { label: 'Undo', onClick: () => void handleUndoModeration({ kind: 'role', userId: action.userId, userLabel: action.userLabel, previousRole: target?.role ?? 'user' }) },
        });
      } else if (action.kind === 'status') {
        const target = users.find((candidate) => candidate.id === action.userId);
        await updateUserStatusMutation.mutateAsync({ userId: action.userId, status: action.nextStatus });
        toast.success(`${action.userLabel} is ${action.nextStatus === 'suspended' ? 'suspended' : 'active'} now.`, {
          description: 'Account status change recorded in the audit stream.',
          duration: 10000,
          action: { label: 'Undo', onClick: () => void handleUndoModeration({ kind: 'status', userId: action.userId, userLabel: action.userLabel, previousStatus: target?.status === 'suspended' ? 'suspended' : 'active' }) },
        });
      } else if (action.kind === 'bulk-role') {
        const selectedBefore = selectAdminUsers(users, action.userIds);
        const result = await bulkUpdateUserRoleMutation.mutateAsync({ userIds: action.userIds, role: action.nextRole });
        toast.success(`${result.count} users promoted.`, {
          description: 'Bulk role change recorded in the audit stream.',
          duration: 10000,
          action: { label: 'Undo', onClick: () => void handleUndoModeration({ kind: 'bulk-role', changes: selectedBefore.map((target) => ({ userId: target.id, userLabel: target.name || target.email || `User #${target.id}`, previousRole: target.role })) }) },
        });
      } else {
        const selectedBefore = selectAdminUsers(users, action.userIds);
        const result = await bulkUpdateUserStatusMutation.mutateAsync({ userIds: action.userIds, status: action.nextStatus });
        toast.success(`${result.count} users suspended.`, {
          description: 'Bulk status change recorded in the audit stream.',
          duration: 10000,
          action: { label: 'Undo', onClick: () => void handleUndoModeration({ kind: 'bulk-status', changes: selectedBefore.map((target) => ({ userId: target.id, userLabel: target.name || target.email || `User #${target.id}`, previousStatus: target.status === 'suspended' ? 'suspended' : 'active' })) }) },
        });
      }
      setSelectedUserIds([]);
      await Promise.all([refetchUsers(), refetchAuditLogs(), auditSummaryQuery.refetch()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'The moderation action could not be completed.');
    } finally {
      setPendingModerationAction(null);
    }
  };

  const resetAuditFilters = () => {
    setAuditAdminQuery('');
    setAuditActionType('all');
    setAuditTargetQuery('');
    setAuditStartDate('');
    setAuditEndDate('');
    setAuditPage(1);
  };

  const handleExportAuditLogs = async () => {
    try {
      const result = await exportAuditLogsCsvMutation.mutateAsync({
        adminQuery: auditAdminQuery.trim() || undefined,
        actionType: auditActionType === 'all' ? undefined : auditActionType,
        targetUserQuery: auditTargetQuery.trim() || undefined,
        startDate: auditStartDate ? new Date(`${auditStartDate}T00:00:00.000Z`).toISOString() : undefined,
        endDate: auditEndDate ? new Date(`${auditEndDate}T23:59:59.999Z`).toISOString() : undefined,
      });
      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `anom-artsy-audit-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${result.count} audit records.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Audit CSV export failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0e14] to-[#1a1f2e] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#00ffff] mb-2">Owner Control Panel</h1>
          <p className="text-gray-400">Manage your Anom Artsy platform • Real-time stats</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')} className="text-[#00ffff] border-[#00ffff] hover:bg-[#00ffff]/10 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 gap-2 mb-8 md:grid-cols-6">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'audit', label: 'Audit Activity', icon: ScrollText },
          { id: 'events', label: 'Events', icon: Package },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'features', label: 'Features', icon: Zap },
        ].map((tab, index) => {
          const Icon = tab.icon;
          const shortcut = `Alt+${index + 1}`;
          return (
            <button
              key={tab.id}
              onClick={() => selectAdminTab(tab.id as AdminTabId)}
              aria-keyshortcuts={shortcut}
              title={`Open ${tab.label} (${shortcut})`}
              className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'border-[#00ffff] bg-[#00ffff]/20 text-[#00ffff]'
                  : 'border-[#00ffff] bg-transparent text-[#00ffff] hover:bg-[#00ffff]/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-bold">{tab.label}</span>
              <span className="hidden xl:inline text-[10px] opacity-60">{shortcut}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Tab - Real-Time Stats */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Total Users</div>
              <div className="text-3xl font-bold text-[#00ffff]">{stats?.totalUsers || 0}</div>
              <div className="text-green-400 text-xs mt-2">↑ {stats?.userGrowth || 0}% this month</div>
            </Card>
            <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Active Members</div>
              <div className="text-3xl font-bold text-[#00ffff]">{stats?.activeMembers || 0}</div>
              <div className="text-green-400 text-xs mt-2">↑ {stats?.activeGrowth || 0}% this week</div>
            </Card>
            <Card className="border-2 border-[#a855f7] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Revenue (This Month)</div>
              <div className="text-3xl font-bold text-[#a855f7]">${stats?.monthlyRevenue || 0}</div>
              <div className="text-green-400 text-xs mt-2">↑ {stats?.revenueGrowth || 0}% vs last month</div>
            </Card>
            <Card className="border-2 border-[#fbbf24] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Coins Distributed</div>
              <div className="text-3xl font-bold text-[#fbbf24]">{stats?.coinsDistributed || 0}</div>
              <div className="text-green-400 text-xs mt-2">↑ {stats?.coinsGrowth || 0}% this week</div>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-[#00ff88] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Total Lounges</div>
              <div className="text-3xl font-bold text-[#00ff88]">{stats?.totalLounges || 0}</div>
            </Card>
            <Card className="border-2 border-[#ff6b9d] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Merch Orders</div>
              <div className="text-3xl font-bold text-[#ff6b9d]">{stats?.totalOrders || 0}</div>
            </Card>
            <Card className="border-2 border-[#00d4ff] bg-[#0b0e14]/80 p-6">
              <div className="text-gray-400 text-sm mb-2">Achievements Unlocked</div>
              <div className="text-3xl font-bold text-[#00d4ff]">{stats?.achievementsUnlocked || 0}</div>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-bold text-[#00ffff] mb-4">Manage Users</h2>
          <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6">
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto] md:items-end">
                <div>
                  <label htmlFor="user-search" className="mb-2 block text-sm font-bold text-gray-300">
                    Search users
                  </label>
                  <Input
                    id="user-search"
                    value={userQuery}
                    onChange={(event) => setUserQuery(event.target.value)}
                    placeholder="Search by name, email, or ID"
                    aria-label="Search users by name, email, or ID"
                    className="bg-[#1a1f2e] border-[#00ffff] text-white placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="user-role-filter" className="mb-2 block text-sm font-bold text-gray-300">
                    Role
                  </label>
                  <select
                    id="user-role-filter"
                    value={userRoleFilter}
                    onChange={(event) => setUserRoleFilter(event.target.value as AdminUserRoleFilter)}
                    className="h-10 w-full rounded-md border border-[#00ffff] bg-[#1a1f2e] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00ffff]"
                  >
                    <option value="all">All roles</option>
                    <option value="admin">Admins</option>
                    <option value="user">Members</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="user-status-filter" className="mb-2 block text-sm font-bold text-gray-300">
                    Activity
                  </label>
                  <select
                    id="user-status-filter"
                    value={userStatusFilter}
                    onChange={(event) => setUserStatusFilter(event.target.value as AdminUserStatusFilter)}
                    className="h-10 w-full rounded-md border border-[#00ffff] bg-[#1a1f2e] px-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#00ffff]"
                  >
                    <option value="all">All activity</option>
                    <option value="active">Active in 30 days</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setUserQuery('');
                    setUserRoleFilter('all');
                    setUserStatusFilter('all');
                  }}
                  disabled={!userQuery && userRoleFilter === 'all' && userStatusFilter === 'all'}
                  className="h-10 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10"
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm" aria-live="polite">
                <p className="text-gray-300">
                  Showing <span className="font-bold text-[#00ffff]">{filteredUsers.length}</span> of {users.length} users
                </p>
                {(userQuery || userRoleFilter !== 'all' || userStatusFilter !== 'all') && (
                  <p className="text-[#00ffff]">Filters active</p>
                )}
              </div>
            </div>
            {filteredUsers.length > 0 && (
              <div className="flex flex-col gap-3 rounded-lg border border-[#2a2f3e] bg-[#1a1f2e]/70 p-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleAllVisibleUsers}
                    className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10"
                    aria-pressed={allVisibleUsersSelected}
                  >
                    {allVisibleUsersSelected ? <CheckSquare className="mr-2 h-4 w-4" /> : <Square className="mr-2 h-4 w-4" />}
                    {allVisibleUsersSelected ? 'Clear visible selection' : 'Select all visible'}
                  </Button>
                  <span className="text-sm text-gray-400" aria-live="polite">
                    {selectedVisibleUserIds.length} selected
                  </span>
                </div>
                <div className="flex flex-col gap-2 min-[420px]:flex-row">
                  <Button
                    type="button"
                    onClick={requestBulkRoleChange}
                    disabled={selectedVisibleUserIds.length === 0 || isModerationPending}
                    className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80 disabled:opacity-40"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Promote selected
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={requestBulkStatusChange}
                    disabled={selectedVisibleUserIds.length === 0 || selectedIncludesCurrentUser || isModerationPending}
                    className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 disabled:opacity-40"
                    title={selectedIncludesCurrentUser ? 'Deselect your own account before suspending users.' : undefined}
                  >
                    Suspend selected
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-3 md:hidden">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const active = isAdminUserActive(u.lastSignedIn);
                  return (
                    <article key={u.id} className="rounded-lg border border-[#2a2f3e] bg-[#1a1f2e] p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(u.id)}
                            onChange={() => toggleUserSelection(u.id)}
                            aria-label={`Select ${u.name || u.email || `user ${u.id}`} for bulk moderation`}
                            className="mt-1 h-4 w-4 accent-[#00ffff]"
                          />
                          <div>
                            <h3 className="font-bold text-white">{u.name || 'Unnamed user'}</h3>
                            <p className="break-all text-sm text-gray-400">{u.email || 'No email'}</p>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500">#{u.id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`rounded px-2 py-1 ${u.role === 'admin' ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'bg-[#00ffff]/20 text-[#00ffff]'}`}>
                          {u.role}
                        </span>
                        <span className={`rounded px-2 py-1 ${active ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-gray-500/20 text-gray-400'}`}>
                          {active ? 'Active in 30d' : 'Inactive'}
                        </span>
                        <span className={`rounded px-2 py-1 ${u.status === 'suspended' ? 'bg-red-500/20 text-red-300' : 'bg-[#00ffff]/10 text-[#00ffff]'}`}>
                          {u.status === 'suspended' ? 'Suspended' : 'Account active'}
                        </span>
                        <span className="text-gray-500">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => requestRoleChange(u)}
                          disabled={u.id === user?.id && u.role === 'admin'}
                          aria-label={`${u.role === 'admin' ? 'Demote' : 'Promote'} ${u.name || u.email || `user ${u.id}`}`}
                          className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {u.role === 'admin' ? <ShieldOff className="mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => requestStatusChange(u)}
                          disabled={u.id === user?.id}
                          aria-label={`${u.status === 'suspended' ? 'Activate' : 'Suspend'} ${u.name || u.email || `user ${u.id}`}`}
                          className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                        </Button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <p className="py-8 text-center text-gray-400">No users match the current search and filters.</p>
              )}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <caption className="sr-only">Filtered Anom Artsy users</caption>
                <thead>
                  <tr className="border-b border-[#2a2f3e]">
                    <th scope="col" className="w-10 py-2 text-left text-[#00ffff]">
                      <input
                        type="checkbox"
                        checked={allVisibleUsersSelected}
                        onChange={toggleAllVisibleUsers}
                        aria-label="Select all visible users for bulk moderation"
                        className="h-4 w-4 accent-[#00ffff]"
                      />
                    </th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">User ID</th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">Name</th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">Email</th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">Role</th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">Activity</th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">Joined</th>
                    <th scope="col" className="text-left py-2 text-[#00ffff]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => {
                      const active = isAdminUserActive(u.lastSignedIn);
                      return (
                        <tr key={u.id} className="border-b border-[#2a2f3e] hover:bg-[#1a1f2e]">
                          <td className="py-2">
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(u.id)}
                              onChange={() => toggleUserSelection(u.id)}
                              aria-label={`Select ${u.name || u.email || `user ${u.id}`} for bulk moderation`}
                              className="h-4 w-4 accent-[#00ffff]"
                            />
                          </td>
                          <td className="py-2 text-gray-300">{u.id}</td>
                          <td className="py-2 text-gray-300">{u.name || 'Unnamed user'}</td>
                          <td className="py-2 text-gray-300">{u.email || 'No email'}</td>
                          <td className="py-2">
                            <span className={`rounded px-2 py-1 text-xs ${u.role === 'admin' ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'bg-[#00ffff]/20 text-[#00ffff]'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={`rounded px-2 py-1 text-xs ${active ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-gray-500/20 text-gray-400'}`}>
                              {active ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`ml-2 rounded px-2 py-1 text-xs ${u.status === 'suspended' ? 'bg-red-500/20 text-red-300' : 'bg-[#00ffff]/10 text-[#00ffff]'}`}>
                              {u.status === 'suspended' ? 'Suspended' : 'Account active'}
                            </span>
                          </td>
                          <td className="py-2 text-gray-300">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-2">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => requestRoleChange(u)}
                                disabled={u.id === user?.id && u.role === 'admin'}
                                aria-label={`${u.role === 'admin' ? 'Demote' : 'Promote'} ${u.name || u.email || `user ${u.id}`}`}
                                className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {u.role === 'admin' ? <ShieldOff className="mr-1 h-3.5 w-3.5" /> : <ShieldCheck className="mr-1 h-3.5 w-3.5" />}
                                {u.role === 'admin' ? 'Demote' : 'Promote'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => requestStatusChange(u)}
                                disabled={u.id === user?.id}
                                aria-label={`${u.status === 'suspended' ? 'Activate' : 'Suspend'} ${u.name || u.email || `user ${u.id}`}`}
                                className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {u.status === 'suspended' ? 'Activate' : 'Suspend'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-400">
                        No users match the current search and filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Audit Activity Tab */}
      {activeTab === 'audit' && (
        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#00ffff]">Audit Activity</h2>
              <p className="mt-1 text-sm text-gray-400">Searchable, exportable record of role and account-status changes.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetchAuditLogs()}
                className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10"
              >
                Refresh activity
              </Button>
              <Button
                type="button"
                onClick={() => void handleExportAuditLogs()}
                disabled={exportAuditLogsCsvMutation.isPending}
                className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80 disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                {exportAuditLogsCsvMutation.isPending ? 'Preparing CSV...' : 'Export CSV'}
              </Button>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Total actions', value: auditSummaryQuery.data?.totalActions ?? 0, color: 'text-[#00ffff]' },
              { label: 'Role changes', value: auditSummaryQuery.data?.roleChanges ?? 0, color: 'text-[#00ffff]' },
              { label: 'Status changes', value: auditSummaryQuery.data?.suspensions ?? 0, color: 'text-[#00ff88]' },
              { label: 'Bulk operations', value: auditSummaryQuery.data?.bulkOperations ?? 0, color: 'text-[#8b00ff]' },
            ].map((metric) => (
              <Card key={metric.label} className="border border-[#2a2f3e] bg-[#1a1f2e]/80 p-4 shadow-[0_0_18px_rgba(255,0,204,0.12)]">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{metric.label}</p>
                <p className={`mt-2 text-2xl font-black ${metric.color}`} aria-label={`${metric.label}: ${metric.value}`}>
                  {auditSummaryQuery.isLoading ? '—' : metric.value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="mb-5 border-2 border-[#8b00ff] bg-[#0b0e14]/80 p-4 md:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#00ffff]">Recent administrative actions</h3>
                <p className="mt-1 text-xs text-gray-500">Daily activity across role, suspension, and bulk moderation changes.</p>
              </div>
              <span className="rounded-full border border-[#00ffff]/40 bg-[#00ffff]/10 px-3 py-1 text-xs text-[#00ffff]">Live summary</span>
            </div>
            {auditSummaryQuery.isError ? (
              <div className="rounded-lg border border-red-400/40 bg-red-950/20 p-4 text-sm text-red-200" role="alert">
                The summary chart could not be loaded. Audit records remain available below.
              </div>
            ) : auditSummaryQuery.isLoading ? (
              <div className="flex h-52 items-center justify-center text-sm text-gray-400" aria-live="polite">Loading action trend…</div>
            ) : auditTimeline.length > 0 ? (
              <ChartContainer config={AUDIT_CHART_CONFIG} className="h-56 w-full aspect-auto">
                <LineChart accessibilityLayer data={auditTimeline} margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,234,255,0.16)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <ChartTooltip cursor={{ stroke: '#00ffff', strokeOpacity: 0.3 }} content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="actions" stroke="var(--color-actions)" strokeWidth={3} dot={{ fill: '#00ffff', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#00ffff' }} />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-[#2a2f3e] text-sm text-gray-500">No recent administrative actions to chart.</div>
            )}
          </Card>

          <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-4 md:p-6">
            <div className="mb-5 rounded-lg border border-[#2a2f3e] bg-[#1a1f2e]/70 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#00ffff]"><Filter className="h-4 w-4" /> Audit filters</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
                <label className="text-sm text-gray-300">
                  Administrator
                  <div className="relative mt-1">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input value={auditAdminQuery} onChange={(event) => { setAuditAdminQuery(event.target.value); setAuditPage(1); }} placeholder="Name, email, or ID" className="bg-[#0b0e14] pl-9 text-white" />
                  </div>
                </label>
                <label className="text-sm text-gray-300">
                  Action type
                  <select value={auditActionType} onChange={(event) => { setAuditActionType(event.target.value); setAuditPage(1); }} className="mt-1 h-10 w-full rounded-md border border-[#00ffff] bg-[#0b0e14] px-3 text-sm text-white">
                    <option value="all">All moderation actions</option>
                    {AUDIT_ACTION_TYPES.map((action) => <option key={action} value={action}>{action.replaceAll('_', ' ')}</option>)}
                  </select>
                </label>
                <label className="text-sm text-gray-300">
                  Target user
                  <div className="relative mt-1">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input value={auditTargetQuery} onChange={(event) => { setAuditTargetQuery(event.target.value); setAuditPage(1); }} placeholder="Email, name, or ID" className="bg-[#0b0e14] pl-9 text-white" />
                  </div>
                </label>
                <label className="text-sm text-gray-300">
                  From date
                  <div className="relative mt-1">
                    <CalendarDays className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="date" value={auditStartDate} onChange={(event) => { setAuditStartDate(event.target.value); setAuditPage(1); }} className="bg-[#0b0e14] pl-9 text-white" />
                  </div>
                </label>
                <label className="text-sm text-gray-300">
                  To date
                  <div className="relative mt-1">
                    <CalendarDays className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="date" value={auditEndDate} onChange={(event) => { setAuditEndDate(event.target.value); setAuditPage(1); }} className="bg-[#0b0e14] pl-9 text-white" />
                  </div>
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-gray-500">Filters apply to the server-side query and CSV export.</p>
                <Button type="button" variant="outline" onClick={resetAuditFilters} className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10">Clear filters</Button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-400">
              <span>Showing {auditTotal === 0 ? 0 : (auditPage - 1) * auditPageSize + 1}–{Math.min(auditPage * auditPageSize, auditTotal)} of {auditTotal} records</span>
              <span>Page {Math.min(auditPage, auditPageCount)} of {auditPageCount}</span>
            </div>

            {auditQuery.isLoading ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center" aria-live="polite">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00ffff] border-t-transparent" aria-hidden="true" />
                <p className="text-gray-300">Loading audit activity…</p>
              </div>
            ) : auditQuery.isError ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center" role="alert">
                <ScrollText className="h-10 w-10 text-[#00ffff]" />
                <div>
                  <p className="text-gray-300">Audit activity could not be loaded.</p>
                  <p className="mt-1 text-xs text-gray-500">{auditQuery.error?.message || 'The protected audit query returned an error.'}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => void refetchAuditLogs()} className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff]/10">Retry query</Button>
              </div>
            ) : auditLogs.length > 0 ? (
              <div className="space-y-3">
                {auditLogs.map((log) => {
                  const details = log.details && typeof log.details === 'object' ? log.details as Record<string, unknown> : {};
                  const targetEmail = typeof details.targetEmail === 'string' ? details.targetEmail : undefined;
                  const targetName = typeof details.targetName === 'string' ? details.targetName : undefined;
                  const count = typeof details.count === 'number' ? details.count : undefined;
                  return (
                    <article key={log.id} className="rounded-lg border border-[#2a2f3e] bg-[#1a1f2e] p-4 transition-colors hover:border-[#00ffff]/70">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-semibold capitalize text-[#00ffff]">{log.action.replaceAll('_', ' ')}</p>
                          <p className="text-sm text-gray-300">By {log.userName || log.userEmail || `Admin #${log.userId ?? 'system'}`}</p>
                          <p className="text-xs text-gray-400">Target: {targetName || targetEmail || (log.entityId ? `User #${log.entityId}` : count ? `${count} users` : 'Bulk selection')}</p>
                        </div>
                        <time className="text-xs text-gray-500" dateTime={new Date(log.createdAt).toISOString()}>{new Date(log.createdAt).toLocaleString()}</time>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <ScrollText className="mx-auto mb-3 h-10 w-10 text-[#00ffff]" />
                <p className="text-gray-300">No moderation activity matches these filters.</p>
                <p className="mt-1 text-sm text-gray-500">Adjust the filters or clear them to see more records.</p>
              </div>
            )}

            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" aria-disabled={auditPage <= 1} className={auditPage <= 1 ? 'pointer-events-none opacity-40' : undefined} onClick={(event) => { event.preventDefault(); setAuditPage((page) => Math.max(1, page - 1)); }} />
                </PaginationItem>
                <PaginationItem><span className="px-3 text-sm text-gray-400">{auditPage} / {auditPageCount}</span></PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" aria-disabled={auditPage >= auditPageCount} className={auditPage >= auditPageCount ? 'pointer-events-none opacity-40' : undefined} onClick={(event) => { event.preventDefault(); setAuditPage((page) => Math.min(auditPageCount, page + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Card>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <h2 className="text-2xl font-bold text-[#00ffff] mb-4">Community Highlights & Events</h2>
          
          {/* Create Event Form */}
          <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6 mb-6">
            <h3 className="text-xl font-bold text-[#00ffff] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Event
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Event Title</label>
                <Input 
                  value={eventForm.title} 
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g., Tater & Clifford Episode Release"
                  className="bg-[#1a1f2e] border-[#00ffff] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                <Textarea 
                  value={eventForm.description} 
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Describe the event..."
                  className="bg-[#1a1f2e] border-[#00ffff] text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Date & Time</label>
                  <Input 
                    type="datetime-local"
                    value={eventForm.date} 
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="bg-[#1a1f2e] border-[#00ffff] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Image URL</label>
                  <Input 
                    value={eventForm.imageUrl} 
                    onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-[#1a1f2e] border-[#00ffff] text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending}
                className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold"
              >
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </Card>

          {/* Events List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00ffff]">Upcoming Events</h3>
            {events && events.length > 0 ? (
              events.map((event: any) => (
                <Card key={event.id} className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#00ffff] mb-2">{event.title}</h4>
                      <p className="text-gray-300 mb-2">{event.description}</p>
                      <p className="text-[#00ffff] text-sm">📅 {new Date(event.date).toLocaleString()}</p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6 text-center">
                <p className="text-gray-400">No events yet. Create one to get started!</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div>
          <h2 className="text-2xl font-bold text-[#00ffff] mb-4">Platform Settings</h2>
          <Card className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Site Name</label>
                <Input 
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="bg-[#1a1f2e] border-[#00ffff] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Site Description</label>
                <Textarea 
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="bg-[#1a1f2e] border-[#00ffff] text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Max Coins/Day</label>
                  <Input 
                    type="number"
                    value={settings.maxCoinsPerDay}
                    onChange={(e) => setSettings({ ...settings, maxCoinsPerDay: parseInt(e.target.value) })}
                    className="bg-[#1a1f2e] border-[#00ffff] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Level Up XP</label>
                  <Input 
                    type="number"
                    value={settings.levelUpXP}
                    onChange={(e) => setSettings({ ...settings, levelUpXP: parseInt(e.target.value) })}
                    className="bg-[#1a1f2e] border-[#00ffff] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Achievement Multiplier</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={settings.achievementMultiplier}
                    onChange={(e) => setSettings({ ...settings, achievementMultiplier: parseFloat(e.target.value) })}
                    className="bg-[#1a1f2e] border-[#00ffff] text-white"
                  />
                </div>
              </div>
              <Button 
                onClick={handleSaveSettings}
                disabled={updateSettingsMutation.isPending}
                className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold"
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div>
          <h2 className="text-2xl font-bold text-[#00ffff] mb-4">Feature Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Social Feed', status: 'active', icon: '📱' },
              { name: 'Lounges', status: 'active', icon: '🏠' },
              { name: 'Merch Shop', status: 'active', icon: '🛍️' },
              { name: 'Games', status: 'active', icon: '🎮' },
              { name: 'Music Platform', status: 'active', icon: '🎵' },
              { name: 'Kids Corner', status: 'active', icon: '👶' },
              { name: 'Collaborations', status: 'active', icon: '🤝' },
              { name: 'Achievements', status: 'active', icon: '🏆' },
            ].map((feature) => (
              <Card key={feature.name} className="border-2 border-[#00ffff] bg-[#0b0e14]/80 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="font-bold text-[#00ffff]">{feature.name}</p>
                      <p className="text-xs text-gray-400">Status: {feature.status}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">
                    {feature.status === 'active' ? '✓ Active' : '○ Inactive'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog
        open={isBulkModerationAction}
        onOpenChange={(open) => {
          if (!open && !isModerationPending) setPendingModerationAction(null);
        }}
      >
        <DialogContent className="max-w-2xl border-2 border-[#00ffff] bg-[#0b0e14] text-white shadow-[0_0_35px_rgba(0,234,255,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-[#00ffff]">Review bulk moderation impact</DialogTitle>
            <DialogDescription className="text-gray-300">
              Confirm the exact users and resulting account changes before applying this protected bulk action.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[45vh] space-y-2 overflow-y-auto rounded-lg border border-[#2a2f3e] bg-[#1a1f2e]/70 p-3">
            {pendingBulkUserIds.map((id) => {
              const target = users.find((candidate) => candidate.id === id);
              const isRoleChange = pendingModerationAction?.kind === 'bulk-role';
              const currentValue = isRoleChange ? (target?.role ?? 'unknown') : (target?.status ?? 'active');
              const nextValue = isRoleChange ? 'admin' : 'suspended';
              return (
                <div key={id} className="flex flex-col gap-2 rounded-md border border-[#2a2f3e] bg-[#0b0e14] p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{target?.name || target?.email || `User #${id}`}</p>
                    <p className="truncate text-xs text-gray-400">{target?.email || `ID ${id}`}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="rounded bg-gray-500/20 px-2 py-1 text-gray-300">{currentValue}</span>
                    <span className="text-[#00ffff]">→</span>
                    <span className={`rounded px-2 py-1 ${isRoleChange ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'bg-red-500/20 text-red-300'}`}>{nextValue}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isModerationPending} onClick={() => setPendingModerationAction(null)} className="border-[#2a2f3e] bg-transparent text-gray-300 hover:bg-[#1a1f2e] hover:text-white">Cancel</Button>
            <Button type="button" disabled={isModerationPending || pendingBulkUsers.length !== pendingBulkUserIds.length} onClick={() => void handleConfirmModeration()} className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80">
              {isModerationPending ? 'Applying...' : 'Confirm and apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingModerationAction !== null && !isBulkModerationAction}
        onOpenChange={(open) => {
          if (!open && !isModerationPending) setPendingModerationAction(null);
        }}
      >
        <AlertDialogContent className="border-2 border-[#00ffff] bg-[#0b0e14] text-white shadow-[0_0_30px_rgba(255,0,204,0.25)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#00ffff]">
              {pendingModerationAction?.kind === 'role'
                ? `${pendingModerationAction.nextRole === 'admin' ? 'Promote' : 'Demote'} user?`
                : pendingModerationAction?.kind === 'status'
                  ? `${pendingModerationAction.nextStatus === 'suspended' ? 'Suspend' : 'Activate'} user?`
                  : pendingModerationAction?.kind === 'bulk-role'
                    ? `Promote ${pendingModerationAction.userIds.length} selected users?`
                    : `Suspend ${pendingModerationAction?.userIds.length ?? 0} selected users?`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {pendingModerationAction?.kind === 'role'
                ? `${pendingModerationAction.userLabel} will ${pendingModerationAction.nextRole === 'admin' ? 'receive' : 'lose'} Owner Control Panel access.`
                : pendingModerationAction?.kind === 'status'
                  ? `${pendingModerationAction.userLabel} will be ${pendingModerationAction.nextStatus === 'suspended' ? 'blocked from active participation' : 'allowed to participate again'}.`
                  : pendingModerationAction?.kind === 'bulk-role'
                    ? `${pendingModerationAction.userIds.length} selected users will receive Owner Control Panel access.`
                    : `${pendingModerationAction?.userIds.length ?? 0} selected users will be blocked from active participation.`}
              {' '}This action is recorded through the protected admin endpoint and written to the audit activity stream.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isModerationPending}
              className="border-[#2a2f3e] bg-transparent text-gray-300 hover:bg-[#1a1f2e] hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isModerationPending}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmModeration();
              }}
              className="bg-[#00ffff] text-black hover:bg-[#00ffff]/80"
            >
              {isModerationPending ? 'Applying...' : 'Confirm action'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
