"use client"
import { useEffect, useState } from 'react'

type Props = { slug: string }

function Node({ node }: { node: any }) {
  if (node.type === 'file') return <div className="pl-4">{node.path}</div>
  return (
    <div className="pl-2">
      <div className="font-medium">{node.path}</div>
      <div className="pl-2">
        {node.children?.map((c: any) => <Node key={c.path} node={c} />)}
      </div>
    </div>
  )
}

export function FileTree({ slug }: Props) {
  const [tree, setTree] = useState<any | null>(null)
  useEffect(() => {
    fetch(`/api/repos/${slug}/files`).then((r) => r.json()).then((d) => setTree(d?.tree))
  }, [slug])
  if (!tree) return null
  return <Node node={tree} />
}


