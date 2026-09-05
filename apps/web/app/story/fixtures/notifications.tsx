import { Notification } from "@/components/ui/notifications"

export default function FixturesNotifications() {

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Notification
        </h2>

        <p className="text-sm text-muted-foreground">
          Bouton de notification avec compteur.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Notification count={0} />

        <Notification count={3} />

        <Notification
          count={12}
          variant="reduced"
        />

        <Notification count={125} />
      </div>
    </section>
  )
}