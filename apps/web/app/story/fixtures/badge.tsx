import { Badge, type BadgeProps } from "@/components/ui/badge"

export default function FixtureBadge() {
  const fixtures: BadgeProps[] = [
    {
      count: 3,
    },
    {
      count: 3,
      variant: "reduced",
    },
    {
      count: 12,
      position: {
        x: "start",
        y: "start",
      },
    },
    {
      count: 12,
      position: {
        x: "start",
        y: "end",
      },
    },
    {
      count: 12,
      position: {
        x: "end",
        y: "end",
      },
    },
    {
      count: 0,
    },
  ]

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Badge
        </h2>

        <p className="text-sm text-muted-foreground">
          Variantes et positions disponibles.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-8">
        {fixtures.map((props, index) => (
          <div
            key={index}
            className="relative size-10 rounded-full border"
          >
            <Badge {...props} />
          </div>
        ))}
      </div>
    </section>
  )
}