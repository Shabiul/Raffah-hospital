import type { Metadata } from "next";
import { Host_Grotesk, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const host = Host_Grotesk({ subsets: ["latin"], variable: "--font-host" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });

export const metadata: Metadata = {
  title: "Dentizz — Speciality Dental Care, Richmond Town, Bengaluru",
  description: "Dentizz Speciality Dental Care, #10 Serpentine Street, Richmond Town, Bengaluru. Child dentistry, orthodontics, aligners, crowns and bridges, aesthetic dentistry, root canal, dentures and wisdom tooth removal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${host.variable} ${schibsted.variable}`}>
      <head>
        {/* Show the intro animation once per visit, and never for reduced-motion visitors. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('dz-intro')){document.documentElement.classList.add('intro');sessionStorage.setItem('dz-intro','1')}}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
