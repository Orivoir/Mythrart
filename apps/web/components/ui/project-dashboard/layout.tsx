export default function ProjectListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
      {children}
    </div>
  )
}