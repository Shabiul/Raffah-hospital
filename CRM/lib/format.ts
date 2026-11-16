const TZ = "Asia/Kolkata";

export const money = (n: number | string | null | undefined) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number(n ?? 0),
  );

export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

export const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date(iso));

export const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(d.length === 10 ? `${d}T00:00:00+05:30` : d),
  );

/** Today's date in the clinic's time zone, as YYYY-MM-DD. */
export const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());

/** Start and end (ISO) of a clinic-local calendar day. */
export const dayRange = (ymd: string) => ({
  start: new Date(`${ymd}T00:00:00+05:30`).toISOString(),
  end: new Date(`${ymd}T23:59:59.999+05:30`).toISOString(),
});

/** Turns a datetime-local value (clinic time) into an ISO timestamp. */
export const istToISO = (local: string) => new Date(`${local}+05:30`).toISOString();

export const STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  dismissed: "Dismissed",
};
