"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/appointments", label: "Appointments" },
  { href: "/patients", label: "Patients" },
  { href: "/requests", label: "Website requests" },
  { href: "/billing", label: "Billing" },
];

export default function Nav({ newRequests }: { newRequests: number }) {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Main">
      {items.map((i) => {
        const active = i.href === "/" ? path === "/" : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} className={active ? "active" : undefined}>
            {i.label}
            {i.href === "/requests" && newRequests > 0 && <span className="pill">{newRequests}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
