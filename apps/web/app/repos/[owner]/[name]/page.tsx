import { RepoHeader } from '@/components/repos/RepoHeader'
import { FileTree } from '@/components/repos/FileTree'
import { RunsTable } from '@/components/repos/RunsTable'

async function getDetail(owner: string, name: string) {
  // Import the mock data directly instead of making HTTP calls in server components
  const { getRepoDetail } = await import('@/lib/mock-data')
  return getRepoDetail(owner, name)
}

export default async function RepoDetailPage({ params }: { params: { owner: string; name: string } }) {
  const detail = await getDetail(params.owner, params.name)
  const slug = `${params.owner}/${params.name}`
  return (
    <div className="p-6 space-y-6">
      <RepoHeader detail={detail} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Files</h2>
          <FileTree slug={slug} />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Latest runs</h2>
          <RunsTable slug={slug} />
        </div>
      </div>
    </div>
  )
}


