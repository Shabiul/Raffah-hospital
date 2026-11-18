import { cn } from "@/lib/utils"

/** Dentizz mark: the tooth logo on a white disc with a blue ring. */
export function DentizzMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-grid h-8 w-8 place-items-center rounded-full bg-white ring-[3px] ring-inset ring-[#0b5db5]", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/tooth.png" alt="" className="h-[62%] w-auto" />
    </span>
  )
}

/** Wordmark: "Dentizz" with the subtitle underneath. */
export function DentizzWordmark({ className, subtitle }: { className?: string; subtitle?: string }) {
  return (
    <div className={cn("leading-none", className)}>
      <p className="text-base font-semibold tracking-tight">Dentizz</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{subtitle ?? "Dental care"}</p>
    </div>
  )
}
