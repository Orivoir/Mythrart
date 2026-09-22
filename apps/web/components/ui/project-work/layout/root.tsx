export default function ProjectWorkLayoutRoot({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-0 flex-1">
      {children}
    </div>
  )
}