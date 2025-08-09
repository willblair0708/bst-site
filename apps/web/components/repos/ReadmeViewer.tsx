"use client"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export function ReadmeViewer({ content }: Props) {
  return (
    <div className="overflow-hidden">
      <div className="bg-primary-50/50 px-6 py-4 border-b border-primary-200/30">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-primary-900 flex items-center gap-2">
            <div className="w-5 h-5 bg-primary-500 rounded-lg flex items-center justify-center">
              📋
            </div>
            README.md
          </h3>
          <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
            {Math.ceil(content.length / 1000)}KB
          </div>
        </div>
      </div>
      <div className="p-8 prose prose-sm max-w-none dark:prose-invert prose-headings:text-primary-900 prose-strong:text-primary-800 prose-code:bg-primary-50 prose-code:text-primary-800 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-pre:bg-primary-50/50 prose-pre:border prose-pre:border-primary-200/30 prose-pre:rounded-xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
