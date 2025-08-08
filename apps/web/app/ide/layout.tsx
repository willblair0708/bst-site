export default function IDELayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">{children}</div>
  )
}


