import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { MessageCircle, PhoneCall } from "lucide-react";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AiCounsellorWidget } from "@/components/chat/ai-counsellor-widget";
import { RoleRedirector } from "@/components/auth/role-redirector";
import { SITE } from "@/lib/constants";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Global University Discovery Platform`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "global university admissions",
    "online degree programs",
    "distance education",
    "vocational courses",
    "skill certification courses",
    "study in india online",
    "international student admissions",
  ],
  alternates: {
    canonical: SITE.url,
    languages: {
      "en-IN": SITE.url,
      "en-US": SITE.url,
      "en-GB": SITE.url,
      "x-default": SITE.url,
    },
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: `${SITE.name} | Global University Discovery Platform`,
    description: SITE.description,
    siteName: SITE.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Global University Discovery Platform`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${display.variable} overflow-x-hidden`}>
      <body className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased">
        <QueryProvider>
          <RoleRedirector />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                name: SITE.name,
                url: SITE.url,
                description: SITE.description,
                areaServed: ["India", "Middle East", "Africa", "Europe", "North America", "Asia Pacific"],
                sameAs: [SITE.url],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+91-9266602967",
                  contactType: "admissions",
                  areaServed: "Worldwide",
                  availableLanguage: ["English"],
                },
              }),
            }}
          />
          <Header />
          <main>{children}</main>
          <Footer />
          <AiCounsellorWidget />

          <div className="fixed bottom-4 right-3 z-50 flex flex-col gap-2 sm:bottom-5 sm:right-5">
            <a
              href="https://wa.me/919266602967"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 sm:px-4 sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href="tel:+919266602967"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 sm:px-4 sm:text-sm"
            >
              <PhoneCall className="h-4 w-4" />
              <span className="hidden sm:inline">Call Now</span>
            </a>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
