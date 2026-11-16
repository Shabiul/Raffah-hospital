import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dentizz CRM",
  description: "Patients, appointments and billing for Dentizz Speciality Dental Care.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
