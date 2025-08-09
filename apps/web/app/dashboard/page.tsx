import { fetchDashboardAggregate } from '@/lib/dashboard'
import DashboardClient from '@/app/dashboard/client'

export default async function DashboardPage() {
  // TODO: wire actual org/role from session
  const data = await fetchDashboardAggregate('vousso', 'PI')
  return <DashboardClient initial={data} />
}