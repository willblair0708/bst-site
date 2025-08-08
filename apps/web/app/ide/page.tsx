"use client"

import React, { use } from "react"
import { Shell } from "@/components/ide/shell"
import { notFound } from "next/navigation"

interface SearchParams {
  repo?: string
}

export default function IDEPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = use(searchParams)
  if (!params?.repo) return notFound()
  return <Shell repoId={params.repo} />
}


