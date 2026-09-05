import Avatar from "@/components/ui/avatar"

export default function FixtureAvatar() {

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Avatar
        </h2>

        <p className="text-sm text-muted-foreground">
          Différentes tailles et sources d&apos;avatar.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
          <Avatar
            key={size}
            email="sam@example.com"
            alt="Sam"
            size={size as "xs" | "sm" | "md" | "lg" | "xl" | "2xl"}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {["xs", "sm", "md", "lg", "xl", "2xl"].map((size) => (
          <Avatar
            key={size}
            email="sam.gabor@hotmail.com"
            alt="Sam"
            size={size as "xs" | "sm" | "md" | "lg" | "xl" | "2xl"}
          />
        ))}
      </div>
    </section>
  )
}