import { cn } from "@/lib/utils"

/** Dentizz mark: the tooth logo on a white disc with a blue ring. */
export function DentizzMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo-mark.png" alt="" aria-hidden="true" className={cn("h-8 w-8 shrink-0 object-contain", className)} />
  )
}

/** Wordmark: "Dentizz" with the subtitle underneath. */
export function DentizzWordmark({ className, subtitle }: { className?: string; subtitle?: string }) {
  return (
    <div className={cn("leading-none", className)}>
      <p className="text-base font-semibold uppercase tracking-[0.08em]">Dentizz</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{subtitle ?? "Dental care"}</p>
    </div>
  )
}
