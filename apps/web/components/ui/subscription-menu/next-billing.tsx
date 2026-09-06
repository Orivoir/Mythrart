import { CalendarDays } from "lucide-react"
import { formatPaymentDate, formatPaymentAmount } from "./utils"

export function NextBilling({
  nextPaymentDate,
  nextPaymentAmount,
  currency = "EUR",
}: {
  nextPaymentDate: string | Date
  nextPaymentAmount: number
  currency?: string
}) {

  return (
    <div className="mt-2 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        <CalendarDays
          className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            Prochain paiement
          </p>

          <p className="mt-0.5 text-sm font-medium">
            {formatPaymentDate(nextPaymentDate)}
          </p>

          <p className="text-xs text-muted-foreground">
            {formatPaymentAmount(
              nextPaymentAmount,
              currency,
            )}
          </p>
        </div>
      </div>
    </div>
  )
}